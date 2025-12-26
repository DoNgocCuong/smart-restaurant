import { Plus, Minus } from "lucide-react";

export default function MenuItemCard({ item, quantity, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* IMAGE */}
      <div className="h-48 bg-gray-100">
        <img
          src={
            item.avatarUrl ||
            "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
          }
          alt={item.itemName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* INFO */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.itemName}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {item.price.toLocaleString("vi-VN")} ₫
          </span>

          {/* ACTION */}
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-gray-100 rounded-md">
              <button
                onClick={onRemove}
                className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                <Minus size={16} />
              </button>

              <span className="font-semibold min-w-5 text-center">
                {quantity}
              </span>

              <button
                onClick={onAdd}
                className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:opacity-90 text-sm cursor-pointer"
            >
              <Plus size={16} />
              Thêm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
