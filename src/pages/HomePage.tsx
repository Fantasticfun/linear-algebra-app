import { chapters } from "../data/chapters"

export default function HomePage({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">📐 线性代数学习中心</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          系统学习线性代数，从行列式到特征值，图文并茂，步步为营
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map(ch => (
          <a
            key={ch.id}
            href={`/linear-algebra-app/#/chapters/${ch.id}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate("chapters")
              window.history.pushState({}, "", `/linear-algebra-app/#/chapters/${ch.id}`)
              window.dispatchEvent(new PopStateEvent("popstate"))
            }}
            className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-3">{ch.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {ch.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{ch.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {ch.keyPoints.slice(0, 3).map((kp, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                  {kp}
                </span>
              ))}
              {ch.keyPoints.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{ch.keyPoints.length - 3}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <a
          href="/linear-algebra-app/#/calculator"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("calculator")
            window.history.pushState({}, "", "/linear-algebra-app/#/calculator")
            window.dispatchEvent(new PopStateEvent("popstate"))
          }}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl text-white hover:shadow-lg transition-all"
        >
          <div className="text-3xl mb-3">🔢</div>
          <h3 className="text-lg font-semibold mb-2">在线运算器</h3>
          <p className="text-sm text-blue-100">交互式计算，逐步展示每一步操作和中间结果</p>
        </a>

        <a
          href="/linear-algebra-app/#/reference"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("reference")
            window.history.pushState({}, "", "/linear-algebra-app/#/reference")
            window.dispatchEvent(new PopStateEvent("popstate"))
          }}
          className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl text-white hover:shadow-lg transition-all"
        >
          <div className="text-3xl mb-3">📝</div>
          <h3 className="text-lg font-semibold mb-2">运算注释说明</h3>
          <p className="text-sm text-purple-100">常见算法详解，含公式推导和代码注释风格说明</p>
        </a>

        <div className="p-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl text-white">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-lg font-semibold mb-2">学习技巧</h3>
          <ul className="text-sm text-green-100 space-y-1">
            <li>• 理解几何意义比死记公式更重要</li>
            <li>• 多动手做运算，在线计算器随时可用</li>
            <li>• 线性代数中的概念相互关联，建立知识网络</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
