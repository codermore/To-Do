from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .serializer import UserSerializer
from django.contrib.auth.models import User
# from rest_framework.authtoken.models import Token
from rest_framework import status
# from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited

# Create your views here.

'''
Esta es una FBV (vista basada en funciones)
'''

#con Decorador
# @api_view  

@api_view(['POST']) #Decorador 1) Filtra request.method. 2) Maneja Formatos JSON
@permission_classes([AllowAny]) 
def login(request):

    try:
        user = User.objects.get(username=request.data['username'])
    except User.DoesNotExist:
        return Response(
            {"errors": ['El usuario no esta registrado']},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(request.data['password']):
        return Response(
            {"errors": ['Contraseña incorrecta']},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # token, _ = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    # Generar tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    response = Response(serializer.data, status=status.HTTP_200_OK)

    # Configurar la cookie HttpOnly con el token
    response.set_cookie(
        key="auth_token", 
        value=access_token, 
        httponly=True,  # Evita acceso desde JavaScript
        secure=False,  # Cambia a True si usas HTTPS
        samesite="Lax",  # Protege contra ataques CSRF
        max_age=3600  # Expira en 1 hora (opcional)
    )

    return response

def get_client_ip(request):
    ip = request.META.get("HTTP_X_FORWARDED_FOR")
    if ip:
        ip = ip.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR", "")
    
    print(f"IP detectada: {ip}")  # 👀 Debugging
    return ip

@ratelimit(key=lambda g, r: get_client_ip(r), rate='1/h', method='POST', block=True)
@api_view(['POST'])  # Solo permite solicitudes POST
@permission_classes([AllowAny]) 
def register(request):
    try:
        real_ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR"))
        print(f"IP detectada (X_FORWARDED_FOR): {real_ip}")
        print(f"Rate limit activado: {getattr(request, 'limited', False)}") 
        print("IP detectada (REMOTE_ADDR):", request.META.get('REMOTE_ADDR'))

        # Verifica si la solicitud fue limitada (por si block=False en algún caso)
        if getattr(request, 'limited', False):
            return Response(
                {"errors": "Has superado el límite de intentos. Inténtalo más tarde."}, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data.get('email', ''),
                password=serializer.validated_data['password']
            )

            return Response(
                {"user": serializer.data}, 
                status=status.HTTP_201_CREATED
            )

        error_list = []
        for field, errors in serializer.errors.items():
            for error in errors:
                error_list.append({error})

        print(error_list)
        return Response({"errors": error_list}, status=status.HTTP_400_BAD_REQUEST)

    except Ratelimited:
        print(f"⛔ Ratelimit activado para IP: {get_client_ip(request)}")
        return Response(
            {"errors": "Has superado el límite de intentos. Inténtalo más tarde."},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

'''
1️⃣ @permission_classes([IsAuthenticated])
    🔹 ¿Qué hace?
        Restringe el acceso a la vista solo a usuarios autenticados.
        Si el usuario no está autenticado, devuelve un error 403 Forbidden.
        Debe ir acompañado de un sistema de autenticación, como TokenAuthentication o SessionAuthentication.
'''

@api_view(['POST']) #Decorador
@permission_classes([IsAuthenticated]) # Solo permite usuarios autenticados
def profile(request):
    serializer = UserSerializer(instance=request.user)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def logout(request):
    response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
    response.delete_cookie("auth_token")  # Elimina la cookie
    return response
