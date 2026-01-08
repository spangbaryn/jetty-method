import React from 'react'

interface PainPointsPreviewProps {
  label?: string
  items?: string[]
}

export function PainPointsPreview({ label, items }: PainPointsPreviewProps) {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#fef2f2',
      borderRadius: '4px',
      border: '1px solid #fecaca',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#dc2626',
        marginBottom: '12px',
        fontStyle: 'italic',
      }}>
        {label || 'Sound familiar?'}
      </div>
      <ul style={{
        margin: 0,
        paddingLeft: '20px',
        listStyleType: 'none',
      }}>
        {(items || ['Pain point 1', 'Pain point 2']).slice(0, 3).map((item, i) => (
          <li key={i} style={{
            color: '#991b1b',
            marginBottom: '4px',
            position: 'relative',
          }}>
            <span style={{ color: '#dc2626', marginRight: '8px' }}>~</span>
            {item}
          </li>
        ))}
        {items && items.length > 3 && (
          <li style={{ color: '#6b7280', fontStyle: 'italic' }}>
            +{items.length - 3} more...
          </li>
        )}
      </ul>
    </div>
  )
}

export default PainPointsPreview
