import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ListingsGrid from "@/components/ListingsGrid";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <ListingsGrid />
      </main>
      <Footer />
    </>
  );
}
