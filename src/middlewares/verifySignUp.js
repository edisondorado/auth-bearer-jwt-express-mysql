const db = require('../models');
const User = db.user;
const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs')

validationSignIn = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).send({ message: errors.array() })
    }

    User.findOne({
        where: {
            id: req.body.id
        }
    })
        .then(user => {
            if (user) return res.status(400).send({ message: "ID is already in use" });
            next();
        })
}

module.exports = validationSignIn;