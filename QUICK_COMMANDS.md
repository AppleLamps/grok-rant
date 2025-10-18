# 🚀 Quick Start Commands

## Development Commands

### Start Everything (Recommended) 🎯

```bash
npm run dev:full
```

**What it does:**
- ✅ Starts Python backend (Port 8000) with all security features
- ✅ Starts Next.js frontend (Port 3000)
- ✅ Shows colorful, labeled output for each server
- ✅ Runs both in a single terminal window

**Output will look like:**
```
[BACKEND] INFO - ✓ API key validated successfully
[BACKEND] INFO - ✓ CORS configured for origins: ['http://localhost:3000']
[BACKEND] INFO - ✓ Rate limiting enabled
[BACKEND] INFO - Uvicorn running on http://0.0.0.0:8000
[FRONTEND] ▲ Next.js 15.5.5
[FRONTEND] - Local: http://localhost:3000
```

---

## Alternative Commands

### Start Backend Only
```bash
npm run dev:backend
```
Starts just the Python FastAPI server on port 8000.

### Start Frontend Only
```bash
npm run dev:frontend
```
Starts just the Next.js development server on port 3000.

### Legacy Command (Same as dev:full)
```bash
npm run dev
```
Basic version without colored labels.

---

## Production Commands

### Build for Production
```bash
npm run build
```
Creates optimized production build of the frontend.

### Start Production Server
```bash
npm run start
```
Runs the production Next.js server (after build).

### Lint Code
```bash
npm run lint
```
Runs ESLint to check for code quality issues.

---

## Backend-Specific Commands

### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Run Backend Directly
```bash
cd backend
python main.py
```

---

## Troubleshooting

### Port Already in Use

**Backend (8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

**Frontend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Backend Won't Start

**Check environment variables:**
```bash
cd backend
cat .env  # Mac/Linux
type .env  # Windows
```

Ensure you have:
```env
XAI_API_KEY=xai-...
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

### Frontend Can't Connect to Backend

1. Verify backend is running: `curl http://localhost:8000/`
2. Check `BACKEND_URL` in `.env.local` (should be `http://localhost:8000`)
3. Verify CORS settings in `backend/.env`

---

## 🎯 Recommended Workflow

### First Time Setup
```bash
# 1. Install Node dependencies
npm install

# 2. Install Python dependencies
cd backend
pip install -r requirements.txt
cd ..

# 3. Configure environment variables
# Make sure backend/.env has your XAI_API_KEY

# 4. Start everything
npm run dev:full
```

### Daily Development
```bash
# Just run this from the project root
npm run dev:full
```

### Stop Everything
Press `Ctrl+C` in the terminal running `dev:full`

---

## 📊 What's Running?

When you run `npm run dev:full`, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | http://localhost:8000 | FastAPI server with Grok AI integration |
| **Frontend** | http://localhost:3000 | Next.js React application |
| **API Status** | http://localhost:8000/ | Security status and health check |

---

## 🔒 Security Features Active

When both servers are running, you have:

✅ **API Key Validation** - Checked at startup  
✅ **CORS Protection** - Restricted to localhost:3000  
✅ **Input Sanitization** - Blocks malicious inputs  
✅ **Rate Limiting** - 5 searches/min, 10 letters/min per IP  
✅ **Error Protection** - Internal errors hidden from clients  
✅ **Structured Logging** - All requests logged  

---

## 💡 Pro Tips

### View Logs Separately

If you want to see backend and frontend logs in separate terminals:

**Terminal 1:**
```bash
npm run dev:backend
```

**Terminal 2:**
```bash
npm run dev:frontend
```

### Check Server Status

**Backend:**
```bash
curl http://localhost:8000/
```

**Frontend:**
```bash
curl http://localhost:3000/
```

### Restart Just One Server

If you need to restart only the backend after making changes:
1. `Ctrl+C` to stop everything
2. `npm run dev:full` to restart both

Or use separate terminals (see above) to restart individually.

---

## 🎨 Color Coding in dev:full

- **Blue** = Backend messages
- **Magenta** = Frontend messages

This makes it easy to see which server is logging what!

---

**Quick Start:** Just run `npm run dev:full` from the project root and you're good to go! 🚀

