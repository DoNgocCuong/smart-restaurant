import { Mail } from "lucide-react";
import { Link } from "react-router";
function VerifyEmail() {
  return (
    <div className="w-full bg-gray-100 h-screen flex items-start justify-center pt-20">
      <div className="bg-white w-1/2 lg:w-1/3 xl:w-1/4 rounded-2xl shadow-xl p-8 flex flex-col gap-4">
        <h1 className="font-extrabold text-2xl text-center text-[#5B94FF]">
          Restaurant Management System
        </h1>
        <div className="flex justify-center">
          <div className="bg-[#5B94FF]/15 p-4 rounded-full">
            <Mail size={28} className=" text-[#5B94FF] " />
          </div>
        </div>
        <h2 className="font-extrabold text-xl text-center">Xác thực Email</h2>
        <div className="flex justify-center">
          <p className="text-center text-[#505050] px-8 text-sm">
            Liên kết xác thực đã được gửi đến
          </p>
        </div>
        <div className="bg-[#5B94FF]/15 flex flex-col items-center py-4 rounded-xl">
          <p className="text-[#505050] px-8 text-sm">Email của bạn</p>
          <p className="font-bold text-xl">abc@gmail.com</p>
        </div>
        <div className="bg-[#B85600]/15 p-6 rounded-xl text-[#B85600] text-sm">
          <p>Hướng dẫn:</p>
          <p>1. Mở hộp thư đến của bạn</p>
          <p>2. Team email từ chúng tôi</p>
          <p>3. Bấm vào đường liên kết xác thực</p>
          <p>4. Quay lại đây để tiếp tục</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-bold text-2xl">24:00:00</p>
          <p>Thời gian chờ còn lại</p>
        </div>
        <div className="flex justify-center">
          <Link>
            Không nhận được email?{" "}
            <span className="text-[#5B94FF]">Gửi lại</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
