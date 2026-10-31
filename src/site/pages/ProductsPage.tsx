import "../css/products.css";
import SiteShell from "../components/SiteShell";
import ProductsSections from "../sections/ProductsSections";

export default function ProductsPage() {
  return (
    <SiteShell page="products">
      <ProductsSections />
    </SiteShell>
  );
}
