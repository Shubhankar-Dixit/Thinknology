import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';

import DilemmaScene, { DilemmaData } from '../components/DilemmaScene';
import TypewriterText from '../components/TypewriterText';
import ProgressIndicator from '../components/ProgressIndicator';
import DataVisualization from '../components/DataVisualization';
import NeuralBackground from '../../components/NeuralBackground';
import Footer from '../../components/Footer';
import { playSound, useBackgroundAudio, preloadSounds } from '../utils/audio';

// Define our dilemmas
const DILEMMAS: DilemmaData[] = [
  {
    id: 'lost-wallet',
    title: 'The Lost Wallet',
    description: 'You\'re walking home late one evening and find a wallet on the sidewalk. Inside is $500 in cash, several credit cards, and the owner\'s ID with their address.',
    question: 'Do you return the wallet, keep everything, or take the cash and leave the wallet where others might find it?',
    choices: [
      {
        id: 'return-wallet',
        text: 'Return the wallet intact',
        description: 'Take it to the address on the ID',
        consequences: 'The owner is incredibly grateful and offers you a $50 reward, which you politely decline. You feel a warm sense of pride in doing the right thing, though you wonder briefly if you could have used that money.'
      },
      {
        id: 'keep-everything',
        text: 'Keep everything',
        description: 'Pocket the wallet and its contents',
        consequences: 'You use the money to pay some bills and cut up the credit cards. Occasionally, you wonder if the person was struggling financially and needed that money for something important. The guilt lingers, but fades with time.'
      },
      {
        id: 'take-cash-only',
        text: 'Take the cash, leave the wallet',
        description: 'Remove the money and drop the wallet where it can be found',
        consequences: 'You rationalize that the cash would be gone anyway if someone else found it, but at least the owner will get their ID and cards back. You feel a mix of guilt and self-justification.'
      }
    ],
    statistics: [
      { label: 'Return Wallet', value: 63, color: '#6d9f71', description: '63% of participants returned the wallet intact' },
      { label: 'Keep Everything', value: 12, color: '#b25d64', description: '12% kept the wallet and all contents' },
      { label: 'Take Cash Only', value: 25, color: '#c99d58', description: '25% took only the cash and left the wallet' }
    ]
  },
  {
    id: 'trolley-problem',
    title: 'The Trolley Dilemma',
    description: 'You\'re standing by a lever controlling railway tracks. An out-of-control trolley is heading for five people who will be killed if it proceeds on its current path. You can pull the lever, diverting the trolley to a side track where it will kill one person instead.',
    question: 'Do you pull the lever, actively causing one death but saving five, or do nothing, allowing nature to take its course?',
    choices: [
      {
        id: 'pull-lever',
        text: 'Pull the lever',
        description: 'Divert the trolley, save five, kill one',
        consequences: 'You pull the lever and watch as the trolley diverts, saving the five people but killing the one person on the side track. You\'ve saved more lives, but you\'ll always carry the knowledge that you actively caused someone\'s death.'
      },
      {
        id: 'do-nothing',
        text: 'Do nothing',
        description: 'Let the trolley continue on its path',
        consequences: 'You freeze, unable to take an action that would directly cause someone\'s death. The trolley continues and kills the five people. You tell yourself it wasn\'t your responsibility, but you wonder if your inaction was itself a choice.'
      }
    ],
    statistics: [
      { label: 'Pull Lever', value: 78, color: '#6d9f71', description: '78% chose utilitarian approach' },
      { label: 'Do Nothing', value: 22, color: '#b25d64', description: '22% refused to intervene' }
    ]
  },
  {
    id: 'damaging-secret',
    title: 'The Damaging Secret',
    description: 'You\'ve discovered that your best friend\'s partner has been having an affair. Your friend is deeply in love and planning to propose next month. Nobody else knows about this affair.',
    question: 'Do you tell your friend what you know, potentially saving them from future pain but certainly causing immediate heartbreak, or keep the secret?',
    choices: [
      {
        id: 'tell-friend',
        text: 'Tell your friend',
        description: 'Reveal the painful truth',
        consequences: 'Your friend is devastated but eventually thanks you for your honesty. The relationship ends, and while your friend goes through a difficult period, they eventually meet someone new. Your friendship emerges stronger, built on trust and honesty.'
      },
      {
        id: 'keep-secret',
        text: 'Keep the secret',
        description: 'Stay out of their relationship',
        consequences: 'You decide it\'s not your place to interfere. Six months after the proposal, your friend discovers the affair on their own. The resulting divorce is messy and expensive. Your friend is hurt that you knew and didn\'t say anything, and your relationship is never quite the same.'
      },
      {
        id: 'confront-partner',
        text: 'Confront the partner',
        description: 'Give them a chance to come clean',
        consequences: 'You meet the partner privately and tell them what you know. They beg for another chance and promise to end the affair. Two years later, they slip again, and this time your friend finds out. When they learn you knew about the first affair, they feel betrayed by both of you.'
      }
    ],
    statistics: [
      { label: 'Tell Friend', value: 58, color: '#6d9f71', description: '58% prioritized honesty' },
      { label: 'Keep Secret', value: 21, color: '#b25d64', description: '21% avoided involvement' },
      { label: 'Confront Partner', value: 21, color: '#c99d58', description: '21% tried a middle path' }
    ]
  },
  {
    id: 'ai-medical',
    title: 'AI Medical Decision',
    description: 'You\'re the administrator of a large hospital. A new AI diagnostic system can detect certain cancers 15% more accurately than human doctors, but in 5% of cases, it gives false positives that lead to unnecessary treatments with painful side effects.',
    question: 'Do you implement this system, potentially saving more lives but harming others through false positives?',
    choices: [
      {
        id: 'implement-fully',
        text: 'Fully implement the AI system',
        description: 'Let AI make the final diagnosis',
        consequences: 'Over the first year, the system helps detect 200 cancers that doctors would have missed, saving many lives. However, 70 patients undergo unnecessary chemotherapy due to false positives, suffering significant side effects and psychological trauma. The hospital faces three lawsuits.'
      },
      {
        id: 'hybrid-approach',
        text: 'Use a hybrid approach',
        description: 'AI flags cases, doctors make final decisions',
        consequences: 'The hybrid approach catches fewer early cancers than full AI implementation would have, but significantly reduces false positives. Some doctors begin relying too heavily on the AI and miss things they would have caught on their own, while others dismiss AI flags that turn out to be correct.'
      },
      {
        id: 'reject-system',
        text: 'Reject the system',
        description: 'Continue with traditional diagnostic methods',
        consequences: 'You maintain the status quo. Your hospital continues to have outcomes comparable to other top hospitals. Occasionally, you wonder how many lives could have been saved with the AI system, but you\'re comforted knowing you\'ve harmed no one with false positives.'
      }
    ],
    statistics: [
      { label: 'Fully Implement', value: 31, color: '#6d9f71', description: '31% prioritized saving more lives' },
      { label: 'Hybrid Approach', value: 63, color: '#c99d58', description: '63% chose balanced approach' },
      { label: 'Reject System', value: 6, color: '#b25d64', description: '6% avoided potential harm' }
    ]
  },
  {
    id: 'privacy-security',
    title: 'Privacy vs. Security',
    description: 'As head of security for a major city, you\'re presented with a proposal for a comprehensive surveillance system that would place cameras and monitoring devices throughout public spaces. This system would likely reduce crime by 40% and help solve cases faster.',
    question: 'Do you implement this system, enhancing security but dramatically reducing privacy for your citizens?',
    choices: [
      {
        id: 'full-surveillance',
        text: 'Implement the full system',
        description: 'Maximum security, minimum privacy',
        consequences: 'Crime drops dramatically, and people initially feel safer. Over time, protests emerge about the "surveillance state." Reports surface of security personnel using cameras to stalk ex-partners or monitor political activists. Citizens become more cautious in public, changing behavior even when doing nothing wrong.'
      },
      {
        id: 'limited-surveillance',
        text: 'Implement a limited version',
        description: 'Balance security and privacy',
        consequences: 'You deploy cameras only in high-crime areas and implement strict controls on who can access the footage. Crime drops in monitored areas but increases in unmonitored zones. The system helps solve several high-profile cases, but debates continue about equality and fairness in monitored vs. unmonitored neighborhoods.'
      },
      {
        id: 'reject-surveillance',
        text: 'Reject the proposal',
        description: 'Preserve privacy entirely',
        consequences: 'You announce that citizen privacy is non-negotiable. Crime rates remain unchanged. After a terrorist attack occurs that might have been prevented with surveillance, public opinion turns against your decision, though civil liberties groups continue to support you strongly.'
      }
    ],
    statistics: [
      { label: 'Full System', value: 16, color: '#b25d64', description: '16% prioritized security above all' },
      { label: 'Limited System', value: 67, color: '#c99d58', description: '67% sought balance' },
      { label: 'Reject System', value: 17, color: '#6d9f71', description: '17% prioritized privacy' }
    ]
  }
];

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [activeDilemmaIndex, setActiveDilemmaIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<{[key: string]: {choiceId: string, feedback?: string}}>({});
  const [showResults, setShowResults] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExperienceComplete, setIsExperienceComplete] = useState(false);
  
  // Preload sounds on component mount
  useEffect(() => {
    preloadSounds();
  }, []);

  // Use our custom hook for background audio
  const { toggleMute } = useBackgroundAudio(isIntroComplete, isMuted);

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleIntroComplete = () => {
    setIsIntroComplete(true);
    
    // Play transition sound
    playSound('transition', isMuted);
  };

  const handleDilemmaComplete = (choiceId: string, feedback?: string) => {
    // Save user's choice and feedback
    setUserChoices(prev => ({
      ...prev,
      [DILEMMAS[activeDilemmaIndex].id]: { choiceId, feedback }
    }));
    
    // Play complete sound
    playSound('complete', isMuted);

    // If this was the last dilemma, show results
    if (activeDilemmaIndex === DILEMMAS.length - 1) {
      setShowResults(true);
    } else {
      // Move to next dilemma
      setTimeout(() => {
        setActiveDilemmaIndex(prevIndex => prevIndex + 1);
      }, 500);
    }
  };

  const restartExperience = () => {
    setUserChoices({});
    setActiveDilemmaIndex(0);
    setShowResults(false);
    setIsExperienceComplete(false);
    
    // Play transition sound
    playSound('transition', isMuted);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getUserArchetype = () => {
    // Count the types of choices made
    const choiceTypes = {
      utilitarian: 0,
      deontological: 0,
      virtueEthics: 0,
      pragmatic: 0,
      principled: 0
    };
    
    Object.entries(userChoices).forEach(([dilemmaId, { choiceId }]) => {
      switch (dilemmaId) {
        case 'lost-wallet':
          if (choiceId === 'return-wallet') choiceTypes.principled++;
          else if (choiceId === 'keep-everything') choiceTypes.utilitarian++;
          else if (choiceId === 'take-cash-only') choiceTypes.pragmatic++;
          break;
        case 'trolley-problem':
          if (choiceId === 'pull-lever') choiceTypes.utilitarian++;
          else choiceTypes.deontological++;
          break;
        case 'damaging-secret':
          if (choiceId === 'tell-friend') choiceTypes.principled++;
          else if (choiceId === 'keep-secret') choiceTypes.pragmatic++;
          else if (choiceId === 'confront-partner') choiceTypes.virtueEthics++;
          break;
        case 'ai-medical':
          if (choiceId === 'implement-fully') choiceTypes.utilitarian++;
          else if (choiceId === 'hybrid-approach') choiceTypes.pragmatic++;
          else if (choiceId === 'reject-system') choiceTypes.principled++;
          break;
        case 'privacy-security':
          if (choiceId === 'full-surveillance') choiceTypes.utilitarian++;
          else if (choiceId === 'limited-surveillance') choiceTypes.pragmatic++;
          else if (choiceId === 'reject-surveillance') choiceTypes.principled++;
          break;
      }
    });
    
    // Find the dominant type
    const dominantType = Object.entries(choiceTypes).reduce(
      (max, [type, count]) => count > max.count ? { type, count } : max,
      { type: '', count: 0 }
    );
    
    // Return an appropriate label
    switch (dominantType.type) {
      case 'utilitarian':
        return { title: 'The Pragmatic Utilitarian', description: 'You tend to make choices that maximize overall benefit, even if some are harmed in the process. You believe the ends can justify the means.' };
      case 'deontological':
        return { title: 'The Rule Follower', description: 'You believe in moral absolutes and following rules. You avoid actions that use others as means to an end, even if the outcome would be better.' };
      case 'virtueEthics':
        return { title: 'The Virtue Ethicist', description: 'You focus on being a good person with the right intentions, rather than following strict rules or maximizing outcomes.' };
      case 'pragmatic':
        return { title: 'The Practical Compromiser', description: 'You often seek middle paths that balance competing values, avoiding extreme positions in favor of workable solutions.' };
      case 'principled':
        return { title: 'The Principled Idealist', description: 'You stand by your principles even when they come at a personal cost. You prioritize integrity and honesty.' };
      default:
        return { title: 'The Balanced Thinker', description: 'You show a mix of ethical approaches, adapting your thinking to each unique situation.' };
    }
  };

  const renderCompletionStats = () => {
    const totalDilemmas = DILEMMAS.length;
    const completedDilemmas = Object.keys(userChoices).length;
    const completionPercentage = (completedDilemmas / totalDilemmas) * 100;
    
    const dilemmaStats = DILEMMAS.map(dilemma => {
      const userChoice = userChoices[dilemma.id]?.choiceId;
      const matchingChoice = dilemma.choices.find(c => c.id === userChoice);
      
      return {
        dilemmaTitle: dilemma.title,
        choiceText: matchingChoice?.text || 'Not answered',
        feedback: userChoices[dilemma.id]?.feedback || ''
      };
    });
    
    const archetype = getUserArchetype();
    
    return (
      <div className="stats-container space-y-8">
        <div className="archetype-container p-6 bg-tertiary/20 rounded-lg text-center">
          <h3 className="font-classic text-2xl mb-2">Your Ethical Archetype</h3>
          <div className="archetype-title text-highlight text-3xl font-bold mb-2">{archetype.title}</div>
          <p className="font-serif">{archetype.description}</p>
        </div>
        
        <div className="dilemma-review space-y-4">
          <h3 className="font-classic text-xl">Your Journey</h3>
          {dilemmaStats.map((stat, index) => (
            <div key={index} className="p-4 bg-tertiary/10 rounded-lg">
              <div className="font-bold">{stat.dilemmaTitle}</div>
              <div className="text-accent">You chose: {stat.choiceText}</div>
              {stat.feedback && (
                <div className="mt-2 italic text-sm font-serif">"{stat.feedback}"</div>
              )}
            </div>
          ))}
        </div>
        
        <div className="share-container text-center mt-8">
          <h3 className="font-classic text-xl mb-4">Share Your Ethical Profile</h3>
          <div className="flex justify-center gap-4">
            <button className="p-3 rounded-full bg-[#1DA1F2] text-white">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button className="p-3 rounded-full bg-[#4267B2] text-white">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="p-3 rounded-full bg-[#0A66C2] text-white">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const sceneVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Head>
        <title>Thinknology - Moral Dilemmas</title>
        <meta name="description" content="Explore your ethical compass through interactive moral dilemmas" />
      </Head>

      {/* Sound controls */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={handleToggleMute}
          className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-md"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" />
              <path d="M23 9L17 15" />
              <path d="M17 9L23 15" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" />
              <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" />
            </svg>
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="min-h-screen bg-gradient-to-br from-background to-tertiary/10">
        {/* Neural Network Background */}
        <NeuralBackground />
        
        {/* Introduction */}
        <AnimatePresence mode="wait">
          {!isIntroComplete && (
            <motion.div 
              className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
              variants={sceneVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="intro"
            >
              <div className="max-w-3xl mx-auto text-center z-10">
                <div className="mb-12">
                  <Image 
                    src="/logo_thinknology.png" 
                    alt="Thinknology Logo" 
                    width={160} 
                    height={160} 
                    className="mx-auto"
                  />
                </div>
                
                <h1 className="font-classic text-5xl md:text-6xl font-bold mb-8">
                  <span className="text-highlight">Moral</span> Dilemmas
                </h1>
                
                <div className="bg-background/90 backdrop-blur-md p-8 rounded-xl shadow-lg mb-8">
                  <TypewriterText 
                    text="Welcome to a journey through ethical decision-making. You'll be presented with a series of moral dilemmas and asked to make choices that reveal your ethical compass."
                    element="p"
                    className="font-serif text-xl mb-6"
                    speed={40}
                  />
                  
                  <TypewriterText 
                    text="There are no right or wrong answers—only reflections of your values and perspectives. Each dilemma will challenge you to consider difficult situations where multiple values may compete."
                    element="p"
                    className="font-serif text-xl mb-6"
                    delay={5000}
                    speed={40}
                  />
                  
                  <TypewriterText 
                    text="At the end, you'll discover your ethical archetype and see how your choices compare to others. Are you ready to begin?"
                    element="p"
                    className="font-serif text-xl"
                    delay={11000}
                    speed={40}
                    onComplete={() => {
                      setTimeout(() => {
                        const button = document.getElementById('start-button');
                        if (button) {
                          button.style.opacity = '1';
                          button.style.transform = 'translateY(0)';
                        }
                      }, 1000);
                    }}
                  />
                </div>
                
                <button
                  id="start-button"
                  onClick={handleIntroComplete}
                  className="px-8 py-4 bg-accent text-background rounded-full text-xl font-classic hover:bg-accent/90 transition-all duration-500 opacity-0 transform translate-y-8"
                  style={{ opacity: 0, transform: 'translateY(2rem)' }}
                >
                  Begin the Journey
                </button>
              </div>
              
              {/* No decorative elements with SVGs - they're replaced by the neural background */}
            </motion.div>
          )}

          {isIntroComplete && !showResults && (
            <motion.div
              className="min-h-screen py-10 px-4 relative"
              key="dilemmas"
              variants={sceneVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Decorative background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
                  animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-tertiary/10 blur-3xl"
                  animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
                />
              </div>
              
              <div className="max-w-6xl mx-auto">
                {/* Progress indicator */}
                <div className="mb-8 pt-12">
                  <ProgressIndicator 
                    currentIndex={activeDilemmaIndex}
                    totalSteps={DILEMMAS.length}
                    labels={DILEMMAS.map(d => d.title)}
                  />
                </div>
                
                {/* Dilemmas */}
                <AnimatePresence mode="wait">
                  {DILEMMAS.map((dilemma, index) => (
                    <DilemmaScene
                      key={dilemma.id}
                      dilemma={dilemma}
                      isActive={index === activeDilemmaIndex}
                      onComplete={handleDilemmaComplete}
                      isMuted={isMuted}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {showResults && (
            <motion.div
              className="min-h-screen py-16 px-4"
              key="results"
              variants={sceneVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <Image 
                    src="/logo_thinknology.png" 
                    alt="Thinknology Logo" 
                    width={100} 
                    height={100} 
                    className="mx-auto mb-6"
                  />
                  <h2 className="font-classic text-4xl font-bold mb-4">
                    Your <span className="text-highlight">Ethical</span> Journey
                  </h2>
                  <p className="font-serif text-lg max-w-2xl mx-auto">
                    Thank you for exploring these moral dilemmas. Here's a summary of your choices and what they might suggest about your ethical perspective.
                  </p>
                </div>
                
                <div className="bg-background/90 backdrop-blur-md p-8 rounded-xl shadow-lg">
                  {renderCompletionStats()}
                </div>
                
                <div className="mt-12 text-center">
                  <button
                    onClick={restartExperience}
                    className="px-8 py-3 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-background transition-colors"
                  >
                    Start a New Journey
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}