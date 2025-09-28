function Empty({title, description}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Empty;
