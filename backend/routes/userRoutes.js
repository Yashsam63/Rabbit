const express = require('express');
const User = require('../models/User'); // Correct model import
const jwt = require('jsonwebtoken');
const {protect} = require('../middleware/authMiddleware'); // Import auth middleware if needed

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // registration logic
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        //ceat jwt payload
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // sign and return the token along with user data
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '40h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            }
        )
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Server error');
    }
});

//@route   POST /api/users/login
// @desc    Login a user
// @access  Public

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        //Find the user by email 
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await user.comparePassword(password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

        //ceat jwt payload
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // sign and return the token along with user data
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '40h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            }
        )


    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
})

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    res.json(req.user); // req.user is set by the auth middleware
    
});

module.exports = router; // ✅ fixed: was "model.exports"
