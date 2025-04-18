import './App.css'
import AlgorithmAnimation from './components/AlgorithmAnimation'
import ControlPanel from './components/ControlPanel'
import AlgorithmExplanation from './components/AlgorithmExplanation'
import AlgorithmCode from './components/AlgorithmCode'
import { AnimationProvider } from './contexts/AnimationContext'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>找到所有数组中消失的数字</h1>
        <h2>LeetCode 448 - 原地修改法</h2>
      </header>
      
      <main>
        <AnimationProvider>
          <div className="animation-container">
            <AlgorithmAnimation />
          </div>
          <div className="control-container">
            <ControlPanel />
          </div>
          <div className="explanation-container">
            <AlgorithmExplanation />
          </div>
          <div className="code-container">
            <AlgorithmCode />
          </div>
        </AnimationProvider>
      </main>
      
      <footer>
        <p>原地修改法 - 空间复杂度 O(1)，时间复杂度 O(n)</p>
      </footer>
    </div>
  )
}

export default App
