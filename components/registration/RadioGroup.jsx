import { labelClass, helperClass, errorClass } from "./formStyles";

export default function RadioGroup({
  label,
  helper,
  name,
  value,
  onChange,
  options,
  span,
  error,
}) {
  return (
    <div className={span ? "md:col-span-2" : ""} data-field={name}>
      <span className={labelClass}>{label}</span>
      {helper && <p className={helperClass}>{helper}</p>}
      <div className="flex flex-wrap gap-6 mt-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 text-sm text-gray-900"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
              className="accent-orange-600"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
