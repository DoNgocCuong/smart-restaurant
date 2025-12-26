import { Search, ShoppingCart, History } from "lucide-react";
import { useEffect, useState } from "react";
import MenuItemCard from "../../components/common/MenuItemCard";
import Logo from "../../assets/images/logo.png";
import CartModal from "../../components/guest/CartModal";
import OrderHistoryModal from "../../components/guest/OrderHistoryModal";

import categoryApi from "../../api/CategoryApi";
import itemApi from "../../api/itemApi";

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState(() => {
    const storedCart = sessionStorage.getItem("cart");
    sessionStorage
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  /* ===== FETCH ===== */
  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      if (res?.result) {
        setCategories(res.result);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục", error);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await itemApi.getAllItems();
      setItems(res.result.content || []);
    } catch (error) {
      console.error("Fetch items failed", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ===== FILTER ===== */
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.itemName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null ||
      item.categoryId === selectedCategory ||
      (selectedCategory === -1 && !item.categoryId);

    return matchesSearch && matchesCategory && item.status === true;
  });

  /* ===== CATEGORY NORMALIZE (THÊM "KHÁC") ===== */
  const normalizedCategories = [
    ...categories,
    { categoryId: -1, categoryName: "Khác" },
  ];

  /* ===== GROUP BY CATEGORY ===== */
  const groupedItems = normalizedCategories.map((category) => ({
    ...category,
    items: filteredItems.filter((item) =>
      category.categoryId === -1
        ? !item.categoryId
        : item.categoryId === category.categoryId
    ),
  }));

  /* ===== CART ===== */
  const addToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) newCart[itemId]--;
      else delete newCart[itemId];
      return newCart;
    });
  };

  const getTotalItems = () =>
    Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="grid grid-cols-12">
          <div className="col-start-2 col-end-12 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-9 h-9 md:w-10 md:h-10"
                />
                <div>
                  <h1 className="font-bold text-sm md:text-base">
                    Menu nhà hàng
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500">
                    Chọn món yêu thích của bạn
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex gap-2"
                >
                  <History size={20} />
                  Lịch sử
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
                >
                  <ShoppingCart size={20} />
                  <span className="hidden sm:inline text-sm font-medium">
                    Giỏ hàng
                  </span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ===== CATEGORY FILTER ===== */}
      <div className="bg-white shadow-sm sticky top-[88px] z-10 grid grid-cols-12">
        <div className="col-start-2 col-end-12">
          <div className="px-4 py-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === null
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100"
              }`}
            >
              Tất cả
            </button>

            {normalizedCategories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategory(cat.categoryId)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === cat.categoryId
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100"
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MENU ===== */}
      <div className="grid grid-cols-12">
        <div className="col-start-2 col-end-12 px-4 py-6">
          {groupedItems.map(
            (category) =>
              category.items.length > 0 && (
                <div key={category.categoryId} className="mb-10">
                  <h2 className="text-lg md:text-xl font-semibold mb-4 border-l-4 border-blue-600 pl-3">
                    {category.categoryName}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {category.items.map((item) => (
                      <MenuItemCard
                        key={item.itemId}
                        item={item}
                        quantity={cart[item.itemId] || 0}
                        onAdd={() => addToCart(item.itemId)}
                        onRemove={() => removeFromCart(item.itemId)}
                      />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {isCartOpen && (
        <CartModal
          cart={cart} // 👈 BẮT BUỘC
          items={items}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <OrderHistoryModal onClose={() => setIsHistoryOpen(false)} />
      )}
    </div>
  );
}
