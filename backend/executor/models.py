from django.db import models
from django.conf import settings


class ExecutionLog(models.Model):
    """Logs code execution requests for analytics and debugging."""
    
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('sql', 'SQL'),
    ]
    
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('error', 'Error'),
        ('timeout', 'Timeout'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='execution_logs'
    )
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    code_hash = models.CharField(max_length=64, help_text="SHA256 hash of the code")
    code_length = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    execution_time_ms = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['language', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.language} execution ({self.status}) - {self.created_at}"
