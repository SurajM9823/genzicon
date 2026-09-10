from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication without CSRF checks.
    Allows public endpoints and client applications to submit API requests 
    seamlessly without session CSRF cookie mismatches.
    """
    def enforce_csrf(self, request):
        return  # Bypass DRF CSRF enforcement for REST API
