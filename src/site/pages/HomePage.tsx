import "../css/home.css";
import SiteShell from "../components/SiteShell";
import HomeSections from "../sections/HomeSections";

export default function HomePage() {
  return (
    <SiteShell page="home">
      <HomeSections />
    </SiteShell>
  );
}
