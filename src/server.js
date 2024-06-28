require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();

const validationSignIn = require('./middlewares/verifySignUp');
const { signUpValidation } = require("./middlewares/validation");
const controller = require("./controllers/auth.controller");
const verifyToken = require("./middlewares/authJwt");

const fileRoutes = require('./routes/file.routes');

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync();

app.post("/api/signup", [...signUpValidation, validationSignIn], controller.signup);
app.post("/api/signin", controller.signin);
app.post("/api/signin/new_token", controller.refreshToken);
app.get("/api/logout", verifyToken, controller.logout)

app.get("/api/info", verifyToken, controller.info)

app.use("/api/file", fileRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
