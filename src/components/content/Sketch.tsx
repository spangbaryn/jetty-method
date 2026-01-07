import { ReactNode } from 'react'

interface SketchProps {
  children: ReactNode
  caption?: string
}

export function Sketch({ children, caption }: SketchProps) {
  return (
    <div className="flex justify-center my-12">
      <div
        className="sketch bg-white border-2 border-[#2c2c2c] rounded p-9 max-w-md relative"
        data-testid="sketch"
        style={{
          transform: 'rotate(-1deg)',
          boxShadow: '4px 4px 0 #2c2c2c'
        }}
      >
        <div className="[&_svg]:w-full [&_svg]:h-auto">
          {children}
        </div>
        {caption && (
          <div className="font-caveat text-lg text-center mt-4 text-[#555]">
            {caption}
          </div>
        )}
      </div>
    </div>
  )
}
