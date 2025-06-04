const express = require('express');
const cors = require('cors');
const Pusher = require('pusher');
const multer = require('multer');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Setup middleware
app.use(cors());
app.use(express.json());

// Pusher config (আপনার Pusher এর তথ্য দিন এখানে)
const pusher = new Pusher({
  appId: "2003207",
  key: "6136ef6aad376412a5ba",
  secret: "8437379a510390d80301",
  cluster: "ap2",
  useTLS: true
});

// Multer for handling image upload from form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Simple in-memory chat message store
let messages = [];

// Chat message get API
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Chat message post API (with optional image upload)
app.post('/messages', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      // Upload image to imgbb
      const apiKey = 'b6bb4c72c7ca016e8be9ee40ea079922'; // imgbb থেকে API কী দিন এখানে

      const formData = new FormData();
      formData.append('image', req.file.buffer.toString('base64'));

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
        headers: formData.getHeaders()
      });

      imageUrl = response.data.data.url;
    }

    const { name, message } = req.body;

    const newMessage = {
      id: Date.now(),
      name,
      message,
      image: imageUrl,
      createdAt: new Date()
    };

    messages.push(newMessage);

    // Trigger Pusher event
    pusher.trigger('chat', 'message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
