from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .serializer import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

# Create your views here.

#sin Decorador
'''
def mi_vista(request):
    if request.method == 'POST':
        return JsonResponse({"mensaje": "Hola desde POST"})
    return JsonResponse({"error": "Método no permitido"}, status=405)
'''

#con Decorador
# @api_view  

@api_view(['POST']) #Decorador 1) Filtra request.method. 2) Maneja Formatos JSON
def login(request):

    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response(
            {"error": "Invalid password"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    token, _ = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({
        "token": token.key,
        "user": serializer.data},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])  # Solo permite solicitudes POST
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

        # Genera o recupera un token de autenticación para el usuario
        token, _ = Token.objects.get_or_create(user=user)

        # Retorna el token y los datos del usuario en la respuesta
        return Response(
            {'token': token.key, "user": serializer.data}, 
            status=status.HTTP_201_CREATED  # Código 201: recurso creado exitosamente
        )

    # Si los datos no son válidos, devuelve los errores con código 400 (Bad Request)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

