# Adavya Retroverse — Live Point Tracker

Real-time point tracking system built for Adavya Retroverse, 
a carnival event hosted at IIIT Kottayam in January 2026.

## What it does

Students participate in carnival games and earn points. Game admins 
submit points in real time through an admin panel. A live leaderboard 
updates instantly for everyone watching — no refresh needed.

## Features

- Public leaderboard with real-time updates via Supabase
- Two-tier role-based access control
  - Main admin: manages students, admins, and full system access
  - Game admins: can only submit points for their assigned game
- Secure authentication using Supabase Auth
- Points tracked per game per student using JSONB
- Deployed on Vercel, used live during the event

## Games Tracked

Plank Challenge, Flour Passing, Lucky Number, Cup Pyramid, 
Carrom, Bindi Game, Dumbbell Hold, Bottle Flip

## Tech Stack

Frontend: React, TypeScript, Tailwind CSS, shadcn/ui  
Backend: Supabase (Auth, Database, Realtime)  
Deployment: Vercel

## Local Setup

1. Clone the repository

2. Install dependencies
   npm install

3. Create a Supabase project at supabase.com

4. Run the schema from supabase/migrations in your Supabase SQL editor

5. Create admin accounts through Supabase Auth dashboard
   Then insert their roles manually:
   INSERT INTO public.admin_roles (id, roll_no, role)
   VALUES ('auth-user-uuid', 'roll-number', 'main');

6. Create .env file in project root
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

7. Start the development server
   npm run dev

&nbsp;

Note: This project was built and deployed under a tight deadline for a live event 
with real users. After the event, the codebase was refactored to 
replace an insecure localStorage-based auth system with proper 
Supabase Auth and RLS policies.
