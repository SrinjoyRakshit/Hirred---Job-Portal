import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;
    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    const file = req.file
    const fileUri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile:{
        profilePhoto: cloudResponse.secure_url
      }
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        success: false,
        message: "Account dosen't exist with this current role",
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: "1d"});

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // File will come from cloudinary

    const fileuri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileuri.content)

    let skillsArray
    if(skills){
       skillsArray = skills.split(","); 
    }
    const userId = req.id; // Will come from middleware
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Updating data
    if(fullname){
        user.fullname = fullname;
    }
    if(phoneNumber){
        user.phoneNumber = phoneNumber
    }
    if(email){
        user.email = email
    }
    if(bio){
        user.profile.bio = bio
    }
    if(skills){
        user.profile.skills = skillsArray
    }

    // Resume will come from cloudinary
    if(cloudResponse){
      user.profile.resume = cloudResponse.secure_url // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname // save the original filename
    }

    await user.save();
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
