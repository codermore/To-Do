from rest_framework import serializers
from .models import Task, Goal

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['user']

class GoalSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)  # aquí usamos related_name='tasks'

    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ['user']