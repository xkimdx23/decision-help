const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register(req, res) {
  try {
    const { username, email, password, preferred_language } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user
    const user = new User({
      username,
      email,
      password_hash: password,
      preferred_language: preferred_language || 'en',
      email_verification_token: verificationToken
    });
    
    await user.save();
    
    // Send verification email (non-blocking — don't fail registration if email fails)
    sendVerificationEmail(email, verificationToken).catch(err => {
      console.warn('Verification email not sent (SMTP may not be configured):', err.message);
    });
    
    // Generate JWT
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferred_language: user.preferred_language,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.last_login = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferred_language: user.preferred_language,
        is_verified: user.is_verified,
        total_decisions: user.total_decisions
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ email_verification_token: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    user.is_verified = true;
    user.email_verification_token = null;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.password_reset_token = resetToken;
    user.password_reset_expires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    sendPasswordResetEmail(email, resetToken).catch(err => {
      console.warn('Password reset email not sent (SMTP may not be configured):', err.message);
    });
    
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    const user = await User.findOne({
      password_reset_token: token,
      password_reset_expires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    user.password_hash = newPassword;
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password_hash -email_verification_token -password_reset_token');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

async function updateProfile(req, res) {
  try {
    const { username, preferred_language } = req.body;
    
    const updates = {};
    if (username) updates.username = username;
    if (preferred_language) updates.preferred_language = preferred_language;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password_hash');
    
    res.json({ user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

async function deleteAccount(req, res) {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount
};
