import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductSection title="New launches" params={{ sort: 'newest' }} />
      <ProductSection title="Hair care essentials" params={{ category: 'hair-care' }} />
      <ProductSection title="Nutritional super foods" params={{ category: 'super-foods' }} />
    </>
  );
}