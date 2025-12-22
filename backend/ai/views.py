from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .services import PerplexityService

class ExplainLessonView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        content = request.data.get('content')
        difficulty = request.data.get('difficulty', 'beginner')
        
        if not content:
            return Response({'error': 'Content is required'}, status=400)
            
        explanation = PerplexityService.get_explanation(content, difficulty)
        return Response({'explanation': explanation})
