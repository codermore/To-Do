from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Task, Goal, Board
from .serializer import TaskSerializer, GoalSerializer, BoardSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get_queryset(self):
        # Filtra las tareas para que cada usuario solo vea las suyas
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):

        # Obtener el goal_id de los datos de la petición
        goal_id = self.request.data.get('goal_id')  # o 'goal_id' según como lo envíes
        
        if goal_id:
            try:
                # Verificar que el goal existe y pertenece al usuario
                goal = Goal.objects.get(id=goal_id, board__user=self.request.user)
                # Guardar la tarea con el usuario y el goal
                serializer.save(user=self.request.user, goal=goal)
            except Goal.DoesNotExist:
                raise PermissionDenied("El objetivo no existe o no tienes permiso para acceder a él.")
        else:
            # Si no hay goal_id, guardar solo con el usuario
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
    
class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get_queryset(self):
        return Goal.objects.filter(board__user=self.request.user)
    
    def perform_create(self, serializer):
        board_id = self.request.data.get('board')  # podés usar board también si querés
        if not board_id:
            raise ValidationError("board_id es requerido")

        try:
            board = Board.objects.get(id=board_id, user=self.request.user)
        except Board.DoesNotExist:
            raise PermissionDenied("El board no existe o no tenés permiso.")

        serializer.save(board=board)

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
