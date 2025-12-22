
# Accounts App

## Purpose
This application manages User Authentication and Authorization. It replaces the default Django User model with a custom one to support email-based login, which is standard for modern web applications.

## Key Components

### Models
- **User**: A custom user model extending `AbstractBaseUser`. It uses `email` as the unique identifier instead of a username. It also includes a `role` field to distinguish between Students, Instructors, and Admins.

### Authentication Flow
- **Google OAuth**: We use `django-allauth` and `dj-rest-auth` to handle "Login with Google".
    1. Frontend sends an access token from Google to our backend.
    2. Backend verifies it with Google.
    3. If valid, backend returns our own JWT (access + refresh tokens) for session management.

## Real-World Context
In a real production system, this app is critical for security. Separating the identity logic allows us to easily plug in other providers (like GitHub or Facebook) or add Multi-Factor Authentication (MFA) later without breaking the rest of the system.
