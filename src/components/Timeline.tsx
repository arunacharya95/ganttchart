import React from 'react'
import { TimelineUnit } from '../types'
import { getWeek, format } from 'date-fns'

type TimelineProps = {
  units: TimelineUnit[]
  chartWidth: number
  unitWidth: number
}

const Timeline: React.FC<TimelineProps> = ({ units, chartWidth, unitWidth }) => {
  // Group units by week/month
  const groupedUnits: { [key: string]: { units: TimelineUnit[], start: number } } = {}
  let currentGroup = ''
  let startIndex = 0
  
  units.forEach((unit, i) => {
    const monthYear = format(unit.startDate, 'MMMM yyyy')
    if (monthYear !== currentGroup) {
      currentGroup = monthYear
      startIndex = i
      groupedUnits[currentGroup] = { units: [], start: startIndex }
    }
    groupedUnits[currentGroup].units.push(unit)
  })

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Month/Year Header Row */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #d1d5db',
        backgroundColor: '#f9fafb',
        height: '32px'
      }}>
        {Object.entries(groupedUnits).map(([monthYear, data], idx) => (
          <div
            key={idx}
            style={{
              width: `${data.units.length * unitWidth}px`,
              minWidth: `${data.units.length * unitWidth}px`,
              padding: '6px 8px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: '#374151',
              borderRight: '1px solid #d1d5db',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {monthYear}
          </div>
        ))}
      </div>
      
      {/* Week Numbers Row */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #d1d5db',
        backgroundColor: '#fafafa',
        height: '24px'
      }}>
        {units.map((unit, i) => {
          const weekNum = getWeek(unit.startDate)
          const showWeek = i === 0 || getWeek(units[i-1].startDate) !== weekNum
          
          return (
            <div
              key={i}
              style={{
                width: `${unitWidth}px`,
                minWidth: `${unitWidth}px`,
                padding: '4px 2px',
                textAlign: 'center',
                fontSize: '10px',
                fontWeight: 500,
                color: '#6b7280',
                borderRight: '1px solid #e5e7eb',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showWeek ? `Week ${weekNum}` : ''}
            </div>
          )
        })}
      </div>
      
      {/* Day Numbers Row */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #d1d5db',
        backgroundColor: '#fff',
        height: '28px'
      }}>
        {units.map((unit, i) => {
          const date = unit.startDate
          const dayOfWeek = format(date, 'EEEEEE') // M, T, W, etc.
          const dayNum = format(date, 'd')
          const isToday = new Date().toDateString() === date.toDateString()
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          
          return (
            <div
              key={i}
              style={{
                width: `${unitWidth}px`,
                minWidth: `${unitWidth}px`,
                padding: '4px 2px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: isToday ? 700 : 500,
                color: isToday ? '#fff' : (isWeekend ? '#9ca3af' : '#374151'),
                backgroundColor: isToday ? '#3b82f6' : 'transparent',
                borderRight: '1px solid #e5e7eb',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1px'
              }}
            >
              <span style={{ fontSize: '9px', opacity: 0.8 }}>{dayOfWeek}</span>
              <span>{dayNum}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Timeline
