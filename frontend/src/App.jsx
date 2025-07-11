import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import OrganizationList from "./pages/OrganizationList";
import ContactList from "./pages/ContactList";
import OrganizationForm from "./pages/OrganizationForm";
import ContactForm from "./pages/ContactForm";
import AllContacts from "./pages/AllContacts";
import IndustryList from "./pages/IndustryList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="organizations" element={<OrganizationList />} />
          <Route path="contacts" element={<AllContacts />} />
          <Route path="industries" element={<IndustryList />} />
          <Route path="organizations/new" element={<OrganizationForm />} />
          <Route path="organizations/:id/edit" element={<OrganizationForm />} />
          {/* <Route
            path="/organizations/:orgId/contacts"
            element={<ContactList />}
          />
          <Route
            path="/organizations/:orgId/contacts/new"
            element={<ContactForm />}
          />
          <Route path="/contacts/:contactId/edit" element=
          {<ContactForm />} /> */}

          <Route
            path="/organizations/:orgId/contacts/new"
            element={<ContactForm />}
          />
          <Route path="/contacts/:id/edit" element={<ContactForm />} />
          <Route
            path="/organizations/:orgId/contacts"
            element={<ContactList />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
