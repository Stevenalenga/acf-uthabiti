import { labelClass, helperClass, errorClass } from "./formStyles";

export default function CheckboxGroup({
  label,
  helper,
  name,
  value = [],
  onChange,
  options,
  span,
  error,
}) {
  const toggle = (v) => {
    const updated = value.includes(v)
      ? value.filter((x) => x !== v)
      : [...value, v];
    onChange({ target: { name, value: updated } });
  };

  return (
    <div className={span ? "md:col-span-2" : ""} data-field={name}>
      <span className={labelClass}>{label}</span>
      {helper && <p className={helperClass}>{helper}</p>}
      <div className="space-y-2 mt-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 text-sm text-gray-900"
          >
            <input
              type="checkbox"
              checked={value.includes(o.value)}
              onChange={() => toggle(o.value)}
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
