import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  showRestIcon?: Boolean;
  placeholder?: string;
  onSubmit?: any;
  inputClassName?: string;
  onReset?: any;
}

const defaultInputStyle = "border-white  focus:border-white  text-md";
export default function AppSearchForm({
  showRestIcon,
  placeholder = "Search...",
  onSubmit,
  inputClassName = defaultInputStyle,
  onReset,
}: Props) {
  const [value, setValue] = useState("");

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleReset = () => {
    setValue("");
    onReset();
  };

  return (
    <form className="relative w-full" onSubmit={handleOnSubmit}>
      <input
        type="text"
        className={
          "transition border-2 rounded outline-none bg-transparent p-0.5 w-full " +
          inputClassName
        }
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {showRestIcon ? (
        <button
          onClick={handleReset}
          type="button"
          className="absolute -translate-y-1/2 top-1/2 right-2 text-secondary"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
}
