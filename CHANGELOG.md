# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-11

### Added

- Monorepo structure with Turborepo and pnpm workspaces
- `@bettracker/core` package with shared types, validators, formatters, parsers, and calculations
- `@bettracker/config` package with shared TypeScript configurations
- Next.js 15 web app with App Router and Tailwind CSS v4
- Design system with dark/light themes, custom color palette, and glassmorphism
- Supabase integration (client, server, middleware) with auth route protection
- Landing page with premium design
- Auth page (login, register, reset) with password strength and Portuguese error translation
- App layout with collapsible sidebar and responsive mobile navigation
- Dashboard, Transactions, Analytics, Profiles, Compare, Goals, Settings page stubs
- Database schema (6 tables with RLS, indexes, triggers)
- BetanoParser with auto-detection for CSV format `Date;Tipe;Vaule`
- Calculation engine: statistics, monthly aggregation, MoM, histograms, streaks
- Insights engine with strategy pattern (Performance, Patterns, Recommendations)
