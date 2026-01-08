interface BigQuoteProps {
  text: string
  attribution?: string
}

export function BigQuote({ text, attribution }: BigQuoteProps) {
  return (
    <blockquote className="my-8 py-6 px-8 relative" data-testid="big-quote">
      {/* Decorative opening quote */}
      <span className="absolute top-0 left-0 text-6xl text-gray-200 font-serif leading-none">
        "
      </span>

      <p className="text-2xl italic text-gray-700 font-caveat leading-relaxed pl-8">
        {text}
      </p>

      {attribution && (
        <footer className="mt-4 text-right text-gray-500">
          — {attribution}
        </footer>
      )}
    </blockquote>
  )
}
