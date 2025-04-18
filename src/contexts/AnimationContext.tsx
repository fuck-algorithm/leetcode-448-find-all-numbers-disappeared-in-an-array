import { createContext, useContext, useReducer } from 'react';

// 初始数组
const INITIAL_ARRAY = [4, 3, 2, 7, 8, 2, 3, 1];

// 动画状态接口
export interface AnimationState {
  currentStep: number;
  isPlaying: boolean;
  animationSpeed: number;
  numsSnapshot: number[][];
  highlightedIndices: number[];
  currentPointer: number | null;
  operationLog: string[];
  result: number[];
  totalSteps: number;
}

// 初始状态
const initialState: AnimationState = {
  currentStep: 0,
  isPlaying: false,
  animationSpeed: 1,
  numsSnapshot: [INITIAL_ARRAY.slice()],
  highlightedIndices: [],
  currentPointer: null,
  operationLog: ['初始化数组 [4,3,2,7,8,2,3,1]'],
  result: [],
  totalSteps: 0,
};

// 动作类型
type AnimationAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'RESET' };

// 创建上下文
const AnimationContext = createContext<{
  state: AnimationState;
  dispatch: React.Dispatch<AnimationAction>;
} | undefined>(undefined);

// 生成动画数据的函数
const generateAnimationData = (nums: number[]): AnimationState => {
  const n = nums.length;
  const snapshots: number[][] = [nums.slice()];
  const logs: string[] = ['初始化数组 [' + nums.join(',') + ']'];
  const result: number[] = [];
  
  let currentArray = nums.slice();
  
  // 第一遍遍历 - 标记存在的数字
  for (let i = 0; i < n; i++) {
    const num = currentArray[i];
    const val = ((num - 1) % n);
    currentArray = currentArray.slice();
    currentArray[val] += n;
    
    snapshots.push(currentArray.slice());
    logs.push(`处理索引 ${i}: 数值为 ${num}，标记索引 ${val} 处的元素`);
  }
  
  // 第二遍遍历 - 查找缺失的数字
  for (let i = 0; i < n; i++) {
    currentArray = currentArray.slice();
    if (currentArray[i] <= n) {
      result.push(i + 1);
      logs.push(`发现索引 ${i} 处的元素值 ≤ ${n}，缺失的数字为 ${i + 1}`);
    } else {
      logs.push(`索引 ${i} 处的元素值 > ${n}，数字 ${i + 1} 已存在`);
    }
    snapshots.push(currentArray.slice());
  }
  
  return {
    ...initialState,
    numsSnapshot: snapshots,
    operationLog: logs,
    result: result,
    totalSteps: snapshots.length - 1,
  };
};

// 动画状态更新reducer
const animationReducer = (state: AnimationState, action: AnimationAction): AnimationState => {
  switch (action.type) {
    case 'NEXT_STEP':
      if (state.currentStep >= state.totalSteps) return state;
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'PREV_STEP':
      if (state.currentStep <= 0) return state;
      return {
        ...state,
        currentStep: state.currentStep - 1,
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: Math.min(Math.max(0, action.payload), state.totalSteps),
      };
    case 'TOGGLE_PLAY':
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case 'SET_SPEED':
      return {
        ...state,
        animationSpeed: action.payload,
      };
    case 'RESET':
      return {
        ...initialState,
        ...generateAnimationData(INITIAL_ARRAY),
      };
    default:
      return state;
  }
};

// 提供者组件
export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    animationReducer,
    generateAnimationData(INITIAL_ARRAY)
  );

  return (
    <AnimationContext.Provider value={{ state, dispatch }}>
      {children}
    </AnimationContext.Provider>
  );
};

// 自定义钩子，用于访问上下文
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}; 