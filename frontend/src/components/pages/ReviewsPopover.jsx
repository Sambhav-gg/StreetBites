// // import React from 'react';
// // import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';

// // const ReviewsPopover = ({ reviews }) => {
// //   return (
// //     <Dialog>
// //       <DialogTrigger asChild>
// //         <Button variant="outline">View Reviews</Button>
// //       </DialogTrigger>
// //       <DialogContent className="max-h-[80vh] overflow-y-auto bg-white rounded-lg p-4">
// //         <h2 className="text-xl font-bold mb-4">User Reviews</h2>
// //         {reviews.length === 0 ? (
// //           <p className="text-gray-500">No reviews yet.</p>
// //         ) : (
// //           <ul className="space-y-4">
// //             {reviews.map((rev, index) => (
// //               <li key={index} className="border p-3 rounded-md shadow-sm">
// //                 <p className="font-semibold text-gray-800">{rev.user?.name || "Anonymous"}</p>
// //                 <p className="text-sm text-gray-600">{rev.comment}</p>
// //                 <p className="text-yellow-500 mt-1">⭐ {rev.rating}</p>
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // export default ReviewsPopover;
// import React, { useRef, useState, useEffect } from 'react';
// import { Dialog, DialogTrigger, DialogContent,DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const getEmoji = (rating) => {
//   if (rating >= 4) return '⭐';
//   if (rating === 3) return '😐';
//   return '😞';
// };

// const ReviewsPopover = ({ stallId, reviews = [], onReviewAdded }) => {
//   console.log("✅ stallId received in ReviewsPopover:", stallId);
//   const [comment, setComment] = useState('');
//   const [rating, setRating] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const { user } = useSelector((state) => state.auth);
//   const bottomRef = useRef(null);

//   const handleReviewSubmit = async () => {
//     if (!comment || !rating) return toast.error('Fill all fields');
//     if (!user) return toast.error('You must be logged in');

//     try {
      
//       console.log('Submitting review with:', { comment, rating, stallId });

//       setSubmitting(true);
//       await axios.post(
//         `/api/reviews`,
//         { comment, rating: Number(rating), stallId },
//         { withCredentials: true }
//       );
//       console.log('Submitting review with:', { comment, rating, stallId });


//       toast.success('Review added!');
//       setComment('');
//       setRating('');
//       onReviewAdded && onReviewAdded();

//       // Auto-scroll to bottom after a delay (wait for new review to load)
//       setTimeout(() => {
//         bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 500);
//     } catch (err) {
//       if (err.response?.status === 400 && err.response?.data?.message === 'You have already reviewed this stall') {
//         toast.error("You have already reviewed this stall.");
//       } else {
//         toast.error(err.response?.data?.message || 'Failed to submit review');
//       }
//     }
//     finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">View Reviews</Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto bg-white rounded-lg p-4">
//       <DialogTitle className="text-xl font-bold mb-4">User Reviews</DialogTitle>

//         {/* Existing Reviews */}
//         {reviews.length === 0 ? (
//           <p className="text-gray-500">No reviews yet.</p>
//         ) : (
//           <ul className="space-y-4 mb-6">
//             {reviews.map((rev, index) => (
//               <li key={index} className="border p-3 rounded-md shadow-sm flex gap-3">
//                 <img
//                   src={rev.user?.profilePhoto || '/avatar.png'}
//                   alt="user"
//                   className="h-10 w-10 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {rev.user?.name || 'Anonymous'}
//                   </p>
//                   <p className="text-sm text-gray-600">{rev.comment}</p>
//                   <p className="text-yellow-500 mt-1">
//                     {getEmoji(rev.rating)} {rev.rating}
//                   </p>
//                 </div>
//               </li>
//             ))}
//             <div ref={bottomRef} />
//           </ul>
//         )}

//         {/* Add Review Form */}
//         <div className="border-t pt-4">
//           <h3 className="font-bold mb-2">Add Your Review</h3>
//           <Textarea
//             placeholder="Your review"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="mb-2"
//           />
//           <Input
//             type="number"
//             placeholder="Rating (1-5)"
//             min={1}
//             max={5}
//             value={rating}
//             onChange={(e) => setRating(e.target.value)}
//             className="mb-2"
//           />
//           <Button
//             onClick={handleReviewSubmit}
//             disabled={submitting}
//             className="w-full bg-red-500 hover:bg-red-600 text-white"
//           >
//             {submitting ? 'Submitting...' : 'Submit Review'}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ReviewsPopover;






// import React, { useRef, useState, useEffect } from 'react';
// import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const getEmoji = (rating) => {
//   if (rating >= 4) return '⭐';
//   if (rating === 3) return '😐';
//   return '😞';
// };

// const ReviewsPopover = ({ stallId, reviews = [], onReviewAdded }) => {
//   const [comment, setComment] = useState('');
//   const [rating, setRating] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [hasReviewed, setHasReviewed] = useState(false); // ✅ NEW
//   const { user } = useSelector((state) => state.auth);
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     if (user && reviews.length > 0) {
//       const alreadyReviewed = reviews.some((rev) => rev.user?._id === user._id);
//       setHasReviewed(alreadyReviewed);
//     }
//   }, [reviews, user]);

//   const handleReviewSubmit = async () => {
//     if (!comment || !rating) return toast.error('Fill all fields');
//     if (!user) return toast.error('You must be logged in');

//     try {
//       setSubmitting(true);
//       await axios.post(
//         `/api/reviews`,
//         { comment, rating: Number(rating), stallId },
//         { withCredentials: true }
//       );

//       toast.success('Review added!');
//       setComment('');
//       setRating('');
//       onReviewAdded && onReviewAdded();
//       setHasReviewed(true); // ✅ mark after submit

//       // Auto-scroll to bottom
//       setTimeout(() => {
//         bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 500);
//     } catch (err) {
//       if (err.response?.status === 400 && err.response.data.message === 'You have already reviewed this stall') {
//         toast.error('You have already reviewed this stall.');
//         setHasReviewed(true); // Just in case
//       } else {
//         toast.error(err.response?.data?.message || 'Failed to submit review');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">View Reviews</Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto bg-white rounded-lg p-4">
//         <DialogTitle className="text-xl font-bold mb-4">User Reviews</DialogTitle>

//         {/* Reviews List */}
//         {reviews.length === 0 ? (
//           <p className="text-gray-500">No reviews yet.</p>
//         ) : (
//           <ul className="space-y-4 mb-6">
//             {reviews.map((rev, index) => (
//               <li key={index} className="border p-3 rounded-md shadow-sm flex gap-3">
//                 <img
//                   src={rev.user?.profilePhoto || '/avatar.png'}
//                   alt="user"
//                   className="h-10 w-10 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {rev.user?.name || 'Anonymous'}
//                   </p>
//                   <p className="text-sm text-gray-600">{rev.comment}</p>
//                   <p className="text-yellow-500 mt-1">
//                     {getEmoji(rev.rating)} {rev.rating}
//                   </p>
//                 </div>
//               </li>
//             ))}
//             <div ref={bottomRef} />
//           </ul>
//         )}

//         {/* Review Form */}
//         {!user ? (
//           <p className="text-sm text-red-500">Login to write a review</p>
//         ) : hasReviewed ? (
//           <p className="text-sm text-green-600 font-medium">
//             ✅ You have already reviewed this stall.
//           </p>
//         ) : (
//           <div className="border-t pt-4">
//             <h3 className="font-bold mb-2">Add Your Review</h3>
//             <Textarea
//               placeholder="Your review"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               className="mb-2"
//             />
//             <Input
//               type="number"
//               placeholder="Rating (1-5)"
//               min={1}
//               max={5}
//               value={rating}
//               onChange={(e) => setRating(e.target.value)}
//               className="mb-2"
//             />
//             <Button
//               onClick={handleReviewSubmit}
//               disabled={submitting}
//               className="w-full bg-red-500 hover:bg-red-600 text-white"
//             >
//               {submitting ? 'Submitting...' : 'Submit Review'}
//             </Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ReviewsPopover;


import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, MessageCircle, User, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';

const getEmoji = (rating) => {
  if (rating >= 5) return '🤩';
  if (rating >= 4) return '⭐';
  if (rating >= 3) return '😊';
  if (rating >= 2) return '😐';
  return '😞';
};

const getRatingText = (rating) => {
  if (rating >= 5) return 'Amazing!';
  if (rating >= 4) return 'Great!';
  if (rating >= 3) return 'Good';
  if (rating >= 2) return 'Okay';
  return 'Poor';
};

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(0)}
          className={`${
            readonly ? 'cursor-default' : 'cursor-pointer'
          } transition-colors duration-200`}
          disabled={readonly}
        >
          <Star
            size={readonly ? 16 : 24}
            className={`${
              star <= (hoveredRating || rating)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            } transition-colors duration-200`}
          />
        </motion.button>
      ))}
    </div>
  );
};

const ReviewsPopover = ({ stallId, reviews = [], onReviewAdded }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const alreadyReviewed = reviews.some((rev) => rev.user?._id === user._id);
      setHasReviewed(alreadyReviewed);
    }
  }, [reviews, user]);

  const handleReviewSubmit = async () => {
    if (!comment.trim()) return toast.error('Please write a comment');
    if (!rating) return toast.error('Please select a rating');
    if (!user) return toast.error('You must be logged in');

    try {
      setSubmitting(true);
      await axios.post(
        `/api/reviews`,
        { comment: comment.trim(), rating: Number(rating), stallId },
        { withCredentials: true }
      );

      toast.success('Review added successfully! 🎉');
      setComment('');
      setRating(0);
      onReviewAdded && onReviewAdded();
      setHasReviewed(true);

      // Auto-scroll to bottom
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.message === 'You have already reviewed this stall') {
        toast.error('You have already reviewed this stall.');
        setHasReviewed(true);
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 border-2 border-blue-400"
        >
          <MessageCircle size={20} />
          View Reviews ({reviews.length})
        </motion.button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-lg shadow-2xl rounded-3xl p-0 border-2 border-white/50 overflow-hidden">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <DialogTitle className="text-3xl font-black flex items-center gap-3 mb-2">
                💬 Reviews & Ratings
              </DialogTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(averageRating)} readonly />
                  <span className="text-xl font-bold">{averageRating}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1">
                  <span className="font-semibold">{reviews.length} reviews</span>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-2 right-4 text-4xl opacity-20">⭐</div>
            <div className="absolute bottom-2 left-4 text-3xl opacity-20">💬</div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Reviews List */}
            {reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">💭</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Be the first to share your experience and help others discover this amazing stall!
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 mb-6"
              >
                {reviews.map((rev, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, x: 5 }}
                    className="bg-gradient-to-r from-white/70 to-blue-50/50 backdrop-blur-sm border-2 border-white/50 hover:border-blue-200 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={
                          rev.user?.profilePhoto || 
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.user?.name || 'Anonymous')}`
                        }
                        alt="user"
                        className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {rev.user?.name || 'Anonymous'}
                          </h4>
                          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                            <span className="text-lg">{getEmoji(rev.rating)}</span>
                            <span>{rev.rating}/5</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <StarRating rating={rev.rating} readonly />
                          <span className="ml-2 text-sm font-semibold text-gray-600">
                            {getRatingText(rev.rating)}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed font-medium bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                          "{rev.comment}"
                        </p>
                        
                        {rev.createdAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(rev.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </motion.div>
            )}

            {/* Review Form */}
            {!user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 text-center"
              >
                <User className="mx-auto mb-3 text-red-500" size={32} />
                <h3 className="text-xl font-bold text-red-700 mb-2">Login Required</h3>
                <p className="text-red-600 font-medium">Please login to write a review and share your experience!</p>
              </motion.div>
            ) : hasReviewed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center"
              >
                <CheckCircle className="mx-auto mb-3 text-green-600" size={32} />
                <h3 className="text-xl font-bold text-green-700 mb-2">Review Submitted!</h3>
                <p className="text-green-600 font-medium">
                  ✅ Thank you for sharing your experience! You can only review each stall once.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg border-2 border-white/50 rounded-2xl p-6 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  ✍️ Share Your Experience
                </h3>
                
                <div className="space-y-4">
                  {/* Rating Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      How would you rate this stall?
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-white/50 rounded-xl border border-orange-200">
                      <StarRating rating={rating} onRatingChange={setRating} />
                      {rating > 0 && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-lg font-bold text-orange-600 flex items-center gap-2"
                        >
                          {getEmoji(rating)} {getRatingText(rating)}
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tell us about your experience
                    </label>
                    <Textarea
                      placeholder="Share your thoughts about the food, service, and overall experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-24 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 resize-none"
                      maxLength={500}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {comment.length}/500 characters
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReviewSubmit}
                    disabled={submitting || !comment.trim() || !rating}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg ${
                      submitting || !comment.trim() || !rating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl border-2 border-orange-400'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Submitting Review...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit Review 🚀
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #6366f1 #e0e7ff;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #e0e7ff;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #6366f1;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #4f46e5;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewsPopover;