import type { CSSProperties } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type Props = {
  maxLength?: number;
  value: string;
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  className?: string;
  externalRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  style?: CSSProperties;
  disabled?: boolean;
  isTextArea?: boolean;
  placeholder?: string;
  onKeyUp?: (event: React.KeyboardEvent) => void;
};

export function ControlledInput({
  maxLength,
  value,
  onChange,
  className,
  externalRef,
  style,
  disabled,
  isTextArea,
  onKeyUp,
  placeholder,
}: Props) {
  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const input = externalRef ? externalRef.current : ref.current;
    if (input) {
      input.setSelectionRange(cursor, cursor);
    }
  }, [ref, externalRef, cursor, value]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCursor(event.target.selectionStart);
    if (onChange) {
      onChange(event);
    }
  };

  if (isTextArea) {
    return (
      <textarea
        className={className}
        ref={
          (externalRef
            ? externalRef
            : ref) as React.RefObject<HTMLTextAreaElement | null>
        }
        rows={2}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    );
  }

  return (
    <input
      className={className}
      disabled={disabled}
      maxLength={maxLength}
      ref={
        (externalRef
          ? externalRef
          : ref) as React.RefObject<HTMLInputElement | null>
      }
      value={value}
      onChange={handleChange}
      style={style}
      onKeyUp={onKeyUp}
      placeholder={placeholder}
    />
  );
}
