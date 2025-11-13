import React from 'react'
import { TimelineUnit } from '../types'

type TimelineProps = {
  units: TimelineUnit[]
  chartWidth: number
  unitWidth: number
}

const Timeline: React.FC<TimelineProps> = ({ units, chartWidth, unitWidth }) => {
  return (
    <div style={{ 
      display: 'flex', 
      borderBottom: '2px solid #e5e7eb', 
      backgroundColor: '#f9fafb',
      height: '60px'
    }}>
      {units.map((unit, i) => (
        <div
          key={i}
          style={{
            width: `${unitWidth}px`,
            minWidth: `${unitWidth}px`,
            maxWidth: `${unitWidth}px`,
            padding: '8px 4px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#374151',
            borderRight: i < units.length - 1 ? '1px solid #e5e7eb' : 'none',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {unit.label}
        </div>
      ))}
    </div>
  )
}

export default Timeline
