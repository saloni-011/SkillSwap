const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    const email = 'salonni817@gmail.com';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const user = await User.findOneAndUpdate(
      { email },
      { 
        name: 'Admin Saloni',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );

    console.log('Successfully fixed/created Admin account!');
    console.log('Email:', email);
    console.log('Password set to: 123456');
    console.log('Role set to: admin');
    
    process.exit();
  } catch (err) {
    console.error('Error fixing admin:', err);
    process.exit(1);
  }
};

fixAdmin();
