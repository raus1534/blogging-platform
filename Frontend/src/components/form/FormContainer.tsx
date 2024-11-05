interface Props {
  children: import("react").ReactNode;
  className?: string;
}

export default function FormContainer({ children, className }: Props) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center  -z-10 bg-white dark:bg-primary dark:text-white text-primary  +${className}`}
    >
      {children}
    </div>
  );
}
