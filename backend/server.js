const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Admin Auto-Promote for salonni817@gmail.com
const User = require('./models/User');
const ensureAdmin = async () => {
  try {
    await User.findOneAndUpdate(
      { email: 'salonni817@gmail.com' },
      { role: 'admin' }
    );
    console.log('Admin permissions verified for salonni817@gmail.com');
  } catch (err) {
    console.error('Error in admin auto-promote');
  }
};
ensureAdmin();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Body parser
app.use(express.json());
app.use(cors({
  origin: ['https://skill-swap-three-roan.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

app.get('/', (req, res) => {
  res.send('Skill Exchange API is running...');
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('New WS Connection...');

  socket.on('joinRoom', ({ senderId, receiverId }) => {
    const room = [senderId, receiverId].sort().join('_');
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('chatMessage', async (data) => {
    const { senderId, receiverId, text } = data;
    const room = [senderId, receiverId].sort().join('_');

    // Save message to database
    const newMessage = await Message.create({
      chatRoom: room,
      sender: senderId,
      receiver: receiverId,
      text: text,
    });

    io.to(room).emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
