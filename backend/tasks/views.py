from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Task
from .serializer import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get_queryset(self):
        # Filtra las tareas para que cada usuario solo vea las suyas
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Asocia automáticamente la tarea al usuario autenticado
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Asegura que al actualizar también se mantenga el usuario actual
        serializer.save(user=self.request.user)

    def get_object(self):
        # Verifica que el usuario autenticado sea el dueño de la tarea
        task = super().get_object()
        if task.user != self.request.user:
            raise PermissionDenied("No tienes permiso para acceder a esta tarea.")
        return task
