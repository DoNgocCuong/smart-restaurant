import Overlay from "../common/Overlay";

export default function SuccessModal({ message, onClose }) {
  return (
    <Overlay>
      <div className="bg-white rounded-2xl p-6 w-[90%] sm:w-[360px] shadow-xl text-center">
        <div className="text-green-600 text-4xl mb-3">✓</div>

        <p className="text-gray-700 text-sm mb-5">{message}</p>

        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          Đã hiểu
        </button>
      </div>
    </Overlay>
  );
}
