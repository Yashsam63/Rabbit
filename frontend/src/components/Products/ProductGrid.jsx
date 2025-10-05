// In ProductGrid.jsx

import React from 'react'
import { Link } from 'react-router-dom'

// ✅ FIX: Set a default value for the products prop
function ProductGrid({ products = [], loading, error }) {
    if (loading) {
        return <p className='text-center'>Loading ...</p>
    }
    if (error) {
        return <p className='text-red-500 text-center'>Error: {error}</p>
    }

    // ✅ This extra check makes the component even safer
    if (!products || products.length === 0) {
        return <p className='text-center'>No products found.</p>;
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="block">
                    <div className="bg-white p-4 rounded-lg">
                        <div className="w-full h-96 mb-4 overflow-hidden">
                            <img
                                src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.name}
                                className="w-full h-full object-cover object-top rounded-lg"
                            />
                        </div>
                        <h3 className="text-sm mb-2">{product.name}</h3>
                        <p className="text-gray-500 font-medium text-sm tracking-tighter">
                            ${product.price}
                        </p>
                    </div>
                </Link>
            ))}
        </div>

    )
}

export default ProductGrid