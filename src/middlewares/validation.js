const { check } = require("express-validator");

exports.signUpValidation = [
    check("id", "ID must be a number (which may include '+') or a valid email")
        .custom(value => {
            if (/^\+?\d+$/.test(value)){
                return true;
            }

            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
                return true;
            }

            throw new Error("ID must be a number (which may include '+') or a valid email");
        }),
    check("password", "Password is required").isLength({ min: 6, max: 32 })
]