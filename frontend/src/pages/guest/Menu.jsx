import { Search, ShoppingCart, History, Bell, X } from "lucide-react";
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
import DetailItemModal from "../../components/guest/DetailItemModal";

import categoryApi from "../../api/categoryApi";
import itemApi from "../../api/itemApi";
import modifierGroupApi from "../../api/modifierGroupApi";
import authApi from "../../api/authApi";

import useCustomerWebSocket from "../../hooks/useCustomerWebSocket";
import toast from "react-hot-toast";

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isDetailItemOpen, setIsDetailItemOpen] = useState(false);

  const [userName, setUserName] = useState(() =>
    sessionStorage.getItem("userName"),
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

  const [orderedItems, setOrderedItems] = useState(() => {
    try {
      const stored = sessionStorage.getItem("orderedItems");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [orderId, setOrderId] = useState(() =>
    sessionStorage.getItem("orderId"),
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModifierOpen, setIsModifierOpen] = useState(false);

  const { tenantId, tableId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { notifications, newOrderIds, clearNewOrder, removeNotification } =
    useCustomerWebSocket({
      serverPort: import.meta.env.VITE_SERVER_PORT,
      onCustomerUpdate: (order) => {
        console.log("Order update received:", order);
      },
    });

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

  useEffect(() => {
    sessionStorage.setItem("orderedItems", JSON.stringify(orderedItems));
  }, [orderedItems]);

  useEffect(() => {
    if (orderId) {
      sessionStorage.setItem("orderId", orderId);
    }
  }, [orderId]);

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
        (item) => item.category?.[0]?.categoryId === selectedCategory,
      );
    }

    return result.filter((item) => item.status === true);
  })();

  const getModifierGroupsOfItem = (item) => {
    if (!item.modifierGroupId?.length) return [];
    return modifierGroups.filter((mg) =>
      item.modifierGroupId.includes(mg.modifierGroupId),
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
            : c,
        )
        .filter((c) => c.quantity > 0),
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
        : item.category?.[0]?.categoryId === cat.categoryId,
    ),
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-slate-50 pb-32 md:pb-36">
      <div className="mx-auto">
        {/* HEADER - MOBILE FIRST */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200">
          {/* Mobile Header */}
          <div className="flex flex-col gap-3 py-3 px-3 md:hidden">
            {/* Top Row: Logo + Cart Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <img
                  src={Logo}
                  className="w-9 h-9 rounded-lg shadow-md ring-1 ring-gray-200 shrink-0"
                  alt="Logo"
                />
                <div className="min-w-0">
                  <h1 className="font-bold text-sm text-gray-900 truncate">
                    Menu Nhà Hàng
                  </h1>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    Chọn món yêu thích
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: History + User/Auth */}
            <div className="flex gap-2">
              {userName ? (
                <div className="flex-1 flex items-center justify-between gap-1.5 px-2.5 py-2 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 text-white font-bold text-xs bg-linear-to-br from-blue-500 to-blue-700 rounded-full shadow-md shrink-0">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-xs">{userName}</span>
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
                    className="px-1.5 py-0.5 text-xs text-red-600 font-semibold rounded-md hover:bg-red-50 transition-colors border border-red-200 shrink-0"
                  >
                    Thoát
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex-1 px-2.5 py-2 text-gray-700 text-xs font-semibold bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="flex-1 px-2.5 py-2 text-white text-xs font-semibold bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex flex-row justify-between items-center gap-6 py-4 px-6 lg:px-8">
            {/* LOGO */}
            <div className="flex items-center gap-4 flex-1">
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

            {/* USER / AUTH - ONLY LOGOUT */}
            {userName && (
              <div className="flex items-center gap-3 px-4 py-2.5 text-gray-800 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 text-white font-bold text-sm bg-linear-to-br from-blue-500 to-blue-700 rounded-full shadow-lg ring-2 ring-blue-100">
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
            )}
          </div>
        </header>

        {/* NOTIFICATIONS - MOVED OUT OF HEADER */}
        {notifications.length > 0 && (
          <div className="fixed top-28 right-3 md:top-24 md:right-4 z-40 max-w-xs md:max-w-sm space-y-2 pointer-events-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-2 md:gap-3 p-3 md:p-4 text-white bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl shadow-lg animate-slide-in text-sm md:text-base"
              >
                <div className="p-1.5 md:p-2 bg-white/20 rounded-lg shrink-0">
                  <Bell size={16} className="md:w-5 md:h-5 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs md:text-sm truncate">
                    {notif.message}
                  </p>
                  <p className="mt-1 text-xs opacity-90">
                    Bàn {notif.tableId} - Order #{notif.orderId}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-white/80 hover:text-white shrink-0"
                >
                  <X size={16} className="md:w-4.5 md:h-4.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS - RESPONSIVE */}
        <div className="sticky top-16 md:top-20 z-10 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200 px-3 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {/* HISTORY */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-gray-700 text-xs md:text-sm font-semibold bg-white rounded-lg md:rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm md:shadow-md hover:shadow-md md:hover:shadow-lg border border-gray-200"
            >
              <History
                size={16}
                className="md:w-4.5 md:h-4.5 text-gray-600 group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">Lịch sử</span>
            </button>

            {/* CART */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative group flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 text-white text-xs md:text-sm font-semibold bg-linear-to-r from-blue-600 to-blue-700 rounded-lg md:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm md:shadow-lg hover:shadow-md md:hover:shadow-xl"
            >
              <ShoppingCart
                size={16}
                className="md:w-4.5 md:h-4.5 group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {getTotalItems() > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-white font-bold bg-linear-to-br from-red-500 to-red-600 rounded-full -top-1.5 -right-1.5 md:-top-2 md:-right-2 shadow-md md:shadow-lg ring-1 md:ring-2 ring-white animate-pulse text-xs md:text-xs">
                  {getTotalItems() > 99 ? "99+" : getTotalItems()}
                </span>
              )}
            </button>

            {/* LOGIN & REGISTER - HIDDEN ON MOBILE */}
            {!userName && (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-gray-700 text-sm font-semibold bg-white rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>Đăng nhập</span>
                </button>

                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold bg-linear-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Đăng ký</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-3 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="relative max-w-2xl mx-auto">
            <Search
              size={18}
              className="absolute left-4 top-1/2 text-gray-400 -translate-y-1/2 md:w-5 md:h-5"
            />
            <input
              className="pl-12 md:pl-14 pr-4 md:pr-5 py-2.5 md:py-4 placeholder:text-gray-400 w-full text-sm font-medium bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl shadow-md md:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
              placeholder="Tìm món ăn yêu thích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* MENU */}
        <div className="px-3 md:px-6 lg:px-8 py-6 md:py-10">
          {groupedItems.map(
            (cat) =>
              cat.items.length > 0 && (
                <div key={cat.categoryId} className="mb-8 md:mb-12 lg:mb-16">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <h2 className="px-3 md:px-5 py-2 md:py-2.5 text-lg md:text-xl lg:text-2xl font-bold text-gray-900 bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border-2 border-gray-200 whitespace-nowrap shrink-0">
                      {cat.categoryName}
                    </h2>
                    <div className="flex-1 h-0.5 bg-linear-to-r from-gray-300 via-gray-200 to-transparent rounded-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 lg:gap-5">
                    {cat.items.map((item) => (
                      <MenuItemCard
                        key={item.itemId}
                        item={item}
                        onAdd={() => handleAddClick(item)}
                        onViewDetail={() => {
                          setSelectedItem(item);
                          setIsDetailItemOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ),
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
          orderedItems={orderedItems}
          orderId={orderId}
          onUpdateQty={updateQuantity}
          onClose={() => setIsCartOpen(false)}
          onOrderSuccess={(mergedItems, newOrderId) => {
            setOrderedItems(mergedItems);
            if (newOrderId) {
              setOrderId(newOrderId);
              clearNewOrder(newOrderId);
            }
            setCart([]);
            sessionStorage.removeItem("cart");
          }}
          tableId={tableId}
        />
      )}

      {isHistoryOpen && (
        <OrderHistoryModal
          onClose={() => setIsHistoryOpen(false)}
          orderId={orderId}
        />
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

      {isDetailItemOpen && (
        <DetailItemModal
          item={selectedItem}
          onAdd={() => handleAddClick(selectedItem)}
          onClose={() => setIsDetailItemOpen(false)}
        />
      )}
    </div>
  );
}
