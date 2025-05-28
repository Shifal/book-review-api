import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ username, email, password });
    await user.save();

    // Return only selected fields, not the password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email
    };

    res.status(201).json({ user: userResponse, message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
