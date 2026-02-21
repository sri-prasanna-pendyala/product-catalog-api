const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const { cacheProvider } = require('../middleware/redisUtils');

// GET requests are cached for 60 seconds
router.get('/', cacheProvider(60), productCtrl.getProducts);
router.get('/:id', cacheProvider(60), productCtrl.getProductById);

// POST/PUT/DELETE trigger cache invalidation inside the controller
router.post('/', productCtrl.createProduct);
router.put('/:id', productCtrl.updateProduct);
router.delete('/:id', productCtrl.deleteProduct);

module.exports = router;