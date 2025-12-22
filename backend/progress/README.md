# Progress App

## Purpose
This app tracks the student's learning journey. Unlike generic e-learning sites, we need to know exactly which user is doing what.

## Key Components

### Enrollment
- Before viewing deep content or taking quizzes, a user must **Enroll** in a course.
- This creates an `Enrollment` record.

### Lesson Progress
- Tracks the state of each lesson: `Not Started`, `In Progress`, `Completed`.
- **Last Accessed**: Useful for "Continue where you left off" features on the dashboard.

## Real-World Context
Data from this app drives the "Dashboard" and "Certificate Generation" features. It is write-heavy (students constantly update progress), so we do **not** cache these views heavily.
