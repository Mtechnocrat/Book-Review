// Auth controller logic

// server/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { handleValidation } from "../validators/handleValidation.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN
  });

export const signup = async (req, res) => {
  if (handleValidation(req, res)) return;
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name, email } });
};

export const login = async (req, res) => {
  if (handleValidation(req, res)) return;
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email } });
};

export const me = (req, res) => {
  res.json(req.user);
};
