// src/pages/contacts/ContactForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ContactForm() {
  const { orgId, id } = useParams(); // orgId for new, id for edit
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
    email: "",
    officePhoneNumber: "",
    mobilePhoneNumber: "",
    notes: "",
    isPrimaryContact: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) loadContact();
  }, [id]);

  const loadContact = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/contacts/${id}`);
      const data = await res.json();
      setContact(data);
    } catch (err) {
      console.error("Failed to load contact", err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = id
        ? `http://localhost:3001/contacts/${id}`
        : `http://localhost:3001/organizations/${orgId}/contacts`;
      const method = id ? "PATCH" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      navigate(`/organizations/${orgId}/contacts`);
    } catch (err) {
      console.error("Failed to save contact", err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {id ? "Edit Contact" : "Add Contact"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">First Name *</label>
          <input
            name="firstName"
            value={contact.firstName}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Last Name *</label>
          <input
            name="lastName"
            value={contact.lastName}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Job Title</label>
          <input
            name="jobTitle"
            value={contact.jobTitle}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Department</label>
          <input
            name="department"
            value={contact.department}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Email</label>
          <input
            name="email"
            value={contact.email}
            onChange={handleChange}
            type="email"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Office Phone</label>
          <input
            name="officePhoneNumber"
            value={contact.officePhoneNumber}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Mobile Phone</label>
          <input
            name="mobilePhoneNumber"
            value={contact.mobilePhoneNumber}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Notes</label>
          <textarea
            name="notes"
            value={contact.notes}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isPrimaryContact"
              checked={contact.isPrimaryContact}
              onChange={handleChange}
              className="mr-2"
            />
            Primary Contact
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : "Save Contact"}
        </button>
      </form>
    </div>
  );
}
