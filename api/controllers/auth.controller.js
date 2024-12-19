import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Register function
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Respond with success
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Handle Prisma unique constraint error
    if (error.code === "P2002" && error.meta?.target) {
      if (
        error.meta.target.includes("User_email_key") ||
        error.meta.target.includes("User_username_key")
      ) {
        return res.status(400).json({ error: "User already exists" });
      }
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login function
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username is required and must be valid" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout function
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};
