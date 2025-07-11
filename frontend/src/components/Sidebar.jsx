import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Org Directory
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>
        <Link
          to="/organizations"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Organizations
        </Link>
        <Link to="/contacts" className="block hover:bg-gray-700 p-2 rounded">
          Contacts
        </Link>
        <Link to="/industries" className="block hover:bg-gray-700 p-2 rounded">
          Industries
        </Link>
      </nav>
    </div>
  );
}
