"use client";

import CreateTableDialog from "../../components/admin/CreateTableDialog";
import EditTableDialog from "../../components/admin/EditTableDialog";
import DeleteTableDialog from "../../components/admin/DeleteTableDialog";
import toast from "react-hot-toast";
import {
  Pencil,
  Plus,
  Search,
  QrCode,
  EllipsisVertical,
  RefreshCcw,
  Download,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

// ✅ Mock data đúng theo ERD
const mock_tables = [
  {
    table_id: "T001",
    table_name: "Bàn 01",
    section: "Indoor",
    is_active: true,
    created_at: "2024-01-10",
    updated_at: "2024-01-15",
    qr_history: [
      {
        qr_id: "QR001",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
      },
    ],
  },
  {
    table_id: "T002",
    table_name: "Bàn 02",
    section: "Outdoor",
    is_active: true,
    created_at: "2024-02-01",
    updated_at: "2024-02-10",
    qr_history: [
      {
        qr_id: "QR002",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-02-10",
        updated_at: "2024-02-10",
      },
    ],
  },
  {
    table_id: "T003",
    table_name: "VIP-01",
    section: "VIP Room",
    is_active: false,
    created_at: "2024-03-05",
    updated_at: "2024-03-07",
    qr_history: [
      {
        qr_id: "QR003",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-03-07",
        updated_at: "2024-03-07",
      },
    ],
  },
  {
    table_id: "T004",
    table_name: "Bàn 01",
    section: "Indoor",
    is_active: true,
    created_at: "2024-01-10",
    updated_at: "2024-01-15",
    qr_history: [
      {
        qr_id: "QR001",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
      },
    ],
  },
  {
    table_id: "T005",
    table_name: "Bàn 02",
    section: "Outdoor",
    is_active: true,
    created_at: "2024-02-01",
    updated_at: "2024-02-10",
    qr_history: [
      {
        qr_id: "QR002",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-02-10",
        updated_at: "2024-02-10",
      },
    ],
  },
  {
    table_id: "T006",
    table_name: "VIP-01",
    section: "VIP Room",
    is_active: false,
    created_at: "2024-03-05",
    updated_at: "2024-03-07",
    qr_history: [
      {
        qr_id: "QR003",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-03-07",
        updated_at: "2024-03-07",
      },
    ],
  },
  {
    table_id: "T007",
    table_name: "Bàn 01",
    section: "Indoor",
    is_active: true,
    created_at: "2024-01-10",
    updated_at: "2024-01-15",
    qr_history: [
      {
        qr_id: "QR001",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
      },
    ],
  },
  {
    table_id: "T008",
    table_name: "Bàn 02",
    section: "Outdoor",
    is_active: true,
    created_at: "2024-02-01",
    updated_at: "2024-02-10",
    qr_history: [
      {
        qr_id: "QR002",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-02-10",
        updated_at: "2024-02-10",
      },
    ],
  },
  {
    table_id: "T009",
    table_name: "VIP-01",
    section: "VIP Room",
    is_active: false,
    created_at: "2024-03-05",
    updated_at: "2024-03-07",
    qr_history: [
      {
        qr_id: "QR003",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-03-07",
        updated_at: "2024-03-07",
      },
    ],
  },
  {
    table_id: "T010",
    table_name: "Bàn 01",
    section: "Indoor",
    is_active: true,
    created_at: "2024-01-10",
    updated_at: "2024-01-15",
    qr_history: [
      {
        qr_id: "QR001",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
      },
    ],
  },
  {
    table_id: "T011",
    table_name: "Bàn 02",
    section: "Outdoor",
    is_active: true,
    created_at: "2024-02-01",
    updated_at: "2024-02-10",
    qr_history: [
      {
        qr_id: "QR002",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-02-10",
        updated_at: "2024-02-10",
      },
    ],
  },
  {
    table_id: "T012",
    table_name: "VIP-01",
    section: "VIP Room",
    is_active: false,
    created_at: "2024-03-05",
    updated_at: "2024-03-07",
    qr_history: [
      {
        qr_id: "QR003",
        qr_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superqr.svg/330px-Superqr.svg.png",
        is_active: true,
        created_at: "2024-03-07",
        updated_at: "2024-03-07",
      },
    ],
  },
];

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState(null);

  useEffect(() => {
    setTables(mock_tables);
  }, []);

  const [formData, setFormData] = useState({
    table_name: "",
    section: "Indoor",
    is_active: true,
  });

  // ✅ Tạo lại QR Code
  const handleRegenerateQR = (table) => {
    const newQR = {
      qr_id: `QR${Date.now()}`,
      qr_url: `https://restaurant.com/menu?table=${
        table.table_id
      }&token=${Math.random().toString(36).substr(2, 9)}`,
      is_active: true,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    setTables(
      tables.map((t) =>
        t.table_id === table.table_id
          ? {
              ...t,
              qr_history: [
                ...t.qr_history.map((qr) => ({ ...qr, is_active: false })),
                newQR,
              ],
              updated_at: newQR.created_at,
            }
          : t
      )
    );

    toast.success("Tạo lại mã QR thành công");
    setOpenDropdownId(null);
  };

  // ✅ Tải QR Code
  const handleDownloadQR = async (table) => {
    const activeQR = table.qr_history.find((qr) => qr.is_active);
    if (!activeQR) return;

    try {
      const response = await fetch(activeQR.qr_url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const fileName = `${table.table_name}_${activeQR.created_at}.png`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Không thể tải QR Code:", error);
    }
  };

  // ✅ Mở dialog chỉnh sửa
  const openEditDialog = (table) => {
    setSelectedTable(table);
    setFormData({
      table_name: table.table_name,
      section: table.section,
      is_active: table.is_active,
    });
    setIsEditDialogOpen(true);
    setOpenDropdownId(null);
  };

  // ✅ Lọc dữ liệu
  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.table_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && table.is_active) ||
      (filterStatus === "inactive" && !table.is_active);
    const matchesLocation =
      filterLocation === "all" || table.section === filterLocation;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Quản lý bàn & QR Code
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Tạo, chỉnh sửa và quản lý bàn ăn cùng mã QR
            </p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Plus size={20} />
            Thêm bàn mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm tên bàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full sm:w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          >
            <option value="all">Tất cả khu vực</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Patio">Patio</option>
            <option value="VIP Room">VIP Room</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium text-gray-900">
                  Tên bàn
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 hidden sm:table-cell">
                  Khu vực
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 hidden md:table-cell">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 hidden xl:table-cell">
                  QR Code
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTables.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy bàn nào
                  </td>
                </tr>
              ) : (
                filteredTables.map((table) => {
                  const activeQR = table.qr_history.find((qr) => qr.is_active);
                  return (
                    <tr key={table.table_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {table.table_name}
                      </td>
                      <td className="px-4 py-3 text-gray-700 hidden sm:table-cell">
                        {table.section}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            table.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {table.is_active ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {activeQR ? (
                          <div className="flex items-center gap-2 text-gray-500">
                            <QrCode />
                            <span className="text-xs">
                              {activeQR.created_at}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Chưa có QR
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right relative">
                        {/* Dropdown button */}
                        <button
                          onClick={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setDropdownPosition({
                              x: rect.right - 192,
                              y: rect.bottom + window.scrollY,
                            });
                            setOpenDropdownId(
                              openDropdownId === table.table_id
                                ? null
                                : table.table_id
                            );
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <EllipsisVertical size={16} />
                        </button>

                        {openDropdownId === table.table_id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div
                              className="fixed z-20 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-200"
                              style={{
                                top: `${dropdownPosition.y}px`,
                                left: `${dropdownPosition.x}px`,
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => openEditDialog(table)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Pencil size={16} />
                                  Chỉnh sửa
                                </button>

                                <button
                                  onClick={() => handleRegenerateQR(table)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <RefreshCcw size={16} />
                                  Tạo lại QR Code
                                </button>

                                <button
                                  onClick={() => {
                                    handleDownloadQR(table);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Download size={16} />
                                  Tải QR Code
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedTable(table);
                                    setIsDeleteDialogOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  <Trash2 size={16} />
                                  Xóa bàn
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      {isCreateDialogOpen && (
        <CreateTableDialog
          formData={formData}
          setFormData={setFormData}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      )}

      {isEditDialogOpen && selectedTable && (
        <EditTableDialog
          onClose={() => setIsEditDialogOpen(false)}
          setTables={setTables}
          tables={tables}
          table={selectedTable}
        />
      )}

      {isDeleteDialogOpen && selectedTable && (
        <DeleteTableDialog
          onClose={() => setIsDeleteDialogOpen(false)}
          setTables={setTables}
          tables={tables}
          table={selectedTable}
        />
      )}
    </div>
  );
}
