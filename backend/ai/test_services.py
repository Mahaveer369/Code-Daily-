import requests
from django.test import SimpleTestCase, override_settings
from unittest.mock import patch, Mock
from .services import PerplexityService

@override_settings(PERPLEXITY_API_KEY="test_key")
class PerplexityServiceTests(SimpleTestCase):

    @patch('ai.services.requests.post')
    def test_get_explanation_success(self, mock_post):
        """Test successful generation of an explanation."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [
                {'message': {'content': 'This is a simple explanation.'}}
            ]
        }
        # raise_for_status does nothing on success
        mock_response.raise_for_status = Mock()
        mock_post.return_value = mock_response

        lesson_content = "def foo(): pass"
        result = PerplexityService.get_explanation(lesson_content)

        self.assertEqual(result, 'This is a simple explanation.')

        # Verify requests.post was called with correct arguments
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertEqual(args[0], PerplexityService.BASE_URL)
        self.assertEqual(kwargs['headers']['Content-Type'], "application/json")
        self.assertEqual(kwargs['json']['model'], "llama-3-sonar-large-32k-online")
        self.assertIn(lesson_content, kwargs['json']['messages'][1]['content'])

    @patch('ai.services.requests.post')
    def test_get_explanation_http_error(self, mock_post):
        """Test HTTP error when calling the API."""
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("401 Client Error: Unauthorized for url")
        mock_post.return_value = mock_response

        result = PerplexityService.get_explanation("def foo(): pass")

        self.assertTrue(result.startswith("Error generation explanation: 401 Client Error"))
        mock_post.assert_called_once()

    @patch('ai.services.requests.post')
    def test_get_explanation_connection_error(self, mock_post):
        """Test ConnectionError when calling the API."""
        mock_post.side_effect = requests.exceptions.ConnectionError("Failed to establish a new connection")

        result = PerplexityService.get_explanation("def foo(): pass")

        self.assertTrue(result.startswith("Error generation explanation: Failed to establish a new connection"))
        mock_post.assert_called_once()
