# Mini Metro Infused Game

A game project with Python backend, JavaScript frontend, and PyTorch model training.

## Project Structure

```
mini-metro-infused/
├── frontend/           # JavaScript frontend
│   ├── index.html     # Main HTML file
│   ├── app.js         # Frontend JavaScript
│   ├── styles.css     # Styling
│   └── package.json   # Frontend dependencies
├── backend/           # Python game logic
│   ├── __init__.py
│   ├── main.py        # FastAPI server
│   └── game/          # Game logic modules
│       ├── __init__.py
│       └── engine.py  # Core game engine
├── models/            # PyTorch model training
│   ├── __init__.py
│   └── train.py       # Model training script
└── requirements.txt   # Python dependencies
```

## Setup Instructions

### Backend Setup
1. Create virtual environment: `python -m venv venv`
2. Activate virtual environment: `source venv/bin/activate` (Unix) or `venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Run backend: `python backend/main.py`

### Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Start local server: `npm run start` or `python -m http.server 8080`
3. Open browser to `http://localhost:8080`

### Model Training Setup
1. Ensure PyTorch is installed: `pip install torch torchvision`
2. Run training script: `python models/train.py`

## Development

- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:8080`
- API documentation available at `http://localhost:8000/docs`

## Next Steps

1. Implement game logic in `backend/game/`
2. Create frontend game interface
3. Design and train AI models in `models/`
4. Connect frontend to backend via API calls