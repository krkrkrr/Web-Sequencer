import { memo, useState } from 'react'

const PRESETS = [
  {
    name: 'Basic Beat',
    pattern: 's("bd sd hh sd")'
  },
  {
    name: 'Four on the Floor',
    pattern: 'stack(\n  s("bd*4"),\n  s("~ sd ~ sd"),\n  s("hh*8")\n)'
  },
  {
    name: 'Breakbeat',
    pattern: 'stack(\n  s("bd ~ ~ bd ~ ~ bd ~"),\n  s("~ ~ sd ~ ~ sd ~ sd"),\n  s("hh*8").gain(0.6)\n)'
  },
  {
    name: 'House',
    pattern: 'stack(\n  s("bd*4"),\n  s("~ cp ~ cp"),\n  s("[~ hh]*8").gain(0.5),\n  s("~ ~ ~ ~ ~ ~ oh ~").gain(0.4)\n)'
  },
  {
    name: 'Synth Melody',
    pattern: 'note("<c3 e3 g3 b3>*2")\n  .sound("sawtooth")\n  .lpf(800)\n  .decay(0.2)\n  .sustain(0)'
  },
  {
    name: 'Ambient',
    pattern: 'note("<[c3,e3,g3] [d3,f3,a3] [e3,g3,b3] [f3,a3,c4]>/2")\n  .sound("sine")\n  .attack(0.5)\n  .decay(1)\n  .sustain(0.3)\n  .release(2)\n  .room(0.8)'
  },
  {
    name: 'Techno',
    pattern: 'stack(\n  s("bd*4").gain(1.2),\n  s("~ sd:1 ~ sd:1"),\n  s("hh*16").gain(0.3),\n  s("~ ~ ~ ~ oh ~ ~ ~").gain(0.4)\n)'
  },
  {
    name: 'Polyrhythm',
    pattern: 'stack(\n  s("bd(3,8)"),\n  s("sd(5,8)").gain(0.8),\n  s("hh(7,8)").gain(0.5)\n)'
  }
]

function PatternEditor({ pattern, onPatternChange, onClose }) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="pattern-editor">
      <div className="pattern-editor-header">
        <h2>📝 Pattern Editor</h2>
        <button className="close-button" onClick={onClose} title="Close">
          ✕
        </button>
      </div>
      
      <textarea
        className="pattern-textarea"
        value={pattern}
        onChange={(e) => onPatternChange(e.target.value)}
        placeholder='Enter a Strudel pattern, e.g. s("bd sd hh sd")'
        spellCheck={false}
      />
      
      <div className="preset-buttons">
        <span style={{ color: '#888', marginRight: '10px' }}>Presets:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            className="preset-button"
            onClick={() => onPatternChange(preset.pattern)}
          >
            {preset.name}
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '15px' }}>
        <button 
          className="preset-button"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? '❌ Hide Help' : '❓ Show Help'}
        </button>
      </div>
      
      {showHelp && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          background: '#0d0d1a', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#ccc',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#667eea' }}>Strudel Quick Reference</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><code>s("bd sd hh sd")</code> - Play samples in sequence</li>
            <li><code>s("bd*4")</code> - Play bd 4 times per cycle</li>
            <li><code>s("bd sd")*2</code> - Double the speed</li>
            <li><code>s("[bd sd] hh")</code> - Group sounds together</li>
            <li><code>s("bd, sd, hh")</code> - Play sounds simultaneously</li>
            <li><code>s("bd(3,8)")</code> - Euclidean rhythm (3 hits over 8 steps)</li>
            <li><code>note("c3 e3 g3")</code> - Play notes</li>
            <li><code>.gain(0.5)</code> - Set volume</li>
            <li><code>.lpf(1000)</code> - Low pass filter</li>
            <li><code>.room(0.5)</code> - Reverb</li>
            <li><code>.delay(0.5)</code> - Delay effect</li>
            <li><code>stack(a, b)</code> - Layer patterns</li>
          </ul>
          <p style={{ marginTop: '15px' }}>
            <a 
              href="https://strudel.cc/workshop/getting-started/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#667eea' }}
            >
              Learn more at strudel.cc →
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default memo(PatternEditor)
