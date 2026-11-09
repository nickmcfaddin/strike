# Strike Tracker

This directory contains the React/Vite app for the [WPG General Strike Team Performance Tracker](https://strike-tracker-gray.vercel.app/). It uses Supabase for team and training-session data.

For the feature overview, technology stack, and setup instructions, see the [repository README](../README.md).

## Development

```sh
npm install
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in a local `.env` file before starting the app. Available checks and build commands are `npm run lint`, `npm run build`, and `npm run preview`.
