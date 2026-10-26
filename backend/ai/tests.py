from unittest.mock import patch
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class ExplainLessonViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpassword')
        self.url = reverse('ai-explain')

    def test_explain_lesson_unauthenticated(self):
        """Test that unauthenticated users cannot access the endpoint."""
        response = self.client.post(self.url, {'content': 'What is a variable?'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_explain_lesson_missing_content(self):
        """Test that missing content returns a 400 bad request."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Content is required'})

    @patch('ai.views.PerplexityService.get_explanation')
    def test_explain_lesson_success_default_difficulty(self, mock_get_explanation):
        """Test successful explanation with default difficulty."""
        self.client.force_authenticate(user=self.user)
        mock_get_explanation.return_value = 'A variable is a container.'

        content = 'What is a variable?'
        response = self.client.post(self.url, {'content': content})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'explanation': 'A variable is a container.'})
        mock_get_explanation.assert_called_once_with(content, 'beginner')

    @patch('ai.views.PerplexityService.get_explanation')
    def test_explain_lesson_success_custom_difficulty(self, mock_get_explanation):
        """Test successful explanation with custom difficulty."""
        self.client.force_authenticate(user=self.user)
        mock_get_explanation.return_value = 'A variable is a memory location.'

        content = 'What is a variable?'
        difficulty = 'advanced'
        response = self.client.post(self.url, {'content': content, 'difficulty': difficulty})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'explanation': 'A variable is a memory location.'})
        mock_get_explanation.assert_called_once_with(content, difficulty)
