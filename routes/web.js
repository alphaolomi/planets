const express = require("express");

const registerController = require("../controllers/register");
const loginController = require("../controllers/login");
const homeController = require("../controllers/home");
const storageController = require("../controllers/storage");

const router = express.Router();

// @route GET /
router.get('/', homeController.welcome);


// router.get('/home', homeController.show);

// @route GET /welcome
router.get('/welcome', homeController.index);

// @route GET /login
router.get('/login', loginController.showLoginForm);

// @route GET /login
router.post('/login', loginController.login);

// @route GET /register
router.get('/register', registerController.showRegistrationForm);

// @route GET /register
// router.post('/register', registerController.registerUser);


// @route GET /home
// @desc Loads form
router.get('/home', storageController.index);

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', storageController.store);

// @route GET /files
// @desc  Display all files in JSON
router.get('/files', storageController.get_files);

// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', storageController.get_file);

// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', storageController.get_image);

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', storageController.delete_file);


module.exports = router;
