from django.db import models
from django.contrib.auth.models import User

# Tablero general
class Board(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='boards')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Objetivo / Lista dentro de un Board (antes estaba vinculado directo al user)
class Goal(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="goals")  # 👈 Cambio aquí
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Tareas dentro de un Goal
class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    datecompleted = models.DateTimeField(null=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # El dueño de la tarea
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name="tasks", null=True)  # 👈 Cambio aquí

    def __str__(self):
        return self.title
