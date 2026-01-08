interface DividerProps {
  symbol?: string
}

export function Divider({ symbol = '✦' }: DividerProps) {
  return (
    <div className="my-8 flex items-center justify-center" data-testid="divider">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="px-4 text-gray-400 text-lg">{symbol}</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  )
}
