const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      res.status(400)
      throw new Error('Por Favor Agregue todos los Campos')
    }
    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400)
      throw new Error('El Usuario ya existe en la base de datos')
    }
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error('Los datos del usuario son Invalidos')
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
})


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  // Check for user email
  const user = await User.findOne({ username })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('No Existe el Usuario')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '365d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}