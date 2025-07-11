// src/pages/contacts/ContactList.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchContacts, toggleContactStatus } from "../api/contacts";
import { exportContactsCsv } from "../api/contacts";

export default function ContactList() {
  const { orgId } = useParams(); // passed from route
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [orgId]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchContacts(orgId);
      setContacts(data);
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  const toggleStatus = async (id) => {
    try {
      await toggleContactStatus(id);
      loadContacts();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await exportContactsCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contacts.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export CSV:", err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contacts</h2>
      <Link
        to={`/organizations/${orgId}/contacts/new`}
        className="px-4 py-2 bg-green-600 text-white rounded mb-4"
      >
        + Add Contact
      </Link>

      <div className="mb-4 mt-4 space-x-4">
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full mt-4 bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Job Title</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Primary</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">
                  {c.firstName} {c.lastName}
                </td>
                <td className="p-3">{c.jobTitle || "-"}</td>
                <td className="p-3">{c.department || "-"}</td>
                <td className="p-3">{c.isActive ? "Active" : "Inactive"}</td>
                <td className="p-3">{c.isPrimaryContact ? "Yes" : "No"}</td>
                <td className="p-3 space-x-2">
                  <Link
                    to={`/contacts/${c.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleStatus(c.id)}
                    className="text-red-600 hover:underline"
                  >
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
