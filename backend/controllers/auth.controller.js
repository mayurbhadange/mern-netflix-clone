import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, messageg: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, messageg: "Invalid Email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, messageg: "Password must be atleast 6 characters" });
        }

        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, messageg: "User already exists with this email" });
        }

        const existingUserByUsername = await User.findOne({ username: username });

        if (existingUserByUsername) {
            return res.status(400).json({ success: false, messageg: "User already exists with this username" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PIC = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const image = PROFILE_PIC[Math.floor(Math.random() * PROFILE_PIC.length)];

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image
        });


        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        //remove password from the response
        res.status(201).json({
            success: true, user: {
                ...newUser._doc,
                password: ""
            },
        });

    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ success: false, messageg: "Internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, messageg: "All fields are required" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, messageg: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(404).json({ success: false, messageg: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);
        //remove password from the response
        res.status(200).json({
            success: true, user: {
                ...user._doc,
                password: ""
            },
        });

    } catch (error) {
        console.log("Error in login", error.message);
        res.status(500).json({ success: false, messageg: "Internal Server Error" });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, msg: "Logged out successfully" });
    } catch (error) {   
        console.log("Error in logout", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}

export async function authCheck(req, res) {
    try {
        console.log("req.user:", req.user);
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.log("Error in authCheck", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}