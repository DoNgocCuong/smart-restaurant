import { useEffect, useState } from "react";
import itemApi from "../../api/itemApi";
import { Plus } from "lucide-react";
import AddItemModal from "./AddItemModal";
import DetailItemOverlay from "./DetailItemOverlay";

function ItemManagementCard() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isUpdate, setIsUpdate] = useState(0);

  // ===== FILTER & SORT STATE =====
  const [sortBy, setSortBy] = useState("CREATED_DATE");
  const [direction, setDirection] = useState("DESC");
  const [status, setStatus] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);

      // ===== FIX STATUS STRING -> BOOLEAN =====
      const parsedStatus = status === "" ? null : status === "true";

      const res = await itemApi.getAllItems(
        page,
        size,
        null,
        parsedStatus,
        sortBy,
        direction
      );

      const pageData = res.result;
      setItems(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.error("Fetch items failed", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH WHEN CHANGE =====
  useEffect(() => {
    fetchItems();
  }, [page, sortBy, direction, status, openAdd, isUpdate]);

  // ===== RESET PAGE WHEN FILTER CHANGE =====
  const handleChange = (setter) => (e) => {
    setPage(0);
    setter(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-6">Quản lý món ăn</h2>

      {/* ===== FILTER + SORT ===== */}
      <div className=" flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
          {/* STATUS */}
          <div className=" w-full flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={handleChange(setStatus)}
              className="min-w-[140px] border border-gray-300 rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang bán</option>
              <option value="false">Ngừng bán</option>
            </select>
          </div>

          {/* SORT */}
          <div className=" w-full flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Sắp xếp</label>
            <div className="flex flex-col md:flex-row gap-2">
              <select
                value={sortBy}
                onChange={handleChange(setSortBy)}
                className="min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="CREATED_DATE">Ngày tạo</option>
                <option value="PRICE">Giá</option>
                <option value="POPULAR">Phổ biến</option>
              </select>

              <select
                value={direction}
                onChange={handleChange(setDirection)}
                className="min-w-[120px] border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="DESC">Giảm dần</option>
                <option value="ASC">Tăng dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* ADD ITEM */}
        <button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white
          px-4 py-2 rounded-lg shadow-sm transition whitespace-nowrap cursor-pointer"
          onClick={() => setOpenAdd(true)}
        >
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600"></div>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không có món ăn
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  onClick={() => setSelectedItem(item)}
                  className="border border-gray-100 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative">
                    <img
                      src={
                        item.avatarUrl ||
                        "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                      }
                      alt={item.itemName}
                      className="w-full h-40 object-cover"
                    />
                    <span
                      className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full text-white
                        ${item.status ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {item.status ? "Đang bán" : "Ngừng bán"}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.itemName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-orange-600">
                        {item.price.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Trước
            </button>

            <span className="text-sm text-gray-600">
              Trang <b>{totalPages === 0 ? 0 : page + 1}</b> / {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Sau →
            </button>
          </div>
        </>
      )}
      {openAdd && (
        <AddItemModal open={openAdd} onClose={() => setOpenAdd(false)} />
      )}
      {selectedItem && (
        <DetailItemOverlay
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={() => setIsUpdate(isUpdate + 1)}
        />
      )}
    </div>
  );
}

export default ItemManagementCard;
