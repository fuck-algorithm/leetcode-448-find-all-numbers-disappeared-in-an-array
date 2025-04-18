/**
 * 简化版D3模拟实现，用于绘制动画
 */

// 基础D3选择器接口
export interface D3Selection {
  attr(name: string, value: string | number): D3Selection;
  text(content: string): D3Selection;
  append(elementType: string): D3Selection;
  selectAll(selector: string): D3Selection;
  remove(): D3Selection;
}

// SVG选择器实现
class SVGSelection implements D3Selection {
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

  // 设置文本内容
  text(content: string): SVGSelection {
    this.element.textContent = content;
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
class TextSelection implements D3Selection {
  element: SVGTextElement;

  constructor(element: SVGTextElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): TextSelection {
    this.element.setAttribute(name, value.toString());
    return this;
  }

  text(content: string): TextSelection {
    this.element.textContent = content;
    return this;
  }

  append(_elementType: string): D3Selection {
    throw new Error('Text elements cannot append children');
  }

  selectAll(_selector: string): D3Selection {
    throw new Error('Text elements do not support selectAll');
  }

  remove(): D3Selection {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

// 矩形元素选择器
class RectSelection implements D3Selection {
  element: SVGRectElement;

  constructor(element: SVGRectElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): RectSelection {
    this.element.setAttribute(name, value.toString());
    return this;
  }

  text(_content: string): RectSelection {
    throw new Error('Rect elements do not support text content');
  }

  append(_elementType: string): D3Selection {
    throw new Error('Rect elements cannot append children');
  }

  selectAll(_selector: string): D3Selection {
    throw new Error('Rect elements do not support selectAll');
  }

  remove(): D3Selection {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

// 路径元素选择器
class PathSelection implements D3Selection {
  element: SVGPathElement;

  constructor(element: SVGPathElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): PathSelection {
    this.element.setAttribute(name, value.toString());
    return this;
  }

  text(_content: string): PathSelection {
    throw new Error('Path elements do not support text content');
  }

  append(_elementType: string): D3Selection {
    throw new Error('Path elements cannot append children');
  }

  selectAll(_selector: string): D3Selection {
    throw new Error('Path elements do not support selectAll');
  }

  remove(): D3Selection {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

// 组元素选择器
class GroupSelection implements D3Selection {
  element: SVGGElement;

  constructor(element: SVGGElement) {
    this.element = element;
  }

  attr(name: string, value: string | number): GroupSelection {
    this.element.setAttribute(name, value.toString());
    return this;
  }

  text(_content: string): GroupSelection {
    throw new Error('Group elements do not support direct text content');
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

  selectAll(_selector: string): D3Selection {
    throw new Error('Group elements do not support selectAll');
  }

  remove(): D3Selection {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}

// SVG选择器工厂函数
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