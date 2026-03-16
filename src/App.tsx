import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SplitLayout from './components/SplitLayout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';
import lightProjects from './data/projects-light.json';
import darkProjects from './data/projects-dark.json';

function App() {
  return (
    <SplitLayout
      lightHero={<HeroSection title="ROSE CHUNG" subtitle="Software developer for immersive experiences" />}
      lightContent={
        <>
          <AboutSection />
          <ProjectsSection projects={lightProjects} />
          <Footer />
        </>
      }
      darkHero={<HeroSection title="LUMENWRIGHT" subtitle="Music producer and Twitch DJ" />}
      darkContent={
        <>
          <ProjectsSection projects={darkProjects} />
          <Footer />
        </>
      }
    />
  );
}

export default App;
