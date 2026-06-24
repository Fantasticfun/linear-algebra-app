// ─── 辅助函数 ───
function cloneMatrix(m: number[][]): number[][] {
  return m.map(r => [...r])
}

function formatMatrix(m: number[][], cols = 8): string {
  return m.map(r => r.map(v => {
    if (Math.abs(v) < 1e-12) v = 0
    if (Number.isInteger(v)) return v.toString().padStart(cols)
    return v.toFixed(4).padStart(cols)
  }).join(" ")).join("\n")
}

function isSquare(m: number[][]): boolean {
  return m.length === m[0].length
}

// ─── 行列式（递归余子式展开 + 步骤） ───
export function computeDeterminant(A: number[][], steps: string[]): number {
  const n = A.length
  if (n === 1) {
    steps.push(`det([${A[0][0]}]) = ${A[0][0]}`)
    return A[0][0]
  }
  if (n === 2) {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]
    steps.push(`det(${formatMatrix(A)}) = ${A[0][0]}×${A[1][1]} − ${A[0][1]}×${A[1][0]} = ${det}`)
    return det
  }

  // 找含 0 最多的行
  let bestRow = 0, bestZeros = 0
  for (let i = 0; i < n; i++) {
    let zeros = 0
    for (let j = 0; j < n; j++) {
      if (A[i][j] === 0) zeros++
    }
    if (zeros > bestZeros) { bestZeros = zeros; bestRow = i }
  }

  let det = 0
  steps.push(`按第 ${bestRow + 1} 行展开行列式:`)
  for (let j = 0; j < n; j++) {
    if (A[bestRow][j] === 0) continue
    const sign = (bestRow + j) % 2 === 0 ? 1 : -1
    const sub = getSubmatrix(A, bestRow, j)
    const subSteps: string[] = []
    const subDet = computeDeterminant(sub, subSteps)
    const term = sign * A[bestRow][j] * subDet
    steps.push(`  a[${bestRow + 1}][${j + 1}]=${A[bestRow][j]}, sign=${sign > 0 ? '+' : '−'}, 子式=${subDet}`)
    for (const s of subSteps) {
      steps.push("    " + s)
    }
    det += term
  }
  steps.push(`det = ${det}`)
  return det
}

function getSubmatrix(A: number[][], row: number, col: number): number[][] {
  return A.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col))
}

// ─── 矩阵乘法 ───
export function matrixMultiply(A: number[][], B: number[][]): { value: string; steps: string[] } {
  const m = A.length, pa = A[0].length
  const pb = B.length, n = B[0].length
  if (pa !== pb) throw new Error(`维度不匹配: A(${m}×${pa}) × B(${pb}×${n})`)

  const C: number[][] = Array.from({ length: m }, () => Array(n).fill(0))
  const steps: string[] = []

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const parts: string[] = []
      for (let k = 0; k < pa; k++) {
        C[i][j] += A[i][k] * B[k][j]
        parts.push(`${A[i][k]}×${B[k][j]}`)
      }
      steps.push(`C[${i + 1}][${j + 1}] = ${parts.join(" + ")} = ${C[i][j]}`)
    }
  }

  return { value: formatMatrix(C), steps }
}

// ─── 矩阵加法 ───
export function matrixAdd(A: number[][], B: number[][]): { value: string; steps: string[] } {
  if (A.length !== B.length || A[0].length !== B[0].length) throw new Error("矩阵维度不一致")
  const C = A.map((r, i) => r.map((v, j) => v + B[i][j]))
  const steps: string[] = [`对应元素相加: ${formatMatrix(A)} + ${formatMatrix(B)} = ${formatMatrix(C)}`]
  return { value: formatMatrix(C), steps }
}

// ─── 矩阵减法 ───
export function matrixSubtract(A: number[][], B: number[][]): { value: string; steps: string[] } {
  if (A.length !== B.length || A[0].length !== B[0].length) throw new Error("矩阵维度不一致")
  const C = A.map((r, i) => r.map((v, j) => v - B[i][j]))
  const steps: string[] = [`对应元素相减: ${formatMatrix(A)} − ${formatMatrix(B)} = ${formatMatrix(C)}`]
  return { value: formatMatrix(C), steps }
}

// ─── 矩阵转置 ───
export function matrixTranspose(A: number[][]): { value: string; steps: string[] } {
  const m = A.length, n = A[0].length
  const T: number[][] = Array.from({ length: n }, () => Array(m).fill(0))
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      T[j][i] = A[i][j]
  return { value: formatMatrix(T), steps: ["行列互换"] }
}

// ─── Gauss-Jordan 求逆 ───
export function gaussJordanInverse(A: number[][]): { value: string; steps: string[] } {
  if (!isSquare(A)) throw new Error("只有方阵才能求逆")
  const n = A.length
  const aug = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))])
  const steps: string[] = []

  steps.push(`增广矩阵 [A | I]:\n${formatMatrix(aug)}`)

  for (let col = 0; col < n; col++) {
    // 找主元
    let maxRow = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row
    }
    if (Math.abs(aug[maxRow][col]) < 1e-12) throw new Error("矩阵不可逆（奇异矩阵）")

    if (maxRow !== col) {
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]]
      steps.push(`交换行 ${col + 1} 和行 ${maxRow + 1}（选主元）`)
    }

    const pivot = aug[col][col]
    for (let j = col; j < 2 * n; j++) aug[col][j] /= pivot
    steps.push(`第 ${col + 1} 行除以 ${pivot}`)

    for (let i = 0; i < n; i++) {
      if (i === col) continue
      const factor = aug[i][col]
      if (Math.abs(factor) < 1e-12) continue
      for (let j = col; j < 2 * n; j++) {
        aug[i][j] -= factor * aug[col][j]
      }
      steps.push(`第 ${i + 1} 行 − ${factor} × 第 ${col + 1} 行`)
    }
  }

  const inv = aug.map(r => r.slice(n))
  steps.push(`逆矩阵 A⁻¹:\n${formatMatrix(inv)}`)
  return { value: formatMatrix(inv), steps }
}

// ─── 高斯消元解线性方程组 ───
export function gaussElimination(A: number[][], b: number[]): { value: string; steps: string[] } {
  const n = A.length
  const aug = A.map((r, i) => [...r, b[i]])
  const steps: string[] = []

  steps.push(`增广矩阵 [A | b]:\n${formatMatrix(aug)}`)

  for (let col = 0; col < n; col++) {
    let maxRow = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row
    }
    if (Math.abs(aug[maxRow][col]) < 1e-12) throw new Error("存在自由变量，方程有无穷多解")

    if (maxRow !== col) {
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]]
      steps.push(`交换行 ${col + 1} 和行 ${maxRow + 1}`)
    }

    for (let i = col + 1; i < n; i++) {
      const factor = aug[i][col] / aug[col][col]
      if (Math.abs(factor) < 1e-12) continue
      for (let j = col; j <= n; j++) {
        aug[i][j] -= factor * aug[col][j]
      }
      steps.push(`第 ${i + 1} 行 − ${factor.toFixed(4)} × 第 ${col + 1} 行 →\n${formatRow(aug[i], n)}`)
    }
  }

  steps.push(`阶梯形矩阵:\n${formatMatrix(aug)}`)

  // 回代
  const x: number[] = Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n]
    for (let j = i + 1; j < n; j++) {
      x[i] -= aug[i][j] * x[j]
    }
    x[i] /= aug[i][i]
    steps.push(`x[${i + 1}] = ${x[i].toFixed(4)}`)
  }

  return {
    value: x.map((v, i) => `x[${i + 1}] = ${v.toFixed(6)}`).join("\n"),
    steps,
  }
}

function formatRow(row: number[], n: number): string {
  return row.map(v => {
    if (Math.abs(v) < 1e-12) return "0".padStart(8)
    return v.toFixed(4).padStart(8)
  }).join(" ")
}

// ─── QR 迭代求特征值（简化版） ───
export function qrEigenvalues(A: number[][]): { value: string; steps: string[] } {
  if (!isSquare(A)) throw new Error("只有方阵有特征值")
  const n = A.length
  let M = cloneMatrix(A)
  const steps: string[] = []
  const maxIter = 50

  for (let iter = 0; iter < maxIter; iter++) {
    // QR 分解（Gram-Schmidt）
    const Q: number[][] = []
    const R: number[][] = Array.from({ length: n }, () => Array(n).fill(0))

    // 对每一列做 Gram-Schmidt
    for (let j = 0; j < n; j++) {
      let v = M.map(r => r[j])
      for (let i = 0; i < j; i++) {
        const qi = Q[i]
        R[i][j] = qi.reduce((sum, qik, k) => sum + qik * v[k], 0)
        v = v.map((vk, k) => vk - R[i][j] * qi[k])
      }
      const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0))
      if (norm < 1e-12) throw new Error("矩阵奇异，QR分解失败")
      R[j][j] = norm
      Q.push(v.map(x => x / norm))
    }

    // M_new = R * Q (用 Q 的转置)
    const Mnew: number[][] = Array.from({ length: n }, () => Array(n).fill(0))
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        for (let k = 0; k < n; k++)
          Mnew[i][j] += R[i][k] * Q[k][j]

    if (iter < 3 || (iter > 0 && iter % 10 === 0)) {
      steps.push(`迭代 ${iter + 1}:\n${formatMatrix(Mnew)}`)
    }

    // 检查是否已接近上三角
    let offDiag = 0
    for (let i = 0; i < n; i++)
      for (let j = 0; j < i; j++)
        offDiag += Mnew[i][j] * Mnew[i][j]
    offDiag = Math.sqrt(offDiag)

    M = Mnew
    if (offDiag < 1e-8) {
      steps.push(`收敛于迭代 ${iter + 1}`)
      break
    }
  }

  const eigenvalues = Array.from({ length: n }, (_, i) => M[i][i])
  return {
    value: eigenvalues.map((v, i) => `λ[${i + 1}] = ${v.toFixed(6)}`).join("\n"),
    steps,
  }
}
