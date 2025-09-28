function FormRow({label, children, errors}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={children.props?.id}>
          {label}
        </label>
      )}
      {children}
      {errors && <p className="text-red-500">{errors.message}</p>}
    </div>
  );
}

export default FormRow;
