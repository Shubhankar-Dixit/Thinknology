import { useRef, useEffect } from "react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="py-12 px-4 border-t border-foreground/10 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Replace SVG logo with text or another icon */}
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-background font-bold">
                T
              </div>
              <h3 className="font-classic text-xl font-bold">Thinknology</h3>
            </div>
            <p className="font-serif text-sm text-foreground/70">
              An interactive exploration of ethical dilemmas in modern technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-modern text-sm font-bold uppercase tracking-wider mb-4">Ethical Topics</h4>
            <ul className="space-y-2">
              {["Artificial Intelligence", "In Vitro Fertilization", "Cloning", "Gene Editing", "Brain-Computer Interfaces"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-highlight transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-modern text-sm font-bold uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Ethics Framework", "Educational Material", "Further Reading", "Discussion Forum", "Citations"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-highlight transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-modern text-sm font-bold uppercase tracking-wider mb-4">Connect</h4>
            <p className="text-sm mb-4">Join the conversation about ethics in technology.</p>
            <div className="flex space-x-4">
              {["Twitter", "Instagram", "LinkedIn", "Email"].map((platform, i) => (
                <a key={i} href="#" className="text-foreground/70 hover:text-highlight transition-colors">
                  <span className="sr-only">{platform}</span>
                  <div className="w-8 h-8 flex items-center justify-center border border-foreground/20 rounded-full hover:border-highlight">
                    {/* Placeholder for social icons */}
                    <div className="w-4 h-4 rounded-full border border-current"></div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
          <p className="font-mono">© {new Date().getFullYear()} Thinknology. Educational purposes only.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-highlight transition-colors">About Us</a>
            <a href="#" className="hover:text-highlight transition-colors">Privacy</a>
            <a href="#" className="hover:text-highlight transition-colors">Educational Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
