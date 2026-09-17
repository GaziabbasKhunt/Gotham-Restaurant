import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenuItemById } from '../services/menuService';
import { getMenuItemReviews } from '../services/reviewService';
import { MenuItem, Review } from '../types';
import { Loading } from '../components/common/Loading';
import { ErrorComponent } from '../components/common/ErrorComponent';
import { ReviewForm } from '../components/review/ReviewForm';
import { useCart } from '../hooks/useCart';
import { ArrowLeft, Leaf, Clock, Star, CheckCircle, ShoppingBag, Plus, Minus, MessageSquare } from 'lucide-react';

export const MenuDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);

  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const fetchDishAndReviews = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      
      const [itemRes, reviewRes] = await Promise.all([
        getMenuItemById(id),
        getMenuItemReviews(id)
      ]);

      if (itemRes.data) setItem(itemRes.data);
      if (reviewRes.data) setReviews(reviewRes.data);
      if (reviewRes.meta?.avgRating) setAvgRating(reviewRes.meta.avgRating as number);
    } catch (err) {
      setError((err as Error).message || 'Failed to load dish details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishAndReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      addItem(item, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    }
  };

  if (loading) return <Loading message="Preparing dish details & reviews..." fullScreen />;
  if (error || !item) {
    return (
      <div className="py-16">
        <ErrorComponent title="Dish Not Found" message={error || 'Requested menu item does not exist'} />
      </div>
    );
  }

  const categoryName = typeof item.category === 'object' ? item.category?.name : 'Gotham Gourmet';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back Link */}
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold-400 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Full Menu
      </Link>

      {/* Main Grid */}
      <div className="glass-card rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left: Dish Image */}
        <div className="relative min-h-[350px] lg:min-h-[500px] w-full bg-dark-800">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {item.isVegetarian && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold uppercase backdrop-blur-md">
                <Leaf className="w-3.5 h-3.5" /> Vegetarian
              </span>
            )}
            {item.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-500 text-black text-xs font-bold uppercase shadow-md">
                <Star className="w-3.5 h-3.5 fill-current" /> Chef Special
              </span>
            )}
          </div>
        </div>

        {/* Right: Details & Order Controls */}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 text-xs font-semibold uppercase tracking-widest">
                {categoryName}
              </span>
              {avgRating > 0 && (
                <div className="flex items-center gap-1 text-gold-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" /> {avgRating} ({reviews.length} reviews)
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-100">{item.name}</h1>
            
            <p className="text-3xl font-serif font-bold text-gold-gradient">
              ₹{item.price}
            </p>

            <p className="text-gray-300 text-sm leading-relaxed font-light">
              {item.description}
            </p>

            {/* Quick Meta Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div className="bg-dark-900/60 p-3.5 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500">Preparation Time</p>
                <p className="text-sm font-bold text-gray-200 flex items-center gap-1.5 mt-1">
                  <Clock className="w-4 h-4 text-gold-500" /> {item.preparationTime || 20} minutes
                </p>
              </div>

              <div className="bg-dark-900/60 p-3.5 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500">Stock Availability</p>
                <p className={`text-sm font-bold mt-1 ${item.isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.isAvailable ? 'In Stock & Ready' : 'Currently Out of Stock'}
                </p>
              </div>
            </div>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ingredients & Seasonings</h4>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-800 text-gray-300 text-xs border border-gray-800"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-gold-500" /> {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-6 border-t border-gray-800">
            {addedToast && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-400 text-xs font-semibold text-center">
                Added {quantity} × {item.name} to cart!
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center bg-dark-900 border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-gray-400 hover:text-gold-400 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-gray-100 text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-gray-400 hover:text-gold-400 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:brightness-110 transition duration-200 gold-glow shadow-xl flex items-center justify-center gap-3 text-base disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" /> Add {quantity} to Order — ₹{item.price * quantity}
            </button>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-8 pt-8 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-gold-500" /> Customer Reviews ({reviews.length})
          </h2>
        </div>

        {/* Review Form */}
        {id && <ReviewForm menuItemId={id} onReviewAdded={fetchDishAndReviews} />}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No reviews posted yet for this dish. Be the first to share your review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="glass-card rounded-xl p-5 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-200 text-sm">
                    {typeof rev.user === 'object' ? rev.user.name : 'Customer'}
                  </span>
                  <div className="flex items-center gap-1 text-gold-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-gray-700'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-gray-500">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
