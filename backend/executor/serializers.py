from rest_framework import serializers


class ExecuteCodeSerializer(serializers.Serializer):
    """Serializer for code execution requests."""
    
    LANGUAGE_CHOICES = ['python', 'javascript', 'js', 'sql']
    
    code = serializers.CharField(
        min_length=1,
        max_length=50000,
        help_text="Code to execute"
    )
    language = serializers.ChoiceField(
        choices=LANGUAGE_CHOICES,
        help_text="Programming language"
    )
    stdin = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=10000,
        help_text="Optional stdin input"
    )
    
    def validate_code(self, value):
        """Basic code validation."""
        if not value.strip():
            raise serializers.ValidationError("Code cannot be empty")
        return value


class ExecuteResultSerializer(serializers.Serializer):
    """Serializer for code execution results."""
    
    success = serializers.BooleanField()
    output = serializers.CharField(allow_blank=True)
    error = serializers.CharField(allow_null=True, allow_blank=True)
    execution_time_ms = serializers.IntegerField()
    language = serializers.CharField()
