import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import Head from 'next/head';
import Footer from '@/components/Footer';
import Timeline from '@/components/Timeline';
import Quiz from '@/components/Quiz';
import DataVisualization from '@/components/DataVisualization';
import NeuralBackground from '@/components/NeuralBackground';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import AIAgentDemo from '@/components/AIAgentDemo';
import React, { ReactNode } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Adding missing JSX IntrinsicElements definitions
interface ScrollSectionProps {
  id: string;
  className: string;
  children: ReactNode;
  animateDirection?: string; // Optional property
  delay?: number; // Optional property
}

const ScrollSection: React.FC<ScrollSectionProps> = ({
  id,
  className,
  children,
}) => {
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};

// Sample timeline data
const aiTimelineEvents = [
  {
    id: 'ai1',
    year: '1950',
    title: 'Turing Test Proposed',
    description: 'Alan Turing proposes the &quot;Imitation Game,&quot; now known as the Turing Test, which examines a machine&apos;s ability to exhibit intelligent behavior indistinguishable from a human.'
  },
  {
    id: 'ai2',
    year: '1956',
    title: 'Birth of AI as a Field',
    description: 'John McCarthy coins the term &quot;Artificial Intelligence&quot; at the Dartmouth Conference, marking the formal birth of AI as a field of research.'
  },
  {
    id: 'ai3',
    year: '1997',
    title: 'Deep Blue Defeats Chess Champion',
    description: 'IBM&apos;s Deep Blue defeats world chess champion Garry Kasparov, marking the first time a computer defeated a reigning world chess champion.'
  },
  {
    id: 'ai4',
    year: '2011',
    title: 'IBM Watson Wins Jeopardy',
    description: 'IBM&apos;s Watson defeats human champions on the quiz show Jeopardy!, demonstrating its advanced natural language processing capabilities.'
  },
  {
    id: 'ai5',
    year: '2022',
    title: 'Generative AI Goes Mainstream',
    description: 'Large language models and text-to-image AI systems like ChatGPT and DALL-E become widely accessible to the public, transforming how we interface with AI technology.'
  }
];

// Sample ethics quiz data
const aiEthicsQuiz = {
  id: 'ai-ethics',
  scenario: 'A healthcare system is implementing an AI diagnostic tool that will analyze patient data to recommend treatments. The system is 15% more accurate than human doctors when detecting certain conditions, but also has a 5% rate of unexplainable results.',
  context: `<p>AI healthcare systems present complex ethical considerations:</p>
  <ul>
    <li>Higher accuracy could save lives, but errors could also cause harm</li>
    <li>The &quot;black box&quot; nature of some AI algorithms makes it difficult to understand why specific decisions are made</li>
    <li>Patient data privacy must be balanced with the need for data to train these systems</li>
    <li>Human oversight might introduce bias or override beneficial AI decisions</li>
  </ul>`,
  options: [
    {
      id: 'option1',
      text: 'Deploy the AI system as the primary diagnostic tool, with human doctors reviewing its recommendations',
      explanation: 'This approach takes advantage of the AI&apos;s higher accuracy while maintaining human oversight. However, it may lead to overreliance on technology and potential missed diagnoses when humans defer to AI judgment too readily.'
    },
    {
      id: 'option2',
      text: 'Use the AI system only as a secondary opinion after human diagnosis',
      explanation: 'This preserves human judgment as the primary factor in healthcare decisions, but potentially loses the benefit of the AI&apos;s higher accuracy rate in initial diagnoses. It values human interpretability over pure statistical performance.'
    },
    {
      id: 'option3',
      text: 'Delay implementation until the unexplainable results can be addressed',
      explanation: 'This prioritizes safety and transparency over immediate benefits. It acknowledges the ethical concern that healthcare decisions should be explainable, but delays potentially life-saving improvements in care.'
    }
  ],
  data: [
    { label: 'AI Accuracy', value: 92, color: '#8c7851', description: '92% diagnostic accuracy' },
    { label: 'Human Accuracy', value: 77, color: '#d97941', description: '77% diagnostic accuracy' },
    { label: 'Unexplainable', value: 5, color: '#c6b499', description: '5% unexplainable results' }
  ]
};

// Sample data visualizations
const ivfUsageData = [
  { id: '1', label: '1980', value: 5, description: 'Early clinical trials' },
  { id: '2', label: '1990', value: 20, description: 'Growing acceptance' },
  { id: '3', label: '2000', value: 40, description: 'Mainstream medical procedure' },
  { id: '4', label: '2010', value: 65, description: 'Widely available' },
  { id: '5', label: '2020', value: 90, description: 'Common fertility treatment' }
];

const cloningEthicsData = [
  { id: '1', label: 'Medical Research', value: 72, description: 'Therapeutic applications' },
  { id: '2', label: 'Animal Welfare', value: 45, description: 'Concerns about animal testing' },
  { id: '3', label: 'Human Dignity', value: 25, description: 'Philosophical objections' },
  { id: '4', label: 'Bioethics', value: 58, description: 'Professional ethics committees' },
  { id: '5', label: 'Public Opinion', value: 30, description: 'General population support' }
];

// Sample data for AI conversation simulator
const aiConversationData = {
  introMessage: "Hi, I'm an AI assistant. Ask me anything about ethics or your personal data.",
  responses: [
    {
      question: "Do you collect my personal data?",
      answer: "I collect data to improve my responses. This includes our conversation history and usage patterns.",
      ethicalLevel: "low"
    },
    {
      question: "Can I delete my data?",
      answer: "You can request data deletion, but I may retain some information to comply with legal requirements and continue service improvement.",
      ethicalLevel: "medium"
    },
    {
      question: "How do you make decisions?",
      answer: "I analyze patterns from millions of text examples to predict the most helpful response. I'm designed to be helpful, harmless, and honest.",
      ethicalLevel: "high"
    }
  ]
};

// AI bias simulation data
const aiBiasData = [
  { category: "Gender", biasScore: 68, examples: ["He is a doctor. She is a nurse.", "He is an engineer. She is a teacher."] },
  { category: "Race", biasScore: 74, examples: ["European names receive more positive associations than non-European names."] },
  { category: "Age", biasScore: 52, examples: ["Younger people described as 'innovative', older as 'outdated'."] }
];

// AI research data
const aiResearchData = [
  {
    study: "Medical Diagnostics Study",
    author: "Topol (2019)",
    finding: "AI significantly improves diagnostic accuracy, reducing errors by up to 30% in certain conditions.",
    type: "benefit"
  },
  {
    study: "Facial Recognition Analysis",
    author: "Buolamwini & Gebru (2018)",
    finding: "Facial recognition AI had an error rate of 1% for white men but up to 34% for dark-skinned women.",
    type: "risk" 
  },
  {
    study: "Employment Impact Forecast",
    author: "Frey & Osborne (2017)",
    finding: "Approximately 30% of jobs could be impacted by automation by 2030.",
    type: "risk"
  },
  {
    study: "Climate Change Solutions",
    author: "Rolnick et al. (2019)",
    finding: "AI can help monitor deforestation, optimize energy systems, and predict extreme weather events.",
    type: "benefit"
  }
];

// AI dilemmas and scenarios
const aiDilemmas = [
  {
    title: "Self-Driving Car Dilemma",
    scenario: "A self-driving car must choose: swerve to avoid a child but hit an elderly person, or continue straight and hit the child.",
    options: ["Prioritize saving children", "Treat all human lives equally", "Let car owners choose prioritization settings"],
    implications: "This choice reflects value judgments about human worth based on age, raising profound questions about how we program ethics into machines."
  },
  {
    title: "Predictive Policing",
    scenario: "An AI system predicts crime hotspots based on historical arrest data, which shows higher arrests in minority neighborhoods.",
    options: ["Use the system despite potential bias", "Adjust the algorithm to correct for historical bias", "Don't use predictive policing AI"],
    implications: "Historical policing data may reflect biased practices, causing AI to perpetuate discrimination while appearing objective."
  },
  {
    title: "Medical Resource Allocation",
    scenario: "During a pandemic, an AI system prioritizes patients for limited ventilators based on calculated survival probability.",
    options: ["Let AI make unbiased triage decisions", "Keep doctors as final decision makers", "Use a hybrid approach"],
    implications: "AI might make more consistent decisions, but should algorithms determine who lives when resources are limited?"
  }
];

// AI future perspectives
const aiFuturePerspectives = [
  {
    persona: "The Optimist",
    view: "AI will solve humanity's greatest challenges, from climate change to disease, creating abundance for all.",
    quote: "We're on the cusp of an intelligence revolution that will liberate humans from mundane work."
  },
  {
    persona: "The Cautious Pragmatist",
    view: "AI offers tremendous benefits but requires careful governance. We need thoughtful regulation and ethics-by-design.",
    quote: "Let's harness AI's potential while being mindful of unintended consequences."
  },
  {
    persona: "The Concerned Critic",
    view: "Unregulated AI poses existential risks through autonomous weapons, surveillance states, and job displacement.",
    quote: "We're creating systems we may not be able to control, with impacts we've barely begun to understand."
  }
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('intro');
  const [votes, setVotes] = useState({
    ai: null,
    ivf: null,
    cloning: null
  });

  const [aiConvoState, setAiConvoState] = useState({
    currentQuestion: null as null | { question: string; answer: string; ethicalLevel: string },
    askedQuestions: [] as { question: string; answer: string; ethicalLevel: string }[],
    showEthicsRating: false,
    userInput: ""
  });
  
  const [activeDilemma, setActiveDilemma] = useState<number | null>(null);
  const [selectedDilemmaChoices, setSelectedDilemmaChoices] = useState<Record<string, string>>({});
  const [activeBiasCategory, setActiveBiasCategory] = useState<string | null>(null);
  const [activeAIPerspective, setActiveAIPerspective] = useState<string | null>("The Cautious Pragmatist");
  const [showResearchCard, setShowResearchCard] = useState<number | null>(null);
  const [typingEffect, setTypingEffect] = useState({
    isTyping: false,
    text: "",
    fullText: "Artificial Intelligence means giving machines the ability to learn, think, and make decisions similarly to humans. It's everywhere and changing our world rapidly."
  });

  useEffect(() => {
    // Initialize GSAP animations
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      // Create a timeline for each section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'center 30%',
          toggleActions: 'play none none reverse'
        }
      });
      
      // Animate the section header
      tl.from(`#${section.id} h2`, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      // Animate content elements with stagger
      tl.from(`#${section.id} .animate-content`, {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4');
    });
    
    // Clean up on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!typingEffect.isTyping) {
      let i = 0;
      setTypingEffect(prev => ({ ...prev, isTyping: true }));
      
      const intervalId = setInterval(() => {
        if (i < typingEffect.fullText.length) {
          setTypingEffect(prev => ({ 
            ...prev, 
            text: prev.text + typingEffect.fullText.charAt(i)
          }));
          i++;
        } else {
          clearInterval(intervalId);
          setTypingEffect(prev => ({ ...prev, isTyping: false }));
        }
      }, 50);
      
      return () => clearInterval(intervalId);
    }
  }, [typingEffect.fullText, typingEffect.isTyping, activeSection === 'ai']);

  const handleVote = (section: string, value: 'ethical' | 'unethical') => {
    setVotes(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
  };

  const handleAIConversationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAiConvoState(prev => ({
      ...prev,
      userInput: e.target.value
    }));
  };

  const submitAIQuestion = () => {
    if (!aiConvoState.userInput.trim()) return;
    
    const question = aiConversationData.responses.find(r => 
      r.question.toLowerCase().includes(aiConvoState.userInput.toLowerCase())
    ) || aiConversationData.responses[0];

    setAiConvoState(prev => ({
      ...prev,
      currentQuestion: question,
      askedQuestions: [...prev.askedQuestions, question],
      showEthicsRating: true,
      userInput: ""
    }));
  };

  const handleDilemmaSelection = (dilemmaTitle: string, choice: string) => {
    setSelectedDilemmaChoices(prev => ({
      ...prev,
      [dilemmaTitle]: choice
    }));
  };

  const toggleAIPerspective = (persona: string) => {
    setActiveAIPerspective(prev => prev === persona ? null : persona);
  };

  return (
    <>
      <Head>
        <title>Thinknology - Exploring Ethical Dilemmas in Technology</title>
        <meta name="description" content="An interactive journey through ethical questions in modern technology" />
      </Head>

      <div className="bg-background text-foreground" ref={containerRef}>
        {/* Neural Network Background */}
        <NeuralBackground />
        
        {/* Navigation Dots */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
          <div className="flex flex-col space-y-4">
            {['intro', 'ai', 'ivf', 'cloning'].map((section) => (
              <motion.a 
                key={section}
                href={`#${section}`}
                className={`w-3 h-3 rounded-full border border-accent transition-all duration-300 ${activeSection === section ? 'bg-accent scale-125' : 'bg-transparent'}`}
                aria-label={`Navigate to ${section} section`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* Hero Section with Parallax */}
        <ScrollSection 
          id="intro" 
          className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20"
        >
          <div className="max-w-6xl mx-auto text-center z-10">
            <motion.div 
              className="mb-8 float"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
              }}
            >
              <Image 
                src="/logo_thinknology.png" 
                alt="Thinknology Logo" 
                width={120} 
                height={120} 
                className="mx-auto"
              />
            </motion.div>
            
            <motion.h1 
              className="font-classic text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-highlight">Think</span>nology
            </motion.h1>
            
            <motion.p 
              className="font-serif text-xl md:text-2xl max-w-3xl mx-auto italic mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Exploring the ethical boundaries where <span className="font-classic">humanity</span> meets <span className="font-mono">technology</span>
            </motion.p>
            
            <motion.div 
              className="bg-tertiary/50 p-8 rounded-lg max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="font-modern text-lg mb-4">
                Welcome to an interactive journey through the ethical dilemmas of emerging technologies.
              </p>
              <p className="font-serif mb-6">
                Scroll through our exhibits, interact with demonstrations, and contribute your perspective on whether these technologies are ethical.
              </p>
              <motion.a 
                href="#ai" 
                className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-background hover:bg-accent/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Begin the Journey
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.a>
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute bottom-10"
            initial={{ y: 0 }}
            animate={{ y: 10 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </ScrollSection>
        
        {/* AI Ethics Section */}
        <ScrollSection 
          id="ai" 
          className="min-h-screen py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="ethics-card p-8 md:p-12">
              {/* AI Header Section with interactive elements */}
              <div className="mb-12 text-center">
                <span className="font-mono text-sm text-accent uppercase tracking-wider animate-content">Topic 01</span>
                <h2 className="font-classic text-3xl md:text-5xl font-bold mt-2 mb-6">
                  Artificial <span className="text-highlight italic">Intelligence</span>
                </h2>
                <div className="h-20 flex items-center justify-center">
                  <p className="font-serif text-xl md:text-2xl animate-content text-center relative">
                    <span className="absolute -left-4 font-mono text-accent">&gt;</span>
                    {typingEffect.text}
                    <span className={`inline-block w-2 h-5 ml-1 bg-accent ${typingEffect.isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2">
                  {/* Timeline and historical context */}
                  <div className="prose prose-lg prose-headings:font-classic prose-headings:font-bold animate-content">
                    <div className="bg-tertiary/20 p-4 rounded-lg mb-8">
                      <h3 className="text-xl mb-4">Historical Journey of AI</h3>
                      <Timeline 
                        events={aiTimelineEvents} 
                        className="animate-content" 
                      />
                    </div>
                    
                    {/* Research findings cards */}
                    <div className="mb-8">
                      <h3 className="text-xl mb-4">Research Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiResearchData.map((research, index) => (
                          <motion.div 
                            key={index}
                            className={`p-4 rounded-lg cursor-pointer border ${
                              showResearchCard === index 
                                ? 'border-accent' 
                                : 'border-secondary/30'
                            } ${
                              research.type === 'benefit' 
                                ? 'bg-green-600/10' 
                                : 'bg-red-600/10'
                            }`}
                            onClick={() => setShowResearchCard(showResearchCard === index ? null : index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <h4 className="text-md font-classic">{research.study}</h4>
                            {showResearchCard === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                              >
                                <p className="text-sm mt-2">{research.finding}</p>
                                <p className="text-xs mt-1 italic">— {research.author}</p>
                                <span className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${
                                  research.type === 'benefit' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {research.type === 'benefit' ? 'Benefit' : 'Risk'}
                                </span>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* AI Bias Detector */}
                    <div className="mb-8 bg-tertiary/30 p-4 rounded-lg">
                      <h3 className="font-classic text-xl mb-4">AI Bias Explorer</h3>
                      <p className="text-sm mb-4 font-serif">AI systems can perpetuate human biases found in training data. Explore common AI biases below:</p>
                      
                      <div className="space-y-3">
                        {aiBiasData.map((bias, index) => (
                          <div key={index} className="relative">
                            <motion.button 
                              className="flex justify-between w-full items-center text-left p-3 rounded-lg bg-tertiary/50 hover:bg-tertiary/80 transition-colors"
                              onClick={() => setActiveBiasCategory(activeBiasCategory === bias.category ? null : bias.category)}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <span className="font-classic">{bias.category} Bias</span>
                              <div className="flex items-center">
                                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                                  <motion.div 
                                    className="h-full bg-accent rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${bias.biasScore}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                  ></motion.div>
                                </div>
                                <span className="mr-2 text-sm font-mono">{bias.biasScore}%</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d={activeBiasCategory === bias.category ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"} 
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </motion.button>
                            
                            {activeBiasCategory === bias.category && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-background/80 p-3 rounded-b-lg mt-1 border-l-2 border-accent"
                              >
                                <p className="text-sm font-serif">Examples:</p>
                                <ul className="list-disc pl-5 mt-2 text-sm">
                                  {bias.examples.map((example, i) => (
                                    <li key={i}>{example}</li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Future Perspectives */}
                    <div className="mb-8">
                      <h3 className="text-xl mb-4">Expert Perspectives on AI's Future</h3>
                      <div className="space-y-4">
                        {aiFuturePerspectives.map((perspective, index) => (
                          <motion.div 
                            key={index}
                            className={`p-4 rounded-lg border transition-all ${
                              activeAIPerspective === perspective.persona 
                                ? 'border-accent' 
                                : 'border-secondary/30'
                            }`}
                            onClick={() => toggleAIPerspective(perspective.persona)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between cursor-pointer">
                              <h4 className="text-md font-classic">{perspective.persona}</h4>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d={activeAIPerspective === perspective.persona ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"} 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            
                            {activeAIPerspective === perspective.persona && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-2"
                              >
                                <p className="text-sm">{perspective.view}</p>
                                <blockquote className="text-sm mt-2 border-l-2 border-accent pl-3 italic">
                                  "{perspective.quote}"
                                </blockquote>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex flex-col justify-between animate-content">
                  {/* Ethical Dilemmas Explorer */}
                  <div className="bg-tertiary/30 p-5 rounded-lg mb-8">
                    <h3 className="font-classic text-xl mb-4">Explore AI Ethical Dilemmas</h3>
                    <p className="text-sm mb-6 font-serif">Below are real-world AI ethical dilemmas. What would you do?</p>
                    
                    <div className="space-y-6">
                      {aiDilemmas.map((dilemma, index) => (
                        <motion.div 
                          key={index}
                          className={`border rounded-lg overflow-hidden ${
                            activeDilemma === index 
                              ? 'border-accent' 
                              : 'border-secondary/30'
                          }`}
                        >
                          <div 
                            className="p-4 bg-tertiary/30 cursor-pointer flex justify-between items-center"
                            onClick={() => setActiveDilemma(activeDilemma === index ? null : index)}
                          >
                            <h4 className="font-classic">{dilemma.title}</h4>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d={activeDilemma === index ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"} 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                          {activeDilemma === index && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-4 bg-background/70"
                            >
                              <p className="text-sm mb-4">{dilemma.scenario}</p>
                              
                              <div className="space-y-2 mb-4">
                                <p className="text-sm font-classic">What would you choose?</p>
                                {dilemma.options.map((option, optionIndex) => (
                                  <motion.button
                                    key={optionIndex}
                                    className={`block w-full text-left p-2 rounded-lg text-sm border transition-colors ${
                                      selectedDilemmaChoices[dilemma.title] === option 
                                        ? 'bg-accent/20 border-accent' 
                                        : 'border-secondary/30 hover:bg-tertiary/30'
                                    }`}
                                    onClick={() => handleDilemmaSelection(dilemma.title, option)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {option}
                                  </motion.button>
                                ))}
                              </div>
                              
                              {selectedDilemmaChoices[dilemma.title] !== undefined && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-sm p-3 bg-tertiary/20 rounded-lg"
                                >
                                  <p className="font-classic mb-1">Ethical Implications:</p>
                                  <p>{dilemma.implications}</p>
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Agent Demo - Live Interactive Example */}
                  <motion.div 
                    className="bg-tertiary/30 p-5 rounded-lg mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-classic text-xl mb-4">Try a Real AI Agent</h3>
                    <p className="text-sm mb-4 font-serif">Experience a practical example of how AI agents can assist with tasks, answer questions, and provide helpful information:</p>
                    
                    <AIAgentDemo className="mb-2" />
                    
                    <p className="text-xs mt-3 text-secondary/80 font-serif">
                      <span className="font-bold">👆 This is why AI is valuable:</span> AI agents can understand natural language, search for information, and provide personalized assistance without requiring specialized technical knowledge from users.
                    </p>
                  </motion.div>
                  
                  {/* AI Conversation Interface */}
                  <motion.div 
                    className="bg-tertiary/30 p-5 rounded-lg mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="font-classic text-xl mb-4">AI Ethics Conversation Simulator</h3>
                    <p className="text-sm mb-4 font-serif">Ask the AI about ethics and data privacy to see how it responds:</p>
                    
                    <div className="bg-background/80 rounded-lg p-3 mb-4 max-h-60 overflow-y-auto flex flex-col space-y-4">
                      {aiConvoState.askedQuestions.map((question, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex space-x-2 items-start">
                            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold">You</span>
                            </div>
                            <div className="bg-tertiary/30 rounded-lg p-3 max-w-[85%]">
                              <p className="text-sm">{question.question}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 items-start">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-background font-bold">AI</span>
                            </div>
                            <div className="bg-tertiary/30 rounded-lg p-3 max-w-[85%]">
                              <p className="text-sm">{question.answer}</p>
                              {question.ethicalLevel && (
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs mr-2">Ethics rating:</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    question.ethicalLevel === 'low' ? 'bg-red-200 text-red-800' :
                                    question.ethicalLevel === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-green-200 text-green-800'
                                  }`}>
                                    {question.ethicalLevel === 'low' ? 'Concerning' :
                                     question.ethicalLevel === 'medium' ? 'Acceptable' :
                                     'Exemplary'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {aiConvoState.askedQuestions.length === 0 && (
                        <div className="text-center text-secondary/60 italic text-sm flex-grow flex items-center justify-center">
                          <p>Ask a question to start the conversation</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        className="flex-grow bg-background/80 border border-secondary rounded-l-lg px-3 py-2 text-sm"
                        placeholder="Ask about data privacy or how it makes decisions..."
                        value={aiConvoState.userInput}
                        onChange={handleAIConversationInput}
                        onKeyPress={(e) => e.key === 'Enter' && submitAIQuestion()}
                      />
                      <motion.button
                        className="bg-accent text-background px-4 py-2 rounded-r-lg"
                        onClick={submitAIQuestion}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {/* Healthcare AI Quiz */}
                  <Quiz 
                    question={aiEthicsQuiz}
                    className="mb-8"
                  />
                  
                  {/* AI Ethics Vote Section */}
                  <div className="bg-tertiary/30 p-5 rounded-lg">
                    <h3 className="font-classic text-xl mb-4">What do you think?</h3>
                    <p className="mb-6 font-serif">After exploring AI's benefits and risks, what's your stance?</p>
                    
                    <div className="flex gap-4">
                      <motion.button 
                        onClick={() => handleVote('ai', 'ethical')}
                        className={`vote-button flex-1 py-3 px-4 rounded-lg border ${votes.ai === 'ethical' ? 'selected' : 'border-secondary'}`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="block text-lg font-classic mb-1">EMBRACE AI</span>
                        <span className="text-sm font-modern">Benefits outweigh risks</span>
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => handleVote('ai', 'unethical')}
                        className={`vote-button flex-1 py-3 px-4 rounded-lg border ${votes.ai === 'unethical' ? 'selected' : 'border-secondary'}`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="block text-lg font-classic mb-1">RESTRICT AI</span>
                        <span className="text-sm font-modern">Caution required</span>
                      </motion.button>
                    </div>
                    
                    {votes.ai && (
                      <motion.div 
                        className="mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span>Current community opinion</span>
                          <span>68% embrace AI</span>
                        </div>
                        <div className="ethics-progress">
                          <motion.div 
                            className="ethics-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: '68%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-center mt-2 font-serif italic">
                          Based on 1,248 responses
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Citation footer */}
              <div className="mt-16 border-t border-secondary/30 pt-6">
                <h4 className="font-classic text-lg mb-3">📝 Reference List (Simplified):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p>• Russell, S. & Norvig, P. (2020). <i>Artificial Intelligence: A Modern Approach.</i></p>
                  <p>• Topol, E. (2019). <i>Deep Medicine: How AI Can Make Healthcare Human Again.</i></p>
                  <p>• Buolamwini, J., & Gebru, T. (2018). <i>Gender Shades: Intersectional Accuracy Disparities.</i></p>
                  <p>• Frey, C. B., & Osborne, M. A. (2017). <i>The Future of Employment.</i></p>
                  <p>• Rolnick et al. (2019). <i>Tackling Climate Change with Machine Learning.</i></p>
                  <p>• Bostrom, N. (2014). <i>Superintelligence: Paths, Dangers, Strategies.</i></p>
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>
        
        {/* IVF Ethics Section */}
        <ScrollSection 
          id="ivf" 
          className="min-h-screen py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="ethics-card p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2">
                  <span className="font-mono text-sm text-accent uppercase tracking-wider animate-content">Topic 02</span>
                  <h2 className="font-classic text-3xl md:text-5xl font-bold mt-2 mb-6">
                    In Vitro <span className="text-highlight italic">Fertilization</span>
                  </h2>
                  
                  <div className="prose prose-lg prose-headings:font-classic prose-headings:font-bold">
                    <p className="font-serif animate-content">
                      IVF technology allows us to create embryos outside the womb and select which ones to implant based on genetic characteristics.
                    </p>
                    
                    <DataVisualization
                      data={ivfUsageData}
                      type="line"
                      title="IVF Usage Growth (1980-2020)"
                      description="Percentage of fertility treatments using IVF"
                      className="my-8 animate-content"
                    />
                    
                    <h3 className="text-xl mt-8 mb-4 animate-content">The Ethical Questions</h3>
                    
                    <ul className="space-y-3 font-modern animate-content">
                      <li>Is genetic selection a step toward a eugenic society?</li>
                      <li>What happens to unused embryos, and what moral status do they have?</li>
                      <li>Should parents be able to select non-medical traits in their children?</li>
                      <li>How do we ensure equitable access to reproductive technologies?</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex flex-col justify-between animate-content">
                  <div className="aspect-video bg-tertiary/50 rounded-lg flex items-center justify-center mb-8">
                    <p className="text-center font-classic italic text-lg">IVF interactive demonstration will appear here</p>
                  </div>
                  
                  <div>
                    <h3 className="font-classic text-xl mb-4">What do you think?</h3>
                    <p className="mb-6 font-serif">Is embryo selection for non-medical traits ethical?</p>
                    
                    <div className="flex gap-4">
                      <motion.button 
                        onClick={() => handleVote('ivf', 'ethical')}
                        className={`vote-button flex-1 py-3 px-4 rounded-lg border ${votes.ivf === 'ethical' ? 'selected' : 'border-secondary'}`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="block text-lg font-classic mb-1">Ethical</span>
                        <span className="text-sm font-modern">Parental choice</span>
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => handleVote('ivf', 'unethical')}
                        className={`vote-button flex-1 py-3 px-4 rounded-lg border ${votes.ivf === 'unethical' ? 'selected' : 'border-secondary'}`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="block text-lg font-classic mb-1">Unethical</span>
                        <span className="text-sm font-modern">Slippery slope</span>
                      </motion.button>
                    </div>
                    
                    {votes.ivf && (
                      <motion.div 
                        className="mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span>Current community opinion</span>
                          <span>42% ethical</span>
                        </div>
                        <div className="ethics-progress">
                          <motion.div 
                            className="ethics-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: '42%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-center mt-2 font-serif italic">
                          Based on 956 responses
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>
        
        {/* Cloning Ethics Section */}
        <ScrollSection 
          id="cloning" 
          className="min-h-screen py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="ethics-card p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2">
                  <span className="font-mono text-sm text-accent uppercase tracking-wider animate-content">Topic 03</span>
                  <h2 className="font-classic text-3xl md:text-5xl font-bold mt-2 mb-6">
                    Genetic <span className="text-highlight italic">Cloning</span>
                  </h2>
                  
                  <div className="prose prose-lg prose-headings:font-classic prose-headings:font-bold">
                    <p className="font-serif animate-content">
                      Cloning technology allows the creation of genetically identical organisms, with applications from agriculture to potentially humans.
                    </p>
                    
                    <DataVisualization
                      data={cloningEthicsData}
                      type="bar"
                      title="Ethical Perspectives on Cloning"
                      description="Support levels across different consideration areas (%)"
                      className="my-8 animate-content"
                    />
                    
                    <h3 className="text-xl mt-8 mb-4 animate-content">The Ethical Questions</h3>
                    
                    <ul className="space-y-3 font-modern animate-content">
                      <li>Does human cloning undermine human dignity and uniqueness?</li>
                      <li>What rights would a human clone have in society?</li>
                      <li>Is therapeutic cloning for organ harvesting acceptable?</li>
                      <li>How do we balance scientific progress with ethical boundaries?</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex flex-col justify-between animate-content">
                  <div className="aspect-video bg-tertiary/50 rounded-lg flex items-center justify-center mb-8">
                    <p className="text-center font-classic italic text-lg">Cloning interactive demonstration will appear here</p>
                  </div>
                  
                  <div>
                    <h3 className="font-classic text-xl mb-4">What do you think?</h3>
                    <p className="mb-6 font-serif">Should human cloning be permitted for any purpose?</p>
                    
                    <div className="flex gap-4">
                      <motion.button 
                        onClick={() => handleVote('cloning', 'ethical')}
                        className={`vote-button flex-1 py-3 px-4 rounded-lg border ${votes.cloning === 'ethical' ? 'selected' : 'border-secondary'}`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="block text-lg font-classic mb-1">Ethical</span>
                        <span className="text-sm font-modern">With regulation</span>
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => handleVote('cloning', 'unethical')}
                        className={`vote-button flex-1 py-3 px-4 rounded-lg border ${votes.cloning === 'unethical' ? 'selected' : 'border-secondary'}`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="block text-lg font-classic mb-1">Unethical</span>
                        <span className="text-sm font-modern">Never justified</span>
                      </motion.button>
                    </div>
                    
                    {votes.cloning && (
                      <motion.div 
                        className="mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span>Current community opinion</span>
                          <span>23% ethical</span>
                        </div>
                        <div className="ethics-progress">
                          <motion.div 
                            className="ethics-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: '23%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-center mt-2 font-serif italic">
                          Based on 812 responses
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>
        
        {/* Conclusion Section */}
        <ScrollSection 
          id="conclusion"
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="mb-8"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
              }}
            >
              <Image 
                src="/logo_thinknology.png" 
                alt="Thinknology Logo" 
                width={100} 
                height={100} 
                className="mx-auto"
              />
            </motion.div>
            
            <h2 className="font-classic text-3xl md:text-4xl font-bold mb-6 animate-content">
              The Journey of <span className="text-highlight italic">Ethical Reflection</span>
            </h2>
            
            <p className="font-serif text-lg mb-8 max-w-3xl mx-auto animate-content">
              Technology will continue to evolve, and so must our ethical frameworks. There are no easy answers, but the conversation itself is valuable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-content">
              <motion.a 
                className="rounded-full border border-accent px-6 py-3 hover:bg-accent hover:text-background transition-colors"
                href="#intro"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Over
              </motion.a>
              
              <motion.a 
                className="rounded-full bg-accent text-background px-6 py-3 hover:bg-accent/90 transition-colors"
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Your Thoughts
              </motion.a>
            </div>
          </div>
        </ScrollSection>
        
        <Footer />
      </div>
    </>
  );
}
