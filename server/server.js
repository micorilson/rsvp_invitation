const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Paths to JSON files
const GUESTS_FILE = path.join(__dirname, '../app/src/assets/guests.json');
const MESSAGES_FILE = path.join(__dirname, '../app/src/assets/messages.json');

// Helper function to read JSON file
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Helper function to write JSON file
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// GET endpoint to fetch all guests
app.get('/api/guests', (req, res) => {
  const guests = readJSONFile(GUESTS_FILE);
  if (guests) {
    res.json(guests);
  } else {
    res.status(500).json({ error: 'Failed to read guests data' });
  }
});

// GET endpoint to fetch all messages
app.get('/api/messages', (req, res) => {
  const messages = readJSONFile(MESSAGES_FILE);
  if (messages) {
    res.json(messages);
  } else {
    res.status(500).json({ error: 'Failed to read messages data' });
  }
});

// POST endpoint to submit RSVP
app.post('/api/rsvp/submit', (req, res) => {
  const { guests, message } = req.body;

  if (!guests || !message || !message.code) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  // Read current data
  const currentGuests = readJSONFile(GUESTS_FILE);
  const currentMessages = readJSONFile(MESSAGES_FILE);

  if (!currentGuests || !currentMessages) {
    return res.status(500).json({ error: 'Failed to read data files' });
  }

  // Update guests with new attendance data
  const updatedGuests = currentGuests.map(guest => {
    const updatedGuest = guests.find(g => g.id === guest.id);
    return updatedGuest ? updatedGuest : guest;
  });

  // Check if message with this code already exists
  const existingMessageIndex = currentMessages.findIndex(m => m.code === message.code);
  
  if (existingMessageIndex >= 0) {
    // Update existing message
    currentMessages[existingMessageIndex] = message;
  } else {
    // Add new message
    currentMessages.push(message);
  }

  // Write updated data to files
  const guestsSaved = writeJSONFile(GUESTS_FILE, updatedGuests);
  const messagesSaved = writeJSONFile(MESSAGES_FILE, currentMessages);

  if (guestsSaved && messagesSaved) {
    res.json({ 
      success: true, 
      message: 'RSVP submitted successfully' 
    });
  } else {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// GET endpoint to fetch guests by code
app.get('/api/guests/:code', (req, res) => {
  const { code } = req.params;
  const guests = readJSONFile(GUESTS_FILE);
  
  if (!guests) {
    return res.status(500).json({ error: 'Failed to read guests data' });
  }

  const filteredGuests = guests.filter(guest => 
    guest.code.toLowerCase() === code.toLowerCase()
  );

  res.json(filteredGuests);
});

// GET endpoint to fetch message by code
app.get('/api/messages/:code', (req, res) => {
  const { code } = req.params;
  const messages = readJSONFile(MESSAGES_FILE);
  
  if (!messages) {
    return res.status(500).json({ error: 'Failed to read messages data' });
  }

  const message = messages.find(m => 
    m.code.toLowerCase() === code.toLowerCase()
  );

  if (message) {
    res.json(message);
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RSVP API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`RSVP API server is running on http://localhost:${PORT}`);
  console.log(`Guests file: ${GUESTS_FILE}`);
  console.log(`Messages file: ${MESSAGES_FILE}`);
});
