import { useEffect, useState } from "react";
import { fetchOrganizations } from "../api/organization";
import { Link } from "react-router-dom";
import { exportOrganizationsCsv } from "../api/organization";

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [industryId, setIndustryId] = useState("");
  const [status, setStatus] = useState("");
  const [industries, setIndustries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch industries for the dropdown
  useEffect(() => {
    fetch("http://localhost:3001/industries")
      .then((res) => res.json())
      .then((data) => setIndustries(data))
      .catch((err) => console.error("Failed to load industries", err));
  }, []);

  useEffect(() => {
    console.log("Current page:", page);
    loadOrganizations();
  }, [page]); // fetch when page changes

  useEffect(() => {
    setPage(1); // reset page when filters change
    loadOrganizations();
  }, [industryId, status]);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const res = await fetchOrganizations({
        search,
        industryId,
        status,
        page,
        limit: 10, // you can adjust this limit as needed
      });
      setOrganizations(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error("Error loading organizations:", error.message);
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrganizations();
  };

  const toggleStatus = async (id) => {
    try {
      await fetch(`http://localhost:3001/organizations/${id}/toggle`, {
        method: "PATCH",
      });
      loadOrganizations(); // reload data
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await exportOrganizationsCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "organizations.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export CSV:", err.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Organizations</h1>

      <form onSubmit={handleSearchSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="border px-3 py-2 rounded w-64"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <form onSubmit={handleSearchSubmit} className="mb-4 space-x-4">
        <select
          value={industryId}
          onChange={(e) => setIndustryId(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Industries</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </form>

      <Link
        to="/organizations/new"
        className="inline-block mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add Organization
      </Link>

      <button
        onClick={handleExportCsv}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export CSV
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Industry</th>
              <th className="p-3">Website</th>
              <th className="p-3">Tax ID</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-t">
                <td className="p-3">{org.id}</td>
                <td className="p-3">{org.name}</td>
                <td className="p-3">{org.industry?.name || "-"}</td>
                <td className="p-3">{org.website}</td>
                <td className="p-3">{org.taxId}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      org.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {org.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/organizations/${org.id}/edit`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </Link>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(org.id)}
                    className={`px-3 py-1 rounded text-white ${
                      org.isActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {org.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
                <td className="p-3">
                  <Link
                    to={`/organizations/${org.id}/contacts`}
                    className="text-blue-600 hover:underline"
                  >
                    View Contacts
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
