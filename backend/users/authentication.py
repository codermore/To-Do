from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

class CookieTokenAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('auth_token')  # Buscar el token en la cookie

        if not token:
            return None  # No hay token, el usuario no está autenticado
        
        try:
            validated_token = AccessToken(token)  # Valida y decodifica el token
        except Exception:
            raise AuthenticationFailed("Token inválido o expirado")

        '''
        self.get_user() es un método heredado de JWTAuthentication, 
        que pertenece a rest_framework_simplejwt.authentication.
        '''
        #Obtiene el usuario autenticado con ese token.
        user = self.get_user(validated_token)

        if not user:
            raise AuthenticationFailed("No se pudo autenticar al usuario")

        return (user, validated_token)

