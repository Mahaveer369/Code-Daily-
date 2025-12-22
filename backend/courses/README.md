# Courses App

## Purpose
This app handles the educational content structure. It is designed to be **read-heavy**, meaning students will fetch this data frequently, but it changes rarely.

## Structure
1. **Subject**: Broad category (e.g., "Python", "React").
2. **Topic**: A chapter within a subject (e.g., "Variables", "Hooks").
3. **Lesson**: The actual content page.
4. **CodeExample**: Snippets attached to lessons.

## Performance Strategy
Since 100+ students might access the same lesson simultaneously, we use **Redis Caching** in the views.
- **Cache Hit**: Returns data instantly from memory (RAM).
- **Cache Miss**: Queries the database, then saves to cache for next time.
- **TTL (Time To Live)**: Set to 1 hour, so updates typically take an hour to propagate unless cache is cleared.
