# Generated by Django 2.0.2 on 2018-03-02 02:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [("core", "0031_auto_20180301_2300")]

    operations = [
        migrations.AlterField(
            model_name="recipe",
            name="team",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="recipes",
                to="core.Team",
            ),
        )
    ]
