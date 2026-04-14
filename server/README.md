# RSVP API Server

Backend API for the RSVP Invitation application.

## Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Get All Guests
- **GET** `/api/guests`
- Returns all guests from guests.json

### Get Guests by Code
- **GET** `/api/guests/:code`
- Returns guests matching the invitation code

### Get All Messages
- **GET** `/api/messages`
- Returns all messages from messages.json

### Get Message by Code
- **GET** `/api/messages/:code`
- Returns message for specific invitation code

### Submit RSVP
- **POST** `/api/rsvp/submit`
- Body:
  ```json
  {
    "guests": [
      {
        "id": 1,
        "name": "John Smith",
        "code": "SMITH2024",
        "attending": true
      }
    ],
    "message": {
      "code": "SMITH2024",
      "message": "Looking forward to it!",
      "timestamp": "2026-03-03T10:30:00Z"
    }
  }
  ```
- Updates guests.json and messages.json

## CORS

CORS is enabled for all origins. In production, configure it to only allow your frontend domain.
