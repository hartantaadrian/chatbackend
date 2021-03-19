const express = require("express");

const userController = require("../controllers/login");

const router = express.Router();

router.post("/login", userController.login);
router.post("/signIn", userController.signIn);

module.exports = router;
