import toast from "react-hot-toast";

export default function DeleteTableDialog({
  onClose,
  setTables,
  tables,
  table,
}) {
  const handleDelete = () => {
    setTables(tables.filter((t) => t.id !== table.id));
    toast.success("Đã xóa bàn!");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed z-50 left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Xóa bàn</h2>
        <p className="text-sm text-gray-600">
          Bạn có chắc muốn xóa bàn{" "}
          <span className="font-semibold">{table.number}</span> không?
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </>
  );
}
