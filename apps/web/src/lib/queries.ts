import { createClient } from '@/lib/supabase/client';
import type { TransactionType } from '@bettracker/core';

export interface DBProfile {
    id: string;
    user_id: string;
    name: string;
    is_default: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface DBTransaction {
    id: string;
    profile_id: string;
    transaction_date: string;
    transaction_type: TransactionType;
    amount: number;
    raw_line: string | null;
    import_batch_id: string | null;
    created_at: string;
}

/** Fetch default profile for current user, auto-creating one if none exists */
export async function getDefaultProfile(): Promise<DBProfile | null> {
    const supabase = createClient();

    // Try to fetch existing default profile
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_default', true)
        .single();

    if (data) return data as DBProfile;

    // If no default found, check if ANY profiles exist
    if (error && error.code === 'PGRST116') {
        const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // Only auto-create if zero profiles exist
        if (count === 0) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    user_id: user.id,
                    name: 'Principal',
                    is_default: true,
                    sort_order: 0,
                })
                .select()
                .single();

            if (insertError) {
                console.error('Error creating default profile:', insertError);
                return null;
            }
            return newProfile as DBProfile;
        }

        // If profiles exist but none is default -> return null (represents "All Accounts")
        return null;
    }

    if (error) {
        console.error('Error fetching default profile:', error);
    }
    return null;
}

/** Fetch all profiles for current user */
export async function getProfiles(): Promise<DBProfile[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    return (data ?? []) as DBProfile[];
}

/** Fetch transactions for a profile */
export async function getTransactions(profileId?: string): Promise<DBTransaction[]> {
    const supabase = createClient();

    let query = supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: true });

    if (profileId) {
        query = query.eq('profile_id', profileId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
    return (data ?? []) as DBTransaction[];
}

/** Insert transactions in batch */
export async function insertTransactions(
    profileId: string,
    rows: Array<{ date: string; type: TransactionType; amount: number; rawLine?: string }>,
    batchId: string,
): Promise<{ inserted: number; duplicates: number; error?: string }> {
    const supabase = createClient();

    const records = rows.map((row) => ({
        profile_id: profileId,
        transaction_date: row.date,
        transaction_type: row.type,
        amount: row.amount,
        raw_line: row.rawLine ?? null,
        import_batch_id: batchId,
    }));

    // Batch insert (Supabase handles up to ~1000 rows at once)
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('transactions').insert(batch);

        if (error) {
            return { inserted, duplicates: 0, error: error.message };
        }
        inserted += batch.length;
    }

    return { inserted, duplicates: 0 };
}

/** Delete all transactions for a batch (undo import) */
export async function deleteImportBatch(batchId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('import_batch_id', batchId);

    if (error) {
        console.error('Error deleting batch:', error);
        return false;
    }
    return true;
}

/** Multiset diff: finds which CSV rows are new vs already in DB.
 *  Uses a frequency count approach to handle multiple identical transactions correctly.
 *  E.g., if DB has 2x "2024-01-01|Deposit|20" and CSV has 3x, only 1 is new. */
export interface ParsedRow {
    date: string;
    type: 'Deposit' | 'Withdrawal';
    amount: number;
    rawLine: string;
}

export interface DiffResult {
    newRows: ParsedRow[];
    existingCount: number;
    totalInCSV: number;
    totalInDB: number;
}

export async function diffTransactions(
    profileId: string,
    csvRows: ParsedRow[],
): Promise<DiffResult> {
    const existing = await getTransactions(profileId);

    // Build frequency map for existing DB transactions
    const dbFreq = new Map<string, number>();
    for (const t of existing) {
        const key = `${t.transaction_date}|${t.transaction_type}|${Number(t.amount)}`;
        dbFreq.set(key, (dbFreq.get(key) ?? 0) + 1);
    }

    // Clone the frequency map for consumption
    const remaining = new Map(dbFreq);
    const newRows: ParsedRow[] = [];

    for (const row of csvRows) {
        const key = `${row.date}|${row.type}|${row.amount}`;
        const count = remaining.get(key) ?? 0;

        if (count > 0) {
            // This row already exists in DB — consume one occurrence
            remaining.set(key, count - 1);
        } else {
            // This row is new
            newRows.push(row);
        }
    }

    return {
        newRows,
        existingCount: csvRows.length - newRows.length,
        totalInCSV: csvRows.length,
        totalInDB: existing.length,
    };
}

// ── Profile CRUD ──

/** Create a new profile */
export async function createProfile(name: string): Promise<DBProfile | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get max sort_order
    const profiles = await getProfiles();
    const maxOrder = profiles.reduce((max, p) => Math.max(max, p.sort_order), -1);

    const { data, error } = await supabase
        .from('profiles')
        .insert({
            user_id: user.id,
            name,
            is_default: false,
            sort_order: maxOrder + 1,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating profile:', error);
        return null;
    }
    return data as DBProfile;
}

/** Update a profile's name */
export async function updateProfile(id: string, name: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', id);

    if (error) {
        console.error('Error updating profile:', error);
        return false;
    }
    return true;
}

/** Delete a profile (cascade deletes transactions) */
export async function deleteProfile(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting profile:', error);
        return false;
    }
    return true;
}

/** Set a profile as the default (unsets all others first) */
export async function setDefaultProfile(id: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Unset all defaults for this user
    const { error: unsetError } = await supabase
        .from('profiles')
        .update({ is_default: false })
        .eq('user_id', user.id);

    if (unsetError) {
        console.error('Error unsetting defaults:', unsetError);
        return false;
    }

    // Set new default
    const { error } = await supabase
        .from('profiles')
        .update({ is_default: true })
        .eq('id', id);

    if (error) {
        console.error('Error setting default profile:', error);
        // Attempt to restore the previous default to avoid leaving all profiles without a default
        await supabase
            .from('profiles')
            .update({ is_default: true })
            .eq('id', id)
            .eq('user_id', user.id);
        return false;
    }
    return true;
}

/** Clear all defaults (for "Todas as Contas" mode) */
export async function clearAllDefaults(): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('profiles')
        .update({ is_default: false })
        .eq('user_id', user.id);

    if (error) {
        console.error('Error clearing defaults:', error);
        return false;
    }
    return true;
}


/** Get stats (transaction count and net result) for a profile */
export async function getProfileStats(profileId: string): Promise<{ count: number; net: number }> {
    const transactions = await getTransactions(profileId);
    let deposits = 0;
    let withdrawals = 0;

    for (const t of transactions) {
        if (t.transaction_type === 'Deposit') {
            deposits += Number(t.amount);
        } else {
            withdrawals += Number(t.amount);
        }
    }

    return { count: transactions.length, net: withdrawals - deposits };
}

