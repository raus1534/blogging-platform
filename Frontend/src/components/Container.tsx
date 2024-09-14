import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: Props) {
  return (
    <div className={"max-w-screen-xl mx-auto " + className}>{children}</div>
  );
}
