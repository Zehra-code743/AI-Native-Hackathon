@echo off
echo Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
echo.
echo Dependencies installed successfully!
echo You can now run 'npm start' from the Book directory.
pause

