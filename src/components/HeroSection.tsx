interface HeroSectionProps {
    title: string;
    subtitle: string;
}

function HeroSection({ title, subtitle }: HeroSectionProps) {  return (
    <section
      className="text-center"
      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="container">
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>
      </div>
    </section>
  );
}

export default HeroSection;