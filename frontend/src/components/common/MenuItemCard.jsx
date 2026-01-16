import { Plus, Minus } from "lucide-react";

export default function MenuItemCard({ item, quantity, onAdd, onRemove }) {
  return (
    <div
      onClick={onAdd}
      className="cursor-pointer group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="relative h-52 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={
            item.avatarUrl ||
            "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
          }
          alt={item.itemName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* INFO */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {item.itemName}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium mb-0.5">
              Giá
            </span>
            <span className="text-xl font-bold text-gray-900">
              {item.price.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {/* ACTION */}
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl shadow-md border border-gray-200 p-1">
              <button
                onClick={onRemove}
                className="p-2 hover:bg-white rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <Minus size={16} className="text-gray-700" />
              </button>

              <span className="font-bold min-w-6 text-center text-gray-900 px-2">
                {quantity}
              </span>

              <button
                onClick={onAdd}
                className="p-2 hover:bg-white rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <Plus size={16} className="text-gray-700" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Plus size={18} />
              Thêm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
