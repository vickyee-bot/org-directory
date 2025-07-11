const API_BASE_URL = "http://localhost:3001";

export const fetchIndustries = async () => {
  const res = await fetch(`${API_BASE_URL}/industries`);
  if (!res.ok) throw new Error("Failed to fetch industries");
  return await res.json();
};

export const createIndustry = async (name) => {
  const res = await fetch(`${API_BASE_URL}/industries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create industry");
  return await res.json();
};

export const updateIndustry = async (id, name) => {
  const res = await fetch(`${API_BASE_URL}/industries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update industry");
  return await res.json();
};
