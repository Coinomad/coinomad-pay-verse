import "../css/blog.css";
import SiteShell from "../components/SiteShell";
import BlogSections from "../sections/BlogSections";

export default function BlogPage() {
  return (
    <SiteShell page="blog" hideFooterCta>
      <BlogSections />
    </SiteShell>
  );
}
