export const formControlBase =
  "w-full rounded-lg border px-3 py-2 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 [color-scheme:light]";

export function formControlClass(error) {
  return `${formControlBase} ${error ? "border-red-500 ring-1 ring-red-200" : "border-gray-300"}`;
}

export const labelClass = "block text-sm font-medium text-gray-900 mb-1";
export const helperClass = "text-xs text-gray-500 mt-0.5 mb-1";
export const errorClass = "text-red-500 text-xs mt-1";
