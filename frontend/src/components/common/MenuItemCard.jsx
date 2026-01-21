import { Plus, Minus } from "lucide-react";

export default function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
  onViewDetail,
}) {
  return (
    <div
      onClick={onViewDetail}
      className="cursor-pointer group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col h-full"
    >
      {/* IMAGE */}
      <div className="relative w-full pt-[100%] bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0">
        <img
          src={
            item.avatarUrl ||
            "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
          }
          alt={item.itemName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* INFO */}
      <div className="p-4 sm:p-5 flex flex-col grow gap-3">
        <div className="grow min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors wrap-break-words">
            {item.itemName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 pt-2 border-t border-gray-100">
          {/* PRICE */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium mb-0.5">
              Giá
            </span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
              {item.price.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {/* ACTION */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="
              w-full md:w-auto
              flex items-center justify-center gap-2
              px-4 py-2.5
              bg-linear-to-r from-blue-600 to-blue-700
              text-white rounded-xl
              hover:from-blue-700 hover:to-blue-800
              text-sm font-semibold
              transition-all duration-300
              shadow-md hover:shadow-lg active:scale-95
            "
          >
            <Plus size={18} />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
