# Generated by Django 4.2.4 on 2023-08-19 04:29

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Data",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name_of_object", models.CharField(max_length=100)),
                ("country", models.CharField(max_length=100)),
                ("class_of_object", models.CharField(max_length=100)),
            ],
        ),
    ]