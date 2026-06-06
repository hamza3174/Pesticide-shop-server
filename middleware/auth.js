const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });

    }
};

module.exports = { authMiddleware };