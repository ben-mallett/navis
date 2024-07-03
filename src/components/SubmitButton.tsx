"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  className: string;
  content: string;
};

export default function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const handleClick = (event: any) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button
      aria-disabled={pending}
      className={props.className}
      onClick={handleClick}
    >
      {props.content}
    </button>
  );
}
