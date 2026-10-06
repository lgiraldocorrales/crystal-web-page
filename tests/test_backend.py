"""Regression tests for the Flask delivery layer and security headers."""

import os
import unittest
from unittest.mock import patch

from app import app, _rate_buckets


class BackendTests(unittest.TestCase):
    def setUp(self) -> None:
        app.config.update(TESTING=True, TRUSTED_HOSTS=None)
        _rate_buckets.clear()
        self.client = app.test_client()

    def test_health_endpoint(self) -> None:
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "ok"})

    def test_static_home_has_security_headers(self) -> None:
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("default-src 'self'", response.headers["Content-Security-Policy"])
        self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
        self.assertEqual(response.headers["X-Frame-Options"], "DENY")
        response.close()

    def test_contact_rejects_invalid_payload(self) -> None:
        response = self.client.post("/api/contact", json={})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "invalid_fields")

    def test_contact_rejects_untrusted_origin(self) -> None:
        with patch.dict(os.environ, {"CONTACT_ALLOWED_ORIGINS": "https://www.crystal.com.co"}, clear=False):
            response = self.client.post("/api/contact", json={}, headers={"Origin": "https://example.com"})
        self.assertEqual(response.status_code, 403)

    @patch("app._send_email")
    def test_contact_sends_internal_and_confirmation_messages(self, send_email) -> None:
        environment = {
            "MASTERBASE_INTERNAL_RECIPIENTS": "contacto@crystal.com.co",
            "MASTERBASE_FROM_EMAIL": "no-reply@crystal.com.co",
        }
        payload = {
            "name": "Persona de prueba",
            "email": "persona@example.com",
            "company": "Crystal",
            "phone": "+57 300 000 0000",
            "message": "Mensaje de validación suficientemente largo.",
            "language": "es",
            "website": "",
        }
        with patch.dict(os.environ, environment, clear=False):
            response = self.client.post("/api/contact", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(send_email.call_count, 2)


if __name__ == "__main__":
    unittest.main()
