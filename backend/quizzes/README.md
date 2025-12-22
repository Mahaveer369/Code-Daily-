# Quizzes App

## Purpose
Handles assessments and validation of knowledge. 

## Workflow
1. **Quiz Creation**: Admins create a Quiz linked to a Lesson.
2. **Taking a Quiz**: Student fetches the quiz (excluding answers).
3. **Submission**: 
   - Student submits answers.
   - Backend calculates score immediately.
   - Result is saved as a `QuizAttempt`.

## Security Note
In `serializers.py`, you will notice we specifically **exclude** the `is_correct` field when sending questions to the frontend. This prevents cheat tools from inspecting network traffic to find the answers. Validation happens strictly on the server.
