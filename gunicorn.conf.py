"""Gunicorn configuration for Azure App Service Linux."""

import os


bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"
workers = 1
threads = 4
timeout = 60
graceful_timeout = 30
accesslog = "-"
errorlog = "-"
capture_output = True
