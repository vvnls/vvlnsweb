import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductSection title="Combos" params={{ category: 'combo' }} />
      <ProductSection title="best sellers" params={{ sort: 'bestselling' }} />
      <ProductSection title="Hair care essentials" params={{ category: 'hair-care' }} />
      <ProductSection title="New launches" params={{ sort: 'newest' }} />
    </>
  );
}