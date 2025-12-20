function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Khối chứa modal */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        {children}
      </div>
    </div>
  );
}

export default Overlay;
