import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { bookingsAPI, adminAPI } from '../utils/api';
import { FaUser, FaStar, FaArrowLeft, FaQuoteLeft } from 'react-icons/fa';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { motion } from 'framer-motion';

function ProviderProfile() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const reviewsData = await bookingsAPI.getProviderReviews(id);
                if (reviewsData.success) {
                    setReviews(reviewsData.reviews);
                    setStats(reviewsData.stats);
                }



            } catch (err) {
                setError('Failed to load profile');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/dashboard">
                        <Button variant="primary">Go Back</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center text-neutral-600 hover:text-primary-600 mb-8 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                </Link>

                {/* Profile Header */}
                <Card className="p-8 mb-8 border-t-4 border-t-primary-500">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                            <FaUser className="text-5xl text-primary-400" />
                            {/* If we had an avatar URL, we'd show it here */}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">
                                Service Provider
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-800">
                                    <FaStar className="text-yellow-500 mr-2" />
                                    <span className="font-bold">{stats.averageRating.toFixed(1)}</span>
                                    <span className="mx-1">•</span>
                                    <span>{stats.totalReviews} Reviews</span>
                                </div>
                            </div>
                            <p className="text-neutral-600 max-w-lg">
                                Certified Service Provider at ServEase using our platform to deliver quality home and care services.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Reviews List */}
                <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-heading">Client Reviews</h2>

                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaStar className="text-2xl text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-1">No reviews yet</h3>
                        <p className="text-neutral-500">This provider hasn't received any reviews yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                {review.user?.name?.charAt(0) || <FaUser />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-neutral-900">{review.user?.name || 'Anonymous Client'}</h3>
                                                    <p className="text-sm text-neutral-400">
                                                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex text-yellow-400 text-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-neutral-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.review && (
                                                <div className="bg-neutral-50 rounded-lg p-4 relative mt-3">
                                                    <FaQuoteLeft className="text-neutral-200 absolute top-2 left-2 text-xl" />
                                                    <p className="text-neutral-700 relative z-10 pl-6 italic">
                                                        "{review.review}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProviderProfile;
