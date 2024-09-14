import { ImSpinner5 } from "react-icons/im";

interface Props {
  submitValue: string;
  busy?: boolean;
  onClick?: any;
  type?: "submit" | "reset" | "button" | undefined;
}
export default function SubmitBtn({ submitValue, busy, onClick, type }: Props) {
  return (
    <button
      type={type || "submit"}
      onClick={onClick}
      value={submitValue}
      className="flex items-center justify-center w-full h-10 p-1 text-lg font-semibold text-white transition rounded cursor-pointer bg-primary hover:bg-opacity-90"
    >
      {busy ? <ImSpinner5 className="animate-spin" /> : submitValue}
    </button>
  );
}
