# Generated by Django 2.0.2 on 2018-03-07 05:30

from django.db import migrations, models
import django.db.models.deletion


def copy_user_to_generic_forwards(apps, schema_editor):
    """
    Set all recipes content type to MyUser ContentType and object_id to the users field value
    """
    db_alias = schema_editor.connection.alias

    Recipe = apps.get_model("core", "Recipe")
    ContentType = apps.get_model("contenttypes", "ContentType")

    # NB need to user get_or_create: https://stackoverflow.com/a/31543063/3555105
    user_content_type, _ = ContentType.objects.using(db_alias).get_or_create(
        app_label="core", model="myuser"
    )

    for recipe in Recipe.objects.using(db_alias).all():
        recipe.content_type = user_content_type
        recipe.object_id = recipe.user.id
        recipe.save()


class Migration(migrations.Migration):

    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        ("core", "0037_auto_20180304_0138"),
    ]

    operations = [
        migrations.RemoveField(model_name="recipe", name="team"),
        migrations.AddField(
            model_name="recipe",
            name="content_type",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="contenttypes.ContentType",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="recipe",
            name="object_id",
            field=models.PositiveIntegerField(null=True),
            preserve_default=False,
        ),
        migrations.RunPython(copy_user_to_generic_forwards),
        migrations.AlterField(
            model_name="recipe",
            name="content_type",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="contenttypes.ContentType",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="recipe",
            name="object_id",
            field=models.PositiveIntegerField(),
            preserve_default=False,
        ),
        migrations.RemoveField(model_name="recipe", name="user"),
    ]
