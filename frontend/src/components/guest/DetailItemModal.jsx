import Overlay from "../common/Overlay";
import imageApi from "../../api/imageApi";
import reviewApi from "../../api/reviewApi";

import { useEffect, useState } from "react";
import { fetchMyCustomerId } from "../../utils/customerUtil";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  Heart,
  Send,
} from "lucide-react";

function DetailItemModal({ item, onClose, onAdd }) {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const id = await fetchMyCustomerId();
        setCustomerId(id);
      } catch (error) {
        console.error("Không lấy được customerId", error);
      }
    };

    fetchCustomerId();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await imageApi.getByItemId(item.itemId);
        setImages(response.result);

        const reviewResponse = await reviewApi.getByItemId(item.itemId);
        setReviews(reviewResponse.result);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [item.itemId]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex];

  const handleAddToCart = async () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleSubmitReview = async () => {
    if (!reviewMessage.trim()) {
      setSubmitError("Vui lòng nhập nội dung đánh giá");
      return;
    }

    if (!customerId) {
      setSubmitError("Vui lòng đăng nhập để đánh giá");
      return;
    }

    setIsSubmittingReview(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await reviewApi.makeReview(customerId, {
        itemId: item.itemId,
        message: reviewMessage.trim(),
      });

      setReviewMessage("");
      setSubmitSuccess(true);

      // Reload reviews
      const reviewResponse = await reviewApi.getByItemId(item.itemId);
      setReviews(reviewResponse.result);

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Không thể gửi đánh giá. Vui lòng thử lại!",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <Overlay onClose={onClose} zindex={60}>
      <div className="z-55 bg-white rounded-2xl shadow-2xl w-full mx-4 max-w-4xl max-h-[95vh] overflow-hidden md:max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header - Mobile first */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-transparent">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate pr-4">
            {item.itemName}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Slideshow Section */}
          <div className="relative bg-linear-to-br from-gray-50 to-gray-100 w-full aspect-square sm:aspect-auto sm:h-96 flex items-center justify-center overflow-hidden group">
            {images.length > 0 && currentImage ? (
              <>
                <img
                  key={currentImageIndex}
                  src={currentImage.url}
                  alt={item.itemName}
                  className="w-full h-full object-cover animate-fade-in duration-300"
                />

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white shadow-lg p-2 sm:p-3 rounded-full hover:scale-110 transition-all duration-200 z-10"
                >
                  <Heart
                    size={20}
                    className={`transition-all duration-200 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  />
                </button>
              </>
            ) : (
              <div className="text-gray-400 text-center">
                <p>No images available</p>
              </div>
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-100 text-gray-800 p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl group-hover:opacity-100 sm:opacity-100"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-100 text-gray-800 p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl group-hover:opacity-100 sm:opacity-100"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 0 && (
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Image Thumbnails - Mobile horizontal scroll */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 sm:p-4 bg-linear-to-r from-gray-50 to-transparent overflow-x-auto scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    idx === currentImageIndex
                      ? "border-blue-500 scale-105 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Product Details */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Category Badge */}
            {item.category && item.category.length > 0 && (
              <div>
                <span className="inline-block bg-linear-to-r from-blue-100 to-blue-50 text-blue-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full border border-blue-200">
                  {item.category[0].categoryName}
                </span>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Price Section */}
            <div className="pt-2 sm:pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Giá</p>
              <p className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price)}
              </p>
            </div>

            {/* Status & Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              <div className="bg-linear-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl border border-green-200">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Trạng thái
                </p>
                <p
                  className={`text-base sm:text-lg font-bold mt-1 ${
                    item.status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.status ? "Còn hàng" : "Hết hàng"}
                </p>
              </div>
              <div className="bg-linear-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-xl border border-orange-200">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Đã bán
                </p>
                <p className="text-base sm:text-lg font-bold text-orange-600 mt-1">
                  {item.quantitySold}
                </p>
              </div>
            </div>

            {/* Write Review Section */}
            <div className="pt-4 sm:pt-6 border-t border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Viết đánh giá
              </h3>
              <div className="space-y-3">
                <textarea
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  rows="4"
                  disabled={isSubmittingReview}
                />

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                    ✓ Đánh giá của bạn đã được gửi thành công!
                  </div>
                )}

                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview || !reviewMessage.trim()}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-2 sm:py-3 rounded-xl transition-all duration-200 text-white text-sm sm:text-base ${
                    isSubmittingReview || !reviewMessage.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg active:scale-95"
                  }`}
                >
                  <Send size={18} className="sm:w-5 sm:h-5" />
                  <span>
                    {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </span>
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="pt-4 sm:pt-6 border-t border-gray-100">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                  Đánh giá ({reviews.length})
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.reviewId}
                      className="bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Customer Name and Date */}
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {review.customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      {/* Review Message */}
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {review.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Sticky */}
        <div className="p-4 sm:p-6 bg-linear-to-t from-white via-white to-transparent border-t border-gray-100 flex gap-3">
          <button
            onClick={onAdd}
            disabled={isAdding || !item.status}
            className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform text-white text-sm sm:text-base ${
              isAdding
                ? "scale-95 bg-blue-700"
                : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg active:scale-95"
            } ${!item.status ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ShoppingCart size={20} className="sm:w-5 sm:h-5" />
            <span>{isAdding ? "Đang thêm..." : "Thêm vào giỏ"}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 sm:py-4 rounded-xl transition-all duration-200 text-sm sm:text-base"
          >
            Đóng
          </button>
        </div>
      </div>
    </Overlay>
  );
}

export default DetailItemModal;
