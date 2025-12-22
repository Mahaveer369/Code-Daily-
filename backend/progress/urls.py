from django.urls import path
from .views import EnrollmentView, UpdateProgressView, UserProgressView

urlpatterns = [
    path('enroll/<int:subject_id>/', EnrollmentView.as_view(), name='enroll'),
    path('update/<int:lesson_id>/', UpdateProgressView.as_view(), name='update-progress'),
    path('my-progress/', UserProgressView.as_view(), name='my-progress'),
]
