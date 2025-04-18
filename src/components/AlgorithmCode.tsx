import '../styles/AlgorithmCode.css';

const AlgorithmCode: React.FC = () => {
  const code = `function findDisappearedNumbers(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = [];
  
  // 第一次遍历：标记存在的数字
  for (let i = 0; i < n; i++) {
    // 计算当前元素对应的索引（注意1-based转0-based）
    const index = (nums[i] - 1) % n;
    // 在对应位置加n，标记该数字存在
    nums[index] += n;
  }
  
  // 第二次遍历：找出缺失的数字
  for (let i = 0; i < n; i++) {
    // 如果数字小于等于n，说明原始数字i+1未出现过
    if (nums[i] <= n) {
      result.push(i + 1);
    }
  }
  
  return result;
}`;

  return (
    <div className="algorithm-code">
      <h3>算法代码实现</h3>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default AlgorithmCode; 