const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error("Error in GET /api/admin/users:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

// @route POST /api/admin/users
// @desc Create a new user (Admin only)
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {

    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role ? role : 'customer' // Default to "customer"
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error("Error in POST /api/admin/users:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

// @route PUT /api/admin/users/:id
// @desc update user info (admin only) _Name , Role and Email
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        const updatedUser = await user.save();
        res.json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        console.error("Error in PUT /api/admin/users/:id:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

//@route DELETE /api/admin/users/:id
// @desc Delete user (Admin only)
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in DELETE /api/admin/users/:id:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

module.exports = router;
