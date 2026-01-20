import { useEffect, useState, useMemo } from "react";
import itemApi from "../../api/itemApi";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import AddItemModal from "./AddItemModal";
import DetailItemOverlay from "./DetailItemOverlay";

function ItemManagementCard() {
  const [allItems, setAllItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdate, setIsUpdate] = useState(0);

  // ===== FILTER & SORT STATE =====
  const [sortBy, setSortBy] = useState("CREATED_DATE");
  const [direction, setDirection] = useState("DESC");
  const [status, setStatus] = useState("");

  // ===== FETCH ALL ITEMS =====
  const fetchAllItems = async () => {
    try {
      setLoading(true);
      setPage(0);

      const res = await itemApi.getAllItems(
        0,
        10000,
        null,
        null,
        "CREATED_DATE",
        "DESC",
      );
      const allData = res.result.content || [];
      setAllItems(allData);
    } catch (error) {
      console.error("Fetch items failed", error);
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH WHEN COMPONENT MOUNTS OR UPDATE =====
  useEffect(() => {
    fetchAllItems();
  }, [isUpdate, openAdd]);

  // ===== FILTER & SORT ON FRONTEND =====
  const filteredAndSortedItems = useMemo(() => {
    let result = [...allItems];

    // FILTER BY STATUS
    if (status !== "") {
      const statusBool = status === "true";
      result = result.filter((item) => item.status === statusBool);
    }

    // SORT
    result.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "CREATED_DATE":
          aVal = new Date(a.createdDate || 0).getTime();
          bVal = new Date(b.createdDate || 0).getTime();
          break;
        case "PRICE":
          aVal = a.price || 0;
          bVal = b.price || 0;
          break;
        case "POPULAR":
          aVal = a.popular || 0;
          bVal = b.popular || 0;
          break;
        case "QUANTITY_SOLD":
          aVal = a.quantitySold || 0;
          bVal = b.quantitySold || 0;
          break;
        default:
          aVal = 0;
          bVal = 0;
      }

      if (direction === "DESC") {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });

    return result;
  }, [allItems, status, sortBy, direction]);

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filteredAndSortedItems.length / size);
  const paginatedItems = useMemo(() => {
    const start = page * size;
    const end = start + size;
    return filteredAndSortedItems.slice(start, end);
  }, [filteredAndSortedItems, page, size]);

  // ===== RESET PAGE WHEN FILTER CHANGE =====
  const handleChange = (setter) => (e) => {
    setPage(0);
    setter(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border border-blue-100 shadow-sm p-3 sm:p-5 md:p-8">
      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-5 md:mb-7">
        Quản lý món ăn
      </h2>

      {/* ===== FILTER + SORT ===== */}
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-7">
        {/* TOP ROW - STATUS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="text-xs sm:text-sm font-bold text-blue-600">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={handleChange(setStatus)}
              className="
                w-full sm:w-40
                border-2 border-blue-200
                rounded-lg sm:rounded-xl
                px-3 py-2 sm:px-4 sm:py-2.5
                text-xs sm:text-sm
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
        </div>

        {/* MIDDLE ROW - SORT */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="text-xs sm:text-sm font-bold text-blue-600">
            Sắp xếp
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={sortBy}
              onChange={handleChange(setSortBy)}
              className="
                flex-1 sm:flex-none
                border-2 border-blue-200
                rounded-lg sm:rounded-xl
                px-3 py-2 sm:px-4 sm:py-2.5
                text-xs sm:text-sm
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
              <option value="QUANTITY_SOLD">Số lượng bán</option>
            </select>

            <select
              value={direction}
              onChange={handleChange(setDirection)}
              className="
                flex-1 sm:flex-none
                border-2 border-blue-200
                rounded-lg sm:rounded-xl
                px-3 py-2 sm:px-4 sm:py-2.5
                text-xs sm:text-sm
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

            <button
              className="
                flex items-center justify-center gap-1.5 sm:gap-2
                bg-linear-to-r from-blue-600 to-blue-700
                hover:from-blue-700 hover:to-blue-800
                text-white
                px-3 sm:px-5 py-2 sm:py-2.5
                rounded-lg sm:rounded-xl
                shadow-sm
                transition-all duration-300
                whitespace-nowrap
                cursor-pointer
                font-medium
                border-2 border-blue-600
                text-xs sm:text-sm
              "
              onClick={() => setOpenAdd(true)}
            >
              <Plus size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex justify-center py-12 sm:py-16 md:py-20">
          <div className="relative w-10 sm:w-12 h-10 sm:h-12">
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-1 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          {paginatedItems.length === 0 ? (
            <div className="text-center py-10 sm:py-12 md:py-16 text-blue-400 font-medium text-xs sm:text-sm md:text-base">
              📦 Chưa có món ăn nào
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8">
              {paginatedItems.map((item) => (
                <div
                  key={item.itemId}
                  onClick={() => setSelectedItem(item)}
                  className="
                    border-2 border-blue-100
                    shadow-sm
                    rounded-lg sm:rounded-xl md:rounded-2xl
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
                        absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3
                        px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5
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

                  <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 space-y-1.5 sm:space-y-2 md:space-y-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-gray-800 text-xs sm:text-sm md:text-base line-clamp-2">
                        {item.itemName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Đã bán: {item.quantitySold || 0}
                      </p>
                    </div>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 sm:pt-2 md:pt-3 border-t border-blue-100">
                      <span className="font-bold text-xs sm:text-sm md:text-base lg:text-lg bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
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
            <div className="flex fflex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="
                  w-fit xs:w-auto
                  flex items-center justify-center
                  gap-1
                  px-3 py-2 sm:px-4 sm:py-2.5
                  border-2 border-blue-200
                  rounded-lg sm:rounded-xl
                  hover:border-blue-300
                  hover:bg-blue-50
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  disabled:hover:border-blue-200
                  disabled:hover:bg-white
                  cursor-pointer
                  transition-all duration-300
                  font-medium
                  text-xs sm:text-sm
                  text-gray-700
                "
              >
                <ChevronLeft
                  size={14}
                  strokeWidth={2.5}
                  className="sm:w-4 sm:h-4"
                />
              </button>

              <div className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-lg sm:rounded-xl border-2 border-blue-100 whitespace-nowrap">
                <span className="text-xs sm:text-sm text-gray-700">
                  Trang{" "}
                  <b className="text-blue-700">
                    {totalPages === 0 ? 0 : page + 1}
                  </b>
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-xs sm:text-sm text-gray-700">
                  <b className="text-blue-700">{totalPages}</b>
                </span>
              </div>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className="
                  w-fit xs:w-auto
                  flex items-center justify-center
                  gap-1
                  px-3 py-2 sm:px-4 sm:py-2.5
                  border-2 border-blue-200
                  rounded-lg sm:rounded-xl
                  hover:border-blue-300
                  hover:bg-blue-50
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  disabled:hover:border-blue-200
                  disabled:hover:bg-white
                  cursor-pointer
                  transition-all duration-300
                  font-medium
                  text-xs sm:text-sm
                  text-gray-700
                "
              >
                <ChevronRight
                  size={14}
                  strokeWidth={2.5}
                  className="sm:w-4 sm:h-4"
                />
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
