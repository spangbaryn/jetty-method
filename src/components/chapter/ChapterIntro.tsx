interface ChapterIntroProps {
  children: React.ReactNode
}

export function ChapterIntro({ children }: ChapterIntroProps) {
  return (
    <p
      className="text-xl italic text-gray-600 mb-12 font-serif"
      data-testid="chapter-intro"
    >
      {children}
    </p>
  )
}
