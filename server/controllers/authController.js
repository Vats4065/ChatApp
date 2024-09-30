const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });


        user.lastSeen = new Date();
        user.isOnline = true;
        await user.save();

        const token = jwt.sign({ userId: user._id }, "secret-key", { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.getUserInfo = async (req, res) => {
    const { userId } = req.params


    try {
        const user = await User.findById(userId).select("-password")

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user information' });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find()
        return res.json({ users }).status(200)
    } catch (error) {
        return res.status(500).json({ error })
    }
}


exports.logout = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.lastSeen = new Date();
        user.isOnline = false;

        // Save the updated user information
        await user.save();

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {

        res.status(500).json({ error: 'Failed to update user status' });
    }
};

