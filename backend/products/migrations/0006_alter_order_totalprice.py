# Generated by Django 3.2.8 on 2021-11-12 20:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_review_createdat'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='totalPrice',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]