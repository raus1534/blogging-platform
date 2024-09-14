interface Props {
  children: import("react").ReactNode;
}

export default function FormContainer({ children }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white -z-10">
      {children}
    </div>
  );
}
