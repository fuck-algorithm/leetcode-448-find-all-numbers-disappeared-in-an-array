import { useEffect, useRef } from 'react';
import * as d3 from '../utils/d3Mock';
import { useAnimation } from '../contexts/AnimationContext';
import '../styles/AlgorithmAnimation.css';

const AlgorithmAnimation: React.FC = () => {
  const { state } = useAnimation();
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 计算当前数据快照
  const currentSnapshot = state.numsSnapshot[state.currentStep] || [];
  const n = currentSnapshot.length;
  
  // 计算当前阶段
  let animationPhase = "初始化";
  if (state.currentStep > n) {
    animationPhase = "找到缺失数字";
  } else if (state.currentStep > 0) {
    animationPhase = "标记存在的数字";
  }
  
  // 使用D3绘制数组动画
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    const padding = 50;
    const boxWidth = (width - 2 * padding) / n;
    const boxHeight = 60;
    
    // 清空SVG内容
    svg.selectAll("*").remove();
    
    // 绘制标题
    svg.append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text(`算法阶段: ${animationPhase}`);
    
    // 绘制数组背景和边框
    const arrayGroup = svg.append("g")
      .attr("transform", `translate(${padding}, 100)`);
    
    // 绘制索引标签
    for (let i = 0; i < n; i++) {
      arrayGroup.append("text")
        .attr("class", "index-label")
        .attr("x", i * boxWidth + boxWidth / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(i);
    }
    
    // 绘制数组元素
    for (let i = 0; i < n; i++) {
      // 计算元素颜色
      let boxClass = "array-box";
      let originalValue = currentSnapshot[i];
      let displayValue = originalValue;
      
      // 判断当前元素是否被修改过（大于n的元素已被标记）
      const isMarked = originalValue > n;
      
      // 如果是第二阶段遍历，显示处理后的值
      if (state.currentStep > n) {
        boxClass = isMarked ? "array-box marked" : "array-box missing";
      } else if (state.currentStep > 0 && i === ((currentSnapshot[state.currentStep-1] - 1) % n)) {
        // 高亮标记的元素
        boxClass = "array-box highlight";
      }
      
      // 绘制矩形背景
      arrayGroup.append("rect")
        .attr("class", boxClass)
        .attr("x", i * boxWidth)
        .attr("y", 0)
        .attr("width", boxWidth - 2)
        .attr("height", boxHeight)
        .attr("rx", 5);
      
      // 绘制元素值
      arrayGroup.append("text")
        .attr("class", "array-value")
        .attr("x", i * boxWidth + boxWidth / 2)
        .attr("y", boxHeight / 2 + 5)
        .attr("text-anchor", "middle")
        .text(displayValue);
      
      // 如果元素被修改，显示原始值
      if (isMarked) {
        arrayGroup.append("text")
          .attr("class", "array-original")
          .attr("x", i * boxWidth + boxWidth / 2)
          .attr("y", boxHeight + 20)
          .attr("text-anchor", "middle")
          .text(`原始值: ${displayValue % n || n}`);
      }
    }
    
    // 绘制当前指针（如果需要）
    if (state.currentStep > 0 && state.currentStep <= n) {
      const pointerIndex = state.currentStep - 1;
      const pointerX = pointerIndex * boxWidth + boxWidth / 2;
      
      // 绘制箭头
      arrayGroup.append("path")
        .attr("class", "pointer")
        .attr("d", `M ${pointerX} -30 L ${pointerX} -15 L ${pointerX + 10} -20 Z`)
        .attr("fill", "#3498db");
      
      // 显示当前处理的元素
      arrayGroup.append("text")
        .attr("class", "pointer-label")
        .attr("x", pointerX)
        .attr("y", -35)
        .attr("text-anchor", "middle")
        .text(`当前处理: ${currentSnapshot[pointerIndex]}`);
    }
    
    // 绘制结果数组
    if (state.currentStep > n) {
      const resultGroup = svg.append("g")
        .attr("transform", `translate(${padding}, 250)`);
      
      resultGroup.append("text")
        .attr("class", "result-title")
        .attr("x", 0)
        .attr("y", -10)
        .text("缺失的数字:");
      
      // 计算当前步骤下的结果子集
      const currentStep = state.currentStep - n - 1;
      const currentResults = state.result.slice(0, Math.min(currentStep + 1, state.result.length));
      
      for (let i = 0; i < currentResults.length; i++) {
        resultGroup.append("rect")
          .attr("class", "result-box")
          .attr("x", i * 50)
          .attr("y", 0)
          .attr("width", 40)
          .attr("height", 40)
          .attr("rx", 5);
        
        resultGroup.append("text")
          .attr("class", "result-value")
          .attr("x", i * 50 + 20)
          .attr("y", 25)
          .attr("text-anchor", "middle")
          .text(currentResults[i]);
      }
    }
    
    // 绘制操作日志
    svg.append("text")
      .attr("class", "operation-log")
      .attr("x", padding)
      .attr("y", 350)
      .text(state.operationLog[state.currentStep] || "");
    
  }, [currentSnapshot, state.currentStep, animationPhase, state.operationLog, state.result]);
  
  return (
    <div className="algorithm-animation">
      <svg ref={svgRef} width="800" height="400"></svg>
    </div>
  );
};

export default AlgorithmAnimation; 