// /client/src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchCategories,
  fetchActivePromotions,
  selectFeaturedProducts,
  selectNewArrivals,
  selectCategories,
  selectPromotions,
  selectHomeLoading,
} from '../store/homeSlice';
import HeroBanner from '../components/home/HeroBanner';
import CategoryMenu from '../components/home/CategoryMenu';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewArrivals from '../components/home/NewArrivals';

export default function HomePage() {
  const dispatch = useDispatch();
  const featured = useSelector(selectFeaturedProducts);
  const newArrivals = useSelector(selectNewArrivals);
  const categories = useSelector(selectCategories);
  const promotions = useSelector(selectPromotions);
  const loading = useSelector(selectHomeLoading);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchNewArrivals());
    dispatch(fetchCategories());
    dispatch(fetchActivePromotions());
  }, [dispatch]);

  const heroPromotion = promotions[0] || {
    title: 'Welcome to HomeNest',
    description: 'Discover amazing products',
    image: 'https://via.placeholder.com/1200x400',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroBanner
          imageUrl={heroPromotion.image}
          title={heroPromotion.title}
          subtitle={heroPromotion.description}
          ctaText={heroPromotion.ctaText}
          ctaLink={heroPromotion.ctaLink}
        />

        <CategoryMenu categories={categories} loading={loading} />

        <FeaturedProducts products={featured} loading={loading} />

        <NewArrivals products={newArrivals} loading={loading} />
      </div>
    </div>
  );
}
