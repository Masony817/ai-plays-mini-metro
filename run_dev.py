#!/usr/bin/env python3
"""
Development runner script
Starts both backend and frontend servers
"""

import subprocess
import sys
import time
from threading import Thread

def run_backend():
    """Run the FastAPI backend"""
    try:
        print("Starting backend server...")
        subprocess.run([sys.executable, "backend/main.py"], check=True)
    except KeyboardInterrupt:
        print("Backend server stopped")

def run_frontend():
    """Run the frontend server"""
    try:
        print("Starting frontend server...")
        subprocess.run([sys.executable, "-m", "http.server", "8080"], 
                      cwd="frontend", check=True)
    except KeyboardInterrupt:
        print("Frontend server stopped")

if __name__ == "__main__":
    print("Starting development environment...")
    print("Backend will run on http://localhost:8000")
    print("Frontend will run on http://localhost:8080")
    print("Press Ctrl+C to stop all servers")
    
    # Start backend in a separate thread
    backend_thread = Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Give backend time to start
    time.sleep(2)
    
    # Start frontend (this will block until Ctrl+C)
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\nShutting down development environment...")
        sys.exit(0)