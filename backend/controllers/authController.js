const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// Register User
exports.registerUser = async (req, res) => {
    // console.log("Incoming req.body:", req.body);
    const { fullName, email, password } = req.body;


    // Validation: Check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch(err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }

}

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    

    if(!email || !password) {
        return res.status(400).json({message: "Invalid credentials"});
    }

    try {
        const user = await User.findOne({ email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });

    } catch(err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }


}
// Get User Info
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
}