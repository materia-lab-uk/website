#!/usr/bin/env python3
"""Tiny email relay for Materia Lab website."""

import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import HTTPServer, BaseHTTPRequestHandler

BEARER_TOKEN = os.environ.get("RELAY_TOKEN", "mtr-relay-Kx9vP2wL7nQ4")
PORT = 8025


class RelayHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        auth = self.headers.get("Authorization", "")
        if auth != f"Bearer {BEARER_TOKEN}":
            self.send_response(401)
            self.end_headers()
            self.wfile.write(b"Unauthorized")
            return

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))

        to = body.get("to")
        subject = body.get("subject")
        html = body.get("html", "")
        text = body.get("text", "")

        if not to or not subject:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Missing to or subject")
            return

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = "Materia Lab <noreply@materia-lab.uk>"
            msg["To"] = to

            if text:
                msg.attach(MIMEText(text, "plain"))
            if html:
                msg.attach(MIMEText(html, "html"))

            with smtplib.SMTP("localhost", 587) as s:
                s.starttls()
                s.login("noreply", "MateriaNoReply2026")
                s.send_message(msg)

            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True}).encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    print(f"Email relay listening on port {PORT}")
    HTTPServer(("127.0.0.1", PORT), RelayHandler).serve_forever()
