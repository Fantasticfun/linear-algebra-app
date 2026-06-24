import { HashRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import HomePage from "./pages/HomePage"
import ChapterPage from "./pages/ChapterPage"
import CalculatorPage from "./pages/CalculatorPage"
import ReferencePage from "./pages/ReferencePage"

function getModuleFromPath(path: string) {
  if (path.startsWith("/calculator")) return "calculator"
  if (path.startsWith("/reference")) return "reference"
  if (path.startsWith("/chapters")) return "chapters"
  return "home"
}

export default function App() {
  return (
    <HashRouter>
      <AppInner />
    </HashRouter>
  )
}

function AppInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const [activeModule, setActiveModule] = useState("home")

  useEffect(() => {
    setActiveModule(getModuleFromPath(location.pathname))
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activeModule={activeModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className="flex-1 overflow-auto bg-gray-50">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} activeModule={activeModule} />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chapters/:id" element={<ChapterPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/reference" element={<ReferencePage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function Sidebar({ open, setOpen, activeModule, collapsed, setCollapsed }: {
  open: boolean; setOpen: (v: boolean) => void;
  activeModule: string;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const navigate = useNavigate()
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
        fixed lg:static inset-y-0 left-0 z-50 bg-gray-900 text-gray-100
        transform transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${collapsed ? "w-16" : "w-64"}
        flex flex-col
      `}>
        <div className={`
          flex items-center gap-2 px-4 h-16 border-b border-gray-700
          ${collapsed ? "justify-center px-0" : ""}
        `}>
          <span className="text-2xl flex-shrink-0">📐</span>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-bold">线性代数学习中心</h1>
              <p className="text-xs text-gray-400">Interactive Learning</p>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path)
                setOpen(false)
              }}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                ${collapsed ? "justify-center px-0" : ""}
                ${activeModule === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className={`
          border-t border-gray-700 text-xs text-gray-500
          ${collapsed ? "text-center p-2" : "p-4"}
        `}>
          {collapsed ? "矿大" : "中国矿业大学 · 线性代数"}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 transition-colors"
          title={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
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
