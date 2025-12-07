#!/usr/bin/env python3
"""Script to start the FastAPI backend server."""

import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Change to backend directory
os.chdir(backend_dir)

# Check if required packages are installed
def check_dependencies():
    """Check if required packages are installed."""
    required_packages = [
        'qdrant_client',
        'fastapi',
        'uvicorn',
        'openai',
        'dotenv'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            if package == 'dotenv':
                __import__('dotenv')
            elif package == 'qdrant_client':
                __import__('qdrant_client')
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("=" * 60)
        print("ERROR: Missing required Python packages!")
        print("=" * 60)
        print(f"Missing packages: {', '.join(missing_packages)}")
        print("\nPlease install dependencies by running:")
        print(f"  cd {backend_dir}")
        print("  pip install -r requirements.txt")
        print("\nOr run: install_dependencies.bat")
        print("=" * 60)
        sys.exit(1)

# Start uvicorn server
if __name__ == "__main__":
    # Check dependencies first
    check_dependencies()
    
    import uvicorn
    
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    uvicorn.run(
        "src.vla.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[str(backend_dir / "src")]
    )

