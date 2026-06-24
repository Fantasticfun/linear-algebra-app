export default function ReferencePage() {
  const algorithms = [
    {
      name: "克莱姆法则 (Cramer's Rule)",
      alias: "cramer",
      desc: "利用行列式求解线性方程组，适用于 n 较小的方阵系统。",
      steps: [
        "1. 计算 det(A)，若为 0 则无解或无穷解",
        "2. 对每个未知数 xⱼ，构造 Aⱼ（将 A 第 j 列替换为 b）",
        "3. xⱼ = det(Aⱼ) / det(A)",
      ],
      complexity: "O(n!) — 对大矩阵不实用",
      note: "虽然原理优雅，但计算量随 n 增长急剧增大。对于 n > 3 建议使用高斯消元法。",
    },
    {
      name: "高斯消元法 (Gaussian Elimination)",
      alias: "gauss",
      desc: "将增广矩阵化为阶梯形，然后回代求解。是最实用的线性方程组求解方法。",
      steps: [
        "1. 构造增广矩阵 [A | b]",
        "2. 前进消元：每列选主元，将下方消为零",
        "3. 回代：从最后一行开始，逐行求解",
      ],
      complexity: "O(n³)",
      note: "可配合部分主元法提高数值稳定性。也可化为行最简形(Jordan消元)，直接读出解。",
    },
    {
      name: "LU 分解 (LU Decomposition)",
      alias: "lu",
      desc: "将矩阵分解为下三角 L 和上三角 U 的乘积 A = LU，便于重复求解不同 b 的方程组。",
      steps: [
        "1. 初始化 L = I（对角为1的下三角）, U = A",
        "2. 对 k = 1 到 n-1：",
        "   a. 若 U[k][k]=0 则分解失败",
        "   b. 对 i = k+1 到 n：L[i][k] = U[i][k]/U[k][k]",
        "   c. 对 j = k 到 n：U[i][j] -= L[i][k] × U[k][j]",
        "3. 求解：先解 Ly = b（前代），再解 Ux = y（回代）",
      ],
      complexity: "O(n³) 分解，O(n²) 求解",
      note: "Doolittle 算法（L 对角为1）是最常用的变体。Crout 算法（U 对角为1）是另一变体。",
    },
    {
      name: "Gram-Schmidt 正交化 / QR 分解",
      alias: "gram-schmidt",
      desc: "将一组线性无关向量转化为标准正交基。等价于矩阵的 QR 分解 A = QR。",
      steps: [
        "1. 令 u₁ = v₁",
        "2. 对 k = 2 到 n：",
        "   uₖ = vₖ − Σ(j=1 to k-1) proj_uj(vₖ)",
        "   其中 proj_u(v) = (v·u)/(u·u) · u",
        "3. 归一化：eₖ = uₖ / ||uₖ||",
        "由此得到 Q = [e₁...eₙ]（正交矩阵）",
        "R 为上三角矩阵，R[i][j] = vⱼ · eᵢ (i≤j)",
      ],
      complexity: "O(mn²)",
      note: "经典 Gram-Schmidt 数值不稳定，改进的 MGS 算法精度更高。Householder 变换是另一种更稳定的 QR 分解方法。",
    },
    {
      name: "幂迭代法 (Power Iteration)",
      alias: "power",
      desc: "迭代求解矩阵模最大的特征值和对应特征向量。",
      steps: [
        "1. 随机初始化向量 b₀（模为1）",
        "2. 迭代：b_{k+1} = Abₖ / ||Abₖ||",
        "3. λ ≈ (b_{k+1})^T A b_{k+1}  或  λ ≈ ||Abₖ||",
        "收敛条件：连续两次 λ 的差小于阈值",
      ],
      complexity: "每次迭代 O(n²)",
      note: "仅收敛到模最大的特征值。逆幂法可找接近某 μ 的特征值。QR 迭代可求全部特征值。",
    },
    {
      name: "配方法 (Lagrange 配方法)",
      alias: "lagrange",
      desc: "通过逐变量配方将二次型化为标准形（平方和形式）。",
      steps: [
        "1. 先配方所有含 x₁ 的项",
        "2. 然后处理剩余项中含 x₂ 的",
        "3. 依此类推",
        "换元后得到：f = a₁y₁² + a₂y₂² + ... + aₙyₙ²",
      ],
      complexity: "O(n²)",
      note: "每一步配方的系数可能为零，需要灵活处理。对正定二次型特别有效。",
    },
    {
      name: "正交变换化标准形（特征值法）",
      alias: "orthogonal",
      desc: "通过正交变换 x = Qy，利用实对称矩阵的正交对角化性质，将二次型化为标准形。",
      steps: [
        "1. 写出二次型的实对称矩阵 A",
        "2. 求 A 的特征值 λ₁,...,λₙ",
        "3. 求对应的正交单位化特征向量",
        "4. 构成正交矩阵 Q = [e₁,...,eₙ]",
        "5. 作 x = Qy，得标准形 f = λ₁y₁² + ... + λₙyₙ²",
      ],
      complexity: "O(n³)",
      note: "适用于任何实二次型。特征值的符号决定了二次型的正定性。",
    },
    {
      name: "秩-零化度定理 (Rank-Nullity)",
      alias: "rank-nullity",
      desc: "矩阵的秩与其零空间维数之和等于列数。",
      steps: [
        "对矩阵 A(m×n)：",
        "rank(A) + nullity(A) = n",
        "",
        "其中 rank(A) = dim(Col(A)) = dim(Row(A))",
        "nullity(A) = dim(Nul(A))",
        "",
        "推论：",
        "- 若 rank(A) = n（列满秩），则 Nul(A) = {0}",
        "- 若 m < n，则 nullity(A) ≥ n - m（不可能列满秩）",
      ],
      complexity: "O(1) — 是理论结果",
      note: "这是线性代数中最重要的定理之一，连接了矩阵的代数性质和几何性质。",
    },
    {
      name: "Cholesky 分解",
      alias: "cholesky",
      desc: "将对称正定矩阵分解为下三角矩阵与其转置的乘积 A = LL^T。",
      steps: [
        "前提：A 必须是对称正定矩阵",
        "对 j = 1 到 n：",
        "  L[j][j] = √(A[j][j] − Σ(k=1 to j-1) L[j][k]²)",
        "  对 i = j+1 到 n：",
        "    L[i][j] = (A[i][j] − Σ(k=1 to j-1) L[i][k]·L[j][k]) / L[j][j]",
      ],
      complexity: "O(n³/3)，比 LU 分解快约 2 倍",
      note: "仅适用于对称正定矩阵。广泛应用于数值优化和 Monte Carlo 模拟。如果根号下出现负数则说明矩阵并非正定。",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">📝 运算注释说明</h1>
      <p className="text-gray-500 mb-8">
        常见线性代数算法的详细说明，包含核心步骤、复杂度分析和注意事项
      </p>

      <div className="space-y-4">
        {algorithms.map((algo, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
              <span className="text-xl">{algo.alias === "cramer" ? "📐" : algo.alias === "gauss" ? "🔽" : algo.alias === "lu" ? "📊" : algo.alias === "gram-schmidt" ? "🔺" : algo.alias === "power" ? "🔁" : algo.alias === "lagrange" ? "✏️" : algo.alias === "orthogonal" ? "🔍" : algo.alias === "rank-nullity" ? "⚖️" : "💎"}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{algo.name}</h3>
                <p className="text-sm text-gray-500">{algo.desc}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">核心步骤</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                    {algo.steps.join("\n")}
                  </pre>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                  ⏱ 复杂度：{algo.complexity}
                </span>
                <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                  📌 {algo.alias}
                </span>
              </div>

              {algo.note && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  💡 {algo.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
