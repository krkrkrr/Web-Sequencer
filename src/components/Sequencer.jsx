import { useState, useCallback, memo, useEffect, useRef } from 'react'

const STEPS = 16
const INSTRUMENTS = [
  { id: 'bd', name: 'Kick', color: '#ff6b6b' },
  { id: 'sd', name: 'Snare', color: '#4ecdc4' },
  { id: 'hh', name: 'Hi-Hat', color: '#45b7d1' },
  { id: 'oh', name: 'Open HH', color: '#98d8c8' },
  { id: 'cp', name: 'Clap', color: '#96ceb4' },
  { id: 'lt', name: 'Low Tom', color: '#dda0dd' },
  { id: 'mt', name: 'Mid Tom', color: '#da70d6' },
  { id: 'ht', name: 'High Tom', color: '#ba55d3' },
  { id: 'rim', name: 'Rimshot', color: '#ffeaa7' },
  { id: 'cb', name: 'Cowbell', color: '#fdcb6e' },
  { id: 'cr', name: 'Crash', color: '#74b9ff' },
  { id: 'rd', name: 'Ride', color: '#a29bfe' },
]

// Generate euclidean rhythm pattern
function generateEuclideanRhythm(hits, total) {
  if (hits <= 0) return Array(total).fill(false)
  if (hits >= total) return Array(total).fill(true)
  
  // Simple euclidean distribution
  const pattern = Array(total).fill(false)
  const step = total / hits
  
  for (let i = 0; i < hits; i++) {
    const position = Math.round(i * step) % total
    pattern[position] = true
  }
  
  return pattern
}

// Parse pattern string to grid
function parsePatternToGrid(pattern) {
  const grid = INSTRUMENTS.map(() => Array(STEPS).fill(false))
  
  // Handle stack patterns by splitting into individual patterns
  const stackRegex = /stack\s*\(\s*([^)]+)\s*\)/
  const stackMatch = pattern.match(stackRegex)
  const patternsToProcess = stackMatch 
    ? stackMatch[1].split(',').map(p => p.trim())
    : [pattern.trim()]
  
  patternsToProcess.forEach(singlePattern => {
    INSTRUMENTS.forEach((instrument, instrumentIndex) => {
      // Match struct pattern: s("bd").struct("x ~ x ~ ...")
      const structRegex = new RegExp(`s\\s*\\(\\s*["']${instrument.id}["']\\s*\\)\\.struct\\s*\\(\\s*["']([^"']+)["']\\s*\\)`)
      const structMatch = singlePattern.match(structRegex)
      
      if (structMatch) {
        const steps = structMatch[1].split(/\s+/)
        steps.forEach((step, i) => {
          if (i < STEPS && step === 'x') {
            grid[instrumentIndex][i] = true
          }
        })
        return
      }
      
      // Match repeat pattern: s("bd*4") or s("bd*8") etc
      const repeatRegex = new RegExp(`s\\s*\\(\\s*["']${instrument.id}\\*(\\d+)["']\\s*\\)`)
      const repeatMatch = singlePattern.match(repeatRegex)
      
      if (repeatMatch) {
        const count = parseInt(repeatMatch[1], 10)
        const interval = Math.floor(STEPS / count)
        for (let i = 0; i < count && i * interval < STEPS; i++) {
          grid[instrumentIndex][i * interval] = true
        }
        return
      }
      
      // Match euclidean pattern: s("bd(3,8)") or s("sd(5,8)") etc
      const euclideanRegex = new RegExp(`s\\s*\\(\\s*["']${instrument.id}\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)["']\\s*\\)`)
      const euclideanMatch = singlePattern.match(euclideanRegex)
      
      if (euclideanMatch) {
        try {
          const hits = parseInt(euclideanMatch[1], 10)
          const total = parseInt(euclideanMatch[2], 10)
          
          // Generate euclidean rhythm
          const rhythm = generateEuclideanRhythm(hits, total)
          
          // Map to 16 steps - repeat the pattern to fill 16 steps
          for (let i = 0; i < STEPS; i++) {
            const sourceIndex = i % total
            if (rhythm[sourceIndex]) {
              grid[instrumentIndex][i] = true
            }
          }
        } catch (error) {
          console.warn('Failed to parse euclidean rhythm:', error)
        }
        return
      }
      
      // Match sequence pattern: s("bd sd hh sd") - distribute tokens across 16 steps
      const sequenceRegex = /s\s*\(\s*["']([^"']+)["']\s*\)/
      const sequenceMatch = singlePattern.match(sequenceRegex)
      
      if (sequenceMatch) {
        const tokens = sequenceMatch[1].split(/\s+/)
        // Repeat the sequence to fill 16 steps
        for (let i = 0; i < STEPS; i++) {
          const tokenIndex = i % tokens.length
          if (tokens[tokenIndex] === instrument.id) {
            grid[instrumentIndex][i] = true
          }
        }
        return
      }
    })
  })
  
  return grid
}

// Convert grid to pattern string
function gridToPattern(grid) {
  const patternParts = []
  INSTRUMENTS.forEach((instrument, i) => {
    const steps = grid[i]
      .map((active) => active ? 'x' : '~')
      .join(' ')
    if (steps.includes('x')) {
      patternParts.push(`s("${instrument.id}").struct("${steps}")`)
    }
  })
  
  return patternParts.length > 0 
    ? `stack(\n  ${patternParts.join(',\n  ')}\n)`
    : 's("~")'
}

function Sequencer({ pattern, onPatternChange, activeStep }) {
  const [grid, setGrid] = useState(() => {
    // Initialize 4x16 grid from pattern if possible
    return parsePatternToGrid(pattern)
  })
  
  // Track if we're the source of the change
  const isInternalChange = useRef(false)
  
  // Sync grid from pattern when pattern changes externally
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    const newGrid = parsePatternToGrid(pattern)
    setGrid(newGrid)
  }, [pattern])

  const toggleStep = useCallback((instrumentIndex, stepIndex) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row])
      newGrid[instrumentIndex][stepIndex] = !newGrid[instrumentIndex][stepIndex]
      
      // Convert grid to Strudel pattern
      const newPattern = gridToPattern(newGrid)
      
      isInternalChange.current = true
      onPatternChange(newPattern)
      return newGrid
    })
  }, [onPatternChange])

  return (
    <div className="sequencer">
      <h2>🎛️ Step Sequencer</h2>
      <div className="sequencer-grid">
        {INSTRUMENTS.map((instrument, instrumentIndex) => (
          <div key={instrument.id} className="sequencer-row">
            <div className="instrument-label-container">
              <span 
                className={`instrument-label ${instrumentIndex >= 4 ? 'compact' : ''}`}
                style={{ color: instrument.color }}
              >
                {instrument.name}
              </span>
            </div>
            <div className="step-buttons">
              {Array(STEPS).fill(null).map((_, stepIndex) => (
                <button
                  key={stepIndex}
                  className={`step-button ${
                    grid[instrumentIndex][stepIndex] ? 'active' : ''
                  } ${activeStep === stepIndex ? 'playing' : ''}`}
                  style={{
                    backgroundColor: grid[instrumentIndex][stepIndex] 
                      ? instrument.color 
                      : undefined
                  }}
                  onClick={() => toggleStep(instrumentIndex, stepIndex)}
                  title={`${instrument.name} - Step ${stepIndex + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(Sequencer)
