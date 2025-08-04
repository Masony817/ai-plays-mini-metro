"""
Main backend entry point for the game server
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mini Metro Infused Game Backend")

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Game backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Game logic endpoints will be added here
# @app.post("/game/action")
# async def process_game_action():
#     pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)