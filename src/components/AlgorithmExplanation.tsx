import '../styles/AlgorithmExplanation.css';

const AlgorithmExplanation: React.FC = () => {
  return (
    <div className="algorithm-explanation">
      <h3>原地修改法解析</h3>
      <div className="explanation-content">
        <p>
          这个问题要求找出1-n范围内不在数组中的数字。由于原数组长度为n，数组元素范围在1-n之间，每个数字可能出现多次或者不出现。
        </p>
        
        <h4>解题思路</h4>
        <p>
          原地修改法的核心思想是：<strong>将原数组本身作为哈希表使用</strong>，避免使用额外空间。具体做法如下：
        </p>
        
        <ol>
          <li>遍历数组nums，对于每个元素nums[i]，计算其对应的索引位置val = (nums[i] - 1) % n</li>
          <li>将索引位置val处的元素增加n，即nums[val] += n</li>
          <li>增加后的元素必然大于n，标记该位置对应的数字出现过</li>
          <li>再次遍历数组，如果某个位置nums[i] ≤ n，说明数字(i+1)未出现过</li>
        </ol>
        
        <h4>时间复杂度</h4>
        <p>数组需要遍历两次，时间复杂度为O(n)</p>
        
        <h4>空间复杂度</h4>
        <p>不需要额外空间，空间复杂度为O(1)</p>
      </div>
    </div>
  );
};

export default AlgorithmExplanation; 