from django.test import TestCase
from .services import PerplexityService

class PerplexityServiceTests(TestCase):
    def test_get_recommendation(self):
        """
        Test that get_recommendation accepts user_history and returns None
        as it is currently an empty implementation.
        """
        user_history = {"completed_lessons": [1, 2, 3], "current_level": "beginner"}

        result = PerplexityService.get_recommendation(user_history)

        self.assertIsNone(result, "get_recommendation should return None for now")
