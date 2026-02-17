# ExamBuddy Project Report

## 1. Project Title
**ExamBuddy** - A Comprehensive Student Resource Sharing Platform

## 2. Abstract
ExamBuddy is a web-based platform designed to facilitate the sharing and access of educational study materials among students. It serves as a centralized hub for university notes, sessional papers, and verified question papers. The platform incorporates user roles (Student, Admin), premium content subscriptions, and community interaction features like voting and reviews.

## 3. Introduction
### 3.1 Background
Students often struggle to find reliable, high-quality study materials and previous year's question papers. Physical notes are easily lost, and digital sharing via messaging apps is disorganized.
### 3.2 Objective
To build a scalable, secure, and user-friendly web application that allows students to upload, organize, verify, and download study resources.
### 3.3 Scope
- User authentication and profile management.
- Resource management (Notes, Papers).
- Admin dashboard for content verification.
- Subscription model for premium content.

## 4. System Analysis
### 4.1 Existing System
Currently, students rely on WhatsApp groups, Google Drive links, and physical photocopies. These methods lack verification, organization, and searchability.
### 4.2 Proposed System
ExamBuddy offers:
- structured categorization by Branch, Semester, and Subject.
- Admin verification to ensure quality.
- Search and filter capabilities.
- A "Premium" model to incentivize high-quality uploads.

## 5. Technology Stack
### 5.1 Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **Icons**: Lucide React
- **Language**: TypeScript

### 5.2 Backend
- **Framework**: FastAPI (Python)
- **Database ORM**: SQLAlchemy (Async)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: OpenAPI / Swagger UI

### 5.3 Database & Storage
- **Database**: PostgreSQL (via Supabase)
- **File Storage**: Supabase Storage Buckets

## 6. System Design
### 6.1 Architecture
The application follows a client-server architecture. The Next.js frontend consumes RESTful APIs provided by the FastAPI backend.

### 6.2 Database Schema (ERD)
The database consists of the following key entities:
- **Users**: Stores student profiles, roles (STUDENT, ADMIN), and stats (CGPA, SGPA).
- **Notes**: Stores metadata for notes, papers, status (PENDING, APPROVED), and file URLs.
- **Downloads**: Tracks user download history.
- **Votes**: Stores upvote/downvote interactions.
- **Reviews**: Stores ratings and comments on notes.
- **Subscriptions**: Manages premium access plans.
- **Circulars**: Notifications or university updates.

### 6.3 Data Flow
1.  **Upload**: User uploads a file -> Frontend sends FormData -> Backend saves to Storage -> DB entry created (Status: PENDING).
2.  **Verification**: Admin logs in -> Views pending notes -> Approves/Rejects -> Status updated.
3.  **Access**: Student logs in -> Browses/Searches -> Views/Downloads file -> Download recorded in DB.

## 7. Key Modules & Implementation
### 7.1 Authentication Module
- Secure customized login/signup flow using proper hashing.
- **Features**: JWT-based session management.

### 7.2 Dashboard Module
- **Notes Library**: Filter by Semester, Branch, Subject. Sort by Newest/Rating.
- **Papers**: Dedicated sections for Sessional and University papers.
- **Profile**: Tracks uploads, download history, and academic stats (SGPA, CGPA).

### 7.3 Admin Module
- Protected route accessible only to users with `ADMIN` role.
- features: Manage Notes (Approve/Delete), View User statistics.

### 7.4 Subscription Module
- Differentiates between Free and Premium notes.
- Restricts access to Premium files for non-subscribed users.

## 8. Features Implemented
- **Role-Based Access Control (RBAC)**: Distinct features for Students vs Admins.
- **Smart Search & Filter**: Real-time searching and filtering by metadata.
- **Verification Workflow**: Content quality control via Admin approval.
- **Interactive UI**: Dark mode support, responsive design, and toast notifications.
- **Community Features**: Voting (Likes) and Star Ratings for notes.

## 9. Conclusion
ExamBuddy successfully addresses the problem of disorganized study materials by providing a robust, verified, and centralized platform. It leverages modern web technologies to ensure performance, scalability, and a superior user experience.

## 10. Future Scope
- **AI Integration**: AI-generated summaries and quizzes from notes.
- **Social Features**: Comments threads and study groups.
- **Mobile App**: Developing a dedicated mobile application (React Native).
- **Gamification**: Badges and leaderboards for top contributors.
