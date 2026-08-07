const BlogModel = require('../models/blog.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const slugify = require('../utils/slugify');

// GET /api/blog — public/admin
const listPosts = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const onlyPublished = !req.admin;
  const { tag } = req.query;
  const [items, total] = await Promise.all([
    BlogModel.findAll({ skip, take, onlyPublished, tag }),
    BlogModel.count({ onlyPublished, tag }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// GET /api/blog/:slug — public
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogModel.findBySlug(req.params.slug);
  if (!post) throw ApiError.notFound('Article introuvable.');
  return sendSuccess(res, { data: post });
});

// POST /api/blog — admin
const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, author, tags, isPublished } = req.body;
  const coverImage = req.file ? `/uploads/images/${req.file.filename}` : req.body.coverImage;
  const post = await BlogModel.create({
    title,
    slug: slugify(title),
    content,
    excerpt,
    author,
    coverImage,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
    isPublished: !!isPublished,
    publishedAt: isPublished ? new Date() : undefined,
  });
  return sendSuccess(res, { statusCode: 201, data: post, message: 'Article créé.' });
});

// PUT /api/blog/:id — admin
const updatePost = asyncHandler(async (req, res) => {
  const existing = await BlogModel.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Article introuvable.');

  const { title, content, excerpt, author, tags, isPublished } = req.body;
  const coverImage = req.file ? `/uploads/images/${req.file.filename}` : req.body.coverImage;
  const willPublish = isPublished !== undefined ? !!isPublished : existing.isPublished;
  const post = await BlogModel.update(req.params.id, {
    ...(title && { title, slug: slugify(title) }),
    ...(content && { content }),
    ...(excerpt !== undefined && { excerpt }),
    ...(author !== undefined && { author }),
    ...(coverImage !== undefined && { coverImage }),
    ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [tags] }),
    ...(isPublished !== undefined && { isPublished: willPublish }),
    ...(isPublished && !existing.publishedAt && { publishedAt: new Date() }),
  });
  return sendSuccess(res, { data: post, message: 'Article mis à jour.' });
});

// DELETE /api/blog/:id — admin
const deletePost = asyncHandler(async (req, res) => {
  await BlogModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Article supprimé.' });
});

module.exports = { listPosts, getPostBySlug, createPost, updatePost, deletePost };
