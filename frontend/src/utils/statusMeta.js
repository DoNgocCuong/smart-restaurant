import {
  Check,
  Clock,
  ChefHat,
  Sparkles,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

export const STATUS_META = {
  Paid: {
    label: "Đã thanh toán",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Check,
  },
  Pending_payment: {
    label: "Chờ thanh toán",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Clock,
  },
  Pending_approval: {
    label: "Chờ duyệt",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  Approved: {
    label: "Đã duyệt",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Check,
  },
  Cooking: {
    label: "Đang nấu",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: ChefHat,
  },
  Cooked: {
    label: "Đã nấu xong",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Sparkles,
  },
  Serving: {
    label: "Đang phục vụ",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: UtensilsCrossed,
  },
  Rejected: {
    label: "Từ chối",
    color: "bg-gray-50 text-gray-600 border-gray-200",
    icon: XCircle,
  },
};
