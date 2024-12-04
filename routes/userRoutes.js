const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/getUser").get(authController.isLoggedIn, authController.getUser);
router
  .route("/")
  .get(userController.getAllUsers)
  .delete(userController.deleteAllUsers);

module.exports = router;
