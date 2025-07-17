const User = require('../models/userModel');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res) => {
try {
    const user = await User.create(req.body);
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username } });
} catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
}
};

exports.login = async (req, res) => {
const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
}
const token = signToken(user._id);
res.json({ token, user: { id: user._id, username: user.username } });
};