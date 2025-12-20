import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  required = false,
  onlyNumber = false,
  error = "",
  className = "",
}) {
  const [isView, setIsView] = useState(false);

  const handleChange = (e) => {
    let v = e.target.value;

    if (onlyNumber) {
      v = v.replace(/\D+/g, "");
    }

    onChange?.(v);
  };

  const isPassword = type === "password";
  const inputType = isPassword && isView ? "text" : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          value={value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          className={`
            w-full rounded-md border px-3 py-2 pr-10 text-base
            ${disabled ? "bg-gray-100 text-gray-400" : "bg-white text-gray-900"}
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
            focus:outline-none focus:ring-1
            ${className}
          `}
        />

        {/* Toggle password */}
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setIsView(!isView)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isView ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default InputField;
