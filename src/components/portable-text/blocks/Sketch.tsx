import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

interface SketchProps {
  image: {
    asset: {
      _ref: string
    }
  }
  alt: string
  caption?: string
}

export function Sketch({ image, alt, caption }: SketchProps) {
  const imageUrl = urlFor(image).width(800).url()

  return (
    <figure
      className="my-8 transform rotate-1 hover:rotate-0 transition-transform"
      data-testid="sketch"
    >
      <div className="border-2 border-gray-200 bg-white p-2 shadow-md">
        <Image
          src={imageUrl}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-caveat text-lg text-gray-600">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
