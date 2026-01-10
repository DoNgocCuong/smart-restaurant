import { jsPDF } from "jspdf";
import roboto from "../assets/fonts/Roboto-Regular.ttf"; // đường dẫn đúng tới font của bạn

export const addVietnameseFont = async (pdf) => {
  // Tải font về dưới dạng base64
  const response = await fetch(roboto);
  const blob = await response.blob();

  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
  });

  pdf.addFileToVFS("Roboto-Regular.ttf", base64);
  pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  pdf.setFont("Roboto");
};
