import requests
from django.conf import settings

class PerplexityService:
    """
    Wrapper for Perplexity API.
    
    Why separate this?
    - Keeps API keys and URL configs in one place.
    - Allows us to mock this service easily during tests.
    """
    BASE_URL = "https://api.perplexity.ai/chat/completions"
    
    @staticmethod
    def get_explanation(lesson_content, user_difficulty='beginner'):
        """
        Sends lesson content to Perplexity and asks for a simplification.
        """
        headers = {
            "Authorization": f"Bearer {settings.PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"Explain the following lesson content for a {user_difficulty} level student in simple terms:\n\n{lesson_content}"
        
        payload = {
            "model": "llama-3-sonar-large-32k-online",
            "messages": [
                {"role": "system", "content": "You are a helpful coding tutor."},
                {"role": "user", "content": prompt}
            ]
        }
        
        try:
            response = requests.post(PerplexityService.BASE_URL, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"Error generation explanation: {str(e)}"

    @staticmethod
    def get_recommendation(user_history):
        # Implementation for recommendation logic
        pass
