const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
const authHeader = req.headers.authorization;
let token;
if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
}
if (!token) return res.status(401).json({ message: 'No token provided' });

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    next();
} catch (err) {
    res.status(401).json({ message: 'Invalid token' });
}
};
