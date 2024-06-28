const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Token = db.token;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({
    id: req.body.id,
    password: bcrypt.hashSync(req.body.password, 8)
  })
  .then(async user => {
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    const refreshToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtRefreshExpiration
    });

    let existingToken = await Token.findOne({ where: { userId: user.id } })

    if (existingToken){
      existingToken.token = token;
      existingToken.invalidated = false;
      await existingToken.save()
        .then(() => {
          res.status(200).send({
            id: user.id,
            accessToken: `Bearer ${token}`,
            refreshToken: refreshToken
          });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        })
    } else {
      Token.create({
        token: token,
        userId: user.id,
        invalidated: false
      })
        .then(() => {
          res.status(200).send({
            id: user.id,
            accessToken: `Bearer ${token}`,
            refreshToken: refreshToken
          });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        })
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      id: req.body.id
    }
  })
  .then(async user => {
    if (!user) return res.status(404).send({ message: "User Not found." });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    const refreshToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtRefreshExpiration
    });

    let existingToken = await Token.findOne({ where: { userId: user.id } })

    if (existingToken){
      existingToken.token = token;
      existingToken.invalidated = false;
      await existingToken.save()
        .then(() => {
          res.status(200).send({
            id: user.id,
            accessToken: `Bearer ${token}`,
            refreshToken: refreshToken
          });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        })
    } else {
      Token.create({
        token: token,
        userId: user.id,
        invalidated: false
      })
        .then(() => {
          res.status(200).send({
            id: user.id,
            accessToken: `Bearer ${token}`,
            refreshToken: refreshToken
          });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        })
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(403).send({ message: "Refresh Token is required!" });

  jwt.verify(refreshToken, config.secret, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Invalid Refresh Token!" });

    const newAccessToken = jwt.sign({ id: decoded.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    res.status(200).send({
      accessToken: `Bearer ${newAccessToken}`
    });
  });
};

exports.info = (req, res) => {
  const userId = req.userId;

  User.findByPk(userId)
    .then(user => {
      if (!user) return res.status(404).send({ message: "User not found" })
      
      res.status(200).send({
        id: user.id
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.logout = async (req, res) => {
  const userId = req.userId;
  await Token.update({ invalidated: true }, { where: { userId }})
  res.status(200).send({ message: "Logout successfully" })
}
