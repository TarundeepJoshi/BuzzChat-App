import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge / 1000,
  });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response
      .status(500)
      .json({ message: "An error occurred during signup." });
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.findOne({ email });
    if (!User) {
      return response.status(404).send("Please Sign up first");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).send("Password is incorrect");
    }
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("An error occurred during signup.");
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    console.log(request.userId);
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).send("User with the given id not found.");
    }
    return response.status(200).json({
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
    return response.status(500).send("An error occurred during signup.");
  }
};

export const updateProfile = async (request, response) => {
  try {
    const { firstName, lastName, color } = request.body;
    const userId = request.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true }
    ).select("-password");

    response.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating profile" });
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return response.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("An error occurred during signup.");
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).send("User not found");
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return response.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("An error occurred during signup.");
  }
};
export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Logged Out successfully.");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("An error occurred during signup.");
  }
};

export const checkAuth = async (request, response) => {
  try {
    const token = request.cookies.jwt;
    if (!token) {
      return response.status(401).json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.userId).select("-password").lean();

    if (!user) {
      return response.status(401).json({ isAuthenticated: false });
    }

    return response.status(200).json({
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    return response.status(401).json({ isAuthenticated: false });
  }
};
