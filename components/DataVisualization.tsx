import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

export type ChartType = 'bar' | 'pie' | 'line' | 'scatter';

export interface DataPoint {
  id: string;
  label: string;
  value: number;
  color?: string;
  category?: string;
  description?: string;
}

interface DataVisualizationProps {
  data: DataPoint[];
  type: ChartType;
  title?: string;
  description?: string;
  height?: number;
  className?: string;
  animated?: boolean;
  interactive?: boolean;
}

interface SVGEvent {
  currentTarget: SVGElement;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  type,
  title,
  description,
  height = 300,
  className = '',
  animated = true,
  interactive = true
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;

    // Create intersection observer for animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(chartRef.current);
    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !isVisible) return;

    // Clear any previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Default color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.id))
      .range(data.map(d => d.color || '#8c7851'));

    // Render charts based on type
    if (type === 'bar') {
      // Bar chart
      const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.3);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .range([chartHeight, 0]);

      // Add X axis
      svg.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Add Y axis
      svg.append("g").call(d3.axisLeft(y));

      // Add bars
      svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.label) || 0)
        .attr("width", x.bandwidth())
        .attr("fill", d => colorScale(d.id))
        .attr("stroke", "white")
        .attr("rx", 3)
        .on("mouseover", function(this: SVGElement, event: MouseEvent, d: DataPoint) {
          if (interactive) {
            d3.select(this).attr("fill", "#d97941");
            setActivePoint(d.id);
          }
        })
        .on("mouseout", function(this: SVGElement, event: MouseEvent, d: DataPoint) {
          if (interactive) {
            d3.select(this).attr("fill", colorScale(d.id));
            setActivePoint(null);
          }
        });

      // Animate bars if enabled
      if (animated) {
        svg.selectAll("rect")
          .attr("y", chartHeight)
          .attr("height", 0)
          .transition()
          .duration(800)
          .delay((d, i) => i * 100)
          .attr("y", d => y(d.value))
          .attr("height", d => chartHeight - y(d.value));
      } else {
        svg.selectAll("rect")
          .attr("y", d => y(d.value))
          .attr("height", d => chartHeight - y(d.value));
      }
    } else if (type === 'pie') {
      // Pie chart
      const radius = Math.min(width, chartHeight) / 2;
      
      const pie = d3.pie<DataPoint>()
        .value(d => d.value)
        .sort(null);
      
      const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
        .innerRadius(radius * 0.4) // Donut hole size
        .outerRadius(radius);
      
      const arcs = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${chartHeight / 2})`)
        .selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("fill", d => colorScale(d.data.id))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("mouseover", function(this: SVGElement, event: MouseEvent, d: d3.PieArcDatum<DataPoint>) {
          if (interactive) {
            d3.select(this).attr("opacity", 0.8).attr("transform", "scale(1.05)");
            setActivePoint(d.data.id);
          }
        })
        .on("mouseout", function(this: SVGElement, event: MouseEvent, d: d3.PieArcDatum<DataPoint>) {
          if (interactive) {
            d3.select(this).attr("opacity", 1).attr("transform", "scale(1)");
            setActivePoint(null);
          }
        });
      
      // Add labels
      const outerArc = d3.arc<d3.PieArcDatum<DataPoint>>()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);
      
      svg.select("g")
        .selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${outerArc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => d.data.label);
      
      // Animate pie segments if enabled
      if (animated) {
        arcs.attr("d", d3.arc<d3.PieArcDatum<DataPoint>>()
          .innerRadius(radius * 0.4)
          .outerRadius(0))
          .transition()
          .duration(800)
          .delay((d, i) => i * 100)
          .attrTween("d", function(d) {
            const i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
            return function(t) {
              return arc(i(t));
            };
          });
      } else {
        arcs.attr("d", arc);
      }
    } else if (type === 'line') {
      // Line chart
      const x = d3.scalePoint()
        .domain(data.map(d => d.label))
        .range([0, width]);
      
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .range([chartHeight, 0]);
      
      // Add X axis
      svg.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x));
      
      // Add Y axis
      svg.append("g").call(d3.axisLeft(y));
      
      // Add the line
      const line = d3.line<DataPoint>()
        .x(d => x(d.label) || 0)
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);
      
      const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#8c7851")
        .attr("stroke-width", 3)
        .attr("d", line);
      
      // Add dots
      svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.label) || 0)
        .attr("cy", d => y(d.value))
        .attr("r", 6)
        .attr("fill", d => colorScale(d.id))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(this: SVGElement, event: MouseEvent, d: DataPoint) {
          if (interactive) {
            d3.select(this).attr("r", 8).attr("fill", "#d97941");
            setActivePoint(d.id);
          }
        })
        .on("mouseout", function(this: SVGElement, event: MouseEvent, d: DataPoint) {
          if (interactive) {
            d3.select(this).attr("r", 6).attr("fill", colorScale(d.id));
            setActivePoint(null);
          }
        });
      
      // Animate line if enabled
      if (animated) {
        const totalLength = path.node()?.getTotalLength() || 0;
        path.attr("stroke-dasharray", totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(1000)
          .attr("stroke-dashoffset", 0);
        
        svg.selectAll("circle")
          .attr("opacity", 0)
          .transition()
          .duration(800)
          .delay((d, i) => 1000 + i * 100)
          .attr("opacity", 1);
      }
    }

  }, [data, type, height, isVisible, interactive, animated]);

  return (
    <div className={`data-visualization ${className}`}>
      {title && <h3 className="font-classic text-xl mb-4 text-center">{title}</h3>}
      {description && <p className="font-serif text-sm mb-4 text-center">{description}</p>}
      
      <div 
        ref={chartRef} 
        className="chart-container w-full" 
        style={{ height: `${height}px` }}
      />
      
      {activePoint && interactive && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="tooltip bg-tertiary/80 p-3 rounded-lg mt-2"
        >
          <p className="font-classic">{data.find(d => d.id === activePoint)?.label}</p>
          {data.find(d => d.id === activePoint)?.description && (
            <p className="font-serif text-sm mt-1">
              {data.find(d => d.id === activePoint)?.description}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DataVisualization;