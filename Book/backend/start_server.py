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
        print("\nAttempting to install missing packages automatically...")
        print("=" * 60)
        
        try:
            import subprocess
            result = subprocess.run(
                [sys.executable, "-m", "pip", "install", "-r", str(backend_dir / "requirements.txt")],
                cwd=str(backend_dir),
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print("[OK] Successfully installed missing packages!")
                print("=" * 60)
                print("Restarting server...")
                print("=" * 60)
                # Re-check dependencies
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
                    print(f"[WARNING] Still missing: {', '.join(missing_packages)}")
                    print("\nPlease install manually:")
                    print(f"  cd {backend_dir}")
                    print("  pip install -r requirements.txt")
                    sys.exit(1)
            else:
                print("[ERROR] Failed to install packages automatically.")
                print(f"Error: {result.stderr}")
                print("\nPlease install dependencies manually by running:")
                print(f"  cd {backend_dir}")
                print("  pip install -r requirements.txt")
                print("\nOr run: install_dependencies.bat")
                print("=" * 60)
                sys.exit(1)
        except Exception as e:
            print(f"[ERROR] Error during automatic installation: {e}")
            print("\nPlease install dependencies manually by running:")
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
    env_path = backend_dir / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        print(f"[OK] Loaded environment variables from: {env_path}")
    else:
        load_dotenv()
        print(f"[WARNING] .env file not found at {env_path}, using system environment variables")
    
    print("=" * 60)
    print("Starting FastAPI Backend Server")
    print("=" * 60)
    print(f"Server will run on: http://localhost:8000")
    print(f"API Documentation: http://localhost:8000/docs")
    print(f"Health Check: http://localhost:8000/health")
    print("=" * 60)
    print()
    
    try:
        uvicorn.run(
            "src.vla.api.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            reload_dirs=[str(backend_dir / "src")]
        )
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("[STOP] Backend server stopped by user")
        print("=" * 60)
    except Exception as e:
        print("\n" + "=" * 60)
        print(f"[ERROR] Error starting backend server: {e}")
        print("=" * 60)
        import traceback
        traceback.print_exc()
        sys.exit(1)

