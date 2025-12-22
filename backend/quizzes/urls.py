from django.urls import path
from .views import QuizDetailView, QuizSubmitView

urlpatterns = [
    path('<int:lesson_id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('submit/<int:quiz_id>/', QuizSubmitView.as_view(), name='quiz-submit'),
]
