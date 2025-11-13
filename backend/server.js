const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for demo purposes (replace with database in production)
let designs = [];
let contactMessages = [];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ModularSpace API is running' });
});

// Get all designs
app.get('/api/designs', (req, res) => {
  res.json({ success: true, designs });
});

// Get single design
app.get('/api/designs/:id', (req, res) => {
  const design = designs.find(d => d.id === req.params.id);
  if (design) {
    res.json({ success: true, design });
  } else {
    res.status(404).json({ success: false, message: 'Design not found' });
  }
});

// Save a new design
app.post('/api/designs', (req, res) => {
  const { name, data, userId } = req.body;
  
  if (!name || !data) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and design data are required' 
    });
  }

  const newDesign = {
    id: Date.now().toString(),
    name,
    data,
    userId: userId || 'anonymous',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  designs.push(newDesign);
  res.status(201).json({ success: true, design: newDesign });
});

// Update a design
app.put('/api/designs/:id', (req, res) => {
  const { name, data } = req.body;
  const designIndex = designs.findIndex(d => d.id === req.params.id);

  if (designIndex === -1) {
    return res.status(404).json({ success: false, message: 'Design not found' });
  }

  designs[designIndex] = {
    ...designs[designIndex],
    name: name || designs[designIndex].name,
    data: data || designs[designIndex].data,
    updatedAt: new Date().toISOString()
  };

  res.json({ success: true, design: designs[designIndex] });
});

// Delete a design
app.delete('/api/designs/:id', (req, res) => {
  const designIndex = designs.findIndex(d => d.id === req.params.id);

  if (designIndex === -1) {
    return res.status(404).json({ success: false, message: 'Design not found' });
  }

  designs.splice(designIndex, 1);
  res.json({ success: true, message: 'Design deleted successfully' });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  const contactMessage = {
    id: Date.now().toString(),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  contactMessages.push(contactMessage);

  // Here you would typically send an email or notification
  console.log('New contact message:', contactMessage);

  res.status(201).json({ 
    success: true, 
    message: 'Thank you for your message. We will get back to you soon!' 
  });
});

// Get all contact messages (admin only in production)
app.get('/api/contact', (req, res) => {
  res.json({ success: true, messages: contactMessages });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ModularSpace API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
