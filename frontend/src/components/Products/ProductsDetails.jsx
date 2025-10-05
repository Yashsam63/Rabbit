import React from 'react'
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import ProductGrid from './ProductGrid'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/Slices/ProductSlice'
import { addToCart } from '../../redux/Slices/cartSlice'

const ProductsDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, error, loading, similarProducts } = useSelector((state) => state.products);
    const { user, guestId } = useSelector((state) => state.auth)
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({ id: productFetchId }))
        }
    }, [dispatch, productFetchId])

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url)
        }
    }, [selectedProduct])

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);

    }

    const handleAddToCart = () => {

        if (!selectedColor || !selectedSize) {
            toast.error("Please select a size and color before adding to cart.", {
                duration: 2000,
            });
            return;
        }

        setIsButtonDisabled(true);

        // Get the main image URL safely
        const imageUrl = selectedProduct.images?.[0]?.url || "";

        dispatch(
            addToCart({
                // --- Your existing properties ---
                productId: selectedProduct._id,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id,

                // --- ✨ ADD THESE PROPERTIES ---
                images: imageUrl, // Pass the main image URL
            })
        )
            .then(() => {
                toast.success("Product added to cart!", {
                    duration: 1000,
                });
            })
            .finally(() => {
                setIsButtonDisabled(false);
            })
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p className='text-red-500 text-center'>Error: {error}</p>
    }

 return (
        <div className=''>
            {selectedProduct && (
                <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">

                    {/* MAIN PRODUCT LAYOUT: Grid for responsive columns */}
                    {/* Mobile: 1 column stack | Desktop: 3 columns (thumb | main image | details) */}
                    <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] lg:grid-cols-[100px_1.5fr_1fr] gap-6 lg:gap-8 items-start">

                        {/* ✅ 1. LEFT THUMBNAILS (Desktop Only) */}
                        {/* On mobile, it's hidden (as intended). On desktop, it takes the first column. */}
                        <div className="hidden md:flex flex-col space-y-3">
                            {selectedProduct.images.map((image) => (
                                <button
                                    key={image._id || image.url}
                                    onClick={() => setMainImage(image.url)}
                                    className={`w-20 h-20 overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black ${mainImage === image.url ? "border-black shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.altText || selectedProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* ✅ 2. MAIN PRODUCT IMAGE */}
                        {/* Order 1 on mobile to be at the top. On desktop, it takes the second column. */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg md:col-start-2 md:col-end-3 order-1">
                            <img
                                src={mainImage}
                                alt={selectedProduct.name}
                                className='w-full h-full object-top object-cover'
                            />
                        </div>

                        {/* ✅ 3. MOBILE THUMBNAIL SCROLL (Mobile Only) */}
                        {/* Change: Set order-2 on mobile so it's directly below the main image (order-1). */}
                        {/* Removing the original `order-last` and replacing it with explicit `order-2`. */}
                        <div className="md:hidden flex overflow-x-auto space-x-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] order-2">
                            {selectedProduct.images.map((image) => (
                                <button
                                    key={image._id || image.url}
                                    onClick={() => setMainImage(image.url)}
                                    className={`flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black ${mainImage === image.url ? "border-black shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.altText || selectedProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* ✅ 4. PRODUCT DETAILS SECTION (Desktop: third column | Mobile: stacks below thumbnails) */}
                        {/* Change: Set order-3 on mobile so it comes after the image and mobile thumbnails. */}
                        <div className="md:col-start-3 md:col-end-4 flex flex-col order-3">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                {selectedProduct.name}
                            </h1>

                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-2xl text-gray-800 font-semibold">
                                    ${selectedProduct.price}
                                </span>
                                {selectedProduct.originalPrice && (
                                    <span className="text-lg text-gray-500 line-through">
                                        ${selectedProduct.originalPrice}
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {selectedProduct.description}
                            </p>

                            {/* Color Selector */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-800 mb-2">Color:</p>
                                <div className="flex flex-wrap gap-3">
                                    {selectedProduct.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-9 h-9 rounded-full border-2 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-black ${selectedColor === color ? 'ring-2 ring-black ring-offset-2 scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-800 mb-2">Size:</p>
                                <div className="flex flex-wrap gap-3">
                                    {selectedProduct.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                    <button onClick={() => handleQuantityChange("minus")} className='px-4 py-2 text-lg text-gray-600 rounded-l-lg hover:bg-gray-100'>-</button>
                                    <span className='px-5 text-lg font-medium'>{quantity}</span>
                                    <button onClick={() => handleQuantityChange("plus")} className='px-4 py-2 text-lg text-gray-600 rounded-r-lg hover:bg-gray-100'>+</button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={isButtonDisabled}
                                    className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? "cursor-not-allowed opacity-50 " : " hover:bg-gray-900"}`}>
                                    {isButtonDisabled ? "Adding..." : "Add to cart "}
                                </button>
                            </div>


                            {/* Characteristics Table */}
                            <div className="mt-auto pt-6 border-t border-gray-200 text-gray-700">
                                <h3 className="text-lg font-semibold mb-3">Characteristics:</h3>
                                <table className='w-full text-left text-sm text-gray-600'>
                                    <tbody>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2 pr-4 font-medium">Brand</td>
                                            <td className="py-2">{selectedProduct.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Material</td>
                                            <td className="py-2">{selectedProduct.material}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Gender</td>
                                            <td className="py-2">{selectedProduct.gender}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* You May Also Like Section - Spans full width below the three columns on desktop */}
                        {/* Ensure this is order-4 on mobile to come last. */}
                        <div className="md:col-span-3 mt-12 pt-8 border-t border-gray-200 order-4">
                            <h2 className="text-2xl text-center font-bold mb-6">
                                You May Also Like
                            </h2>
                            <ProductGrid products={similarProducts} loading={loading} error={error} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsDetails

}

export default ProductsDetails
