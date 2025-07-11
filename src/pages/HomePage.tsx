import React from "react";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { MovieScreens } from "../components/MovieScreens";
import { Testimonials } from "../components/Testimonials";
import { Packages } from "../components/Packages";
import { Gallery } from "../components/Gallery";
import { FAQ } from "../components/FAQ";
import { AdminPanel } from "./AdminPanel";
import PopulateScreens from "./populateScreens";

export const HomePage: React.FC = () => {
  return (
    <>
      <PopulateScreens />
      <Hero />
      <Features />
      <MovieScreens />
      <Packages />
      <Testimonials />
      <Gallery />
      <FAQ />
    </>
  );
};
