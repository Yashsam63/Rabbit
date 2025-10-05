const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//helper function to get cart by userId or guestId
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

//@route   GET /api/cart
//@desc    Add a products at cart
//@access  pulic
router.post('/', async (req, res) => {

    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        //determine if the user is logged in or a guest
        let cart = await getCart(userId, guestId);

        // Image fallback if none exists
        const productImage = product.images?.[0]?.url || 'https://via.placeholder.com/150';

        //if the cart exsits update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                //if product already exists in the cart, update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                //if product does not exist in the cart, add it
                cart.products.push({
                    productId,
                    name: product.name,
                    images: productImage,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            //recalculate total price
            cart.totalPrice = cart.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            //save the cart
            await cart.save();
            return res.status(200).json(cart);
        } else {
            //create a new cart for the user or guest
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        images: productImage,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ message: 'Server error 1', error: error.message });
    }
});

//@route   PUT /api/cart
//@desc   Update a products at cart
//access  public

router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            //if product already exists in the cart, update the quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                //if quantity is 0, remove the product from the cart
                cart.products.splice(productIndex, 1);
            }

            cart.totalPrice = cart.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating product in cart:', error);
        return res.status(500).json({ message: 'Server error 2', error: error.message });
    }
})

// @route delete /api/cart
// @desc delete a product from cart
//@acess public
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            //if product exists in the cart, remove it
            cart.products.splice(productIndex, 1);

            //recalculate total price
            cart.totalPrice = cart.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        return res.status(500).json({ message: 'Server error 3', error: error.message });
    }
})

//router GET/api/cart
//@desc Get loggedin user's or guests'cart 
//@access public
router.get('/', async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }

    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error 4', error: error.message });
    }
});

//@route POST /api/cart/merge
//@desc Merge guest cart with user cart on login
//@access public

router.post('/merge', protect, async (req, res) => {
    const { guestId } = req.body;

    if (!guestId) {
        return res.status(400).json({ message: 'guestId is required' });
    }

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(200).json({ message: 'No products in guest cart to merge' });
            }

            if (userCart) {
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
                await userCart.save();

                try {
                    await Cart.findOneAndDelete({ guestId });
                } catch (error) {
                    console.error('Error deleting guest cart:', error);
                }

                return res.status(200).json(userCart);
            } else {
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                return res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                return res.status(200).json(userCart);
            }

            return res.status(404).json({ message: 'No cart found for user' });
        }
    } catch (error) {
        console.error('Error merging carts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;