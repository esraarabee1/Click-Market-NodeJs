const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  //   updateLoggedUserValidator,
} = require("../utils/validator/userValidator");
const authService = require("../services/authService");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  //   getLoggedUserData,
  //   updateLoggedUserPassword,
  //   updateLoggedUserData,
  //   deleteLoggedUserData,
} = require("../services/userService");

const router = express.Router();

// router.use(authService.protect);

// router.get('/getMe', getLoggedUserData, getUser);
// router.put('/changeMyPassword', updateLoggedUserPassword);
// router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
// router.delete('/deleteMe', deleteLoggedUserData);

// Admin
// router.use(authService.allowedTo('admin', 'manager'));
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin", "manager"), getUsers)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
