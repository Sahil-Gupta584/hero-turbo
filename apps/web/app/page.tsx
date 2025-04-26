"use client";
import Features from "./components/features";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import Pricing from "./components/pricing";
import WhyUs from "./components/whyUs";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <WhyUs />
      <Features />
      <Pricing />
      <Footer />
    </>
  );
}
