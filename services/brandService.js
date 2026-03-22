const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const brandModel = require("../models/brandModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
// // Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});

exports.getBrands = factory.getAll(brandModel);
// exports.getBrands = asyncHandler(async (req, res) => {
//   //build query
//   const documentsCount = await brandModel.countDocuments();
//   const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
//     .paginate(documentsCount)
//     .filter()
//     .search()
//     .limitFields()
//     .sort();
//   //excute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const brands = await mongooseQuery;
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 5;
//   // const skip = (page - 1) * limit;
//   // const brands = await brandModel.find({});
//   res
//     .status(200)
//     .json({ results: brands.length, paginationResult, data: brands });
// });

exports.getBrand = factory.getOne(brandModel);
// exports.getBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await brandModel.findById(id);
//   console.log(brand, "brand");

//   if (!brand) {
//     // return res.status(404).json({ msg: `No category found for ID ${id}` });
//     return next(new ApiError(`No brand for this id ${id}`, 404));
//   }

//   res.status(200).json({ data: brand });
// });

exports.createBrand = factory.createOne(brandModel);

// exports.createBrand = asyncHandler(async (req, res) => {
//   const name = req.body.name;
//   //async await

//   const category = await brandModel.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: category });
// });

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateBrand = factory.updateOne(brandModel);
// exports.updateBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const brand = await brandModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true }
//   );

//   if (!brand) {
//     //res.status(404).json({ msg: `No category for this id ${id}` });
//     return next(new ApiError(`No brand for this id ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(brandModel);
// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await brandModel.findByIdAndDelete(id);

//   if (!brand) {
//     //res.status(404).json({ msg: `No category for this id ${id}` });
//     return next(new ApiError(`No brand for this id ${id}`, 404));
//   }
//   res.status(204).send();
// });
