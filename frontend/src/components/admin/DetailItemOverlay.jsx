import { useEffect, useState } from "react";
import { X, Pencil, Plus } from "lucide-react";
import Overlay from "../common/Overlay";
import UpdateItemOverlay from "./UpdateItemOverlay";
import UploadImagesOverlay from "./UpdateItemOverlay";
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
          })
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
      <Overlay>
        <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-[95%] overflow-hidden">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center px-6 pt-5 pb-3 shadow-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Thông tin món
            </h2>

            <button
              onClick={onClose}
              className="text-gray-400 hover:bg-red-100 p-1 rounded-md cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="p-6 overflow-y-auto max-h-[85vh]">
            {/* ================= SLIDESHOW ================= */}
            <div className="relative overflow-hidden rounded-xl mb-5 shadow-sm group h-64">
              {allImages.map((img, idx) => (
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
              ))}

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full  transition  cursor-pointer"
                  >
                    ‹
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full  transition cursor-pointer"
                  >
                    ›
                  </button>
                </>
              )}

              {allImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => changeSlide(idx)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition ${
                        idx === currentIndex
                          ? "bg-white scale-125"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* ================= ITEM INFO ================= */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
              {/* ===== LEFT: ITEM INFO ===== */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  {item.itemName}
                </h3>
                <p className="text-gray-600 text-sm md:text-[15px]">
                  {item.description}
                </p>
              </div>

              {/* ===== RIGHT: ACTION BUTTONS ===== */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowUploadImages(true)}
                  className="w-full md:w-auto px-3 py-2 bg-green-500 text-white rounded-lg
                 hover:bg-green-600 text-sm font-medium flex justify-center items-center gap-1 cursor-pointer"
                >
                  <Plus size={16} /> Ảnh
                </button>

                <button
                  onClick={() => setShowUpdate(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-1
                 px-3 py-2 bg-blue-500 text-white rounded-lg
                 hover:bg-blue-600 text-sm font-medium cursor-pointer"
                >
                  <Pencil size={16} /> Cập nhật
                </button>
              </div>
            </div>

            {/* ================= CATEGORY ================= */}
            {item.category?.length > 0 && (
              <div className="mb-5">
                <h4 className="font-semibold mb-2">Danh mục</h4>
                <div className="flex flex-wrap gap-2">
                  {item.category.map((cat) => (
                    <span
                      key={cat.categoryId}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {cat.categoryName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ================= MODIFIER GROUPS ================= */}
            {modifierGroups.length > 0 && (
              <div className="mt-7">
                <h3 className="text-lg font-semibold mb-4">Tuỳ chọn thêm</h3>

                <div className="flex flex-col gap-5">
                  {modifierGroups.map((group) => (
                    <div
                      key={group.modifierGroupId}
                      className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex justify-between mb-3">
                        <span className="font-semibold">{group.name}</span>
                        <span className="text-xs text-gray-500 italic">
                          {group.selectionType === "SINGLE"
                            ? "Chọn 1"
                            : "Chọn nhiều"}{" "}
                          {group.isRequired && "(bắt buộc)"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => (
                          <div
                            key={opt.modifierOptionId}
                            className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm flex gap-2"
                          >
                            <span>{opt.name}</span>
                            <span className="text-gray-500 text-xs">
                              +{opt.price.toLocaleString()}₫
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
