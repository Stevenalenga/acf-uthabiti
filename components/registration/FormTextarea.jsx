import { formControlClass, labelClass, helperClass, errorClass } from "./formStyles";

export default function FormTextarea({
  label,
  helper,
  name,
  value,
  onChange,
  span,
  error,
  rows = 4,
  id,
}) {
  const fieldId = id || name;

  return (
    <div className={span ? "md:col-span-2" : ""} data-field={name}>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {helper && <p className={helperClass}>{helper}</p>}
      <textarea
        id={fieldId}
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        className={formControlClass(error)}
      />
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
