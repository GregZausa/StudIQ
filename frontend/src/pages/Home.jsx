import { useNavigate } from "react-router-dom";
import Footer from "./components/layout/Footer";

import homeStyles from "../utils/home/home.styles";
import { MESSAGES } from "../utils/home/home.constants";
import { useTypewriter, useNavScroll } from "../utils/home/home.hooks";

import HomeNav from "./components/home/HomeNav";
import HomeHero from "./components/home/HomeHero";
import { HomeMarquee, HomeStats } from "./components/home/HomeStats";
import HomeTools from "./components/home/HomeTools";
import HomeWhy from "./components/home/HomeWhy";
import HomeArticles from "./components/home/HomeArticles";
import HomeCTA from "./components/home/HomeCTA";

const Home = () => {
  const typed = useTypewriter(MESSAGES);
  const navSolid = useNavScroll(60);

  return (
    <>
      <style>{homeStyles}</style>

      <HomeNav solid={navSolid} />
      <HomeHero typed={typed} />
      <HomeMarquee />
      <HomeStats />
      <HomeTools />
      <HomeWhy />
      <HomeArticles />
      <HomeCTA />
      <Footer />
    </>
  );
};

export default Home;
