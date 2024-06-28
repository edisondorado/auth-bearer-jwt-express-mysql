const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Token = db.token;

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) return res.status(403).send({
        message: "No token provided!"
    });

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    } else {
        return res.status(403).send({
            message: "Invalid token format!"
        });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        
        const tokenRecord = await Token.findOne({ where: { token, invalidated: false } })
        if (!tokenRecord) return res.status(401).send({ message: "Token is invalid" })

        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
