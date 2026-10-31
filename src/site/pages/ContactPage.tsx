import "../css/contact.css";
import SiteShell from "../components/SiteShell";
import ContactSections from "../sections/ContactSections";

export default function ContactPage() {
  return (
    <SiteShell page="contact">
      <ContactSections />
    </SiteShell>
  );
}
