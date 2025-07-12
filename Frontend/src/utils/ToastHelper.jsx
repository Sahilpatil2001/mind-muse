import { toast } from "react-toastify";

// ✅ Success Toast
export const showSuccessToast = (message) => {
  toast.success(
    <div>
      <p className="text-white text-base font-semibold">{message}</p>
    </div>,
    {
      icon: "✅",
      className: "bg-green-500 text-white rounded-md shadow-lg px-4 py-3",
      progressClassName: "bg-white",
    }
  );
};

// ❌ Error Toast
export const showErrorToast = (message) => {
  toast.error(
    <div>
      <p className="text-white text-base font-semibold">{message}</p>
    </div>,
    {
      icon: "🚫",
      className: "bg-red-600 text-white rounded-md shadow-lg px-4 py-3",
      progressClassName: "bg-white",
    }
  );
};

// ℹ️ Info Toast
export const showInfoToast = (message) => {
  toast.info(
    <div>
      <p className="text-white text-base font-semibold">{message}</p>
    </div>,
    {
      icon: "ℹ️",
      className: "bg-blue-600 text-white rounded-md shadow-lg px-4 py-3",
      progressClassName: "bg-white",
    }
  );
};
