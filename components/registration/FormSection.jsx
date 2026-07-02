export default function FormSection({ title, description, children }) {
  return (
    <div className="md:col-span-2 border border-gray-200 rounded-xl p-6 bg-gray-50/50">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}
