export interface RadioFieldProps {
  label: string;
  type?: string;
  id?: string;
  name?: string;
  options: string[];
  selectedOption: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RadioField({
  label,
  type,
  id,
  name,
  options,
  selectedOption,
  onChange,
}: RadioFieldProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black pt-4 pb-2">{label}</h2>
      {options.map((option) => (
        <div key={option} className="flex items-center">
          <input
            type="radio"
            id={option}
            name={name}
            value={option}
            checked={selectedOption === option}
            onChange={onChange}
          />
          <label htmlFor={option} className="pl-2">
            {option}
          </label>
        </div>
      ))}
    </div>
  );
}
