import {
  Plus,
  Search,
  Download,
  RefreshCcw,
  X,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";

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
        console.log(res.result.content);
        setTables(res.result.content);
      } catch (error) {
        toast.error("Không thể tải danh sách bàn");
      }
    };
    fetchTables();
  }, [isCreateDialogOpen, isEditDialogOpen]);

  /* ================= FILTER ================= */
  const filteredTables = tables.filter((t) =>
    t.tableName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ================= GROUP STATUS (THEO TableCard LOGIC) ================= */
  const groupedTables = {
    available: filteredTables.filter(
      (t) => t.is_active === true && t.statusTable === "unoccupied",
    ),

    occupied: filteredTables.filter(
      (t) => t.is_active === true && t.statusTable === "occupied",
    ),

    inactive: filteredTables.filter((t) => t.is_active === false),
  };

  // ======= TẢI TẤT CẢ QR =======
  const handleDownloadAllQR = async () => {
    setDownloading(true);

    const activeTables = tables.filter((t) => t.is_active);
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
          toast.success(`Đã tạo lại QR cho bàn ${table.tableName}`);
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
    <div className="col-start-2 col-end-12 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-3 p-4 sm:p-6 lg:p-7 bg-white rounded-3xl border-2 border-blue-100 shadow-sm md:flex-row">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold ">Quản lý bàn & QR</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Hiển thị theo card & trạng thái
          </p>
        </div>
      </div>

      {/* SEARCH + ADD BUTTON */}
      <div className="flex flex-col gap-3 p-4 sm:p-6 lg:p-7 bg-white rounded-3xl border-2 border-blue-100 shadow-sm sm:flex-row items-stretch sm:items-center justify-between">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 text-blue-500 -translate-y-1/2"
          />
          <input
            className="
              pl-10 pr-4 py-2.5
              w-full
              text-sm
              border-2 border-blue-200
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              transition-all duration-300
              placeholder-gray-400
            "
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
            px-5 py-2.5
            w-full
            text-white
            bg-linear-to-r from-blue-600 to-blue-700
            rounded-xl
            cursor-pointer
            hover:from-blue-700 hover:to-blue-800
            border-2 border-blue-600
            shadow-sm
            transition-all duration-300
            sm:w-auto
            font-medium
            text-sm
          "
        >
          <Plus size={18} strokeWidth={2.5} />
          Thêm bàn
        </button>
      </div>

      {/* TABLE CARDS SECTION */}
      <div className="p-4 sm:p-6 lg:p-7 bg-white rounded-3xl border-2 border-blue-100 shadow-sm space-y-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:justify-between md:flex-row items-start md:items-center">
          <div>
            <p className="text-left font-bold text-xl sm:text-2xl bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              Danh sách bàn
            </p>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Tất cả bàn hiện có của nhà hàng và trạng thái hoạt động
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row w-full md:w-auto">
            <button
              onClick={() => setIsDownloadDialogOpen(true)}
              className="
                flex items-center justify-center gap-2
                px-5 py-2.5
                text-white
                bg-linear-to-r from-emerald-600 to-emerald-700
                rounded-xl
                cursor-pointer
                hover:from-emerald-700 hover:to-emerald-800
                border-2 border-emerald-600
                shadow-sm
                transition-all duration-300
                text-sm
                font-medium
              "
            >
              <Download size={18} strokeWidth={2.5} />
              <span>Tải tất cả QR</span>
            </button>
            <button
              onClick={handleRegenerateAllQR}
              disabled={downloading}
              className="
                flex items-center justify-center gap-2
                px-5 py-2.5
                text-white
                bg-linear-to-r from-orange-600 to-orange-700
                rounded-xl
                cursor-pointer
                hover:from-orange-700 hover:to-orange-800
                border-2 border-orange-600
                shadow-sm
                transition-all duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
                text-sm
                font-medium
              "
            >
              <RefreshCcw size={18} strokeWidth={2.5} />
              <span>Tạo lại tất cả QR</span>
            </button>
          </div>
        </div>

        {/* Groups */}
        {[
          {
            key: "available",
            title: "Có sẵn",
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            count: groupedTables.available.length,
          },
          {
            key: "occupied",
            title: "Đã sử dụng",
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-100",
            count: groupedTables.occupied.length,
          },
          {
            key: "inactive",
            title: "Không hoạt động",
            icon: MinusCircle,
            color: "text-gray-500",
            bg: "bg-gray-200",
            count: groupedTables.inactive.length,
          },
        ].map((group) => (
          <div key={group.key}>
            <h2 className="mb-4 flex items-center gap-3 font-bold text-lg text-gray-800">
              <span
                className={`w-9 h-9 flex items-center justify-center rounded-xl ${group.bg}`}
              >
                <group.icon size={20} className={group.color} />
              </span>

              <span>{group.title}</span>

              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {group.count}
              </span>
            </h2>

            <div className="flex flex-wrap gap-5">
              {groupedTables[group.key].length === 0 ? (
                <p className="text-gray-400 italic text-sm w-full">
                  Không có bàn nào
                </p>
              ) : (
                groupedTables[group.key].map((table) => (
                  <TableCard
                    key={table.tableId}
                    table={table}
                    onEdit={() => {
                      setSelectedTable(table);
                      setIsEditDialogOpen(true);
                    }}
                  />
                ))
              )}
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
        <div className="z-50 fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !downloading && setIsDownloadDialogOpen(false)}
          ></div>

          <div className="z-10 relative p-4 sm:p-6 lg:p-7 w-[95%] max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-100">
              <h2 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                Chọn định dạng tải QR
              </h2>
              <button
                onClick={() => !downloading && setIsDownloadDialogOpen(false)}
                className="
                  w-8 h-8
                  flex items-center justify-center
                  rounded-lg
                  text-gray-400
                  hover:bg-red-100 hover:text-red-600
                  transition-all duration-300
                  cursor-pointer
                "
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-6">
              <label
                className="
                flex items-center gap-3
                p-3 rounded-xl
                border-2 border-blue-200
                cursor-pointer
                hover:bg-blue-50
                transition-all duration-300
              "
              >
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={downloadFormat === "png"}
                  onChange={() => setDownloadFormat("png")}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Ảnh PNG (ZIP)</p>
                  <p className="text-xs text-gray-500">
                    Tải tất cả QR dưới dạng ZIP nhiều file
                  </p>
                </div>
              </label>

              <label
                className="
                flex items-center gap-3
                p-3 rounded-xl
                border-2 border-blue-200
                cursor-pointer
                hover:bg-blue-50
                transition-all duration-300
              "
              >
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={downloadFormat === "pdf"}
                  onChange={() => setDownloadFormat("pdf")}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">File PDF</p>
                  <p className="text-xs text-gray-500">
                    Tất cả bàn được in trong 1 file PDF
                  </p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t-2 border-blue-100">
              <button
                onClick={() => setIsDownloadDialogOpen(false)}
                disabled={downloading}
                className="
                  px-5 py-2.5
                  rounded-xl
                  border-2 border-gray-300
                  text-gray-700
                  hover:border-gray-400
                  hover:bg-gray-100
                  text-sm
                  font-medium
                  transition-all duration-300
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  cursor-pointer
                "
              >
                Hủy
              </button>
              <button
                onClick={handleDownloadAllQR}
                disabled={downloading}
                className="
                  px-6 py-2.5
                  text-white
                  bg-linear-to-r from-blue-600 to-blue-700
                  rounded-xl
                  hover:from-blue-700 hover:to-blue-800
                  border-2 border-blue-600
                  text-sm
                  font-medium
                  transition-all duration-300
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  shadow-sm
                  cursor-pointer
                "
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
