const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,//explain: This option removes whitespace from both ends of the string
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
    },
    sizes: {
        type: [String],
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    collections: {
        type: String,
        required: true
    },
    material: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex'],
        required: true
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            altText: {
                type: String
            },
        },
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metaTitle: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    metakeywords: {
        type: String,
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    weight: {
        type: Number,
    },

},
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
// This code defines a Mongoose schema and model for a Product in a MongoDB database.
// The schema includes fields for name, description, price, image, category, and countInStock.