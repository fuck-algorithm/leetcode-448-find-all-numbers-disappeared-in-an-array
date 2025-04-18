/**
 * 简化版D3模拟实现，用于绘制动画
 */

// 元素类型
export type D3Selection = SVGSelection | TextSelection | RectSelection | PathSelection | GroupSelection;

// SVG选择器
export function select(element: SVGSVGElement): SVGSelection {
  return new SVGSelection(element);
}

// 动画缓动函数
export const easeLinear = (t: number) => t;
export const easeQuadOut = (t: number) => t * (2 - t);
export const easeBackOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const easeElasticOut = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
export const easePolyIn = (t: number) => Math.pow(t, 3);
export const easeExpOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// SVG选择器实现
class SVGSelection {
  element: SVGSVGElement;
  private currentGroup: SVGGElement | null = null;

  constructor(element: SVGSVGElement) {
    this.element = element;
  }

  // 移除所有子元素
  selectAll(selector: string): SVGSelection {
    if (selector === '*') {
      while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
      }
    }
    return this;
  }
  
  // 移除所有子元素(别名)
  remove(): SVGSelection {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    return this;
  }
  
  // 设置属性
  attr(name: string, value: string | number): SVGSelection {
    this.element.setAttribute(name, value.toString());
    return this;
  }

  // 添加元素
  append(elementType: string): D3Selection {
    if (elementType === 'text') {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      if (this.currentGroup) {
        this.currentGroup.appendChild(text);
      } else {
        this.element.appendChild(text);
      }
      return new TextSelection(text);
    } else if (elementType === 'rect') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      if (this.currentGroup) {
        this.currentGroup.appendChild(rect);
      } else {
        this.element.appendChild(rect);
      }
      return new RectSelection(rect);
    } else if (elementType === 'path') {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      if (this.currentGroup) {
        this.currentGroup.appendChild(path);
      } else {
        this.element.appendChild(path);
      }
      return new PathSelection(path);
    } else if (elementType === 'g') {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      this.element.appendChild(g);
      this.currentGroup = g;
      return new GroupSelection(g);
    }
    
    return this;
  }
}

// 文本元素选择器
class TextSelection {
  element: SVGTextElement;

  constructor(element: SVGTextElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): TextSelection {
    if (name === 'class') {
      this.element.setAttribute('class', value.toString());
    } else if (name === 'x') {
      this.element.setAttribute('x', value.toString());
    } else if (name === 'y') {
      this.element.setAttribute('y', value.toString());
    } else if (name === 'text-anchor') {
      this.element.setAttribute('text-anchor', value.toString());
    } else {
      this.element.setAttribute(name, value.toString());
    }
    return this;
  }

  text(content: string): TextSelection {
    this.element.textContent = content;
    return this;
  }
}

// 矩形元素选择器
class RectSelection {
  element: SVGRectElement;

  constructor(element: SVGRectElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): RectSelection {
    if (name === 'class') {
      this.element.setAttribute('class', value.toString());
    } else if (name === 'x') {
      this.element.setAttribute('x', value.toString());
    } else if (name === 'y') {
      this.element.setAttribute('y', value.toString());
    } else if (name === 'width') {
      this.element.setAttribute('width', value.toString());
    } else if (name === 'height') {
      this.element.setAttribute('height', value.toString());
    } else if (name === 'rx') {
      this.element.setAttribute('rx', value.toString());
    } else {
      this.element.setAttribute(name, value.toString());
    }
    return this;
  }
}

// 路径元素选择器
class PathSelection {
  element: SVGPathElement;

  constructor(element: SVGPathElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): PathSelection {
    if (name === 'class') {
      this.element.setAttribute('class', value.toString());
    } else if (name === 'd') {
      this.element.setAttribute('d', value.toString());
    } else if (name === 'fill') {
      this.element.setAttribute('fill', value.toString());
    } else {
      this.element.setAttribute(name, value.toString());
    }
    return this;
  }
}

// 组元素选择器
class GroupSelection {
  element: SVGGElement;

  constructor(element: SVGGElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): GroupSelection {
    if (name === 'transform') {
      this.element.setAttribute('transform', value.toString());
    } else {
      this.element.setAttribute(name, value.toString());
    }
    return this;
  }

  append(elementType: string): D3Selection {
    if (elementType === 'text') {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      this.element.appendChild(text);
      return new TextSelection(text);
    } else if (elementType === 'rect') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      this.element.appendChild(rect);
      return new RectSelection(rect);
    } else if (elementType === 'path') {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.element.appendChild(path);
      return new PathSelection(path);
    }
    
    return this;
  }
} 