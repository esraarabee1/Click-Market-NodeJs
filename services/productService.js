const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const productModel = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
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
exports.uploadProductsImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 2,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    // Save image into our db
    req.body.imageCover = imageCoverFilename;
  }

  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img) => {
        req.body.images = [];
        const imageName = `product-${uuidv4()}-${Date.now()}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

exports.getProducts = factory.getAll(productModel, "Products");
// exports.getProducts = asyncHandler(async (req, res) => {
//   //filtering
//   // const querySring = { ...req.query };
//   // const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
//   // excludeFields.forEach((field) => delete querySring[field]);
//   // //apply filter by greater than or other
//   // let queryStr = JSON.stringify(querySring);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   // console.log(queryStr);
//   //pagination
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 50;
//   // const skip = (page - 1) * limit;

//   //build query
//   const documentsCount = await productModel.countDocuments();
//   const apiFeatures = new ApiFeatures(productModel.find(), req.query)
//     .paginate(documentsCount)
//     .filter()
//     .search("Products")
//     .limitFields()
//     .sort();

//   const { mongooseQuery, paginationResult } = apiFeatures;
//   // let mongooseQuery = productModel
//   //   .find(JSON.parse(queryStr))
//   //   .skip(skip)
//   //   .limit(limit)
//   //   .populate({ path: "category", select: "name" });
//   //sorting
//   // if (req.query.sort) {
//   //   // price, sold => [price,sold] => pricesold => price sold
//   //   const sortBy = req.query.sort.split(",").join(" ");
//   //   mongooseQuery = mongooseQuery.sort(sortBy);
//   // } else {
//   //   mongooseQuery = mongooseQuery.sort("-createdAt");
//   // }
//   //fields limiting
//   // if (req.query.fields) {
//   //   //
//   //   const fields = req.query.fields.split(",").join(" ");
//   //   mongooseQuery = mongooseQuery.select(fields);
//   // } else {
//   //   mongooseQuery = mongooseQuery.select("-__v");
//   // }
//   //search
//   // if (req.query.keyword) {
//   //   //
//   //   const query = {};
//   //   query.$or = [
//   //     { title: { $regex: req.query.keyword, $options: "i" } },
//   //     { description: { $regex: req.query.keyword, $options: "i" } },
//   //   ];
//   //   mongooseQuery = mongooseQuery.find(query);
//   //   console.log(query);
//   // }
//   //excute query
//   const products = await mongooseQuery;
//   res
//     .status(200)
//     .json({ results: products.length, paginationResult, data: products });
// });

exports.getProduct = factory.getOne(productModel);

// exports.getProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await productModel
//     .findById(id)
//     .populate({ path: "category", select: "name" });

//   if (!product) {
//     // return res.status(404).json({ msg: `No product found for ID ${id}` });
//     return next(new ApiError(`No product for this id ${id}`, 404));
//   }

//   res.status(200).json({ data: product });
// });

exports.createProduct = factory.createOne(productModel);

// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);
//   //async await

//   const product = await productModel.create(req.body);
//   res.status(201).json({ data: product });
// });

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateProduct = factory.updateOne(productModel);
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   if (req.body.title) {
//     req.body.slug = slugify(req.body.title);
//   }
//   const product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
//     new: true,
//   });

//   if (!product) {
//     //res.status(404).json({ msg: `No product for this id ${id}` });
//     return next(new ApiError(`No product for this id ${id}`, 404));
//   }
//   res.status(200).json({ data: product });
// });

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(productModel);
// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await productModel.findByIdAndDelete(id);

//   if (!product) {
//     //res.status(404).json({ msg: `No product for this id ${id}` });
//     return next(new ApiError(`No product for this id ${id}`, 404));
//   }
//   res.status(204).send();
// });
