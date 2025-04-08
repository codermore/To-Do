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
        secure=True,  # Cambia a True si usas HTTPS
        samesite="None",  # Protege contra ataques CSRF
        max_age=3600  # Expira en 1 hora (opcional)
    )

    return response

@api_view(['POST'])  # Solo permite solicitudes POST
@permission_classes([AllowAny]) 
def register(request):
    """
    Endpoint para registrar un nuevo usuario.
    Recibe los datos del usuario en el cuerpo de la solicitud (JSON).
    Devuelve un token de autenticación y los datos del usuario si el registro es exitoso.
    """

    # convierte datos JSON --> objeto de modelo válido para Django
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():  # Verifica si los datos cumplen con las reglas de validación
        # Crea el usuario con la contraseña encriptada
        user = User.objects.create_user(
            username=serializer.validated_data['username'],  # Nombre de usuario
            email=serializer.validated_data.get('email', ''),  # Email (opcional)
            password=serializer.validated_data['password']  # Contraseña (se encripta automáticamente)
        )

        # Retorna el token y los datos del usuario en la respuesta
        return Response(
            {"user": serializer.data}, 
            status=status.HTTP_201_CREATED  # Código 201: recurso creado exitosamente
        )
    
    # Pasamos de un diccionario a un array.
    error_list = []
    for field, errors in serializer.errors.items():
        for error in errors:
            # error_list.append(f"{field}: {error}")
            error_list.append({error})

    
    print(error_list)
    # Si los datos no son válidos, devuelve los errores con código 400 (Bad Request)
    return Response({"errors": error_list}, status=status.HTTP_400_BAD_REQUEST)

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
    response.delete_cookie(
        key="auth_token",
        path="/",
        samesite="None",
    )
    return response
