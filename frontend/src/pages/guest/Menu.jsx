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

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fuse = useMemo(() => {
    if (!items.length) return null;
    return new Fuse(items, {
      keys: [
        { name: "itemName", weight: 0.8 },
        { name: "description", weight: 0.2 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  const filteredItems = (() => {
    let result = items;

    if (searchQuery.trim() && fuse) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    if (selectedCategory !== null) {
      result = result.filter(
        (item) => item.category?.[0]?.categoryId === selectedCategory
      );
    }

    return result.filter((item) => item.status === true);
  })();

  const getModifierGroupsOfItem = (item) => {
    if (!item.modifierGroupId?.length) return [];
    return modifierGroups.filter((mg) =>
      item.modifierGroupId.includes(mg.modifierGroupId)
    );
  };

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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-slate-50 pb-36">
      <div className="mx-auto ">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200">
          {/* Desktop Header */}
          <div className="hidden sm:flex flex-row justify-between items-center gap-4 py-5 px-6 lg:px-8">
            {/* LOGO */}
            <div className="flex items-center gap-4">
              <img
                src={Logo}
                className="w-12 h-12 rounded-2xl shadow-lg ring-1 ring-gray-200 lg:w-14 lg:h-14"
                alt="Logo"
              />
              <div>
                <h1 className="font-bold text-xl text-gray-900 lg:text-2xl">
                  Menu Nhà Hàng
                </h1>
                <p className="text-sm text-gray-600 font-medium lg:text-base">
                  Chọn món yêu thích của bạn
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              {/* HISTORY */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="group flex items-center gap-2 px-4 py-2.5 text-gray-700 text-sm font-semibold bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200"
              >
                <History
                  size={18}
                  className="text-gray-600 group-hover:scale-110 transition-transform"
                />
                <span>Lịch sử</span>
              </button>

              {/* USER / AUTH */}
              {userName ? (
                <div className="flex items-center gap-2.5 px-4 py-2.5 text-gray-800 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 text-white font-bold text-sm bg-linear-to-br from-blue-500 to-blue-700 rounded-full shadow-lg ring-2 ring-blue-100">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm">{userName}</span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await authApi.logout();
                      } catch (err) {
                        console.warn("Logout API failed:", err);
                      } finally {
                        sessionStorage.removeItem("userName");
                        localStorage.removeItem("token");
                        setUserName(null);
                      }
                    }}
                    className="ml-2 px-3 py-1.5 text-xs text-red-600 font-semibold rounded-lg cursor-pointer hover:bg-red-50 transition-colors border border-red-200 hover:border-red-300"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-700 text-sm font-semibold bg-white rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span>Đăng nhập</span>
                  </button>

                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold bg-linear-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>Đăng ký</span>
                  </button>
                </>
              )}

              {/* CART */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative group flex items-center gap-2.5 px-4 py-2.5 text-white text-sm font-semibold bg-linear-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Giỏ hàng</span>
                {getTotalItems() > 0 && (
                  <span className="absolute flex items-center justify-center w-6 h-6 text-white text-xs font-bold bg-linear-to-br from-red-500 to-red-600 rounded-full -top-2 -right-2 shadow-lg ring-2 ring-white animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="flex sm:hidden flex-col gap-4 py-4 px-4">
            {/* Top Row: Logo + Cart */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={Logo}
                  className="w-10 h-10 rounded-xl shadow-lg ring-1 ring-gray-200"
                  alt="Logo"
                />
                <div>
                  <h1 className="font-bold text-base text-gray-900">
                    Menu Nhà Hàng
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">
                    Chọn món yêu thích
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-white text-xs font-bold bg-linear-to-br from-red-500 to-red-600 rounded-full -top-1.5 -right-1.5 shadow-lg ring-2 ring-white">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>

            {/* Bottom Row: Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-gray-700 text-sm font-semibold bg-white rounded-xl hover:bg-gray-50 transition-all shadow-md border border-gray-200"
              >
                <History size={16} />
                <span>Lịch sử</span>
              </button>

              {userName ? (
                <div className="flex-1 flex items-center justify-between gap-2 px-3 py-2.5 text-gray-800 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 text-white font-bold text-xs bg-linear-to-br from-blue-500 to-blue-700 rounded-full shadow-lg ring-2 ring-blue-100">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm truncate max-w-20">
                      {userName}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await authApi.logout();
                      } catch (err) {
                        console.warn("Logout API failed:", err);
                      } finally {
                        sessionStorage.removeItem("userName");
                        localStorage.removeItem("token");
                        setUserName(null);
                      }
                    }}
                    className="px-2 py-1 text-xs text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors border border-red-200"
                  >
                    Thoát
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex-1 px-3 py-2.5 text-gray-700 text-sm font-semibold bg-white rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all shadow-md"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="flex-1 px-3 py-2.5 text-white text-sm font-semibold bg-linear-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="px-4 pb-5 sm:px-6 lg:px-8">
            <div className="relative max-w-2xl mx-auto">
              <Search
                size={20}
                className="absolute left-5 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                className="pl-14 pr-5 py-4 placeholder:text-gray-400 w-full text-sm font-medium bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 sm:text-base"
                placeholder="Tìm món ăn yêu thích..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* MENU */}
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          {groupedItems.map(
            (cat) =>
              cat.items.length > 0 && (
                <div key={cat.categoryId} className="mb-12 sm:mb-16">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="px-5 py-2.5 text-xl font-bold text-gray-900 bg-white rounded-xl shadow-md border-2 border-gray-200 sm:text-2xl whitespace-nowrap">
                      {cat.categoryName}
                    </h2>
                    <div className="flex-1 h-0.5 bg-linear-to-r from-gray-300 via-gray-200 to-transparent rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {/* MODALS */}
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
            setCart([]);
            sessionStorage.removeItem("cart");
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
