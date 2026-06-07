const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// ================= VERIFY TOKEN =================
exports.verifyToken = async (req, res) => {
    try {
        const user =
            await UserModel.findById(
                req.userId
            ).select("-password");

        if (!user) {
            return res.status(401).json({
                valid: false
            });
        }

        res.json({
            valid: true,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            valid: false
        });
    }
};

// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const {
            name,
            shopName,
            email,
            password
        } = req.body;

        const existingUser =
            await UserModel.findOne({
                email
            });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await UserModel.create({
                name,
                shopName,
                email,
                password: hashedPassword,
                role: "owner"
            });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            token,
            user
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user =
            await UserModel.findOne({
                email
            });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            token,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};