import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { fetchProductsByFilters } from '../redux/Slices/ProductSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const CollectionPages = () => {
    // Router Hooks
    const { collection } = useParams();
    const [searchParams] = useSearchParams();

    // Redux Hooks
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    // State for Sidebar
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Prepare API parameters
    const queryParams = Object.fromEntries([...searchParams]);
    // Get the raw search string for stable dependency array
    const searchString = searchParams.toString();

    /**
     * Effect to fetch products when the collection or filters change.
     * Dependencies: dispatch, collection (from URL path), searchString (from URL query)
     */
    useEffect(() => {
        // Dispatch the fetch action with the collection name and query parameters
        dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    }, [dispatch, collection, searchString]);


    // --- Sidebar Handlers ---
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        // Close the sidebar if the click is outside the sidebar area
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        // Add event listener for clicks
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // --- Helper function for displaying state in the main content area ---
    const renderProductsContent = () => {
        // FIXED: Always show 'Loading...' if a fetch is in progress.
        // This prevents the 'No products found' message from flashing when switching categories.
        if (loading) {
            return <div className="text-center py-10 text-xl font-semibold">Loading...</div>;
        }

        // Show Error if the request failed (and loading is complete)
        if (error) {
            return <div className="text-center py-10 text-xl font-semibold text-red-600">Error: {error}</div>;
        }

        // Show 'No products found' if the fetch returned an empty array
        if (products.length === 0) {
            return <div className="text-center py-10 text-xl text-gray-500">No products found for this filter.</div>;
        }

        // Render the product grid
        return <ProductGrid products={products} />;
    };


    // Helper to format the collection name (e.g., 'mens-shoes' -> 'Mens Shoes')
    const formattedCollectionName = collection
        ? collection.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'All Products';


    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Mobile filter button */}
            <button
                onClick={toggleSidebar}
                className='lg:hidden border p-2 flex justify-center items-center m-4'>
                <FaFilter className='mr-2' /> Filters
            </button>

            {/* Filter sidebar */}
            <div
                ref={sidebarRef}
                // Tailwind classes for fixed position on mobile and static on desktop
                className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 shadow-xl lg:static lg:translate-x-0 lg:shadow-none p-4`} >
                <FilterSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow p-4">
                {/* Dynamically display the collection name */}
                <h2 className="text-2xl uppercase mb-4 font-bold">
                    <Link
                        to="/collections/all"
                        className="cursor-pointer"
                    >
                        {formattedCollectionName} Collection
                    </Link>
                </h2>
                {/* Sort options */}
                <SortOptions />

                {/* Products grid / State messages */}
                {renderProductsContent()}
            </div>
        </div>
    );
};

export default CollectionPages;