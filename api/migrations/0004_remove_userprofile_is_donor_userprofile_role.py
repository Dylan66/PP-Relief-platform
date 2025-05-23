# Generated by Django 5.2 on 2025-04-23 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_inventoryitem_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='is_donor',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='role',
            field=models.CharField(choices=[('individual', 'Individual Recipient'), ('organization_admin', 'Organization Admin'), ('donor', 'Donor'), ('center_admin', 'Distribution Center Admin')], default='individual', help_text="Determines the user's primary function/dashboard in the system.", max_length=50),
        ),
    ]
