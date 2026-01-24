from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch, MagicMock


class ExecuteCodeViewTests(APITestCase):
    """Tests for code execution endpoint."""
    
    def test_execute_missing_code(self):
        """Test that missing code returns validation error."""
        response = self.client.post('/api/execute/', {'language': 'python'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_execute_missing_language(self):
        """Test that missing language returns validation error."""
        response = self.client.post('/api/execute/', {'code': 'print("test")'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_execute_invalid_language(self):
        """Test that invalid language returns validation error."""
        response = self.client.post('/api/execute/', {
            'code': 'print("test")',
            'language': 'ruby'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_execute_empty_code(self):
        """Test that empty code returns validation error."""
        response = self.client.post('/api/execute/', {
            'code': '',
            'language': 'python'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('executor.views.httpx.Client')
    def test_execute_python_success(self, mock_client):
        """Test successful Python execution."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'success': True,
            'output': 'Hello, World!\n',
            'error': None,
            'execution_time_ms': 45,
            'language': 'python'
        }
        mock_client.return_value.__enter__.return_value.post.return_value = mock_response
        
        response = self.client.post('/api/execute/', {
            'code': 'print("Hello, World!")',
            'language': 'python'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['output'], 'Hello, World!\n')
    
    @patch('executor.views.httpx.Client')
    def test_execute_javascript_success(self, mock_client):
        """Test successful JavaScript execution."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'success': True,
            'output': 'Hello, World!\n',
            'error': None,
            'execution_time_ms': 30,
            'language': 'javascript'
        }
        mock_client.return_value.__enter__.return_value.post.return_value = mock_response
        
        response = self.client.post('/api/execute/', {
            'code': 'console.log("Hello, World!")',
            'language': 'javascript'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    @patch('executor.views.httpx.Client')
    def test_execute_timeout(self, mock_client):
        """Test execution timeout handling."""
        import httpx
        mock_client.return_value.__enter__.return_value.post.side_effect = httpx.TimeoutException("Timed out")
        
        response = self.client.post('/api/execute/', {
            'code': 'while True: pass',
            'language': 'python'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['success'])
        self.assertIn('timed out', response.data['error'].lower())
    
    @patch('executor.views.httpx.Client')
    def test_execute_service_unavailable(self, mock_client):
        """Test handling when executor service is unavailable."""
        import httpx
        mock_client.return_value.__enter__.return_value.post.side_effect = httpx.ConnectError("Connection refused")
        
        response = self.client.post('/api/execute/', {
            'code': 'print("test")',
            'language': 'python'
        })
        
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)


class ExecutorHealthViewTests(APITestCase):
    """Tests for executor health endpoint."""
    
    @patch('executor.views.httpx.Client')
    def test_health_check_success(self, mock_client):
        """Test health check when executor is available."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'status': 'healthy',
            'executor_ready': True,
            'supported_languages': ['python', 'javascript', 'sql']
        }
        mock_client.return_value.__enter__.return_value.get.return_value = mock_response
        
        response = self.client.get('/api/execute/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
    
    @patch('executor.views.httpx.Client')
    def test_health_check_failure(self, mock_client):
        """Test health check when executor is unavailable."""
        import httpx
        mock_client.return_value.__enter__.return_value.get.side_effect = httpx.ConnectError("Connection refused")
        
        response = self.client.get('/api/execute/health/')
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
