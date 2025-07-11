import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrganizationForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [website, setWebsite] = useState("");
  const [taxId, setTaxId] = useState("");
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch industries for the dropdown
  useEffect(() => {
    fetch("http://localhost:3001/industries")
      .then((res) => res.json())
      .then((data) => setIndustries(data))
      .catch((err) => console.error("Failed to fetch industries", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/industries")
      .then((res) => res.json())
      .then((data) => setIndustries(data))
      .catch((err) => console.error("Failed to fetch industries", err));

    if (id) {
      setLoading(true);
      fetch(`http://localhost:3001/organizations/${id}`)
        .then((res) => res.json())
        .then((org) => {
          setName(org.name);
          setIndustryId(org.industryId);
          setWebsite(org.website || "");
          setTaxId(org.taxId || "");
        })
        .catch((err) => console.error("Failed to load organization", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      industryId: parseInt(industryId),
      website,
      taxId,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/organizations${id ? `/${id}` : ""}`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to ${id ? "update" : "create"} organization`);

      navigate("/organizations");
    } catch (error) {
      console.error(error);
      alert(`Error ${id ? "updating" : "creating"} organization`);
    }
  };

  if (loading) return <div>Loading organization...</div>;


  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Organization</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Industry *</label>
          <select
            className="border px-3 py-2 rounded w-full"
            value={industryId}
            onChange={(e) => setIndustryId(e.target.value)}
            required
          >
            <option value="">Select industry</option>
            {industries.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Website</label>
          <input
            type="url"
            className="border px-3 py-2 rounded w-full"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tax ID</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
