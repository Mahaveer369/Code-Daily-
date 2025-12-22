from django.urls import path
from .views import SubjectList, SubjectDetail, LessonDetail

urlpatterns = [
    path('subjects/', SubjectList.as_view(), name='subject-list'),
    path('subjects/<slug:slug>/', SubjectDetail.as_view(), name='subject-detail'),
    path('lessons/<int:pk>/', LessonDetail.as_view(), name='lesson-detail'),
]
