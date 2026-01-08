import React from 'react'

interface MarginNotePreviewProps {
  content?: string
}

export function MarginNotePreview({ content }: MarginNotePreviewProps) {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#fefce8',
      borderLeft: '4px solid #eab308',
      borderRadius: '4px',
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: 600,
        color: '#a16207',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Margin Note
      </div>
      <div style={{
        fontSize: '14px',
        color: '#713f12',
        fontStyle: 'italic',
      }}>
        {content || 'Note content...'}
      </div>
    </div>
  )
}

export default MarginNotePreview
