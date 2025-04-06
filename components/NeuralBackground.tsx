import React, { useEffect, useRef } from 'react';

interface NeuronNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Connection {
  source: number;
  target: number;
  strength: number;
  active: boolean;
  lastActive: number;
}

const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<NeuronNode[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  
  // Initialize the neural network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeNetwork();
    };
    
    const initializeNetwork = () => {
      const numNodes = Math.max(20, Math.floor(window.innerWidth * window.innerHeight / 25000));
      
      // Create neurons
      const nodes: NeuronNode[] = [];
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 2
        });
      }
      nodesRef.current = nodes;
      
      // Create connections between neurons
      const connections: Connection[] = [];
      const maxDistance = Math.min(canvas.width, canvas.height) * 0.15;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            connections.push({
              source: i,
              target: j,
              strength: 1 - distance / maxDistance,
              active: Math.random() > 0.7,
              lastActive: Date.now()
            });
          }
        }
      }
      connectionsRef.current = connections;
    };
    
    // Animation loop
    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const now = Date.now();
      
      // Draw connections
      connections.forEach(connection => {
        const source = nodes[connection.source];
        const target = nodes[connection.target];
        
        // Toggle connection activity randomly
        if (Math.random() < 0.002) {
          connection.active = !connection.active;
          connection.lastActive = now;
        }
        
        const timeSinceToggle = now - connection.lastActive;
        const opacity = connection.active 
          ? Math.min(1, timeSinceToggle / 500) 
          : Math.max(0, 1 - timeSinceToggle / 500);
        
        if (opacity > 0) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(150, 150, 200, ${opacity * connection.strength * 0.5})`;
          ctx.lineWidth = connection.strength * 1.5;
          ctx.stroke();
        }
      });
      
      // Draw and update nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 180, 220, 0.8)';
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Initial setup
    resizeCanvas();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.25 }}
    />
  );
};

export default NeuralBackground;