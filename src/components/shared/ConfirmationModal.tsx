type ConfirmationModalProps = {
  loadingLabel: string
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  isLoading?: boolean;
  variant?: "danger" | "primary"
};

const ConfirmationModal = ({
  loadingLabel,
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  isLoading = false,
  variant= "danger"
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const buttonStyle =
    variant === "danger"
      ? "bg-red hover:opacity-90"
      : "bg-primary-500 hover:bg-primary-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-dark-3 p-6 text-white shadow-xl border border-dark-4 mx-4">
        <h3 className="h3-bold text-light-1">{title}</h3>
        <p className="small-regular text-light-3 mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg text-light-2 hover:bg-dark-4 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`${buttonStyle} cursor-pointer px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal