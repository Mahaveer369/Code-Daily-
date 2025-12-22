from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'role', 'date_joined')
        read_only_fields = ('id', 'email', 'date_joined', 'role') # Role shouldn't be changeable by user normally
