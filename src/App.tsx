import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import HomePage from "./pages/HomePage"
import ChapterPage from "./pages/ChapterPage"
import CalculatorPage from "./pages/CalculatorPage"
import ReferencePage from "./pages/ReferencePage"

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModule, setActiveModule] = useState("home")

  return (
    <BrowserRouter basename="/linear-algebra-app">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
        <main className="flex-1 overflow-auto bg-gray-50">
          <MobileHeader onMenuClick={() => setSidebarOpen(true)} activeModule={activeModule} />
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage onNavigate={setActiveModule} />} />
              <Route path="/chapters/:id" element={<ChapterPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/reference" element={<ReferencePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

function Sidebar({ open, setOpen, activeModule, setActiveModule }: {
  open: boolean; setOpen: (v: boolean) => void;
  activeModule: string; setActiveModule: (v: string) => void;
}) {
  const menuItems = [
    { id: "home", label: "首页", icon: "🏠", path: "/" },
    { id: "chapters", label: "知识章节", icon: "📚", path: "/" },
    { id: "calculator", label: "在线运算", icon: "🔢", path: "/calculator" },
    { id: "reference", label: "运算注释", icon: "📝", path: "/reference" },
  ]

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-100
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}>
        <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-700">
          <span className="text-2xl">📐</span>
          <div>
            <h1 className="text-lg font-bold">线性代数学习中心</h1>
            <p className="text-xs text-gray-400">Interactive Learning</p>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <a
              key={item.id}
              href={item.path}
              onClick={(e) => {
                e.preventDefault()
                setActiveModule(item.id)
                setOpen(false)
                if (item.id === "home" || item.id === "chapters") {
                  window.history.pushState({}, "", "/linear-algebra-app/")
                  window.dispatchEvent(new PopStateEvent("popstate"))
                } else {
                  window.history.pushState({}, "", `/linear-algebra-app${item.path}`)
                  window.dispatchEvent(new PopStateEvent("popstate"))
                }
              }}
              className={`
                flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors
                ${activeModule === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
          中国矿业大学 · 线性代数
        </div>
      </aside>
    </>
  )
}

function MobileHeader({ onMenuClick, activeModule }: {
  onMenuClick: () => void
  activeModule: string
}) {
  const titles: Record<string, string> = {
    home: "首页",
    chapters: "知识章节",
    calculator: "在线运算",
    reference: "运算注释",
  }
  return (
    <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-200">
      <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
      <h2 className="font-semibold text-gray-800">{titles[activeModule] || "线性代数"}</h2>
    </header>
  )
}
