const express = require('express');
const Products = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin

router.post('/', protect, admin, async (req, res) => {
    // console.log('📦 Body:', req.body); // <--- must NOT be undefined

    try {
        const {
            name,
            price,
            description,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Products({
            name,
            price,
            description,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//@route   GET /api/products/:id
// @desc    update product by ID
// @access  Private / admin

router.put('/:id', protect, admin, async (req, res) => {

    try {
        const {
            name,
            price,
            description,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        //Find the product by ID
        const product = await Products.findById(req.params.id);

        if (product) {
            // Update the product fields
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // Save the updated product
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//@route   DELETE /api/products/:id
// @desc    Delete product by ID
// @access  Private/Admin

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);

        if (product) {
            // Remove the product
            await product.deleteOne();
            // Optionally, you can also remove the product from any related collections or perform other cleanup tasks here.
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//@route  GET /api/products
// @desc   Get all products
// @access Public
router.get('/', async (req, res) => {
    try {
        const { collections,
            sizes,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit } = req.query;

        let query = {};

        //filter logic 
        if (collections && collections.toLocaleLowerCase() !== 'all') {
            query.collections = collections;
        }

        if (category && category.toLocaleLowerCase() !== 'all') {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(',') };
        }

        if (brand) {
            query.brand = { $in: brand.split(',') };
        }

        if (sizes) {
            query.sizes = { $in: sizes.split(',') };
        }

        if (color) {
            query.colors = { $in: [color] };
        }

        if (gender) {
            query.gender = gender
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]
        }

        //sort logic 
        // Sort logic
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 };
                    break;
                default:
                    break;
            }
        }

        // Fetch products and apply sorting and limit
        const products = await Products.find(query)
            .sort(sort)
            .limit(Number(limit) || 0);

        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


//router Get api/products/best seller
// @desc retrive the products with the highest sales
// @access public
router.get('/best-seller', async (req, res) => {
    try {
        const bestseller = await Products.find().sort({rating: -1}) // Assuming 'rating' is a field that tracks product popularity

        if(bestseller){
            res.json(bestseller);
        }else{
            res.status(404).json({ message: 'No best sellers found' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//router Get api/products/new-arrivals
// @desc retrive the products with the latest arrivals
// @access public
router.get('/new-arrivals', async (req, res) => {
    try {
        //Fetch latest8 products
        const newArrivals = await Products.find().sort({ createdAt: -1 }).limit(8); 
        res.json(newArrivals);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


//router  Get api/products/:id
//@desc get a single product id
//@access public
router.get('/:id', async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//router Get api/products/similar/:id
// @desc get similar products based on category
// @access public
router.get('/similar/:id', async (req, res) => {
    const { id } = req.params

    try {
        const product = await Products.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const similarProducts = await Products.find({
            _id: { $ne: id }, // Exclude the current product
            category: product.category, // Match the same category
            gender: product.gender // Match the same gender
        }).limit(4); // Limit to 4 similar products

        res.json(similarProducts);
    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
