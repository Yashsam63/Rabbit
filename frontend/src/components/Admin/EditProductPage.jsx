import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { fetchProductDetails, updateProduct } from '../../redux/Slices/ProductSlice';

const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((state) => state.products);



    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collection: "",
        material: "",
        gender: "",
        images: [],
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct) {
            // Ensure selectedProduct is spread into setProductData
            setProductData(selectedProduct); 
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImagesUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            // console.log("Upload response:", data);
            setUploading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageURL, altText: "" }]
            }));
            setUploading(false);
            // console.log("Upload response:", data);
            
            // Clear the file input after successful upload
            e.target.value = null; 

        } catch (error) {
            console.error("Error uploading image:", error);
            setUploading(false);
        }
    };
    
    // ⭐ NEW FUNCTION: Handler for deleting an image
    const handleImageDelete = (urlToDelete) => {
        setProductData((prevData) => ({
            ...prevData,
            images: prevData.images.filter(image => image.url !== urlToDelete),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // The id is already destructured from useParams
        dispatch(updateProduct({ id, productData }));
        navigate('/admin/products');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    // console.log("Product Data:", productData);



    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Product Name"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={4}
                        placeholder="Product Description"
                        required
                    />
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Product Price"
                        required
                    />
                </div>

                {/* Count In Stock */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count In Stock</label>
                    <input
                        type="number"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Count In Stock"
                        required
                    />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Product SKU"
                        required
                    />
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes</label>
                    <input
                        type="text"
                        name="sizes"
                        value={productData.sizes.join(', ')}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                sizes: e.target.value.split(',').map(size => size.trim())
                            })
                        }
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Sizes (comma separated)"
                        required
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors</label>
                    <input
                        type="text"
                        name="colors"
                        value={productData.colors.join(', ')}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                colors: e.target.value.split(',').map(color => color.trim())
                            })
                        }
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Colors (comma separated)"
                        required
                    />
                </div>

                {/* Images */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Images</label>
                    <input type="file" onChange={handleImagesUpload} />
                    {uploading && <p>Uploading image...</p>}
                    <div className="flex flex-wrap gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            // ⭐ MODIFIED: Added a delete button container
                            <div key={index} className="relative w-20 h-20 group">
                                <img
                                    src={image.url}
                                    alt={image.altText || "product image"}
                                    className="w-full h-full object-cover rounded-md shadow-md"
                                />
                                {/* ⭐ DELETE BUTTON */}
                                <button
                                    type="button"
                                    onClick={() => handleImageDelete(image.url)}
                                    className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 
                                               bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center 
                                               text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Delete image"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;
