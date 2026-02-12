import { z } from 'zod';

/** Schema for raw transaction data from CSV */
export const rawTransactionSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    type: z.string().min(1, 'Type is required'),
    value: z.string().min(1, 'Value is required'),
});

/** Schema for a processed transaction */
export const transactionSchema = z.object({
    id: z.string().uuid(),
    profileId: z.string().uuid(),
    platformId: z.string().uuid().optional(),
    date: z.date(),
    rawDate: z.string(),
    type: z.enum(['Deposit', 'Withdrawal']),
    amount: z.number().positive('Amount must be positive'),
    cumulative: z.number(),
    importBatchId: z.string().optional(),
});

/** Schema for creating a profile */
export const createProfileSchema = z.object({
    name: z
        .string()
        .min(1, 'Profile name is required')
        .max(50, 'Profile name must be 50 characters or less')
        .trim(),
});

/** Schema for renaming a profile */
export const renameProfileSchema = createProfileSchema;

/** Schema for user preferences */
export const userPreferencesSchema = z.object({
    theme: z.enum(['dark', 'light']),
    locale: z.enum(['pt', 'en']),
    itemsPerPage: z.number().int().min(5).max(100).default(10),
});

/** Schema for creating a goal */
export const createGoalSchema = z.object({
    profileId: z.string().uuid(),
    title: z.string().min(1).max(100).trim(),
    goalType: z.enum(['net_result', 'roi', 'deposit_limit', 'streak']),
    targetValue: z.number(),
    startDate: z.date(),
    endDate: z.date().optional(),
});

/** Schema for creating a shared report */
export const createSharedReportSchema = z.object({
    profileId: z.string().uuid(),
    title: z.string().min(1).max(100).trim(),
    reportConfig: z.object({
        showKPIs: z.boolean().default(true),
        showCharts: z.boolean().default(true),
        showInsights: z.boolean().default(false),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
    }),
});

/** Schema for pagination params */
export const paginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(5).max(100).default(10),
});

/** Schema for transaction filter */
export const transactionFilterSchema = z.object({
    type: z.enum(['Deposit', 'Withdrawal']).optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
    platformId: z.string().uuid().optional(),
});

/** Schema for sort config */
export const sortConfigSchema = z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']).default('desc'),
});

export type RawTransactionInput = z.infer<typeof rawTransactionSchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type CreateSharedReportInput = z.infer<typeof createSharedReportSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
export type SortConfigInput = z.infer<typeof sortConfigSchema>;
