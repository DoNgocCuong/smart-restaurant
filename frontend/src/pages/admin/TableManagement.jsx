"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import TableCard from "../../components/admin/TableCard";
import CreateTableDialog from "../../components/admin/CreateTableDialog";
import EditTableDialog from "../../components/admin/EditTableDialog";
import tableApi from "../../api/tableApi";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  /* ================= FETCH TABLES ================= */
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await tableApi.getAllTable(); // Spring pageable: page bắt đầu từ 0
        setTables(res.result.content);
        console.log(res.result.content);
      } catch (error) {
        toast.error("Không thể tải danh sách bàn");
      }
    };

    fetchTables();
  }, []);

  /* ================= FILTER ================= */
  const filteredTables = tables.filter((t) =>
    t.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= GROUP STATUS ================= */
  const groupedTables = {
    available: filteredTables.filter(
      (t) => t.is_active && t.orders.length === 0
    ),
    occupied: filteredTables.filter((t) => t.is_active && t.orders.length > 0),
    inactive: filteredTables.filter((t) => !t.is_active),
  };

  /* ================= QR ================= */
  const getQRUrl = (tableId) =>
    `https://restaurant.com/menu?tableId=${tableId}`;

  const handleRegenerateQR = () => {
    toast.success("Tạo lại QR thành công");
  };

  const handleDownloadQR = async (table) => {
    try {
      const res = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          getQRUrl(table.tableId)
        )}`
      );
      const blob = await res.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        const pdf = new jsPDF("p", "mm", "a4");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("TABLE INFORMATION", 105, 20, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.text(`Table: ${table.tableName}`, 20, 45);
        pdf.text(`Section: ${table.section ?? "N/A"}`, 20, 55);
        pdf.text(`Capacity: ${table.capacity}`, 20, 65);
        pdf.text(
          `Status: ${
            table.is_active
              ? table.orders.length > 0
                ? "Occupied"
                : "Available"
              : "Inactive"
          }`,
          20,
          75
        );

        pdf.addImage(reader.result, "PNG", 120, 45, 60, 60);
        pdf.text("Scan QR to view menu", 150, 115, { align: "center" });

        pdf.save(`QR_${table.tableName}.pdf`);
      };
    } catch {
      toast.error("Download QR failed");
    }
  };

  const handleDownloadAllQR = async () => {
    const zip = new JSZip();
    const folder = zip.folder("TABLE_QR");

    for (const table of tables) {
      try {
        const res = await fetch(
          `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            getQRUrl(table.tableId)
          )}`
        );
        const blob = await res.blob();

        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
        });

        const pdf = new jsPDF("p", "mm", "a4");
        pdf.setFontSize(18);
        pdf.text("TABLE INFORMATION", 105, 20, { align: "center" });
        pdf.setFontSize(12);
        pdf.text(`Table: ${table.tableName}`, 20, 45);
        pdf.text(`Section: ${table.section ?? "N/A"}`, 20, 55);

        pdf.addImage(base64Image, "PNG", 120, 45, 60, 60);
        folder.file(`QR_${table.tableName}.pdf`, pdf.output("blob"));
      } catch {
        console.log("Skip table", table.tableId);
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "ALL_TABLE_QR.zip");
    toast.success("Tải QR thành công");
  };

  return (
    <div className="col-start-2 col-end-12 space-y-6 py-6">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2 md:flex-row justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý bàn & QR</h1>
          <p className="text-sm text-gray-500">
            Hiển thị theo card & trạng thái
          </p>
        </div>

        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md cursor-pointer hover:opacity-90"
        >
          <Plus size={18} />
          Thêm bàn
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-400 rounded-md text-sm"
            placeholder="Tìm bàn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CARDS */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-xl">Danh sách bàn</p>
            <p className="text-sm text-gray-500">
              Tất cả bàn hiện có của nhà hàng và trạng thái hoạt động
            </p>
          </div>
          <button
            onClick={handleDownloadAllQR}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:opacity-90"
          >
            Tải tất cả QR
          </button>
        </div>

        {[
          { key: "available", title: "🟢 Có sẵn" },
          { key: "occupied", title: "🔴 Đã sử dụng" },
          { key: "inactive", title: "⚪ Không hoạt động" },
        ].map((group) => (
          <div key={group.key}>
            <h2 className="mb-4 font-semibold text-lg">{group.title}</h2>
            <div className="flex flex-wrap gap-5">
              {groupedTables[group.key].map((table) => (
                <TableCard
                  key={table.tableId}
                  table={table}
                  onEdit={() => {
                    setSelectedTable(table);
                    setIsEditDialogOpen(true);
                  }}
                  onQR={handleRegenerateQR}
                  onDownload={() => handleDownloadQR(table)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCreateDialogOpen && (
        <CreateTableDialog
          onClose={() => {
            setIsCreateDialogOpen(false);
            fetchTables();
          }}
        />
      )}

      {isEditDialogOpen && selectedTable && (
        <EditTableDialog
          table={selectedTable}
          tables={tables}
          setTables={setTables}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
}
