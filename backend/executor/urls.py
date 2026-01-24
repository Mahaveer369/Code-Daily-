from django.urls import path
from .views import ExecuteCodeView, ExecutorHealthView

urlpatterns = [
    path('', ExecuteCodeView.as_view(), name='execute-code'),
    path('health/', ExecutorHealthView.as_view(), name='executor-health'),
]
