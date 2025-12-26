import { Search, ShoppingCart, History } from "lucide-react";
import { useEffect, useState } from "react";
import MenuItemCard from "../../components/common/MenuItemCard";
import Logo from "../../assets/images/logo.png";
import CartModal from "../../components/guest/CartModal";
import OrderHistoryModal from "../../components/guest/OrderHistoryModal";
import ModifierModal from "../../components/guest/ModifierModal";

import categoryApi from "../../api/CategoryApi";
import itemApi from "../../api/itemApi";
import modifierGroupApi from "../../api/modifierGroupApi";

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);

  // ===== CART (SAFE INIT) =====
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

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchModifierGroups();
  }, []);

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

  /* ================= CART STORAGE ================= */
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ================= FILTER ================= */
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.itemName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null ||
      item.category?.[0]?.categoryId === selectedCategory;

    return matchesSearch && matchesCategory && item.status === true;
  });

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
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-30">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <img src={Logo} className="w-10 h-10 rounded-lg shadow-sm" />
            <div>
              <h1 className="font-bold text-lg text-gray-800">Menu nhà hàng</h1>
              <p className="text-sm text-gray-500">
                Chọn món yêu thích của bạn
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium cursor-pointer"
            >
              <History size={18} />
              Lịch sử
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium cursor-pointer"
            >
              <ShoppingCart size={18} />
              Giỏ hàng
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center shadow">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              className="
                w-full
                pl-10 pr-4 py-3
                text-sm
                bg-white
                border border-gray-200
                rounded-2xl
                shadow-sm
                placeholder:text-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-black/80
                focus:border-transparent
                transition
              "
              placeholder="Tìm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* MENU */}
      <div className="px-6 py-8">
        {groupedItems.map(
          (cat) =>
            cat.items.length > 0 && (
              <div key={cat.categoryId} className="mb-14">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {cat.categoryName}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        />
      )}

      {isHistoryOpen && (
        <OrderHistoryModal onClose={() => setIsHistoryOpen(false)} />
      )}
    </div>
  );
}
