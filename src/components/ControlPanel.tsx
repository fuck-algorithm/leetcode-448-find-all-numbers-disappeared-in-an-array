import { useEffect, useRef } from 'react';
import { useAnimation } from '../contexts/AnimationContext';
import '../styles/ControlPanel.css';

const ControlPanel: React.FC = () => {
  const { state, dispatch } = useAnimation();
  const timerRef = useRef<number | null>(null);
  
  // 播放/暂停动画
  const togglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };
  
  // 播放下一步
  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  
  // 播放上一步
  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  // 重置动画
  const resetAnimation = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    dispatch({ type: 'RESET' });
  };
  
  // 调整速度
  const adjustSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    dispatch({ type: 'SET_SPEED', payload: speed });
  };
  
  // 手动设置当前步骤
  const setCurrentStep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = parseInt(e.target.value, 10);
    dispatch({ type: 'SET_STEP', payload: step });
  };
  
  // 控制自动播放
  useEffect(() => {
    if (state.isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        if (state.currentStep >= state.totalSteps) {
          dispatch({ type: 'TOGGLE_PLAY' });
        } else {
          dispatch({ type: 'NEXT_STEP' });
        }
      }, 1000 / state.animationSpeed);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isPlaying, state.currentStep, state.animationSpeed, state.totalSteps, dispatch]);
  
  return (
    <div className="control-panel">
      <div className="control-group">
        <button 
          className={`play-button ${state.isPlaying ? 'pause' : 'play'}`}
          onClick={togglePlay}
        >
          {state.isPlaying ? '暂停' : '播放'}
        </button>
        
        <button className="step-button prev" onClick={prevStep} disabled={state.currentStep <= 0}>
          上一步
        </button>
        
        <button className="step-button next" onClick={nextStep} disabled={state.currentStep >= state.totalSteps}>
          下一步
        </button>
        
        <button className="reset-button" onClick={resetAnimation}>
          重置
        </button>
      </div>
      
      <div className="slider-group">
        <label>
          步骤: {state.currentStep} / {state.totalSteps}
          <input
            type="range"
            min="0"
            max={state.totalSteps}
            value={state.currentStep}
            onChange={setCurrentStep}
            className="step-slider"
          />
        </label>
      </div>
      
      <div className="slider-group">
        <label>
          速度: {state.animationSpeed.toFixed(1)}x
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={state.animationSpeed}
            onChange={adjustSpeed}
            className="speed-slider"
          />
        </label>
      </div>
      
      <div className="log-panel">
        <h3>操作日志</h3>
        <div className="log-content">
          {state.operationLog[state.currentStep] || "等待操作..."}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 