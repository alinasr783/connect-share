function Row({children, type = "row", className = ""}) {
  const classNames = {
    row: "flex-row justify-between",
    col: "flex-col gap-4",
  };

  return (
    <div className={`flex gap-4 ${classNames[type]} ${className}`}>
      {children}
    </div>
  );
}

export default Row;
