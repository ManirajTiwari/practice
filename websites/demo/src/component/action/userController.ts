import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

// SIGN UP USER
export const signUpUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phoneNumber, password, confirmPassword } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ success: false, error: "Missing required fields" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ success: false, error: "Passwords do not match" });
      return;
    }

    // MongoDB lookup using Mongoose
    const existingUser = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        res.status(400).json({ success: false, error: "Email is already registered" });
        return;
      }
      res.status(400).json({ success: false, error: "Name/Username is already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    res.cookie("user_email", newUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(201).json({ success: true, user: { email: newUser.email, name: newUser.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to register user" });
  }
};

// LOGIN USER
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    res.cookie("user_email", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
};