import time
from django.http import JsonResponse
from django.core.cache import cache

class RatelimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limit_seconds = 60 * 60  # 1 hora
        self.max_requests = 1  # Máximo de registros por IP

    def __call__(self, request):
        if request.path == "/api/auth/register/" and request.method == "POST":
            ip = self.get_client_ip(request)
            print(f"🛡 IP detectada: {ip}")

            key = f"register-ip-{ip}"
            attempts = cache.get(key, 0)

            if attempts >= self.max_requests:
                print(f"❌ Límite superado para IP: {ip}")
                return JsonResponse(
                    {"errors": "Has superado el límite de registros por hora desde esta IP."},
                    status=429
                )
            else:
                cache.incr(key)
                # Si es la primera vez, setea el timeout
                if attempts == 0:
                    cache.set(key, 1, timeout=self.rate_limit_seconds)

        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        ip = request.META.get("HTTP_X_FORWARDED_FOR")
        if ip:
            ip = ip.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR", "")
        return ip