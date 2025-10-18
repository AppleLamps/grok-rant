# 🇺🇸 Trump Letter Generator

A fun web application that generates personalized letters from President Trump based on a user's X (Twitter) profile. Powered by Grok AI.

## Features

- 🔍 Search any X (Twitter) username
- 🤖 AI-powered analysis of user's posts and interests
- ✍️ Personalized letter generation in Trump's distinctive style
- 📋 Copy to clipboard
- 💾 Download as text file
- 🔄 Regenerate for different variations

## How It Works

1. User enters an X (Twitter) username
2. Grok AI searches X for that user's posts using the `x_search` tool
3. AI analyzes the posts to extract:
   - Main topics discussed
   - Personality traits
   - Communication style
   - Key interests
4. AI generates a personalized letter from Trump that references the user's specific interests
5. User can copy, download, or regenerate the letter

## Tech Stack

- **Frontend**: Next.js 14 with React and TypeScript
- **Backend**: Python FastAPI with official xAI Python SDK
- **Styling**: Tailwind CSS v4
- **AI**: Grok API (`grok-4-fast` model)
- **Tools Used**: X Search (`x_search`) for gathering user posts

## Architecture

```
┌─────────────────┐
│   Next.js App   │  (Frontend - Port 3000)
│  (TypeScript)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  FastAPI Server │  (Backend - Port 8000)
│    (Python)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Grok API      │  (xAI Python SDK)
│  (x_search)     │
└─────────────────┘
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- A Grok API key from [x.ai](https://x.ai)

### Backend Setup (Python)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- **Windows**: `venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Set up environment variables:
   - The `.env` file is already created with your API key
   - Or create it manually: `cp .env.example .env` and add your key

6. Run the Python backend:
```bash
python main.py
```

The backend will be available at http://localhost:8000

### Frontend Setup (Next.js)

1. Open a new terminal and navigate to the project root:
```bash
cd grok-rant
```

2. Install Node dependencies:
```bash
npm install
```

3. The `.env.local` is already configured to point to the backend

4. Run the Next.js development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Quick Start (Easy Method)

### Starting the Application

Simply double-click `start.bat` (Windows) or run:
```bash
./start.bat    # Windows
./start.sh     # Mac/Linux
```

This will:
- Start both the backend (port 8000) and frontend (port 3000)
- Keep servers running in minimized windows
- **Automatically stop all servers** when you close the terminal or press Ctrl+C

### Stopping the Application

**Option 1:** Close the terminal window that's running the servers
**Option 2:** Press Ctrl+C in the terminal
**Option 3:** Double-click `stop.bat` or run `./stop.bat` to manually stop all servers

The new scripts ensure that servers are **always properly cleaned up** when PowerShell is closed - no more orphaned processes!

## Usage

**Make sure both servers are running** (use `start.bat` or follow manual setup):
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

Then:
1. Enter any X (Twitter) username (without the @)
2. Click "Search" to analyze their profile
3. Review the analysis showing their topics, traits, and interests
4. Click "Generate Trump Letter" to create a personalized letter
5. Copy, download, or regenerate as desired

## API Endpoints

### Backend (Python FastAPI - Port 8000)

#### `POST /api/search-user-posts`
- **Body**: `{ "username": "string" }`
- **Returns**: `{ "analysis": { ... } }`
- Uses xAI Python SDK with `x_search` tool

#### `POST /api/generate-letter`
- **Body**: `{ "username": "string", "analysis": { ... } }`
- **Returns**: `{ "letter": "string", "username": "string" }`
- Uses xAI Python SDK for letter generation

### Frontend (Next.js - Port 3000)

The Next.js API routes proxy requests to the Python backend.

## Project Structure

```
grok-rant/
├── backend/                             # Python FastAPI backend
│   ├── main.py                          # FastAPI app with xAI SDK
│   ├── requirements.txt                 # Python dependencies
│   ├── .env                             # Backend environment variables
│   └── README.md                        # Backend documentation
├── app/                                 # Next.js frontend
│   ├── api/
│   │   ├── search-user-posts/route.ts   # Proxy to Python backend
│   │   └── generate-letter/route.ts     # Proxy to Python backend
│   ├── page.tsx                         # Main page
│   ├── layout.tsx                       # Root layout
│   └── globals.css                      # Global styles
├── components/
│   ├── SearchForm.tsx                   # Username input form
│   ├── PostsPreview.tsx                 # Analysis display
│   ├── LetterDisplay.tsx                # Letter display with actions
│   └── LoadingSpinner.tsx               # Loading indicator
├── lib/
│   └── types.ts                         # TypeScript interfaces
├── .env.local                           # Frontend environment variables
├── package.json                         # Node dependencies
└── README.md                            # This file
```

## Environment Variables

### Backend (`backend/.env`)
- `XAI_API_KEY`: Your Grok API key (required)

### Frontend (`.env.local`)
- `BACKEND_URL`: Python backend URL (default: http://localhost:8000)

## Deployment

### Option 1: Deploy Both Services

**Backend (Python):**
- Deploy to Railway, Render, or any Python hosting service
- Set `XAI_API_KEY` environment variable
- Note the deployed URL

**Frontend (Next.js):**
- Deploy to Vercel
- Set `BACKEND_URL` to your deployed Python backend URL
- Deploy!

### Option 2: Serverless (Vercel only)

You can also deploy the Python backend as Vercel serverless functions by converting the FastAPI app to Vercel's Python runtime.

## Notes

- This is a parody/entertainment application
- Letters are generated by AI and are not actually from Donald Trump
- The app uses Grok's X search capabilities to analyze public posts
- Rate limits may apply based on your Grok API plan

## License

MIT

## Disclaimer

This is a parody application for entertainment purposes only. It is not affiliated with, endorsed by, or connected to Donald Trump or any political organization.

