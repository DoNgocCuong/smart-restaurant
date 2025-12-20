import { Search, ShoppingCart, History } from "lucide-react";
import { useEffect, useState } from "react";
import MenuItemCard from "../../components/common/MenuItemCard";
import Logo from "../../assets/images/logo.png";
import CartModal from "../../components/guest/CartModal";
import OrderHistoryModal from "../../components/guest/OrderHistoryModal";
/* ===== MOCK DATA ===== */
const mock_categories = [
  { category_id: "C001", category_name: "Món khai vị" },
  { category_id: "C002", category_name: "Món chính" },
  { category_id: "C003", category_name: "Tráng miệng" },
  { category_id: "C004", category_name: "Đồ uống" },
];

const mock_items = [
  {
    item_id: "I001",
    category_id: "C001",
    item_name: "Gỏi cuốn tôm thịt",
    description: "Fresh spring rolls with shrimp and pork",
    price: 45000,
    image_url:
      "https://giadinh.mediacdn.vn/296230595582509056/2022/12/21/an-gi-102-16715878746102005998080.jpg",
    status: "available",
  },
  {
    item_id: "I002",
    category_id: "C001",
    item_name: "Nem rán",
    description: "Crispy fried spring rolls",
    price: 50000,
    image_url:
      "https://giadinh.mediacdn.vn/296230595582509056/2022/12/21/an-gi-102-16715878746102005998080.jpg",
    status: "available",
  },
  {
    item_id: "I003",
    category_id: "C002",
    item_name: "Phở bò đặc biệt",
    description: "Special beef pho",
    price: 85000,
    image_url:
      "https://giadinh.mediacdn.vn/296230595582509056/2022/12/21/an-gi-102-16715878746102005998080.jpg",
    status: "available",
  },
  {
    item_id: "I004",
    category_id: "C002",
    item_name: "Cơm tấm sườn nướng",
    description: "Broken rice with grilled pork",
    price: 75000,
    image_url:
      "https://giadinh.mediacdn.vn/296230595582509056/2022/12/21/an-gi-102-16715878746102005998080.jpg",
    status: "available",
  },
  {
    item_id: "I005",
    category_id: "C003",
    item_name: "Chè ba màu",
    description: "Three-color dessert",
    price: 35000,
    image_url:
      "https://giadinh.mediacdn.vn/296230595582509056/2022/12/21/an-gi-102-16715878746102005998080.jpg",
    status: "available",
  },
  {
    item_id: "I006",
    category_id: "C004",
    item_name: "Cà phê sữa đá",
    description: "Vietnamese iced coffee",
    price: 30000,
    image_url:
      "https://giadinh.mediacdn.vn/296230595582509056/2022/12/21/an-gi-102-16715878746102005998080.jpg",
    status: "available",
  },
];

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setCategories(mock_categories);
    setItems(mock_items);
  }, []);

  /* ===== FILTER ===== */
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.item_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;

    return matchesSearch && matchesCategory && item.status === "available";
  });

  /* ===== GROUP BY CATEGORY ===== */
  const groupedItems = categories.map((category) => ({
    ...category,
    items: filteredItems.filter(
      (item) => item.category_id === category.category_id
    ),
  }));

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
      {/* ===== HEADER (STYLE LIKE NAVIGATION) ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="grid grid-cols-12">
          <div className="col-start-2 col-end-12 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left - Logo & Title */}
              <div className="flex items-center gap-3">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-9 h-9 md:w-10 md:h-10"
                />
                <div className="leading-tight">
                  <h1 className="font-bold text-sm md:text-base">
                    Menu nhà hàng
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500">
                    Chọn món yêu thích của bạn
                  </p>
                </div>
              </div>

              {/* Right - Cart */}
              <div className="flex gap-4">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex gap-2 cursor-pointer"
                >
                  <History size={20} />
                  <span>Lịch sử</span>
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 bg-gray-900 hover:bg-gray-800 transition text-white px-4 py-2 rounded-lg shadow cursor-pointer"
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
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
          <div className="mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === "all"
                  ? "bg-gray-900 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>

            {categories.map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => setSelectedCategory(cat.category_id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat.category_id
                    ? "bg-gray-900 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cat.category_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MENU ===== */}
      <div className="grid grid-cols-12">
        <div className="col-start-2 col-end-12">
          <div className="mx-auto px-4 py-6 ">
            {groupedItems.map(
              (category) =>
                category.items.length > 0 && (
                  <div key={category.category_id} className="mb-10">
                    <h2 className="text-lg md:text-xl font-semibold mb-4 border-l-4 border-blue-600 pl-3">
                      {category.category_name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {category.items.map((item) => (
                        <MenuItemCard
                          key={item.item_id}
                          item={item}
                          quantity={cart[item.item_id] || 0}
                          onAdd={() => addToCart(item.item_id)}
                          onRemove={() => removeFromCart(item.item_id)}
                        />
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
      {isCartOpen && (
        <CartModal
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
