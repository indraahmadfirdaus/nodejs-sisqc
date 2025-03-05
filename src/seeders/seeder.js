require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { mongodbUri } = require('../config/env');
const ROLES = require('../constant/roles');

const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        photo_url: 'https://example.com/john.jpg',
        role: ROLES.OFFICER
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        photo_url: 'https://example.com/jane.jpg',
        role: ROLES.MANAGER
    },
    {
        name: 'Jaden Smith',
        email: 'jaden@example.com',
        password: 'password123',
        photo_url: 'https://example.com/jaden.jpg',
        role: ROLES.OFFICER
    }
];


const seedDatabase = async () => {
    try {
        await mongoose.connect(mongodbUri);

        await User.deleteMany();

        console.log('Previous data cleared');

        const createdUsers = await User.create(users);
        console.log('Users seeded');
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();