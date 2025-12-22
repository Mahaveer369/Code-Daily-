from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Quiz, QuizAttempt, Question, Answer
from .serializers import QuizSerializer
from django.shortcuts import get_object_or_404

class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    lookup_field = 'lesson_id' # Access quiz by lesson_id

class QuizSubmitView(APIView):
    """
    Handles quiz submission and grading.
    
    Security:
    - We do not trust the client to calculate the score.
    - We check their answers against the database strictly on the backend.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, quiz_id):
        # ... logic ...
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        answers_data = request.data.get('answers', {}) # {question_id: answer_id}
        
        score = 0
        total_questions = quiz.questions.count()
        
        if total_questions == 0:
            return Response({'error': 'Quiz has no questions'}, status=status.HTTP_400_BAD_REQUEST)

        for q_id, a_id in answers_data.items():
            try:
                # Backend validation of correctness
                answer = Answer.objects.get(pk=a_id, question_id=q_id)
                if answer.is_correct:
                    score += 1
            except Answer.DoesNotExist:
                continue
                
        # Simple percentage score logic or raw count
        final_score = (score / total_questions) * 100
        
        QuizAttempt.objects.create(user=request.user, quiz=quiz, score=final_score)
        
        return Response({'score': final_score, 'correct_count': score, 'total': total_questions})
