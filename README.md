# Daily Tracker - Cloud-Synced Task Manager

A modern, responsive daily task tracker with cloud synchronization, recurring tasks, and monthly progress reports.

## Features

- ✅ **Cloud Sync** - Access your tasks from any device via Supabase
- ✅ **Google Sign-In** - Quick authentication with Google OAuth
- ✅ **Recurring Tasks** - Daily, weekly, or one-time tasks
- ✅ **Per-Date Completion** - Track completion history for recurring tasks
- ✅ **Monthly Reports** - Export progress as PDF
- ✅ **Mobile Responsive** - Works perfectly on phone and desktop
- ✅ **Real-time Sync** - Changes sync across all your devices

## Tech Stack

- **Frontend**: React 19.1 + Vite 7.1
- **Routing**: React Router DOM 7.9
- **State Management**: Zustand 5.0
- **Styling**: Tailwind CSS 4.1
- **Backend**: Supabase (PostgreSQL + Auth)
- **Authentication**: Google OAuth + Email/Password
- **PDF Generation**: jsPDF

## Quick Start

1. **Clone & Install**:
   ```bash
   git clone https://github.com/suhas991/Daily-Tracker.git
   cd Daily-Tracker
   npm install
   ```

2. **Setup Supabase** (see QUICKSTART_SUPABASE.md for detailed steps):
   - Create a Supabase project
   - Run SQL from SUPABASE_SETUP.md to create tables
   - Enable Google provider in Authentication settings
   - Copy your credentials to `.env`

3. **Configure Environment**:
   ```bash
   # Create .env file
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Header.jsx
│   ├── TaskCard.jsx
│   ├── TaskList.jsx
│   └── ConfirmModal.jsx
├── contexts/         # React contexts
│   └── AuthContext.jsx
├── lib/             # Third-party configurations
│   └── supabase.js
├── pages/           # Route pages
│   ├── Auth.jsx
│   ├── Today.jsx
│   ├── Month.jsx
│   └── Editor.jsx
├── store/           # Zustand state management
│   └── taskStore.js (Supabase-integrated)
└── App.jsx          # Main app component
```

## Documentation

- **QUICKSTART_SUPABASE.md** - 5-minute setup guide
- **SUPABASE_SETUP.md** - Detailed configuration instructions

## Deployment

The app is configured for Vercel deployment with proper SPA routing support via `vercel.json`.

## License

MIT

---

**React + Vite Template**

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

