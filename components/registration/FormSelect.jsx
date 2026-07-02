import { formControlClass, labelClass, helperClass, errorClass } from "./formStyles";

export default function FormSelect({
  label,
  helper,
  name,
  value,
  onChange,
  options,
  span,
  error,
  id,
}) {
  const fieldId = id || name;

  return (
    <div className={span ? "md:col-span-2" : ""} data-field={name}>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {helper && <p className={helperClass}>{helper}</p>}
      <select
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        className={formControlClass(error)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
