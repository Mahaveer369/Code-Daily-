from rest_framework import generics
from .models import Subject, Topic, Lesson
from .serializers import SubjectSerializer, TopicSerializer, LessonSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class SubjectList(generics.ListAPIView):
    """
    Returns a list of all available subjects.
    
    Performance Note:
    - Cached for 1 hour to reduce DB load.
    - This is the landing page data, so high traffic is expected.
    """
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    @method_decorator(cache_page(60 * 60)) # Cache for 1 hour
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class SubjectDetail(generics.RetrieveAPIView):
    """
    Returns details of a specific subject, including its topics.
    Also cached because the structure of a course rarely changes.
    """
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    lookup_field = 'slug'

    @method_decorator(cache_page(60 * 60))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class LessonDetail(generics.RetrieveAPIView):
    """
    Returns the actual content of a lesson.
    This includes HTML content and code examples.
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    @method_decorator(cache_page(60 * 60))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
