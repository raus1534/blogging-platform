import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function Title({ children }: Props) {
  return (
    <h1 className="text-xl font-semibold text-center text-primary dark:text-white">
      {children}
    </h1>
  );
}
