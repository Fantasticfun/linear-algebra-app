import { useState } from "react"
import { computeDeterminant, matrixMultiply, matrixAdd, matrixSubtract, gaussJordanInverse, gaussElimination, matrixTranspose, qrEigenvalues } from "../utils/matrixCalc"

type OpType = "det" | "mul" | "add" | "sub" | "inv" | "solve" | "eigen" | "transpose"

const ops: { id: OpType; label: string; icon: string; desc: string }[] = [
  { id: "det", label: "行列式", icon: "|A|", desc: "计算方阵的行列式值" },
  { id: "mul", label: "矩阵乘法", icon: "A×B", desc: "两个矩阵相乘" },
  { id: "add", label: "矩阵加法", icon: "A+B", desc: "两个同型矩阵相加" },
  { id: "sub", label: "矩阵减法", icon: "A−B", desc: "两个同型矩阵相减" },
  { id: "inv", label: "求逆矩阵", icon: "A⁻¹", desc: "Gauss-Jordan 消元法求逆" },
  { id: "solve", label: "解方程组", icon: "Ax=b", desc: "高斯消元法求解线性方程组" },
  { id: "eigen", label: "特征值", icon: "λ", desc: "QR 迭代近似特征值" },
  { id: "transpose", label: "矩阵转置", icon: "Aᵀ", desc: "行列互换" },
]

export default function CalculatorPage() {
  const [op, setOp] = useState<OpType>("det")
  const [matrixA, setMatrixA] = useState("1,2;3,4")
  const [matrixB, setMatrixB] = useState("5,6;7,8")
  const [vectorB, setVectorB] = useState("5;6")
  const [result, setResult] = useState<{ value: string; steps: string[] } | null>(null)
  const [error, setError] = useState("")
  const [showSteps, setShowSteps] = useState(true)
  const [stepIdx, setStepIdx] = useState(0)
  const [animating, setAnimating] = useState(false)

  function parseMatrix(s: string): number[][] {
    return s.trim().split(";").map(row =>
      row.trim().split(/[,\s]+/).filter(Boolean).map(Number)
    )
  }

  function parseVector(s: string): number[] {
    return s.trim().split(/[;\s,]+/).filter(Boolean).map(Number)
  }

  function matrixToStr(m: number[][]): string {
    return m.map(r => r.map(v => {
      if (Math.abs(v) < 1e-10) return "0"
      if (Number.isInteger(v)) return v.toString()
      return v.toFixed(4)
    }).join(", ")).join("; ")
  }

  function handleCalculate() {
    setError("")
    setResult(null)

    try {
      const A = parseMatrix(matrixA)
      let res: { value: string; steps: string[] } = { value: "", steps: [] }

      switch (op) {
        case "transpose": {
          res = matrixTranspose(A)
          break
        }
        case "det": {
          const Btotal = [...A.map(r => [...r])]
          const steps: string[] = []
          const v = computeDeterminant(Btotal, steps)
          res = { value: v.toFixed(4), steps }
          break
        }
        case "inv": {
          res = gaussJordanInverse(A)
          break
        }
        case "solve": {
          const bv = parseVector(vectorB)
          res = gaussElimination(A, bv)
          break
        }
        case "eigen": {
          res = qrEigenvalues(A)
          break
        }
        case "mul":
        case "add":
        case "sub": {
          const B = parseMatrix(matrixB)
          if (op === "mul") res = matrixMultiply(A, B)
          else if (op === "add") res = matrixAdd(A, B)
          else res = matrixSubtract(A, B)
          break
        }
      }
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : "计算出错")
    }
  }

  const needsB = op === "mul" || op === "add" || op === "sub"
  const needsVec = op === "solve"

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">🔢 在线运算器</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {ops.map(o => (
          <button
            key={o.id}
            onClick={() => { setOp(o.id); setResult(null); setError("") }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              op === o.id
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-lg font-bold text-gray-900">{o.icon}</div>
            <div className="text-sm font-medium text-gray-700">{o.label}</div>
            <div className="text-xs text-gray-400 mt-1">{o.desc}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              矩阵 A（用分号分隔行，逗号分隔列）
            </label>
            <textarea
              rows={3}
              value={matrixA}
              onChange={e => setMatrixA(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="1,2,3;4,5,6;7,8,9"
            />
          </div>
          {needsB && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">矩阵 B</label>
              <textarea
                rows={3}
                value={matrixB}
                onChange={e => setMatrixB(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="1,0;0,1"
              />
            </div>
          )}
          {needsVec && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">常向量 b</label>
              <textarea
                rows={3}
                value={vectorB}
                onChange={e => setVectorB(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="5;6;7"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCalculate}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            计算
          </button>
          {result && result.steps.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showSteps}
                onChange={e => setShowSteps(e.target.checked)}
                className="rounded"
              />
              显示逐步过程
            </label>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">结果</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <code className="text-lg font-mono text-gray-900 whitespace-pre-wrap">
                {result.value}
              </code>
            </div>
          </div>

          {showSteps && result.steps.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">运算步骤</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
                    disabled={stepIdx === 0}
                    className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >← 上一步</button>
                  <span className="text-xs text-gray-400 self-center">{stepIdx + 1}/{result.steps.length}</span>
                  <button
                    onClick={() => setStepIdx(Math.min(result.steps.length - 1, stepIdx + 1))}
                    disabled={stepIdx >= result.steps.length - 1}
                    className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >下一步 →</button>
                  <button
                    onClick={() => { setAnimating(true); setStepIdx(0) }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >从头播放</button>
                </div>
              </div>
              <div className="space-y-2">
                {result.steps.slice(0, stepIdx + 1).map((s, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm font-mono ${
                      i === stepIdx ? "bg-blue-50 border border-blue-200 text-blue-900" : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span className="text-xs text-gray-400 mr-2">[{i + 1}]</span>
                    <span className="whitespace-pre-wrap">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
