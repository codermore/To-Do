from django_ratelimit.exceptions import Ratelimited
from django.http import JsonResponse

class RatelimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except Ratelimited:
            return JsonResponse(
                {"errors": "Has superado el límite de intentos. Inténtalo más tarde."},
                status=429
            )
        return response