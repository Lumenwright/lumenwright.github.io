import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SplitLayout from './components/SplitLayout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';
import lightProjects from './data/projects-light.json';

function App() {
  return (
    <SplitLayout
      lightHero={<HeroSection title="ROSE CHUNG" subtitle="Senior Unity/C# Developer · 8 years in real-time 3D" />}
      lightContent={
        <>
          <AboutSection />
          <ProjectsSection projects={lightProjects} />
          <ContactSection />
          <Footer />
        </>
      }
      darkHero={<HeroSection title="LUMENWRIGHT" subtitle="Music producer and Twitch DJ · 'The Oath' out now on FSOE" />}
      darkContent={
        <>
          <Footer />
        </>
      }
    />
  );
}

export default App;
