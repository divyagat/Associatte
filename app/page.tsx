import Hero from "@/components/Home/Hero";
import Featured from "@/components/home/Featured";
import Cities from "@/components/home/Cities";
import WhyUs from "@/components/home/WhyUs";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Cities />
      <WhyUs />
      <Contact />
    </>
  );
}