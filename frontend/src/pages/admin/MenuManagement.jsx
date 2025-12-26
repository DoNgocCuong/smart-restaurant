import CategoryManagementCard from "../../components/admin/CategoryManagementCard";
import ItemManagementCard from "../../components/admin/ItemManagementCard";
import ModifierManagement from "../../components/admin/ModifierManagement";
function MenuManagement() {
  return (
    <div className="col-start-2 col-end-12 space-y-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Quản lý category */}
        <CategoryManagementCard />

        {/* Tùy chọn của item */}
        <ModifierManagement />
      </div>
      {/* Quản lý item */}
      <ItemManagementCard />
      <></>
    </div>
  );
}

export default MenuManagement;
