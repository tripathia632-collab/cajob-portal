#!/usr/bin/env python3
"""
cajob.in - Fixed Asset Register & Depreciation Engine Web Server
Zero external dependency Python 3 HTTP Server
Architect & Author: CA Ashish Tripathi
Brand: cajob.in
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = Path(__file__).resolve().parent

class CajobFARRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def guess_type(self, path):
        path_str = str(path).lower()
        if path_str.endswith(".js"):
            return "application/javascript"
        elif path_str.endswith(".css"):
            return "text/css"
        elif path_str.endswith(".xlsx"):
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        elif path_str.endswith(".csv"):
            return "text/csv"
        elif path_str.endswith(".json"):
            return "application/json"
        
        result = super().guess_type(path)
        if isinstance(result, tuple):
            return result[0] or "application/octet-stream"
        return result or "application/octet-stream"

def main():
    os.chdir(DIRECTORY)
    server_address = ("", PORT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(server_address, CajobFARRequestHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 70)
        print("  cajob.in | Fixed Asset Register & Depreciation Engine")
        print("  Built by: CA Ashish Tripathi")
        print("  Platform: cajob.in")
        print("=" * 70)
        print(f"  Web application live at: {url}")
        print(f"  Serving directory:      {DIRECTORY}")
        print("  Press Ctrl+C to terminate.")
        print("=" * 70)

        if "--no-browser" not in sys.argv:
            try:
                webbrowser.open(url)
            except Exception:
                pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    main()
