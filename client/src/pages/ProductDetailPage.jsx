// /client/src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductById,
  fetchProducts,
  selectSelectedProduct,
  selectSelectedProductLoading,
  selectSelectedProductError,
  selectProducts,
} from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import ImageGallery from '../components/product/ImageGallery';
import QuantitySelector from '../components/product/QuantitySelector';
import ProductCard from '../components/common/ProductCard';

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
        Out of Stock
      </span>
    );
  }
  if (stock <= 10) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
        Low Stock — only {stock} left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
      In Stock
    </span>
  );
}

function StarRating({ rating = 0, reviews = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-400 text-lg">
        {'★'.repeat(full)}
        {half ? '½' : ''}
        <span className="text-gray-300">{'★'.repeat(empty)}</span>
      </div>
      <span className="text-sm text-gray-500">({reviews} reviews)</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectSelectedProductLoading);
  const error = useSelector(selectSelectedProductError);
  const allProducts = useSelector(selectProducts);

  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(id));
    setQuantity(1);
  }, [dispatch, id]);

  // Fetch related products when we know the category
  useEffect(() => {
    if (product?.category?._id) {
      dispatch(fetchProducts({ category: product.category._id, limit: 4 }));
    }
  }, [dispatch, product?.category?._id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    dispatch(addToCart({ product, quantity }));
    showToast(`${product.name} added to cart!`);
  };

  const relatedProducts = allProducts.filter((p) => p._id !== id).slice(0, 4);

  // Build image list: prefer images array, fall back to single image field
  const images =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  // --- Loading state ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // --- AC-PROD-02: 404 / error state ---
  if (error || (!loading && !product)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">
            {error || "We couldn't find this product. It may have been removed or the link is incorrect."}
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            ← Back to Product Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification — AC-PROD-10 */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* AC-PROD-12: Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              {/* Clicking category navigates to catalog pre-filtered by that category */}
              <Link
                to={`/products?category=${product.category._id}`}
                className="hover:text-blue-600"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: AC-PROD-03, AC-PROD-04 — Image Gallery */}
            <div>
              <ImageGallery images={images} name={product.name} />
            </div>

            {/* Right: Product info */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                {/* Category tag */}
                {product.category && (
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {product.category.name}
                  </span>
                )}

                {/* AC-PROD-01: Name */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

                {/* Rating */}
                <StarRating rating={product.rating} reviews={product.reviews} />

                {/* Price */}
                <p className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</p>

                {/* AC-PROD-05 / AC-PROD-06 / AC-PROD-07: Stock badge */}
                <StockBadge stock={product.stock} />

                <hr className="border-gray-100" />

                {/* AC-PROD-01: Description */}
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Cart actions — only show if in stock */}
              <div className="mt-6 space-y-4">
                {product.stock > 0 ? (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      {/* AC-PROD-08, AC-PROD-09: QuantitySelector */}
                      <QuantitySelector
                        value={quantity}
                        min={1}
                        max={product.stock}
                        onChange={setQuantity}
                      />
                    </div>

                    {/* AC-PROD-10: Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-base font-semibold hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      Add to Cart
                    </button>
                  </>
                ) : (
                  /* AC-PROD-07: Disabled when out of stock */
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl text-base font-semibold cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}

                {/* Wishlist placeholder (Module 17) */}
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl text-base font-medium hover:bg-gray-50 transition">
                  ♡ Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full description section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase mb-1">Category</p>
              <p className="font-medium">{product.category?.name || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase mb-1">Rating</p>
              <p className="font-medium">{product.rating} / 5</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase mb-1">Reviews</p>
              <p className="font-medium">{product.reviews}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase mb-1">Stock</p>
              <p className="font-medium">{product.stock} units</p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  price={p.price}
                  image={p.image}
                  rating={p.rating}
                  stock={p.stock}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
