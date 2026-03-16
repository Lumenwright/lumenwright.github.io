import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SplitLayout from './components/SplitLayout';
import LightHeroSection from './components/LightHeroSection';
import DarkHeroSection from './components/DarkHeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';

function App() {
  return (
    <SplitLayout
      lightHero={<LightHeroSection />}
      lightContent={
        <>
          <AboutSection />
          <ProjectsSection />
          <Footer />
        </>
      }
      darkHero={<DarkHeroSection />}
      darkContent={
        <>
          <ProjectsSection />
          <Footer />
        </>
      }
    />
  );
}

export default App;
