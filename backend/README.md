# Trump Letter Generator - Python Backend

FastAPI backend using the official xAI Python SDK.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Add your xAI API key to `.env`:
```
XAI_API_KEY=xai-your-actual-api-key-here
```

## Run

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

## API Endpoints

- `GET /` - Health check
- `POST /api/search-user-posts` - Search and analyze X user posts
- `POST /api/generate-letter` - Generate Trump letter

## Documentation

Interactive API docs available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

