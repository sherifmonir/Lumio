import { createPortal } from "react-dom";

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




  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-card/70 backdrop-blur-sm" >
      <div className="w-full max-w-md rounded-2xl bg-muted p-6 text-foreground shadow-xl border border-background mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="h3-bold text-foreground">{title}</h3>
        <p className="small-regular text-muted-foreground mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg  text-muted-foreground transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`${buttonStyle} cursor-pointer px-4 py-2 rounded-lg text-foreground font-medium transition-colors disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal