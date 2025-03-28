import os
import django

# Configurar Django para que pueda ejecutar código fuera del entorno normal
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskmanager.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Datos del superusuario desde variables de entorno
SUPERUSER_USERNAME = os.getenv('DJANGO_SUPERUSER_USERNAME')
SUPERUSER_EMAIL = os.getenv('DJANGO_SUPERUSER_EMAIL')
SUPERUSER_PASSWORD = os.getenv('DJANGO_SUPERUSER_PASSWORD')

# Crear superusuario si no existe
if not User.objects.filter(username=SUPERUSER_USERNAME).exists():
    User.objects.create_superuser(SUPERUSER_USERNAME, SUPERUSER_EMAIL, SUPERUSER_PASSWORD)
    print("Superusuario creado exitosamente.")
else:
    print("El superusuario ya existe.")
