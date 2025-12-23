## Healio - Mental Health Support Platform

Healio is a web-based mental health support platform designed to provide users with a safe, supportive, and interactive space to manage their emotional well-being. The platform combines community support, AI-assisted guidance, and user-friendly design to help individuals feel heard, understood, and supported.

This is a [Next.js](https://nextjs.org) project 

## Project Preview 
[`Vercel`](https://healio-one.vercel.app/)

## Features
- #### User Authentication

  Secure sign-up and login system

  Protected routes for authenticated users

- #### Community Forum

  Users can share thoughts, experiences, and advice

  Thread-based discussions with real-time updates

- #### AI-Powered Support

  Smart responses to user queries related to mental well-being

  Helpful, non-judgmental conversational interactions

- #### Clean & Responsive UI

  Works seamlessly on desktop and mobile devices

  Minimal, calming, and user-friendly design

## Tech Stack
Frontend: Next.js, React, Tailwind CSS

Backend: Node.js

Database: Convex DB / Supabase (depending on your setup)

Authentication: Clerk

AI Integration: Gemini API / Custom LLM logic


## Architecture Diagram of the Project 

<img width="521" height="596" alt="healio-uml" src="https://github.com/user-attachments/assets/ebba1515-45a8-41c2-b034-f0943342f3f6" />


## Installation And Setup

Clone the repository
```bash
git clone https://github.com/your-username/healio.git
```

Navigate to the project folder
```bash
cd healio
```

Install dependencies
```bash
npm install
```

Create a .env file and add required keys
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
GEMINI_API_KEY=your_key
DATABASE_URL=your_url
```

Run the project
```bash
npm run dev
```


## Purpose 

Healio was built to promote mental well-being by combining technology with empathy. The goal is to make mental health support more accessible through a blend of AI assistance and real human interaction.

## Future Improvements

- Mood tracking and analytics dashboard

- Personalized AI responses based on user history

- One-on-one anonymous chat support




