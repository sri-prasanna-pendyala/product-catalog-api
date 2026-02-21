const Product = require('../models/Product');
const { invalidateCache } = require('../middleware/redisUtils');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    await invalidateCache('__express__/api/products*');
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Product.countDocuments();
    res.json({ products, total, page, limit });
  } catch (err) { next(err); }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    await invalidateCache(`__express__/api/products/${req.params.id}*`);
    await invalidateCache('__express__/api/products*');
    res.json(product);
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    await invalidateCache(`__express__/api/products/${req.params.id}*`);
    await invalidateCache('__express__/api/products*');
    res.status(204).send();
  } catch (err) { next(err); }
};