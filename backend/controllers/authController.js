const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//Register User
exports.registerUser = async (req, res) => {
  const { fullName, username, email, password, profileImageUrl } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const usernameRegex = /^[a-zA-Z0-9-]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        'Invalid username. Only alphanumeric characters and hyphens are allowed. No spaces are permitted',
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      profileImageUrl,
    });

    res
      .status(201)
      .json({ id: user._id, user, token: generateToken(user._id) });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error register user', error: error.message });
  }
};

//Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(201).json({
      id: user._id,
      user,
      user: {
        ...user.toObject(),
        totalPollsCreated: 0,
        totalPollsVoted: 0,
        totalPollsBookmarked: 0,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error login user', error: error.message });
  }
};

//Get User Information
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Add the new attributes to the response
    const userInfo = {
      ...user.toObject(),
      totalPollsCreated: 0,
      totalPollsVoted: 0,
      totalPollsBookmarked: 0,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error get user information', error: error.message });
  }
};
