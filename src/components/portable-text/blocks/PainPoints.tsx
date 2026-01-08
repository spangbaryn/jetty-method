interface PainPointsProps {
  label?: string
  items: string[]
}

export function PainPoints({ label = 'Sound familiar?', items }: PainPointsProps) {
  return (
    <div className="my-6" data-testid="pain-points">
      <p className="font-caveat text-xl text-gray-600 mb-3">{label}</p>
      <ul className="space-y-2">
        {items?.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-red-500 mr-2 font-bold">~</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
