#!/bin/bash

echo "🎤 Circle AI Voice Agent - Starting Server"
echo "=========================================="

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3 server..."
    python3 server.py
elif command -v python &> /dev/null; then
    echo "🐍 Using Python server..."
    python server.py
else
    echo "❌ Python not found. Please install Python 3 to run the server."
    echo "Alternatively, you can:"
    echo "  - Use 'npm run dev' if you have Node.js installed"
    echo "  - Use 'npm run serve' if you have the serve package"
    echo "  - Open index.html directly in your browser (with limitations)"
    exit 1
fi
