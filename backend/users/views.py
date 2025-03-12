from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

#sin Decorador

'''
def mi_vista(request):
    if request.method == 'POST':
        return JsonResponse({"mensaje": "Hola desde POST"})
    return JsonResponse({"error": "Método no permitido"}, status=405)
'''

#con Decorador
# @api_view  1) Filtra request.method. 2) Maneja Formatos JSON

@api_view(['POST']) #Decorador
def login(request):
    return Response({})

@api_view(['POST']) #Decorador
def register(request):
    return Response({})

@api_view(['GET']) #Decorador
def profile(request):
    return Response({})
