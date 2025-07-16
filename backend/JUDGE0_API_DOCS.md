# Judge0 Integration API Documentation

## Overview

This API integrates the Judge0 CE (Community Edition) code execution engine to provide automated code evaluation for programming challenges. The Judge0 API allows secure execution of code in multiple programming languages with customizable resource limits.

## Judge0 Configuration

- **API Endpoint**: `http://10.3.5.139:2358/`
- **API Token**: `ZHVvdGhhbjUuMA==`
- **Documentation**: https://ce.judge0.com/

## Supported Programming Languages

| Language | ID | Name |
|----------|----| -----|
| C | 50 | C (GCC 9.2.0) |
| C++ | 54 | C++ (GCC 9.2.0) |
| Java | 62 | Java (OpenJDK 13.0.1) |
| Python | 71 | Python (3.8.1) |
| Python 2 | 70 | Python (2.7.17) |
| JavaScript | 63 | JavaScript (Node.js 12.14.0) |
| TypeScript | 74 | TypeScript (3.7.4) |
| C# | 51 | C# (Mono 6.6.0.161) |
| Go | 60 | Go (1.13.5) |
| Rust | 73 | Rust (1.40.0) |
| Ruby | 72 | Ruby (2.7.0) |
| PHP | 68 | PHP (7.4.1) |
| Bash | 46 | Bash (5.0.0) |

## API Endpoints

### Authentication Required
All endpoints require authentication using JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Judge0 Management Endpoints

### 1. Test Judge0 Connection
**POST** `/api/judge0/test`

Tests the connection and authentication with Judge0 API.

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Authentication successful"
}
```

### 2. Get Programming Languages
**GET** `/api/judge0/languages`

Returns all available programming languages.

**Response:**
```json
[
  {
    "id": 50,
    "name": "C (GCC 9.2.0)"
  },
  {
    "id": 54,
    "name": "C++ (GCC 9.2.0)"
  }
]
```

### 3. Get Judge0 Health Status
**GET** `/api/judge0/health`

Returns comprehensive health information about the Judge0 service.

**Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "responseTime": "150ms",
  "connection": {
    "success": true,
    "status": 200,
    "message": "Authentication successful"
  },
  "services": {
    "languages": {
      "status": "ok",
      "count": 25
    },
    "statuses": {
      "status": "ok",
      "count": 14
    }
  },
  "overall": {
    "status": "healthy"
  }
}
```

---

## Challenge Management Endpoints

### 4. Get All Challenges
**GET** `/api/challenges`

Returns paginated list of active challenges with user progress.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)
- `difficulty` (optional): Filter by difficulty (Easy, Medium, Hard, Expert)
- `category` (optional): Filter by category
- `search` (optional): Search in title, description, or tags
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order - asc/desc (default: desc)

**Response:**
```json
{
  "challenges": [
    {
      "_id": "challenge_id",
      "title": "Two Sum",
      "description": "Find two numbers that add up to target",
      "difficulty": "Medium",
      "category": "Arrays",
      "points": 150,
      "userStatus": {
        "bestScore": 85,
        "isSolved": false,
        "attemptCount": 3,
        "lastAttempt": "2024-01-15T10:00:00Z"
      }
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalChallenges": 50
}
```

### 5. Get Challenge Details
**GET** `/api/challenges/:id`

Returns detailed information about a specific challenge.

**Response:**
```json
{
  "challenge": {
    "_id": "challenge_id",
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "problemStatement": "Given an array of integers...",
    "inputFormat": "Line 1: Integer N...",
    "outputFormat": "Two integers representing indices...",
    "constraints": "2 ≤ N ≤ 1000",
    "examples": [
      {
        "input": "4\n2 7 11 15\n9",
        "output": "0 1",
        "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
      }
    ],
    "difficulty": "Medium",
    "category": "Arrays",
    "tags": ["array", "hash-table"],
    "timeLimit": 3,
    "memoryLimit": 256000,
    "allowedLanguages": [
      {
        "languageId": 50,
        "languageName": "C"
      }
    ],
    "points": 150
  },
  "userStatus": {
    "bestScore": 85,
    "isSolved": false,
    "recentSubmissions": [
      {
        "status": {
          "id": 3,
          "description": "Accepted"
        },
        "score": 85,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "attemptCount": 3
  },
  "statistics": {
    "totalSubmissions": 150,
    "correctSubmissions": 45,
    "successRate": 30,
    "avgScore": 72.5
  }
}
```

---

## Submission Endpoints

### 6. Submit Code
**POST** `/api/submissions`

Submits code for evaluation against a challenge.

**Request Body:**
```json
{
  "challengeId": "challenge_id",
  "sourceCode": "#include <stdio.h>\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}",
  "languageId": 50,
  "languageName": "C"
}
```

**Response:**
```json
{
  "message": "Code submitted successfully",
  "submissionId": "submission_id",
  "judge0Token": "judge0_token",
  "status": {
    "id": 1,
    "description": "In Queue"
  }
}
```

### 7. Get Submission Status
**GET** `/api/submissions/:id/status`

Returns the current status and results of a submission.

**Response:**
```json
{
  "id": "submission_id",
  "status": {
    "id": 3,
    "description": "Accepted"
  },
  "stdout": "Hello World",
  "stderr": null,
  "compileOutput": null,
  "message": null,
  "time": "0.001",
  "memory": 380,
  "score": 100,
  "isCorrect": true,
  "testCases": [
    {
      "input": "",
      "expectedOutput": "Hello World",
      "actualOutput": "Hello World",
      "passed": true,
      "executionTime": "0.001",
      "memory": 380
    }
  ],
  "formattedTime": "0.001s",
  "formattedMemory": "0.37 MB",
  "createdAt": "2024-01-15T10:00:00Z",
  "finishedAt": "2024-01-15T10:00:02Z"
}
```

### 8. Get User Submissions
**GET** `/api/submissions`

Returns paginated list of user's submissions.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page
- `challengeId` (optional): Filter by challenge
- `status` (optional): Filter by status

**Response:**
```json
{
  "submissions": [
    {
      "_id": "submission_id",
      "challengeId": {
        "title": "Hello World",
        "difficulty": "Easy"
      },
      "status": {
        "id": 3,
        "description": "Accepted"
      },
      "score": 100,
      "isCorrect": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalSubmissions": 25
}
```

### 9. Get Challenge Submissions
**GET** `/api/submissions/challenge/:challengeId`

Returns user's submissions for a specific challenge.

**Response:**
```json
{
  "submissions": [...],
  "bestSubmission": {
    "score": 100,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "currentPage": 1,
  "totalPages": 2,
  "totalSubmissions": 15
}
```

---

## Status Codes

| Status ID | Description |
|-----------|-------------|
| 1 | In Queue |
| 2 | Processing |
| 3 | Accepted |
| 4 | Wrong Answer |
| 5 | Time Limit Exceeded |
| 6 | Compilation Error |
| 7 | Runtime Error (SIGSEGV) |
| 8 | Runtime Error (SIGXFSZ) |
| 9 | Runtime Error (SIGFPE) |
| 10 | Runtime Error (SIGABRT) |
| 11 | Runtime Error (NZEC) |
| 12 | Runtime Error (Other) |
| 13 | Internal Error |
| 14 | Exec Format Error |

---

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "error": "Missing required fields: challengeId, sourceCode, languageId, languageName"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication failed. Invalid token."
}
```

### 404 Not Found
```json
{
  "error": "Challenge not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to submit code",
  "message": "Detailed error message"
}
```

---

## Setup Instructions

### 1. Environment Variables
Create a `.env` file with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/duothan

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Judge0 API Configuration
JUDGE0_API_URL=http://10.3.5.139:2358
JUDGE0_API_TOKEN=ZHVvdGhhbjUuMA==

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Sample Challenges
```bash
npm run seed:challenges
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Test Judge0 Connection
```bash
curl -X POST http://localhost:5000/api/judge0/test \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## Usage Examples

### Example 1: Submit a Hello World Program

```javascript
// 1. Submit code
const submitResponse = await fetch('/api/submissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    challengeId: 'challenge_id',
    sourceCode: '#include <stdio.h>\nint main() {\n    printf("Hello World");\n    return 0;\n}',
    languageId: 50,
    languageName: 'C'
  })
});

const { submissionId } = await submitResponse.json();

// 2. Check status
const statusResponse = await fetch(`/api/submissions/${submissionId}/status`, {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const result = await statusResponse.json();
console.log('Score:', result.score);
console.log('Passed:', result.isCorrect);
```

### Example 2: Get Challenges by Difficulty

```javascript
const response = await fetch('/api/challenges?difficulty=Easy&limit=5', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const { challenges } = await response.json();
challenges.forEach(challenge => {
  console.log(`${challenge.title} - ${challenge.userStatus.bestScore}%`);
});
```

---

## Notes

1. **Resource Limits**: Each challenge has configurable time and memory limits
2. **Test Cases**: Challenges include both public and hidden test cases
3. **Scoring**: Partial scoring based on passed test cases
4. **Background Processing**: Test case execution happens asynchronously
5. **Security**: All code execution is sandboxed through Judge0
6. **Polling**: Use the status endpoint to check submission progress

For more information about Judge0 API, visit: https://ce.judge0.com/
