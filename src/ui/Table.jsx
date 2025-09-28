import {Children} from "react";

function Table({children, className = "", maxHeight = "400px"}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xs overflow-hidden ${className}`}>
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{maxHeight: maxHeight}}>
        <table className="w-full">{children}</table>
      </div>
    </div>
  );
}

function TableHeader({children, className = ""}) {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
}

function TableBody({children, className = ""}) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}

function TableRow({children, className = "", onClick}) {
  return (
    <tr
      className={`${
        onClick ? "cursor-pointer hover:bg-gray-50" : ""
      } ${className}`}
      onClick={onClick}>
      {children}
    </tr>
  );
}

function TableHead({children, className = ""}) {
  return (
    <th
      className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

function TableCell({children, className = ""}) {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
}

function TableEmpty({message = "No data available", className = ""}) {
  return (
    <tr>
      <td
        colSpan="100%"
        className={`px-6 py-12 text-center text-gray-500 ${className}`}>
        {message}
      </td>
    </tr>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Empty = TableEmpty;

export default Table;
