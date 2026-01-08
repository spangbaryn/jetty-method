import React from 'react'
import { StringInputProps, set, unset } from 'sanity'
import { Stack, Flex, Text } from '@sanity/ui'

const COLOR_OPTIONS = [
  { value: 'yellow', label: 'Yellow', color: '#fef08a' },
  { value: 'green', label: 'Green', color: '#bbf7d0' },
  { value: 'blue', label: 'Blue', color: '#bfdbfe' },
]

export function HighlightInput(props: StringInputProps) {
  const { value, onChange } = props

  const handleSelect = (colorValue: string) => {
    onChange(colorValue ? set(colorValue) : unset())
  }

  return (
    <Stack space={3}>
      <Text size={1} weight="semibold">Highlight Color</Text>
      <Flex gap={3}>
        {COLOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: option.color,
              border: value === option.value ? '3px solid #2563eb' : '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              transform: value === option.value ? 'scale(1.1)' : 'scale(1)',
            }}
            title={option.label}
            aria-label={`Select ${option.label} highlight`}
          />
        ))}
      </Flex>
    </Stack>
  )
}

export default HighlightInput
