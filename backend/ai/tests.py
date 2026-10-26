from django.test import TestCase, override_settings
from unittest.mock import patch, Mock
import requests
from .services import PerplexityService

class PerplexityServiceTests(TestCase):
    @patch('ai.services.requests.post')
    @override_settings(PERPLEXITY_API_KEY='test-key')
    def test_get_explanation_success(self, mock_post):
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [
                {'message': {'content': 'This is a simple explanation.'}}
            ]
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        lesson_content = "def hello(): print('hello')"
        result = PerplexityService.get_explanation(lesson_content, 'beginner')

        self.assertEqual(result, 'This is a simple explanation.')

        mock_post.assert_called_once_with(
            PerplexityService.BASE_URL,
            json={
                "model": "llama-3-sonar-large-32k-online",
                "messages": [
                    {"role": "system", "content": "You are a helpful coding tutor."},
                    {"role": "user", "content": f"Explain the following lesson content for a beginner level student in simple terms:\n\n{lesson_content}"}
                ]
            },
            headers={
                "Authorization": "Bearer test-key",
                "Content-Type": "application/json"
            }
        )

    @patch('ai.services.requests.post')
    @override_settings(PERPLEXITY_API_KEY='test-key')
    def test_get_explanation_error(self, mock_post):
        mock_post.side_effect = Exception("API is down")

        lesson_content = "def hello(): print('hello')"
        result = PerplexityService.get_explanation(lesson_content, 'beginner')

        self.assertTrue(result.startswith("Error generation explanation:"))
        self.assertIn("API is down", result)

    @patch('ai.services.requests.post')
    @override_settings(PERPLEXITY_API_KEY='test-key')
    def test_get_explanation_http_error(self, mock_post):
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("403 Client Error")
        mock_post.return_value = mock_response

        lesson_content = "def hello(): print('hello')"
        result = PerplexityService.get_explanation(lesson_content, 'advanced')

        self.assertTrue(result.startswith("Error generation explanation:"))
        self.assertIn("403 Client Error", result)
