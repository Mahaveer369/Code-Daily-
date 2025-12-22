from django.db import models

class Subject(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.title

class Topic(models.Model):
    subject = models.ForeignKey(Subject, related_name='topics', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    order_index = models.IntegerField(default=0)

    class Meta:
        ordering = ['order_index']

    def __str__(self):
        return f"{self.subject.title} - {self.title}"

class Lesson(models.Model):
    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )

    topic = models.ForeignKey(Topic, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content_html = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    estimated_time = models.IntegerField(help_text="Estimated time in minutes")

    def __str__(self):
        return self.title

class CodeExample(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='examples', on_delete=models.CASCADE)
    language = models.CharField(max_length=50) # e.g. python, js
    code_text = models.TextField()

    def __str__(self):
        return f"Code for {self.lesson.title}"
