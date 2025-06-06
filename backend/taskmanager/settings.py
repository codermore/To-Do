"""
Django settings for taskmanager project.

Generated by 'django-admin startproject' using Django 5.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os
from dotenv import load_dotenv

if os.path.exists(".env"):
    load_dotenv()


ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "clave_de_respaldo")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# REDIS
DJANGO_RATELIMIT_CACHE = "default"  # Asegura que usa el caché definido en CACHES
RATELIMIT_USE_X_FORWARDED_FOR = True

if os.getenv("ENV") == "produ":
    # En Produccion
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': os.getenv("REDIS_URL"),
        }
    }
elif os.getenv("ENV") == "local":
    print("cache local")
    # En desarrollo local
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
            'LOCATION': os.path.join(BASE_DIR, 'django_cache'),
        }
}

# Asegurar que Django confíe en proxies inversos
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'whitenoise.runserver_nostatic',  # Asegura que Django no sirva estáticos en desarrollo

    #mis herramientas
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    #my apps
    'tasks',  # App de tareas
    'users',  # App para autenticación
]

MIDDLEWARE = [
    'taskmanager.ratelimit_middleware.RatelimitMiddleware', #my custom middleware
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Usar WhiteNoise para servir archivos estáticos en producción
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'taskmanager.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'taskmanager.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

# Configurar static y media files (para archivos estáticos en producción)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#cors autorization

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://to-do-five-ochre.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True

'''
Como por defecto TokenAuthentication busca el token en el Header.
    'rest_framework.authentication.TokenAuthentication',

# Usa cookies para el token
    'users.authentication.CookieTokenAuthentication',  

# Cookies JWT 
'rest_framework_simplejwt.authentication.JWTAuthentication',  # Autenticación estándar JWT

'''


# # Asegurate que esté True si estás usando https
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# # Muy importante para cookies entre dominios
SESSION_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SAMESITE = "None"


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'users.authentication.CookieTokenAuthentication', 
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Autenticación estándar JWT 
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),  # Token válido por 30 min
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),  # Refresh token válido por 1 día
    'ROTATE_REFRESH_TOKENS': True,  # Si es True, genera un nuevo refresh token con cada uso
    'BLACKLIST_AFTER_ROTATION': True,  # Si es True, el refresh token viejo queda inválido

    # Configuración de cookies
    'AUTH_COOKIE': 'auth_token',  # Nombre de la cookie para el token de acceso
    'AUTH_COOKIE_HTTP_ONLY': True,  # HttpOnly para evitar acceso desde JS
    'AUTH_COOKIE_SECURE': True,  # Poner en True en producción con HTTPS
    'AUTH_COOKIE_SAMESITE': 'None',  # Protege contra CSRF
}