export interface InputFieldProps {
  label?: string;
  type: string;
  value?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({
  label,
  type,
  value,
  placeholder,
  className,
  required,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      {label && (
        <h2 className="text-2xl font-bold text-black pt-4 pb-2">
          {label}
          {required && <span className="text-red">*</span>}
        </h2>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={`w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2 ${className}`}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}
