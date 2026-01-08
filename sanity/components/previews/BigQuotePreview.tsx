import React from 'react'

interface BigQuotePreviewProps {
  text?: string
  attribution?: string
}

export function BigQuotePreview({ text, attribution }: BigQuotePreviewProps) {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderLeft: '4px solid #6366f1',
      borderRadius: '4px',
    }}>
      <div style={{
        fontSize: '24px',
        color: '#6366f1',
        marginBottom: '8px',
      }}>
        "
      </div>
      <div style={{
        fontSize: '16px',
        fontStyle: 'italic',
        color: '#374151',
        marginBottom: '8px',
      }}>
        {text || 'Quote text...'}
      </div>
      {attribution && (
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
        }}>
          — {attribution}
        </div>
      )}
    </div>
  )
}

export default BigQuotePreview
