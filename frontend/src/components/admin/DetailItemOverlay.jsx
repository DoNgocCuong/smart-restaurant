import { useEffect, useState } from "react";
import { X, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Overlay from "../common/Overlay";
import UpdateItemOverlay from "./UpdateItemOverlay";
import UploadImagesOverlay from "./UploadImagesOverlay";

import modifierGroupApi from "../../api/modifierGroupApi";
import imageApi from "../../api/imageApi";

function DetailItemOverlay({ item, onClose, onUpdate }) {
  const [modifierGroups, setModifierGroups] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);
  const [showUploadImages, setShowUploadImages] = useState(false);

  /* ================= FETCH MODIFIER GROUPS ================= */
  useEffect(() => {
    const fetchModifierGroups = async () => {
      if (!item?.modifierGroupId?.length) return;

      try {
        const results = await Promise.all(
          item.modifierGroupId.map(async (id) => {
            const res = await modifierGroupApi.findById(id);
            return res.result;
          }),
        );
        setModifierGroups(results);
      } catch (err) {
        console.error("Fetch modifier groups failed:", err);
      }
    };

    fetchModifierGroups();
  }, [item]);

  /* ================= FETCH IMAGES ================= */
  const fetchImages = async () => {
    if (!item?.itemId) return;

    try {
      const res = await imageApi.getByItemId(item.itemId);
      setImages(res?.result || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Fetch images failed:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [item]);

  if (!item) return null;

  /* ================= SLIDESHOW DATA ================= */
  const allImages = Array.isArray(images) ? images : [];

  /* ================= SLIDESHOW CONTROLS ================= */
  const changeSlide = (nextIndex) => {
    if (animating || nextIndex === currentIndex) return;

    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setAnimating(false);
    }, 0);
  };

  const handlePrev = () => {
    changeSlide(currentIndex === 0 ? allImages.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    changeSlide(currentIndex === allImages.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <>
      <Overlay onClose={onClose}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col border border-blue-100">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-7 py-4 sm:py-5 shadow-sm border-b-2 border-blue-100 bg-linear-to-r from-blue-50 to-white shrink-0 rounded-t-3xl">
            <h2 className="text-lg sm:text-xl font-bold ">Thông tin món ăn</h2>

            <button
              onClick={onClose}
              className="
                w-9 h-9
                flex items-center justify-center
                rounded-xl
                text-gray-400
                hover:bg-red-100 hover:text-red-600
                transition-all duration-300
                cursor-pointer
              "
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
            {/* ================= SLIDESHOW ================= */}
            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-md group h-48 sm:h-56 lg:h-64 bg-gray-100">
              {allImages.length === 0 ? (
                <img
                  src="https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                  alt="item"
                  className="w-full h-full object-cover"
                />
              ) : (
                allImages.map((img, idx) => (
                  <img
                    key={img.id || img.url}
                    src={
                      img.url ||
                      "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                    }
                    alt="item"
                    className={`
                      absolute inset-0 w-full h-full object-cover
                      transition-all duration-300 ease-in-out
                      ${
                        idx === currentIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }
                    `}
                  />
                ))
              )}

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="
                      absolute left-2 top-1/2 -translate-y-1/2
                      bg-black/50 hover:bg-black/70
                      text-white
                      w-9 h-9 sm:w-10 sm:h-10
                      rounded-full
                      flex items-center justify-center
                      transition-all duration-300
                      cursor-pointer
                      shadow-md
                    "
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>

                  <button
                    onClick={handleNext}
                    className="
                      absolute right-2 top-1/2 -translate-y-1/2
                      bg-black/50 hover:bg-black/70
                      text-white
                      w-9 h-9 sm:w-10 sm:h-10
                      rounded-full
                      flex items-center justify-center
                      transition-all duration-300
                      cursor-pointer
                      shadow-md
                    "
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => changeSlide(idx)}
                        className={`
                          h-2 rounded-full
                          transition-all duration-300
                          cursor-pointer
                          ${
                            idx === currentIndex
                              ? "bg-white w-6 shadow-md"
                              : "bg-white/60 w-2 hover:bg-white/80"
                          }
                        `}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ================= ITEM INFO ================= */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
              {/* ===== LEFT: ITEM INFO ===== */}
              <div className="flex flex-col gap-3 flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {item.itemName}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
                <div className="text-2xl font-bold text-blue-600">
                  {item.price?.toLocaleString()} ₫
                </div>
              </div>

              {/* ===== RIGHT: ACTION BUTTONS ===== */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowUploadImages(true)}
                  className="
                    flex justify-center items-center gap-2
                    px-4 py-2.5
                    bg-linear-to-r from-emerald-600 to-emerald-700
                    text-white
                    rounded-xl
                    hover:from-emerald-700 hover:to-emerald-800
                    text-sm
                    font-medium
                    transition-all duration-300
                    cursor-pointer
                    border-2 border-emerald-600
                    shadow-sm
                  "
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>Ảnh</span>
                </button>

                <button
                  onClick={() => setShowUpdate(true)}
                  className="
                    flex items-center justify-center gap-2
                    px-4 py-2.5
                    bg-linear-to-r from-blue-600 to-blue-700
                    text-white
                    rounded-xl
                    hover:from-blue-700 hover:to-blue-800
                    text-sm
                    font-medium
                    transition-all duration-300
                    cursor-pointer
                    border-2 border-blue-600
                    shadow-sm
                  "
                >
                  <Pencil size={18} strokeWidth={2.5} />
                  <span>Cập nhật</span>
                </button>
              </div>
            </div>

            {/* ================= CATEGORY ================= */}
            {item.category?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-blue-700 mb-3 text-sm">
                  Danh mục
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.category.map((cat) => (
                    <span
                      key={cat.categoryId}
                      className="
                        px-4 py-2
                        bg-linear-to-r from-blue-100 to-blue-50
                        text-blue-700
                        rounded-full
                        text-sm
                        font-medium
                        border border-blue-200
                      "
                    >
                      {cat.categoryName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ================= MODIFIER GROUPS ================= */}
            {modifierGroups.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent mb-4">
                  Tùy chọn thêm
                </h3>

                <div className="flex flex-col gap-4">
                  {modifierGroups.map((group) => (
                    <div
                      key={group.modifierGroupId}
                      className="
                        border-2 border-blue-100
                        rounded-2xl
                        p-4 sm:p-5
                        bg-linear-to-br from-blue-50 to-white
                        hover:border-blue-200 hover:shadow-md
                        transition-all duration-300
                      "
                    >
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <span className="font-bold text-gray-800 text-base">
                          {group.name}
                        </span>
                        <span className="text-xs font-medium text-blue-600 italic bg-blue-100 px-2 py-1 rounded-lg">
                          {group.selectionType === "SINGLE"
                            ? "Chọn 1"
                            : "Chọn nhiều"}
                          {group.isRequired && " • Bắt buộc"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {group.options?.map((opt) => (
                          <div
                            key={opt.modifierOptionId}
                            className="
                              border-2 border-blue-200
                              bg-white
                              rounded-xl
                              px-3 sm:px-4 py-2
                              text-sm
                              font-medium
                              flex gap-2
                              hover:border-blue-300
                              transition-colors duration-200
                            "
                          >
                            <span className="text-gray-800">{opt.name}</span>
                            <span className="text-blue-600 font-semibold">
                              +{opt.price?.toLocaleString()}₫
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Overlay>

      {/* ================= UPDATE ITEM ================= */}
      {showUpdate && (
        <UpdateItemOverlay
          item={item}
          modifierGroups={modifierGroups}
          onClose={() => setShowUpdate(false)}
          onUpdate={onUpdate}
        />
      )}

      {/* ================= UPLOAD IMAGES ================= */}
      {showUploadImages && (
        <UploadImagesOverlay
          itemId={item.itemId}
          onClose={() => setShowUploadImages(false)}
          onSuccess={async () => {
            await fetchImages();
            setShowUploadImages(false);
          }}
        />
      )}
    </>
  );
}

export default DetailItemOverlay;
