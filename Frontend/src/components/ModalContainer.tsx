import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  visible: boolean;
  ignoreContainer: boolean;
  onClose?: () => void;
}

export default function ModalContainer({
  children,
  visible,
  ignoreContainer,
  onClose,
}: Props) {
  const handleOnClick = (e: any) => {
    if (e.target.id === "modal-container") onClose && onClose();
  };

  const renderChildren = () => {
    if (ignoreContainer) return children;
    return (
      <div className="w-[45rem] h-[40rem] bg-white dark:bg-primary overflow-auto custom-scroll-bar p-2">
        {children}
      </div>
    );
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleOnClick}
      id="modal-container"
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-primary dark:bg-white dark:bg-opacity-50 backdrop-blur-sm"
    >
      {renderChildren()}
    </div>
  );
}
