from django.contrib import admin
from .models import Task, Goal, Board

# Register your models here.
admin.site.register(Task)
admin.site.register(Goal)
admin.site.register(Board)