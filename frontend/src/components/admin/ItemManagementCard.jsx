import { useEffect, useState } from "react";
import itemApi from "../../api/itemApi";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
        direction,
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
    <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent mb-7">
        Quản lý món ăn
      </h2>

      {/* ===== FILTER + SORT ===== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1">
          {/* STATUS */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-blue-600">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={handleChange(setStatus)}
              className="
                min-w-40
                border-2 border-blue-200
                rounded-xl
                px-4 py-2.5
                text-sm
                font-medium
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                transition-all duration-300
                hover:border-blue-300
                cursor-pointer
              "
            >
              <option value="">Tất cả</option>
              <option value="true">Đang bán</option>
              <option value="false">Ngừng bán</option>
            </select>
          </div>

          {/* SORT */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-blue-600">Sắp xếp</label>
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={handleChange(setSortBy)}
                className="
                  border-2 border-blue-200
                  rounded-xl
                  px-4 py-2.5
                  text-sm
                  font-medium
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                  hover:border-blue-300
                  cursor-pointer
                "
              >
                <option value="CREATED_DATE">Ngày tạo</option>
                <option value="PRICE">Giá</option>
                <option value="POPULAR">Phổ biến</option>
              </select>

              <select
                value={direction}
                onChange={handleChange(setDirection)}
                className="
                  border-2 border-blue-200
                  rounded-xl
                  px-4 py-2.5
                  text-sm
                  font-medium
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                  hover:border-blue-300
                  cursor-pointer
                "
              >
                <option value="DESC">Giảm dần</option>
                <option value="ASC">Tăng dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* ADD ITEM */}
        <button
          className="
            flex items-center justify-center gap-2
            bg-linear-to-r from-blue-600 to-blue-700
            hover:from-blue-700 hover:to-blue-800
            text-white
            px-5 py-2.5
            rounded-xl
            shadow-sm
            transition-all duration-300
            whitespace-nowrap
            cursor-pointer
            font-medium
            border-2 border-blue-600
          "
          onClick={() => setOpenAdd(true)}
        >
          <Plus size={20} strokeWidth={2.5} />
          Thêm sản phẩm
        </button>
      </div>

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-1 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="text-center py-16 text-blue-400 font-medium">
              📦 Chưa có món ăn nào
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  onClick={() => setSelectedItem(item)}
                  className="
                    border-2 border-blue-100
                    shadow-sm
                    rounded-2xl
                    overflow-hidden
                    hover:shadow-lg
                    hover:border-blue-200
                    transition-all duration-300
                    cursor-pointer
                    group
                  "
                >
                  <div className="relative overflow-hidden bg-gray-100 aspect-4/3">
                    <img
                      src={
                        item.avatarUrl ||
                        "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                      }
                      alt={item.itemName}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-105
                        transition-transform duration-300
                      "
                    />
                    <span
                      className={`
                        absolute top-3 right-3
                        px-3 py-1.5
                        text-xs
                        font-bold
                        rounded-full
                        text-white
                        shadow-md
                        ${item.status ? "bg-linear-to-r from-emerald-500 to-emerald-600" : "bg-linear-to-r from-red-500 to-red-600"}
                      `}
                    >
                      {item.status ? "✓ Đang bán" : "✕ Ngừng bán"}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-gray-800 truncate text-base">
                      {item.itemName}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                      <span className="font-bold text-lg bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {item.price.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="
                  flex items-center justify-center
                  gap-1
                  px-4 py-2.5
                  border-2 border-blue-200
                  rounded-xl
                  hover:border-blue-300
                  hover:bg-blue-50
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  disabled:hover:border-blue-200
                  disabled:hover:bg-white
                  cursor-pointer
                  transition-all duration-300
                  font-medium
                  text-gray-700
                "
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
                Trước
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border-2 border-blue-100">
                <span className="text-sm text-gray-700">
                  Trang{" "}
                  <b className="text-blue-700">
                    {totalPages === 0 ? 0 : page + 1}
                  </b>
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-gray-700">
                  <b className="text-blue-700">{totalPages}</b>
                </span>
              </div>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className="
                  flex items-center justify-center
                  gap-1
                  px-4 py-2.5
                  border-2 border-blue-200
                  rounded-xl
                  hover:border-blue-300
                  hover:bg-blue-50
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  disabled:hover:border-blue-200
                  disabled:hover:bg-white
                  cursor-pointer
                  transition-all duration-300
                  font-medium
                  text-gray-700
                "
              >
                Sau
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
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
