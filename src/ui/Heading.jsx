function Heading({as = "h1", children, className = "", ...props}) {
  const Component = as;
  const baseClasses = {
    h1: "text-3xl font-bold text-gray-700 mb-6",
    h2: "text-2xl font-bold text-gray-700 mb-6",
    h3: "text-xl font-bold text-gray-700 mb-6",
  };

  return (
    <Component className={`${baseClasses[as]} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export default Heading;
