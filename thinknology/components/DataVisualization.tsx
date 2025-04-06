import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface DataPoint {
  label: string;
  value: number;
  color: string;
  description?: string;
}

interface DataVisualizationProps {
  data: DataPoint[];
  title?: string;
  description?: string;
  type?: 'bar' | 'pie' | 'radar';
  animateIn?: boolean;
  className?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  title,
  description,
  type = 'bar',
  animateIn = true,
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clear previous visualizations
    if (svgRef.current) {
      d3.select(svgRef.current).remove();
    }

    // Set dimensions
    const width = chartRef.current.clientWidth;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'overflow-visible')
      .attr('xmlns', 'http://www.w3.org/2000/svg');

    svgRef.current = svg.node();

    // Create container for the chart
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (type === 'bar') {
      createBarChart(g, data, innerWidth, innerHeight);
    } else if (type === 'pie') {
      createPieChart(svg, data, width, height);
    } else if (type === 'radar') {
      createRadarChart(svg, data, width, height);
    }

  }, [data, type, chartRef]);

  const createBarChart = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: DataPoint[],
    width: number,
    height: number
  ) => {
    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 100])
      .nice()
      .range([height, 0]);

    // Add the x-axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', 'currentColor');

    // Add the y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'currentColor');

    // Add bars with animation
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) as number)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', d => d.color)
      .transition()
      .duration(1000)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

    // Add value labels
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.label) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .style('opacity', 0)
      .text(d => `${d.value}%`)
      .transition()
      .delay(500)
      .duration(500)
      .style('opacity', 1);
  };

  const createPieChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: DataPoint[],
    width: number,
    height: number
  ) => {
    const radius = Math.min(width, height) / 2 - 40;
    
    // Create container for the pie chart
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create the pie layout
    const pie = d3.pie<DataPoint>()
      .value(d => d.value)
      .sort(null);

    // Create the arc generator
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Create the arc generator for hover effect
    const arcHover = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius + 10);

    // Create slices
    const slices = g.selectAll('.slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice');

    // Add the path (slice)
    slices.append('path')
      .attr('d', d => arc(d) as string)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', d => arcHover(d as d3.PieArcDatum<DataPoint>) as string)
          .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', d => arc(d as d3.PieArcDatum<DataPoint>) as string)
          .style('opacity', 0.8);
      });

    // Add labels
    slices.append('text')
      .attr('transform', d => {
        const centroid = arc.centroid(d);
        return `translate(${centroid[0]},${centroid[1]})`;
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .text(d => `${d.data.value}%`);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120},20)`)
      .selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => d.color);

    legend.append('text')
      .attr('x', 20)
      .attr('y', 6)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text(d => d.label);
  };

  const createRadarChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: DataPoint[],
    width: number,
    height: number
  ) => {
    const radius = Math.min(width, height) / 2 - 40;
    const center = { x: width / 2, y: height / 2 };
    
    // Calculate positions for each axis
    const angleSlice = (Math.PI * 2) / data.length;
    
    // Create scales
    const rScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 100])
      .range([0, radius]);
    
    // Draw the circular grid
    const levels = 5;
    const g = svg.append('g')
      .attr('transform', `translate(${center.x},${center.y})`);
    
    // Draw the grid levels
    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      
      // Create level circles
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', levelFactor)
        .style('fill', 'none')
        .style('stroke', 'currentColor')
        .style('stroke-opacity', 0.1)
        .style('stroke-width', '0.5px');
      
      // Add text for each level
      g.append('text')
        .attr('x', 0)
        .attr('y', -levelFactor)
        .attr('dy', '-0.5em')
        .style('font-size', '10px')
        .style('fill', 'currentColor')
        .style('opacity', 0.5)
        .style('text-anchor', 'middle')
        .text(Math.round(((j + 1) * (d3.max(data, d => d.value) || 100)) / levels) + '%');
    }
    
    // Draw the axes
    const axes = g.selectAll('.axis')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'axis');
    
    axes.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(d3.max(data, d => d.value) || 100) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(d3.max(data, d => d.value) || 100) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('stroke', 'currentColor')
      .style('stroke-width', '1px')
      .style('stroke-opacity', 0.3);
    
    // Draw axis labels
    axes.append('text')
      .attr('x', (d, i) => (radius + 10) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => (radius + 10) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .style('text-anchor', (d, i) => {
        if (angleSlice * i - Math.PI / 2 === 0) return 'middle';
        return (angleSlice * i - Math.PI / 2 > Math.PI / 2 && angleSlice * i - Math.PI / 2 < 3 * Math.PI / 2) ? 'end' : 'start';
      })
      .style('dominant-baseline', (d, i) => {
        if (angleSlice * i - Math.PI / 2 === Math.PI / 2 || angleSlice * i - Math.PI / 2 === 3 * Math.PI / 2) return 'middle';
        return (angleSlice * i - Math.PI / 2 > 0 && angleSlice * i - Math.PI / 2 < Math.PI) ? 'hanging' : 'auto';
      })
      .text(d => d.label);
    
    // Draw radar chart path
    const radarLine = d3.lineRadial<DataPoint>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);
    
    g.append('path')
      .datum(data)
      .attr('d', radarLine as any)
      .style('fill', 'rgba(217, 121, 65, 0.5)')
      .style('stroke', '#d97941')
      .style('stroke-width', '2px')
      .style('fill-opacity', 0)
      .transition()
      .duration(1000)
      .style('fill-opacity', 0.6);
    
    // Draw data points
    g.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('r', 4)
      .style('fill', '#d97941')
      .style('stroke', '#fff')
      .style('stroke-width', '2px')
      .style('opacity', 0)
      .transition()
      .delay((d, i) => 200 * i)
      .duration(500)
      .style('opacity', 1);
  };

  return (
    <motion.div 
      className={`data-visualization ${className}`}
      initial={animateIn ? { opacity: 0, y: 20 } : { opacity: 1 }}
      animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <h3 className="font-classic text-xl mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-sm text-foreground/70 mb-4">{description}</p>
      )}
      
      <div 
        ref={chartRef} 
        className="min-h-[300px] w-full"
      />
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <div className="w-3 h-3 mt-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <div>
              <div className="font-medium">{item.label}: {item.value}%</div>
              {item.description && (
                <div className="text-xs text-foreground/70">{item.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DataVisualization;