from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.test import override_settings

from .models import Subject

@override_settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
class SubjectListTests(APITestCase):
    def setUp(self):
        # Create test subjects
        self.subject1 = Subject.objects.create(
            title="Python Basics",
            description="Learn Python from scratch",
            slug="python-basics"
        )
        self.subject2 = Subject.objects.create(
            title="Advanced Python",
            description="Deep dive into Python",
            slug="advanced-python"
        )
        self.url = reverse('subject-list')

    def test_get_subject_list(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the number of returned subjects
        self.assertEqual(len(response.data), 2)

        # Verify that specific data was returned (order doesn't matter unless explicitly sorted)
        titles = [subject['title'] for subject in response.data]
        self.assertIn("Python Basics", titles)
        self.assertIn("Advanced Python", titles)
