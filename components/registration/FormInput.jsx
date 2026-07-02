import { formControlClass, labelClass, helperClass, errorClass } from "./formStyles";

export default function FormInput({
  label,
  helper,
  name,
  value,
  onChange,
  type = "text",
  span,
  error,
  placeholder,
  id,
}) {
  const fieldId = id || name;

  return (
    <div className={span ? "md:col-span-2" : ""} data-field={name}>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {helper && <p className={helperClass}>{helper}</p>}
      <input
        id={fieldId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={formControlClass(error)}
      />
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
