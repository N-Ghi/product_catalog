const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const searchController = require('../controllers/searchController');
const inventoryController = require('../controllers/inventoryController');

/**
 * @swagger
 * tags:
 *   - name: Inventory
 *   - name: Categories
 *   - name: Products
 *   - name: Search
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get inventory overview for authenticated user
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: number
 *                   example: 125
 *                 variants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       variantId:
 *                         type: string
 *                         example: 64be...
 *                       productId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64bd...
 *                           name:
 *                             type: string
 *                             example: Leather Sneakers
 *                       color:
 *                         type: string
 *                         example: Black
 *                       size:
 *                         type: string
 *                         example: M
 *                       stock:
 *                         type: number
 *                         example: 8
 *                       lowStock:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get('/dashboard', protect, inventoryController.inventoryTracker);

// ------------------- CATEGORY ROUTES -------------------

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Footwear"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64dcb5dd6cba7c56a2e4a23f
 *                     name:
 *                       type: string
 *                       example: "Footwear"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T13:25:35.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T13:25:35.000Z"
 *       400:
 *         description: Failed to create category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to create category
 *                 error:
 *                   type: string
 *                   example: Category name is required
 */
router.post('/categories', protect, categoryController.createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64dcb5dd6cba7c56a2e4a23f
 *                       name:
 *                         type: string
 *                         example: "Accessories"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-17T13:25:35.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-17T13:25:35.000Z"
 *       400:
 *         description: Failed to fetch categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch categories
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */
router.get('/categories', protect, categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: string
 *           example: 64dcb5dd6cba7c56a2e4a23f
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64dcb5dd6cba7c56a2e4a23f
 *                     name:
 *                       type: string
 *                       example: "Bags"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T13:25:35.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T13:25:35.000Z"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/categories/:id', protect, categoryController.getCategoryById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: string
 *           example: 64dcb5dd6cba7c56a2e4a23f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Category Name"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category updated successfully
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64dcb5dd6cba7c56a2e4a23f
 *                     name:
 *                       type: string
 *                       example: "Updated Category Name"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T13:25:35.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T14:00:00.000Z"
 *       400:
 *         description: Failed to update category or category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *                 error:
 *                   type: string
 *                   example: Cast to ObjectId failed for value "invalid-id"
 */
router.put('/categories/:id', protect, categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: string
 *           example: 64dcb5dd6cba7c56a2e4a23f
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.delete('/categories/:id', protect, categoryController.deleteCategory);

// ------------------- PRODUCT ROUTES -------------------

/**
 * @swagger
 * /products/mine:
 *   get:
 *     summary: Get all products created by the authenticated user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's products with associated variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   category_id:
 *                     type: string
 *                   variants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         size:
 *                           type: string
 *                         color:
 *                           type: string
 *                         price:
 *                           type: number
 *                         stock:
 *                           type: number
 *       401:
 *         description: Unauthorized – Authentication token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: No products found for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No products found
 *       500:
 *         description: Internal server error while fetching products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/products/mine', protect, productController.getMyProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product with variants
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - brand
 *               - category_id
 *               - variants
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sneakers"
 *               description:
 *                 type: string
 *                 example: "Comfortable running shoes"
 *               brand:
 *                 type: string
 *                 example: "Nike"
 *               category_id:
 *                 type: string
 *                 example: "64f1c4bcf1234567890abcd1"
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - size
 *                     - color
 *                     - price
 *                     - stock
 *                   properties:
 *                     size:
 *                       type: string
 *                       example: "41"
 *                     color:
 *                       type: string
 *                       example: "Black"
 *                     price:
 *                       type: number
 *                       example: 79.99
 *                     stock:
 *                       type: integer
 *                       example: 50
 *     responses:
 *       201:
 *         description: Product created successfully with variants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *                 variants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Bad request - validation failed or transaction aborted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed: name is required"
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/products', protect, productController.createProduct);

/**
* @swagger
* /products/{id}:
*   put:
*     summary: Update a product and all its variants
*     tags: [Products]
*     security:
*       - bearerAuth: []
*     parameters:
*       - name: id
*         in: path
*         required: true
*         schema:
*           type: string
*         description: Product ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: "Updated Sneakers"
*               description:
*                 type: string
*                 example: "Updated description"
*               brand:
*                 type: string
*                 example: "Nike"
*               category_id:
*                 type: string
*                 example: "64f1c4bcf1234567890abcd1"
*               variants:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     size:
*                       type: string
*                       example: "43"
*                     color:
*                       type: string
*                       example: "Red"
*                     price:
*                       type: number
*                       example: 89.99
*                     stock:
*                       type: integer
*                       example: 40
*     responses:
*       200:
*         description: Product updated successfully along with variants
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Product updated successfully
*                 product:
*                   type: object
*                   properties:
*                     _id:
*                       type: string
*                     name:
*                       type: string
*                     description:
*                       type: string
*                     brand:
*                       type: string
*                     category_id:
*                       type: string
*                     variants:
*                       type: array
*                       items:
*                         type: object
*                         properties:
*                           _id:
*                             type: string
*                           size:
*                             type: string
*                           color:
*                             type: string
*                           price:
*                             type: number
*                           stock:
*                             type: integer
*       400:
*         description: Validation error on product or variant fields
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Validation error
*                 errors:
*                   type: array
*                   items:
*                     type: string
*                   example: ["Name is required", "Price must be positive"]
*       401:
*         description: Unauthorized - missing or invalid authentication token
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Unauthorized
*       404:
*         description: Product not found or user unauthorized to update it
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Product not found or unauthorized
*       500:
*         description: Internal server error during update
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Internal Server Error
*/
router.put('/products/:id', protect, productController.updateProduct);

/**
 * @swagger
 * /products/{productId}/variants/{variantId}:
 *   put:
 *     summary: Update a specific variant of a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to which the variant belongs
 *       - name: variantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the variant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size:
 *                 type: string
 *                 example: "42"
 *               color:
 *                 type: string
 *                 example: "Blue"
 *               price:
 *                 type: number
 *                 example: 59.99
 *               stock:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Variant updated successfully
 *                 variant:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     product_id:
 *                       type: string
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *       400:
 *         description: Validation error on variant data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Price must be a positive number"]
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Product or variant not found, or user unauthorized to update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Variant not found
 *       500:
 *         description: Internal server error while updating variant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.put('/products/:productId/variants/:variantId', protect, productController.updateVariant);

/**
 * @swagger
 * /products/{productId}/variants:
 *   post:
 *     summary: Add a new variant to an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - size
 *               - color
 *               - price
 *               - stock
 *             properties:
 *               size:
 *                 type: string
 *                 example: "40"
 *               color:
 *                 type: string
 *                 example: "White"
 *               price:
 *                 type: number
 *                 example: 69.99
 *               stock:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Variant added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Variant added successfully
 *                 variant:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     product_id:
 *                       type: string
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *       400:
 *         description: Validation error on variant data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Price must be a positive number"]
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Product not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found or unauthorized
 *       500:
 *         description: Internal server error while adding variant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/products/:productId/variants', protect, productController.addVariant);

/**
 * @swagger
 * /products/{productId}/variants/{variantId}:
 *   delete:
 *     summary: Delete a variant from a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to which the variant belongs
 *       - name: variantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the variant to delete
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Variant deleted successfully
 *                 variant:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     product_id:
 *                       type: string
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Product not found or unauthorized, or variant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Variant not found
 *       500:
 *         description: Internal server error while deleting variant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.delete('/products/:productId/variants/:variantId', protect, productController.deleteVariant);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product and its variants
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product and its variants deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product and its variants deleted successfully
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Product not found or user unauthorized to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found or unauthorized
 *       500:
 *         description: Internal server error while deleting product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.delete('/products/:id', protect, productController.deleteProduct);

// ------------------- SEARCH ROUTES -------------------

/**
 * @swagger
 * /search/name:
 *   get:
 *     summary: Search products by name (partial match)
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         description: Partial or full product name to search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching products with their variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   name:
 *                     type: string
 *                     example: "Example Product"
 *                   description:
 *                     type: string
 *                     example: "A sample product description"
 *                   variants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109cb"
 *                         product_id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *                         color:
 *                           type: string
 *                           example: "Red"
 *                         size:
 *                           type: string
 *                           example: "30"
 *       404:
 *         description: No products found matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No products found"
 *       500:
 *         description: Internal server error occurred while processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/search/name', protect, searchController.searchByName);

/**
 * @swagger
 * /search/category:
 *   get:
 *     summary: Search products by category name (partial match)
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         description: Partial or full category name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching products with their variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   name:
 *                     type: string
 *                     example: "Example Product"
 *                   description:
 *                     type: string
 *                     example: "A sample product description"
 *                   category_id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109d0"
 *                   variants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109cb"
 *                         product_id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *                         color:
 *                           type: string
 *                           example: "Blue"
 *                         size:
 *                           type: string
 *                           example: "12"
 *       404:
 *         description: No category or products found matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No category found"
 *       500:
 *         description: Internal server error occurred while processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/search/category', protect, searchController.searchByCategory);

/**
 * @swagger
 * /search/order:
 *   get:
 *     summary: Sort products by date created (oldest or newest)
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order
 *         required: true
 *         description: Sort order — must be "oldest" or "newest"
 *         schema:
 *           type: string
 *           enum: [oldest, newest]
 *     responses:
 *       200:
 *         description: Sorted products with their variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   name:
 *                     type: string
 *                     example: "Example Product"
 *                   description:
 *                     type: string
 *                     example: "A sample product description"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-01T12:00:00.000Z"
 *                   variants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109cb"
 *                         product_id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *                         color:
 *                           type: string
 *                           example: "Black"
 *                         size:
 *                           type: string
 *                           example: "20"
 *       400:
 *         description: Invalid sort order parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid order parameter. Use "oldest" or "newest".'
 *       500:
 *         description: Internal server error occurred while processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/search/order', protect, searchController.searchByDateCreated);

/**
 * @swagger
 * /search/size:
 *   get:
 *     summary: Search products by variant size
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         description: Size of variant (e.g., "42", "20", etc.)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products with matching variant sizes and their variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   name:
 *                     type: string
 *                     example: "Sample Product"
 *                   description:
 *                     type: string
 *                     example: "Product description here"
 *                   variants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109cb"
 *                         product_id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *                         size:
 *                           type: string
 *                           example: "42"
 *                         color:
 *                           type: string
 *                           example: "Black"
 *       404:
 *         description: No variants found matching the size
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No variants found"
 *       500:
 *         description: Internal server error occurred while processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/search/size', protect, searchController.searchBySize);

/**
 * @swagger
 * /search/color:
 *   get:
 *     summary: Search products by variant color
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: color
 *         required: true
 *         description: Variant color (e.g., "Black", "White")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products with matching variant colors and their variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   name:
 *                     type: string
 *                     example: "Example Product"
 *                   description:
 *                     type: string
 *                     example: "Sample product description"
 *                   variants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109cb"
 *                         product_id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *                         color:
 *                           type: string
 *                           example: "Black"
 *                         size:
 *                           type: string
 *                           example: "42"
 *       404:
 *         description: No variants found matching the color
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No variants found"
 *       500:
 *         description: Internal server error occurred while processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/search/color', protect, searchController.searchByColor);

module.exports = router;
