import { compare } from "bcrypt";
import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

const tokenAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  try {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
      expiresIn: tokenAge / 1000, // Convert to seconds for JWT
    });
  } catch (error) {
    console.error("Token creation error:", error);
    throw new Error("Failed to create authentication token");
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and a password" });
    }

    const user = await User.create({
      email,
      password,
    });

    const token = createToken(email, user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: tokenAge,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        password: user.password,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(400).json({
      message: error.message || "Error during signup process",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and a password" });
    }

    // Find user by email only
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(email, user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: tokenAge,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        id: user._id,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error during login" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ message: "User with the given id not found" });
    }

    return res.status(200).json({
      message: "User data retrieved successfully",
      id: userData._id,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).send("FirstName LastName and Color are required.");
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("An error occurred during signup.");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("An error occurred during signup.");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return res.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("An error occurred during signup.");
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Logged Out successfully.");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("An error occurred during signup.");
  }
};
