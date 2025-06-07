from rest_framework import serializers
from .models import Task, Goal, Board

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['user']  # para que no se pueda modificar desde el cliente


class GoalSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)  # related_name="tasks" en Task.goal

    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ['user']


class BoardSerializer(serializers.ModelSerializer):
    goals = GoalSerializer(many=True, read_only=True)  # related_name="goals" en Goal.board

    class Meta:
        model = Board
        fields = '__all__'
        read_only_fields = ['user']
