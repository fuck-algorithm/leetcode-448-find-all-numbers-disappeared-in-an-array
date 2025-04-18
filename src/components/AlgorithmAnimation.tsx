import React, { useEffect, useRef } from 'react';
import { select, D3Selection } from '../utils/d3Mock';
import { useAnimation } from '../contexts/AnimationContext';
import '../styles/AlgorithmAnimation.css';

const AlgorithmAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useAnimation();
  
  // 初始化SVG
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = select(svgRef.current);
    svg.attr('width', '100%')
       .attr('height', '300')
       .attr('viewBox', '0 0 800 300');
  }, []);

  // 绘制数组元素
  const drawArray = (svg: D3Selection) => {
    const boxSize = 40;
    const startX = 50;
    const startY = 100;
    
    svg.selectAll('*').remove();
    
    state.numsSnapshot[state.currentStep].forEach((num: number, i: number) => {
      const group = svg.append('g');
      
      // 绘制矩形
      group.append('rect')
           .attr('x', (startX + i * (boxSize + 10)).toString())
           .attr('y', startY.toString())
           .attr('width', boxSize.toString())
           .attr('height', boxSize.toString())
           .attr('fill', 'white')
           .attr('stroke', '#333')
           .attr('stroke-width', '2');
      
      // 添加文本
      group.append('text')
           .attr('x', (startX + i * (boxSize + 10) + boxSize/2).toString())
           .attr('y', (startY + boxSize/2 + 5).toString())
           .attr('text-anchor', 'middle')
           .text(num.toString());
    });
  };

  // 处理动画状态变化
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = select(svgRef.current);
    
    if (state.currentStep === 0) {
      drawArray(svg);
      return;
    }
    
    if (state.isPlaying) {
      drawArray(svg);
    }
  }, [state.currentStep, state.isPlaying, state.numsSnapshot]);

  return (
    <div className="algorithm-animation">
      <svg ref={svgRef} className="animation-svg"></svg>
    </div>
  );
};

export default AlgorithmAnimation; 