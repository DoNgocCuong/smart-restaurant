import { Search, ShoppingCart, History } from "lucide-react";
import { useEffect, useState, useMemo, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Fuse from "fuse.js";

import MenuItemCard from "../../components/common/MenuItemCard";
import Logo from "../../assets/images/logo.png";

import CartModal from "../../components/guest/CartModal";
import OrderHistoryModal from "../../components/guest/OrderHistoryModal";
import ModifierModal from "../../components/guest/ModifierModal";
import RegisterModal from "../../components/guest/RegisterModal";
import SuccessModal from "../../components/guest/SuccessModal";
import LoginModal from "../../components/guest/LoginModal";

import categoryApi from "../../api/categoryApi";
import itemApi from "../../api/itemApi";
import modifierGroupApi from "../../api/modifierGroupApi";
import authApi from "../../api/authApi";

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userName, setUserName] = useState(() =>
    sessionStorage.getItem("userName")
  );

  /* ================= CART (SAFE INIT) ================= */
  const [cart, setCart] = useState(() => {
    try {
      const stored = sessionStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModifierOpen, setIsModifierOpen] = useState(false);

  const { tenantId, tableId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const handleStorageChange = () => {
      const storedName = sessionStorage.getItem("userName");
      setUserName(storedName);
    };

    window.addEventListener("storage", handleStorageChange);

    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    localStorage.setItem("token", accessToken);

    console.log(localStorage.getItem("token"));

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [accessToken]);

  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchModifierGroups();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    const res = await categoryApi.getAllCategories();
    setCategories(res?.result || []);
  };

  const fetchItems = async () => {
    const res = await itemApi.getAllItems();
    setItems(res?.result?.content || []);
  };

  const fetchModifierGroups = async () => {
    const res = await modifierGroupApi.getAll();
    setModifierGroups(res?.result || []);
  };

  const handleLoginSuccess = () => {
    const storedName = sessionStorage.getItem("userName");
    setUserName(storedName);
  };

  /* ================= CART STORAGE ================= */
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ================= FUSE INSTANCE ================= */
  const fuse = useMemo(() => {
    if (!items.length) return null;

    return new Fuse(items, {
      keys: [
        { name: "itemName", weight: 0.8 },
        { name: "description", weight: 0.2 }, // nếu có
      ],
      threshold: 0.4, // nhỏ hơn = chính xác hơn
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  /* ================= FILTER (FUZZY SEARCH) ================= */
  const filteredItems = (() => {
    let result = items;

    // ---- FUZZY SEARCH ----
    if (searchQuery.trim() && fuse) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    // ---- CATEGORY FILTER ----
    if (selectedCategory !== null) {
      result = result.filter(
        (item) => item.category?.[0]?.categoryId === selectedCategory
      );
    }

    // ---- STATUS FILTER ----
    return result.filter((item) => item.status === true);
  })();

  /* ================= MODIFIER ================= */
  const getModifierGroupsOfItem = (item) => {
    if (!item.modifierGroupId?.length) return [];
    return modifierGroups.filter((mg) =>
      item.modifierGroupId.includes(mg.modifierGroupId)
    );
  };

  /* ================= ADD TO CART ================= */
  const handleAddClick = (item) => {
    const groups = getModifierGroupsOfItem(item);
    if (groups.length > 0) {
      setSelectedItem(item);
      setIsModifierOpen(true);
    } else {
      addToCart(item, []);
    }
  };

  const addToCart = (item, modifiers) => {
    setCart((prev) => [
      ...prev,
      {
        cartItemId: crypto.randomUUID(),
        itemId: item.itemId,
        itemName: item.itemName,
        price: item.price,
        quantity: 1,
        modifiers,
      },
    ]);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.cartItemId === cartItemId
            ? { ...c, quantity: c.quantity + delta }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const getTotalItems = () =>
    Array.isArray(cart) ? cart.reduce((sum, c) => sum + c.quantity, 0) : 0;

  /* ================= CATEGORY ================= */
  const normalizedCategories = [
    ...categories,
    { categoryId: -1, categoryName: "Khác" },
  ];

  const groupedItems = normalizedCategories.map((cat) => ({
    ...cat,
    items: filteredItems.filter((item) =>
      cat.categoryId === -1
        ? !item.category?.length
        : item.category?.[0]?.categoryId === cat.categoryId
    ),
  }));

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 pb-36">
      <div className="mx-auto">
        {/* ================= HEADER ================= */}
        <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* LOGO */}
            <div className="flex gap-3 items-center">
              <img
                src={Logo}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow-sm"
              />
              <div>
                <h1 className="font-bold text-base sm:text-lg text-gray-800">
                  Menu nhà hàng
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Chọn món yêu thích của bạn
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-3">
              {/* HISTORY */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl 
               bg-gray-100 hover:bg-gray-200 
               text-gray-700 text-sm font-medium transition"
              >
                <History size={18} className="text-gray-500" />
                <span>Lịch sử</span>
              </button>

              {/* USER / AUTH */}
              {userName ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm sm:text-base">
                      {userName}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await authApi.logout(); // 🔐 gọi API logout thực sự
                      } catch (err) {
                        console.warn("Logout API failed:", err);
                      } finally {
                        // Dọn dữ liệu local
                        sessionStorage.removeItem("userName");
                        localStorage.removeItem("token");
                        setUserName(null);
                      }
                    }}
                    className="ml-2 text-xs text-red-600 hover:bg-red-100 font-medium cursor-pointer p-1 rounded-lg"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <>
                  {/* LOGIN */}
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl 
                   bg-white border border-gray-300 
                   hover:bg-gray-100 text-gray-700 text-sm font-medium transition"
                  >
                    <span>Đăng nhập</span>
                  </button>

                  {/* REGISTER */}
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl 
                   bg-green-600 hover:bg-green-700 
                   text-white text-sm font-medium transition"
                  >
                    <span>Đăng ký</span>
                  </button>
                </>
              )}

              {/* CART */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl 
               bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
              >
                <ShoppingCart size={18} />
                <span>Giỏ hàng</span>

                {getTotalItems() > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white 
                   text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow"
                  >
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="px-4 sm:px-6 lg:px-8 pb-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full pl-10 pr-4 py-3 text-sm sm:text-base bg-white border border-gray-200 rounded-2xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 transition"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* ================= MENU ================= */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {groupedItems.map(
            (cat) =>
              cat.items.length > 0 && (
                <div key={cat.categoryId} className="mb-10 sm:mb-14">
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {cat.categoryName}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cat.items.map((item) => (
                      <MenuItemCard
                        key={item.itemId}
                        item={item}
                        onAdd={() => handleAddClick(item)}
                      />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {isModifierOpen && selectedItem && (
        <ModifierModal
          item={selectedItem}
          groups={getModifierGroupsOfItem(selectedItem)}
          onClose={() => setIsModifierOpen(false)}
          onConfirm={(mods) => {
            addToCart(selectedItem, mods);
            setIsModifierOpen(false);
          }}
        />
      )}

      {isCartOpen && (
        <CartModal
          cart={cart}
          onUpdateQty={updateQuantity}
          onClose={() => setIsCartOpen(false)}
          onOrderSuccess={() => {
            setCart([]); // clear state
            sessionStorage.removeItem("cart"); // clear storage
          }}
          tableId={tableId}
        />
      )}

      {isHistoryOpen && (
        <OrderHistoryModal onClose={() => setIsHistoryOpen(false)} />
      )}

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          tenantId={tenantId}
          onSuccess={() => {
            setIsRegisterOpen(false);
            setShowSuccess(true);
          }}
          onLoginModal={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}

      {showSuccess && (
        <SuccessModal
          message="Email xác nhận đã được gửi tới email của bạn, vui lòng xác nhận để tiếp tục."
          onClose={() => setShowSuccess(false)}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          tenantId={tenantId}
          onSuccess={() => {
            setIsLoginOpen(false);
            handleLoginSuccess();
            // có thể fetch lại user / cart nếu cần
          }}
          onRegisterModal={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}
    </div>
  );
}
