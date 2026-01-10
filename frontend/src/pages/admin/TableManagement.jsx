import { Plus, Search, Download, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import TableCard from "../../components/admin/TableCard";
import CreateTableDialog from "../../components/admin/CreateTableDialog";
import EditTableDialog from "../../components/admin/EditTableDialog";
import tableApi from "../../api/tableApi";
import qrApi from "../../api/qrApi";
import { addVietnameseFont } from "../../utils/addVietnameseFont";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Modal tải QR
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [downloading, setDownloading] = useState(false);

  /* ================= FETCH TABLES ================= */
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await tableApi.getAllTable();
        setTables(res.result.content);
      } catch (error) {
        toast.error("Không thể tải danh sách bàn");
      }
    };
    fetchTables();
  }, [isCreateDialogOpen, isEditDialogOpen]);

  /* ================= FILTER ================= */
  const filteredTables = tables.filter((t) =>
    t.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= GROUP STATUS (THEO TableCard LOGIC) ================= */
  const groupedTables = {
    available: filteredTables.filter(
      (t) =>
        t.is_active &&
        (t.statusTable === "unoccupied" || t.statusTable === null)
    ),
    occupied: filteredTables.filter(
      (t) => t.is_active && t.statusTable === "occupied"
    ),
    inactive: filteredTables.filter((t) => !t.is_active),
  };

  // ======= TẢI TẤT CẢ QR =======
  const handleDownloadAllQR = async () => {
    setDownloading(true);

    const activeTables = tables.filter((t) => t.is_active);
    console.log(1);
    try {
      if (downloadFormat === "png") {
        const zip = new JSZip();
        const folder = zip.folder("TABLE_QR_PNG");

        for (const table of activeTables) {
          try {
            const res = await qrApi.getQRById(table.tableId);
            const qrInfo = res.result;
            if (!qrInfo || !qrInfo.qr_url) continue;

            const qrResponse = await fetch(qrInfo.qr_url);
            const blob = await qrResponse.blob();
            folder.file(`${table.tableName}.png`, blob);
          } catch (err) {
            console.error(`Lỗi khi tải QR bàn ${table.tableName}`, err);
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "ALL_TABLE_QR_PNG.zip");
      } else {
        const pdf = new jsPDF("p", "mm", "a4");
        await addVietnameseFont(pdf); // 🔹 Nhúng font tiếng Việt

        for (let i = 0; i < activeTables.length; i++) {
          const table = activeTables[i];
          const res = await qrApi.getQRById(table.tableId);
          const qrInfo = res.result;
          if (!qrInfo || !qrInfo.qr_url) continue;

          const qrResponse = await fetch(qrInfo.qr_url);
          const blob = await qrResponse.blob();

          const base64Image = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
          });

          if (i > 0) pdf.addPage();

          pdf.setFontSize(18);
          pdf.text(`Bàn ${table.tableName}`, 105, 20, { align: "center" });
          pdf.addImage(base64Image, "PNG", 60, 40, 90, 90);
          pdf.setFontSize(12);
          pdf.text("Scan để gọi món", 105, 140, { align: "center" });
          pdf.text("WiFi: Restaurant_123 / 12345678", 105, 150, {
            align: "center",
          });
        }
        pdf.save("ALL_TABLE_QR.pdf");
      }

      toast.success("Tải QR thành công");
    } catch (err) {
      toast.error("Lỗi khi tải QR");
      console.error(err);
    } finally {
      setDownloading(false);
      setIsDownloadDialogOpen(false);
    }
  };

  // ======= TẠO LẠI TẤT CẢ QR =======
  const handleRegenerateAllQR = async () => {
    setDownloading(true);
    const activeTables = tables.filter((t) => t.is_active);

    try {
      for (const table of activeTables) {
        try {
          await qrApi.generateQrbyId(table.tableId);
          console.log(`Đã tạo lại QR cho bàn ${table.tableName}`);
        } catch (err) {
          console.error(`Lỗi khi tạo lại QR bàn ${table.tableName}`, err);
        }
      }

      toast.success("Tạo lại toàn bộ mã QR thành công");
    } catch (err) {
      toast.error("Lỗi khi tạo lại mã QR");
      console.error(err);
    } finally {
      setDownloading(false);
    }
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
      </div>

      {/* SEARCH */}
      <div
        className="
          bg-white p-4 rounded-lg border border-gray-200 shadow-sm
          flex flex-col gap-3
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
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

        {/* Nút thêm bàn */}
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="
            flex items-center justify-center gap-2
            px-4 py-2 bg-gray-900 text-white rounded-md cursor-pointer
            hover:opacity-90
            w-full sm:w-auto
          "
        >
          <Plus size={18} />
          Thêm bàn
        </button>
      </div>

      {/* TABLE CARDS */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center sm:justify-between ">
          <div className="">
            <p className="text-left font-bold text-xl">Danh sách bàn</p>
            <p className="text-sm text-gray-500">
              Tất cả bàn hiện có của nhà hàng và trạng thái hoạt động
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setIsDownloadDialogOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:opacity-90"
            >
              <Download size={18} />
              Tải tất cả QR
            </button>
            <button
              onClick={handleRegenerateAllQR}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md cursor-pointer hover:opacity-90 disabled:opacity-50"
              disabled={downloading}
            >
              <RefreshCcw size={18} /> Tạo lại tất cả QR
            </button>
          </div>
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
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT DIALOGS */}
      {isCreateDialogOpen && (
        <CreateTableDialog onClose={() => setIsCreateDialogOpen(false)} />
      )}

      {isEditDialogOpen && selectedTable && (
        <EditTableDialog
          table={selectedTable}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}

      {/* DOWNLOAD MODAL */}
      {isDownloadDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !downloading && setIsDownloadDialogOpen(false)}
          ></div>

          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg z-10">
            <h2 className="text-lg font-semibold mb-4">
              Chọn định dạng tải QR
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={downloadFormat === "png"}
                  onChange={() => setDownloadFormat("png")}
                />
                <span>Ảnh PNG (ZIP nhiều file)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={downloadFormat === "pdf"}
                  onChange={() => setDownloadFormat("pdf")}
                />
                <span>File PDF (tất cả bàn trong 1 file)</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsDownloadDialogOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                disabled={downloading}
              >
                Hủy
              </button>
              <button
                onClick={handleDownloadAllQR}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                disabled={downloading}
              >
                {downloading ? "Đang tải..." : "Tải xuống"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
