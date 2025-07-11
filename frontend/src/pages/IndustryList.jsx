import { useEffect, useState } from "react";
import {
  fetchIndustries,
  createIndustry,
  updateIndustry,
} from "../api/industries";

export default function IndustryList() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newIndustry, setNewIndustry] = useState("");
  const [editIndustryId, setEditIndustryId] = useState(null);
  const [editIndustryName, setEditIndustryName] = useState("");

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    setLoading(true);
    try {
      const data = await fetchIndustries();
      setIndustries(data);
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createIndustry(newIndustry);
      setNewIndustry("");
      loadIndustries();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateIndustry(editIndustryId, editIndustryName);
      setEditIndustryId(null);
      setEditIndustryName("");
      loadIndustries();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Industries</h1>

      <form onSubmit={handleCreate} className="mb-4">
        <input
          type="text"
          value={newIndustry}
          onChange={(e) => setNewIndustry(e.target.value)}
          placeholder="New industry name"
          className="border px-3 py-2 rounded mr-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Industry
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {industries.map((ind) => (
              <tr key={ind.id} className="border-t">
                <td className="p-3">{ind.id}</td>
                <td className="p-3">
                  {editIndustryId === ind.id ? (
                    <input
                      value={editIndustryName}
                      onChange={(e) => setEditIndustryName(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    ind.name
                  )}
                </td>
                <td className="p-3 space-x-2">
                  {editIndustryId === ind.id ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditIndustryId(null)}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditIndustryId(ind.id);
                        setEditIndustryName(ind.name);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
