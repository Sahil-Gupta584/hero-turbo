"use client";
import { useEffect } from "react";
import Features from "./components/features";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import Pricing from "./components/pricing";
import WhyUs from "./components/whyUs";

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);
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
