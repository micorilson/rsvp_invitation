# RSVP Invitation App - Complete Setup Guide

This project consists of an Angular frontend and a Node.js/Express backend API.

## Project Structure
```
rsvp_invitation/
├── app/                    # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   └── assets/
│   │       ├── guests.json     # Guest data
│   │       └── messages.json   # RSVP messages
│   └── package.json
├── server/                 # Node.js backend API
│   ├── server.js
│   ├── package.json
│   └── README.md
```

## Setup Instructions

### 1. Backend API Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   The API will run on `http://localhost:3000`

### 2. Frontend Setup

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```
   
   The app will run on `http://localhost:4200`

## Running Both Servers

You need to run both servers simultaneously:

**Terminal 1 - Backend API:**
```bash
cd server
npm start
```

**Terminal 2 - Angular Frontend:**
```bash
cd app
ng serve
```

## Features

- **Home Page** (`/`): Shows invitation details with QR code
- **RSVP Page** (`/rsvp`): 
  - Search by unique invitation code
  - Display all family/group members for that code
  - Select attending/not attending for each person
  - Add optional message for the celebrant
  - Submit RSVP to save to JSON files

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/guests` - Get all guests
- `GET /api/guests/:code` - Get guests by invitation code
- `GET /api/messages` - Get all messages
- `GET /api/messages/:code` - Get message by invitation code
- `POST /api/rsvp/submit` - Submit RSVP (updates guests.json and messages.json)

## Invitation Codes (for testing)

- `SMITH2024` - John Smith, Jane Smith (2 guests)
- `JOHNSON2024` - Michael Johnson, Emily Johnson (2 guests)
- `BROWN2024` - Sarah Brown, James Brown (2 guests)
- `THOMAS2024` - William Thomas, Linda Thomas (2 guests)
- `WILSON2024` - David Wilson (1 guest)
- Plus 10 more individual codes

## Data Persistence

All RSVP data is saved to:
- `app/src/assets/guests.json` - Guest attendance status
- `app/src/assets/messages.json` - Messages from guests

The backend API writes directly to these files, so changes persist across server restarts.

## Development Notes

- The Angular app uses signals for reactive state management
- The backend uses Express with CORS enabled for cross-origin requests
- JSON files are used for simplicity; consider using a database for production
