# Strike Tracker

**WPG General Strike Team Performance Tracker** is a web app for recording and reviewing team training activity.

**Live site:** [strike-tracker](https://strike-tracker-gray.vercel.app/)

## What it does

- Shows team and individual training totals in a dashboard.
- Logs training sessions by player, category, duration, and date, with optional notes.
- Summarizes training hours by player and category with charts.
- Filters statistics by all time, this week, this month, or this season.

## Technology

- React 19 and JavaScript
- Vite 8
- Supabase for the database
- Recharts for data visualizations
- Lucide React for icons
- Deployed on Vercel

## Run locally

1. Change to the app directory and install dependencies:

   ```sh
   cd strike-tracker
   npm install
   ```

2. Create a `.env` file in `strike-tracker` with the Supabase project URL and anon key:

   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

The app expects active players, an active season, and training sessions in Supabase. Keep database access protected with appropriate Supabase policies; do not put service-role keys in client-side environment variables.

## Available scripts

Run these from `strike-tracker`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
