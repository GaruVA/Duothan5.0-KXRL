# Team Authentication System

## Overview
This is a complete team authentication system built with React (TypeScript) frontend and Node.js/Express backend with MongoDB. It implements secure team registration, login/logout functionality, and access control for algorithmic challenges.

## Features

### ✅ Team Registration
- **Unique team registration** with validations
- Teams register with a unique team name and email
- Password strength validation (minimum 6 characters)
- Optional team members can be added during registration
- Prevents duplicate team names and emails

### ✅ Authentication Flow
- **Login/Logout** with secure session handling
- JWT-based authentication with 7-day expiration
- Automatic token refresh and session management
- Secure password hashing with bcrypt

### ✅ Access Control
- **Protected routes** - only authenticated teams can access challenges
- Automatic redirect to login page for unauthenticated users
- Token-based API authorization
- Session persistence across browser refreshes

### ✅ Redirect on Success
- **Automatic redirect** to dashboard after successful login
- Clean user experience with loading states
- Error handling with user-friendly messages

## Technical Stack

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript support
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: CORS enabled, rate limiting, input validation
- **Environment**: dotenv for configuration

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM for navigation
- **Styling**: Tailwind CSS for modern UI
- **State Management**: React Context API for authentication
- **HTTP Client**: Axios for API communication

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new team
- `POST /api/auth/login` - Team login
- `GET /api/auth/me` - Get current authenticated team
- `POST /api/auth/logout` - Logout (client-side token removal)

### Protected Routes
- `GET /api/challenges` - Get all challenges (requires authentication)
- `GET /api/challenges/:id` - Get specific challenge (requires authentication)

## Security Features

### Password Security
- Minimum 6 character requirement
- Bcrypt hashing with salt rounds
- Password confirmation validation

### Session Management
- JWT tokens with 7-day expiration
- Automatic token refresh
- Secure token storage in localStorage
- Token validation on each request

### Input Validation
- Email format validation
- Team name uniqueness checks
- SQL injection prevention
- XSS protection

## Usage

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## User Flow

1. **Landing Page** (`/`) - Welcome page with login/register links
2. **Registration** (`/register`) - Teams create new accounts
3. **Login** (`/login`) - Existing teams sign in
4. **Dashboard** (`/dashboard`) - Protected area showing team info and challenges
5. **Auto-redirect** - Unauthenticated users redirected to login

## Validation Rules

### Team Registration
- Team name: 3-50 characters, must be unique
- Email: Valid email format, must be unique
- Password: Minimum 6 characters
- Password confirmation: Must match password

### Team Members (Optional)
- Name: Required if email provided
- Email: Valid email format if provided

## Error Handling

### Frontend
- Form validation with real-time feedback
- Loading states during API calls
- User-friendly error messages
- Automatic error clearing on input

### Backend
- Comprehensive error responses
- Duplicate detection for teams/emails
- Authentication middleware validation
- Database connection error handling

## Authentication Flow Diagram

```
1. User visits app → Landing Page
2. Click "Register" → Registration Form
3. Fill form → Submit → Backend validates
4. Success → JWT token returned → Stored in localStorage
5. Redirect to Dashboard → Protected route
6. Dashboard loads → Shows team info and challenges
7. Logout → Token removed → Redirect to login
```

## Database Schema

### Team Model
```javascript
{
  teamName: String (unique, required, 3-50 chars),
  email: String (unique, required, valid email),
  password: String (hashed, required, min 6 chars),
  members: [{
    name: String (required),
    email: String (required, valid email)
  }],
  isActive: Boolean (default: true),
  createdAt: Date (default: now)
}
```

## Testing the System

1. Open `http://localhost:5173`
2. Click "Register Team"
3. Fill in team details:
   - Team name: "Test Team"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm password: "password123"
4. Add team members (optional)
5. Submit form
6. Should redirect to dashboard
7. Try logging out and back in
8. Verify protected routes work correctly

## Production Considerations

### Security Enhancements
- Use HTTPS in production
- Implement rate limiting
- Add CSRF protection
- Use secure cookie settings
- Implement refresh token rotation

### Performance Optimizations
- Redis for session storage
- Database indexing
- API response caching
- Image optimization
- Code splitting

### Monitoring
- Authentication event logging
- Error tracking
- Performance monitoring
- Database query optimization

## Deliverables Status

- ✅ **Team Sign-up**: Complete with unique name validation
- ✅ **Login/Logout**: JWT-based authentication implemented
- ✅ **Access Control**: Protected routes for authenticated teams only
- ✅ **Redirect on Success**: Auto-redirect to dashboard after login
- ✅ **Session Handling**: Secure token-based session management
- ✅ **Team Registration**: Full validation and uniqueness checks

This authentication system provides a solid foundation for the algorithmic challenge platform with secure, scalable team-based access control.
