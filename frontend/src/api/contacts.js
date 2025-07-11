const API_BASE_URL = "http://localhost:3001";

export const fetchAllContacts = async () => {
  const res = await fetch(`${API_BASE_URL}/contacts`);
  if (!res.ok) throw new Error("Failed to fetch all contacts");
  return await res.json();
};

// Get all contacts for an organization (active only)
export const fetchContacts = async (orgId) => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/contacts`);
  console.log("Fetching contacts for orgId:", orgId);
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return await res.json();
};

// Get a single contact by ID
export const fetchContactById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/contacts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch contact");
  return await res.json();
};

// Add a new contact
export const addContact = async (orgId, contactData) => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
  if (!res.ok) throw new Error("Failed to add contact");
  return await res.json();
};

// Update a contact
export const updateContact = async (id, contactData) => {
  const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
  if (!res.ok) throw new Error("Failed to update contact");
  return await res.json();
};

// Toggle contact status (active/inactive)
export const toggleContactStatus = async (id) => {
  const res = await fetch(`${API_BASE_URL}/contacts/${id}/toggle-status`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to toggle status");
  return await res.json();
};

// Export contacts as CSV
export const exportContactsCsv = async () => {
  const res = await fetch(`${API_BASE_URL}/contacts/export/csv`);
  if (!res.ok) throw new Error("Failed to export contacts");
  const blob = await res.blob();
  return blob;
};
