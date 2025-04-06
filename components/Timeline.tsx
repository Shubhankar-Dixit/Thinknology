import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface TimelineEvent {
  id: string;
  year: string | number;
  title: string;
  description: string;
  image?: string;
  color?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Timeline: React.FC<TimelineProps> = ({ 
  events, 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const [activeEvent, setActiveEvent] = useState<string>(events[0]?.id || '');
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  
  const handleEventClick = (id: string) => {
    setActiveEvent(id);
    
    if (orientation === 'horizontal' && eventsRef.current) {
      const eventElement = document.getElementById(`event-${id}`);
      if (eventElement) {
        const scrollPosition = eventElement.offsetLeft - (eventsRef.current.clientWidth / 2) + (eventElement.clientWidth / 2);
        eventsRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    if (timelineRef.current) {
      // Initialize timeline animation with GSAP
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1
        }
      });

      // Animate the timeline line
      timeline.fromTo(".timeline-line", 
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power2.out" }
      );

      // Animate the dots sequentially
      timeline.fromTo(".timeline-dot", 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.2, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.8"
      );
    }
  }, []);

  return (
    <div ref={timelineRef} className={`timeline ${className} my-8`}>
      {/* Timeline */}
      <div className={`relative ${orientation === 'vertical' ? 'h-full' : 'w-full'} mb-8`}>
        {/* Timeline line */}
        <div 
          className={`timeline-line ${orientation === 'vertical' 
            ? 'w-1 h-full absolute left-1/2 transform -translate-x-1/2' 
            : 'h-1 w-full'} 
            bg-secondary rounded-full origin-left`}
        />
        
        {/* Timeline dots and years */}
        <div 
          ref={eventsRef}
          className={`${orientation === 'horizontal' 
            ? 'flex space-x-16 overflow-x-auto pb-4 scrollbar-hide' 
            : 'space-y-16'}`}
        >
          {events.map((event, index) => (
            <div 
              key={event.id}
              id={`event-${event.id}`}
              className={`${orientation === 'vertical' 
                ? 'flex items-center' 
                : 'relative flex flex-col items-center'} 
                cursor-pointer`}
              onClick={() => handleEventClick(event.id)}
            >
              <motion.div 
                className={`timeline-dot w-6 h-6 rounded-full border-2 
                  ${event.id === activeEvent ? 'bg-highlight' : 'bg-background'} 
                  border-accent z-10 transition-colors duration-300`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
              <div 
                className={`font-classic text-lg font-bold 
                  ${orientation === 'vertical' 
                    ? 'ml-6' 
                    : 'mt-4'} 
                  ${event.id === activeEvent ? 'text-highlight' : 'text-accent'}`}
              >
                {event.year}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event details */}
      <div className="event-details">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: event.id === activeEvent ? 1 : 0,
              y: event.id === activeEvent ? 0 : 20,
              display: event.id === activeEvent ? 'block' : 'none'
            }}
            transition={{ duration: 0.5 }}
            className="bg-tertiary/30 p-6 rounded-lg"
          >
            <h3 className="font-classic text-2xl font-bold mb-2">{event.title}</h3>
            <p className="font-serif">{event.description}</p>
            {event.image && (
              <div className="mt-4">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="rounded-lg max-h-56 object-cover"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;