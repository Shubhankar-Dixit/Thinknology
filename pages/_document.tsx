import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#8c7851" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="An interactive exploration of ethical dilemmas in technology including AI, IVF, cloning, and more." />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              // Initialize scroll reveal animations
              function checkReveal() {
                const reveals = document.querySelectorAll('.reveal');
                const windowHeight = window.innerHeight;
                
                reveals.forEach(reveal => {
                  const revealTop = reveal.getBoundingClientRect().top;
                  if (revealTop < windowHeight - 100) {
                    reveal.classList.add('active');
                  }
                });
              }
              
              window.addEventListener('scroll', checkReveal);
              checkReveal(); // Check on initial load
            });
          `
        }} />
      </body>
    </Html>
  );
}
