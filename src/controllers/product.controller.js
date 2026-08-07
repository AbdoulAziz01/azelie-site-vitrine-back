const ProductModel = require('../models/product.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const slugify = require('../utils/slugify');

// GET /api/products — public/admin
const listProducts = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const onlyActive = !req.admin;
  const { category } = req.query;
  const [items, total] = await Promise.all([
    ProductModel.findAll({ skip, take, onlyActive, category }),
    ProductModel.count({ onlyActive, category }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// GET /api/products/:slug — public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await ProductModel.findBySlug(req.params.slug);
  if (!product) throw ApiError.notFound('Produit introuvable.');
  return sendSuccess(res, { data: product });
});

// POST /api/products — admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, isActive } = req.body;
  const images = req.files?.length
    ? req.files.map((f) => `/uploads/images/${f.filename}`)
    : req.body.images || [];
  const product = await ProductModel.create({
    name,
    slug: slugify(name),
    description,
    price: price !== undefined ? Number(price) : undefined,
    category,
    stock: stock !== undefined ? Number(stock) : undefined,
    images,
    isActive,
  });
  return sendSuccess(res, { statusCode: 201, data: product, message: 'Produit créé.' });
});

// PUT /api/products/:id — admin
const updateProduct = asyncHandler(async (req, res) => {
  const existing = await ProductModel.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Produit introuvable.');

  const { name, description, price, category, stock, isActive } = req.body;
  const images = req.files?.length
    ? req.files.map((f) => `/uploads/images/${f.filename}`)
    : req.body.images;
  const product = await ProductModel.update(req.params.id, {
    ...(name && { name, slug: slugify(name) }),
    ...(description && { description }),
    ...(price !== undefined && { price: Number(price) }),
    ...(category !== undefined && { category }),
    ...(stock !== undefined && { stock: Number(stock) }),
    ...(images !== undefined && { images }),
    ...(isActive !== undefined && { isActive }),
  });
  return sendSuccess(res, { data: product, message: 'Produit mis à jour.' });
});

// DELETE /api/products/:id — admin
const deleteProduct = asyncHandler(async (req, res) => {
  await ProductModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Produit supprimé.' });
});

module.exports = { listProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };
