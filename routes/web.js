const express = require("express");

const registerController = require("../controllers/register");
const loginController = require("../controllers/login");
const homeController = require("../controllers/home");
const planetController = require("../controllers/planet");

const router = express.Router();

// @route GET /
router.get("/", homeController.welcome);

// router.get('/home', homeController.show);

// @route GET /welcome
router.get("/welcome", homeController.index);

// @route GET /login
router.get("/login", loginController.showLoginForm);

// @route GET /login
router.post("/login", loginController.login);

// @route GET /register
router.get("/register", registerController.showRegistrationForm);

// @route GET /register
// router.post('/register', registerController.registerUser);

// @route GET /home
// @desc Loads planets
router.get("/planets", planetController.index);

// @route POST /upload
// @desc  Store planet
router.post("/planets", planetController.store);

module.exports = router;
