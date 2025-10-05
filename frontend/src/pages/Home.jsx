import React, { useEffect } from 'react'
import { useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderSectionCollection from '../components/Products/GenderSectionCollection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductsDetails from '../components/Products/ProductsDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/Slices/ProductSlice'
import axios from 'axios'
import { Link } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState([null]);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Top Wear",
        limit: 8,
      })
    );


    //Fetch best seller products
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        // console.log("Best Seller API Response:", response.data); // <-- Add this line
        setBestSellerProduct(response.data[0]);
      } catch (error) {
        console.error("Error fetching best seller products:", error);
        setBestSellerProduct(null);
      }
    }
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderSectionCollection />
      <NewArrivals />

      {/* best seller */}
      <h2 className="text-3xl text-center font-bold mb-4 ">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductsDetails productId={bestSellerProduct._id} />
      ) : (
        <p className='text-center'>
          Loading best seller products...
        </p>
      )}

      {/* Top wears for women  */}
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  )
}

export default Home


