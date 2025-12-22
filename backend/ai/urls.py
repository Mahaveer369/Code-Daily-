from django.urls import path
from .views import ExplainLessonView

urlpatterns = [
    path('explain/', ExplainLessonView.as_view(), name='ai-explain'),
]
