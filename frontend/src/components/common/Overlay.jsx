function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div
        // onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex items-center justify-center w-full h-full px-4"
      >
        {children}
      </div>
    </div>
  );
}

export default Overlay;
