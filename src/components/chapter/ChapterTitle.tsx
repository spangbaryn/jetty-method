interface ChapterTitleProps {
  children: React.ReactNode
}

export function ChapterTitle({ children }: ChapterTitleProps) {
  return (
    <h1
      className="text-4xl font-bold mb-6 font-serif"
      data-testid="chapter-title"
    >
      {children}
    </h1>
  )
}
