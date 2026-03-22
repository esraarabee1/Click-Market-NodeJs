const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const CategoryModel = require("../models/categoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

//1- disk storage
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

//2- memory storage
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only Images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// Upload single image
exports.uploadCategoryImage = upload.single("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});

exports.getCategories = factory.getAll(CategoryModel);

// exports.getCategories = asyncHandler(async (req, res) => {
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 5;
//   // const skip = (page - 1) * limit;
//   //build query
//   const documentsCount = await CategoryModel.countDocuments();
//   const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
//     .paginate(documentsCount)
//     .filter()
//     .search()
//     .limitFields()
//     .sort();
//   //excute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const categories = await mongooseQuery;
//   // const categories = await CategoryModel.find({}).skip(skip).limit(limit);
//   res
//     .status(200)
//     .json({ results: categories.length, paginationResult, data: categories });
// });

exports.getCategory = factory.getOne(CategoryModel);

// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await CategoryModel.findById(id);
//   console.log(category, "category");

//   if (!category) {
//     // return res.status(404).json({ msg: `No category found for ID ${id}` });
//     return next(new ApiError(`No category for this id ${id}`, 404));
//   }

//   res.status(200).json({ data: category });
// });

exports.createCategory = factory.createOne(CategoryModel);
// exports.createCategory = asyncHandler(async (req, res) => {
//   const name = req.body.name;
//   //async await

//   const category = await CategoryModel.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: category });
// });

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(CategoryModel);
// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const category = await CategoryModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true }
//   );

//   if (!category) {
//     //res.status(404).json({ msg: `No category for this id ${id}` });
//     return next(new ApiError(`No category for this id ${id}`, 404));
//   }
//   res.status(200).json({ data: category });
// });

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await CategoryModel.findByIdAndDelete(id);

//   if (!category) {
//     //res.status(404).json({ msg: `No category for this id ${id}` });
//     return next(new ApiError(`No category for this id ${id}`, 404));
//   }
//   res.status(204).send();
// });
