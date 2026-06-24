import { useParams, Link } from "react-router-dom"
import { chapters, type Chapter } from "../data/chapters"

export default function ChapterPage() {
  const { id } = useParams<{ id: string }>()
  const chapter = chapters.find(c => c.id === id)

  if (!chapter) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl mb-4">📭</p>
        <p className="text-gray-500 mb-4">未找到该章节</p>
        <Link to="/" className="text-blue-600 hover:underline">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← 返回首页</Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{chapter.icon}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{chapter.title}</h1>
            <p className="text-gray-500 mt-1">{chapter.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {chapter.keyPoints.map((kp, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
              {kp}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {chapter.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            <div className="p-6 prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(section.content)
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <NavButton chapters={chapters} currentId={id!} direction="prev" />
        <NavButton chapters={chapters} currentId={id!} direction="next" />
      </div>
    </div>
  )
}

function NavButton({ chapters, currentId, direction }: {
  chapters: Chapter[]
  currentId: string
  direction: "prev" | "next"
}) {
  const idx = chapters.findIndex((c: Chapter) => c.id === currentId)
  const targetIdx = direction === "prev" ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= chapters.length) return <div />

  const ch = chapters[targetIdx]
  return (
    <Link
      to={`/chapters/${ch.id}`}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-gray-700"
    >
      {direction === "prev" ? "←" : ""} {ch.title} {direction === "next" ? "→" : ""}
    </Link>
  )
}

function renderMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code class='bg-gray-100 px-1 py-0.5 rounded text-blue-700 text-sm'>$1</code>")
    .replace(/^### (.+)$/gm, "<h3 class='text-base font-semibold text-gray-800 mt-4 mb-2'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-lg font-semibold text-gray-900 mt-6 mb-3'>$1</h2>")
    .replace(/(?:\r?\n){2,}/g, "</p><p class='text-gray-700 leading-relaxed mb-3'>")
    .replace(/^/, "<p class='text-gray-700 leading-relaxed mb-3'>")
    .replace(/$/, "</p>")
}
