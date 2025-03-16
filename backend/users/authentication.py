from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

class CookieTokenAuthentication(JWTAuthentication):
    def authenticate(self, request):
        print("🔍 Cookies en la solicitud:", request.COOKIES)
        token = request.COOKIES.get('auth_token')  # Buscar el token en la cookie

        if not token:
            return None  # No hay token, el usuario no está autenticado
        
        try:
            validated_token = AccessToken(token)  # Valida el token
        except Exception:
            raise AuthenticationFailed("Token inválido o expirado")

        user = self.get_user(validated_token)

        if not user:
            raise AuthenticationFailed("No se pudo autenticar al usuario")

        return (user, validated_token)

