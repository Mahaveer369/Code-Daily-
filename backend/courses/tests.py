from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Subject, Topic, Lesson, CodeExample

class LessonDetailTests(APITestCase):
    def setUp(self):
        # Setup base objects needed for Lesson
        self.subject = Subject.objects.create(
            title="Test Subject",
            description="A test subject",
            slug="test-subject"
        )
        self.topic = Topic.objects.create(
            subject=self.subject,
            title="Test Topic",
            order_index=1
        )
        self.lesson = Lesson.objects.create(
            topic=self.topic,
            title="Test Lesson",
            content_html="<p>Test Content</p>",
            difficulty="beginner",
            estimated_time=15
        )
        self.example = CodeExample.objects.create(
            lesson=self.lesson,
            language="python",
            code_text="print('hello')"
        )
        self.valid_url = reverse('lesson-detail', kwargs={'pk': self.lesson.pk})
        self.invalid_url = reverse('lesson-detail', kwargs={'pk': 9999})

    def test_get_lesson_detail_success(self):
        """Test retrieving a valid lesson detail"""
        response = self.client.get(self.valid_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.lesson.title)
        self.assertEqual(response.data['content_html'], self.lesson.content_html)
        self.assertEqual(response.data['difficulty'], self.lesson.difficulty)
        self.assertEqual(response.data['estimated_time'], self.lesson.estimated_time)

        # Verify nested code examples are returned
        self.assertIn('examples', response.data)
        self.assertEqual(len(response.data['examples']), 1)
        self.assertEqual(response.data['examples'][0]['language'], self.example.language)
        self.assertEqual(response.data['examples'][0]['code_text'], self.example.code_text)

    def test_get_lesson_not_found(self):
        """Test retrieving a lesson that does not exist"""
        response = self.client.get(self.invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cache_control_header(self):
        """Test that the view sets Cache-Control headers properly"""
        response = self.client.get(self.valid_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Cache-Control', response.headers)
        self.assertIn('max-age=3600', response.headers['Cache-Control'])

