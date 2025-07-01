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






import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';

const getEmoji = (rating) => {
  if (rating >= 4) return '⭐';
  if (rating === 3) return '😐';
  return '😞';
};

const ReviewsPopover = ({ stallId, reviews = [], onReviewAdded }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); // ✅ NEW
  const { user } = useSelector((state) => state.auth);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const alreadyReviewed = reviews.some((rev) => rev.user?._id === user._id);
      setHasReviewed(alreadyReviewed);
    }
  }, [reviews, user]);

  const handleReviewSubmit = async () => {
    if (!comment || !rating) return toast.error('Fill all fields');
    if (!user) return toast.error('You must be logged in');

    try {
      setSubmitting(true);
      await axios.post(
        `/api/reviews`,
        { comment, rating: Number(rating), stallId },
        { withCredentials: true }
      );

      toast.success('Review added!');
      setComment('');
      setRating('');
      onReviewAdded && onReviewAdded();
      setHasReviewed(true); // ✅ mark after submit

      // Auto-scroll to bottom
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.message === 'You have already reviewed this stall') {
        toast.error('You have already reviewed this stall.');
        setHasReviewed(true); // Just in case
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Reviews</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white rounded-lg p-4">
        <DialogTitle className="text-xl font-bold mb-4">User Reviews</DialogTitle>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {reviews.map((rev, index) => (
              <li key={index} className="border p-3 rounded-md shadow-sm flex gap-3">
                <img
                  src={rev.user?.profilePhoto || '/avatar.png'}
                  alt="user"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {rev.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">{rev.comment}</p>
                  <p className="text-yellow-500 mt-1">
                    {getEmoji(rev.rating)} {rev.rating}
                  </p>
                </div>
              </li>
            ))}
            <div ref={bottomRef} />
          </ul>
        )}

        {/* Review Form */}
        {!user ? (
          <p className="text-sm text-red-500">Login to write a review</p>
        ) : hasReviewed ? (
          <p className="text-sm text-green-600 font-medium">
            ✅ You have already reviewed this stall.
          </p>
        ) : (
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Add Your Review</h3>
            <Textarea
              placeholder="Your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-2"
            />
            <Input
              type="number"
              placeholder="Rating (1-5)"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mb-2"
            />
            <Button
              onClick={handleReviewSubmit}
              disabled={submitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewsPopover;
