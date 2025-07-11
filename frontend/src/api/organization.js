const API_BASE_URL = "http://localhost:3001";

export const fetchOrganizations = async ({
  search,
  industryId,
  status,
  page,
  limit,
}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (industryId) params.append("industryId", industryId);
  if (status) params.append("status", status);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit); // ADD THIS LINE

  const res = await fetch(
    `http://localhost:3001/organizations?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch organizations");
  return await res.json();
};

export const exportOrganizationsCsv = async () => {
  const res = await fetch(`${API_BASE_URL}/organizations/export/csv`);
  if (!res.ok) throw new Error("Failed to export organizations");
  const blob = await res.blob();
  return blob;
};
