# Generated by Django 5.1.6 on 2025-04-09 09:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("tasks", "0003_alter_task_user"),
    ]

    operations = [
        migrations.RenameField(
            model_name="task",
            old_name="important",
            new_name="completed",
        ),
    ]
