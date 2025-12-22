from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Enrollment, LessonProgress
from .serializers import EnrollmentSerializer, LessonProgressSerializer
from courses.models import Subject, Lesson
from django.shortcuts import get_object_or_404

class EnrollmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, subject_id):
        subject = get_object_or_404(Subject, pk=subject_id)
        enrollment, created = Enrollment.objects.get_or_create(user=request.user, subject=subject)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class UpdateProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        progress, created = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        
        # Update status if provided
        new_status = request.data.get('status')
        if new_status in dict(LessonProgress.STATUS_CHOICES):
            progress.status = new_status
            progress.save()
            
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)

class UserProgressView(generics.ListAPIView):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonProgress.objects.filter(user=self.request.user)
