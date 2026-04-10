const express = require("express");
const { param, validationResult } = require("express-validator");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const authService = require("../services/authService");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");
const subcategoriesRoute = require("../routes/subCategoryRoute");
const router = express.Router();
router.use("/:categoryId/subcategories", subcategoriesRoute);
router.route("/").get(getCategories).post(
  authService.protect,
  authService.allowedTo("admin", "manager"),
  uploadCategoryImage,
  resizeImage,
  // function (req, res, next) {
  //   // req.files is array of `photos` files
  //   // req.body will contain the text fields, if there were any
  //   console.log(req.file);
  //   next();
  // },
  createCategoryValidator,
  createCategory
);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
