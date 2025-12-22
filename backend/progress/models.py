from django.db import models
from django.conf import settings
from courses.models import Subject, Lesson

class Enrollment(models.Model):
    """
    Represents a student signing up for a specific Subject.
    This is required before they can track progress.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='enrollments', on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, related_name='enrollments', on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'subject')

    def __str__(self):
        return f"{self.user.email} - {self.subject.title}"

class LessonProgress(models.Model):
    """
    Tracks the status of a specific lesson for a specific user.
    Used to calculate percentage completion of a course.
    """
    STATUS_CHOICES = (
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='lesson_progress', on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, related_name='user_progress', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    last_accessed = models.DateTimeField(auto_now=True)


    class Meta:
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.email} - {self.lesson.title} - {self.status}"
