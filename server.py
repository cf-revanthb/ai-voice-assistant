#!/usr/bin/env python3
"""
Simple HTTP server for Circle AI Voice Agent
Serves the static files with proper MIME types for web development
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def guess_type(self, path):
        """Override to ensure proper MIME types for web files"""
        mimetype = super().guess_type(path)
        
        # Ensure JavaScript files are served with correct MIME type
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        elif path.endswith('.mp4'):
            return 'video/mp4'
        elif path.endswith('.webm'):
            return 'video/webm'
        elif path.endswith('.wav'):
            return 'audio/wav'
        elif path.endswith('.mp3'):
            return 'audio/mpeg'
        
        return mimetype
    
    def do_GET(self):
        # Default to index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

def main():
    PORT = 8000
    
    # Check if port is already in use
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Circle AI Voice Agent Server")
            print(f"📡 Server running at http://localhost:{PORT}")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"🎤 Ready for voice interactions!")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use. Trying port {PORT + 1}...")
            try:
                with socketserver.TCPServer(("", PORT + 1), CustomHTTPRequestHandler) as httpd:
                    print(f"🚀 Circle AI Voice Agent Server")
                    print(f"📡 Server running at http://localhost:{PORT + 1}")
                    print(f"📁 Serving files from: {os.getcwd()}")
                    print(f"🎤 Ready for voice interactions!")
                    print(f"⏹️  Press Ctrl+C to stop the server")
                    print("-" * 50)
                    
                    httpd.serve_forever()
            except OSError:
                print(f"❌ Could not start server. Please check available ports.")
                sys.exit(1)
        else:
            print(f"❌ Error starting server: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")

if __name__ == "__main__":
    main()
