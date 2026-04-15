const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Match = require('./models/Match');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    // Find main user to use as student/instructor
    const mainUser = await User.findOne({ email: 'salonni817@gmaill.com' });
    if (!mainUser) {
        console.log('Main user not found. Please register salonni817@gmaill.com first.');
        process.exit();
    }

    // Add Mock Users (specific requested names)
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    const specialUsers = [
        {
            name: 'Jaydeep Thakur',
            email: 'jaydeep@test.com',
            password,
            skillsOffered: [{ name: 'System Design', level: 'Expert' }],
            skillsWanted: [{ name: 'Cooking', level: 'Beginner' }],
            bio: 'Expert architect helping students master high-scale systems.'
        },
        {
            name: 'Niraj Sharma',
            email: 'niraj@test.com',
            password,
            skillsOffered: [{ name: 'Figma Mastery', level: 'Expert' }],
            skillsWanted: [{ name: 'English Speaking', level: 'Intermediate' }],
            bio: 'Lead designer focused on modern interface trends.'
        }
    ];

    const createdUsers = await User.insertMany(specialUsers);
    console.log('Jaydeep and Niraj added.');

    // Automatically create accepted matches so they appear in Scheduler dropdown
    const mockMatches = createdUsers.map(u => ({
        sender: u._id,
        receiver: mainUser._id,
        status: 'accepted'
    }));

    await Match.insertMany(mockMatches);
    console.log('Matches established for Scheduler.');

    // Add 3 New Specific Courses
    const newCourses = [
        {
            title: 'Full Stack Next.js 14',
            description: 'Master the power of App Router, Server Actions, and Prisma in this end-to-end masterclass.',
            instructor: mainUser._id,
            category: 'Tech',
            price: 69,
            isApproved: true,
            enrollmentCount: 450
        },
        {
            title: 'Advanced UI/UX with Figma',
            description: 'Design systems, auto-layout 5.0, and interactive prototyping like a silicon valley pro.',
            instructor: createdUsers[1]._id, // Niraj
            category: 'Design',
            price: 39,
            isApproved: true,
            enrollmentCount: 320
        },
        {
            title: 'Data Science with Python',
            description: 'Manipulate large datasets with Numpy/Pandas and build your first Machine Learning models.',
            instructor: createdUsers[0]._id, // Jaydeep
            category: 'Tech',
            price: 55,
            isApproved: true,
            enrollmentCount: 280
        }
    ];

    await Course.insertMany(newCourses);
    console.log('3 New Courses added to Marketplace.');

    console.log('Data successfully seeded! 🚀');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
