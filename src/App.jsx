import { useState, useCallback } from 'react'
import './App.css'
import Sequencer from './components/Sequencer'
import PatternEditor from './components/PatternEditor'
import Controls from './components/Controls'
import { initStrudel, startScheduler, stopScheduler, setVolume } from './strudel/engine'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [volume, setVolumeState] = useState(0.8)
  const [pattern, setPattern] = useState('s("bd sd hh sd")')
  const [error, setError] = useState(null)
  const [activeStep, setActiveStep] = useState(-1)

  const handleVolumeChange = useCallback((newVolume) => {
    setVolumeState(newVolume)
    setVolume(newVolume)
    // Re-evaluate pattern with new volume if playing
    if (isPlaying) {
      startScheduler(pattern, bpm, setActiveStep).catch(err => {
        setError('Volume error: ' + err.message)
      })
    }
  }, [isPlaying, pattern, bpm])

  const handleInit = useCallback(async () => {
    try {
      await initStrudel()
      setIsInitialized(true)
      setError(null)
    } catch (err) {
      setError('Failed to initialize audio: ' + err.message)
    }
  }, [])

  const handlePlay = useCallback(async () => {
    if (!isInitialized) {
      await handleInit()
    }
    try {
      await startScheduler(pattern, bpm, setActiveStep)
      setIsPlaying(true)
      setError(null)
    } catch (err) {
      setError('Failed to play: ' + err.message)
    }
  }, [isInitialized, pattern, bpm, handleInit])

  const handleStop = useCallback(() => {
    stopScheduler()
    setIsPlaying(false)
    setActiveStep(-1)
  }, [])

  const handlePatternChange = useCallback((newPattern) => {
    setPattern(newPattern)
    if (isPlaying) {
      // Delay scheduler restart to avoid React state update during render
      setTimeout(() => {
        startScheduler(newPattern, bpm, setActiveStep).catch(err => {
          setError('Pattern error: ' + err.message)
        })
      }, 0)
    }
  }, [isPlaying, bpm])

  const handleBpmChange = useCallback((newBpm) => {
    setBpm(newBpm)
    if (isPlaying) {
      startScheduler(pattern, newBpm, setActiveStep).catch(err => {
        setError('BPM error: ' + err.message)
      })
    }
  }, [isPlaying, pattern])

  const [showPatternEditor, setShowPatternEditor] = useState(false)

  return (
    <div className="app compact">
      {!isInitialized && (
        <div className="init-overlay">
          <button className="init-button" onClick={handleInit}>
            🔊 Click to Enable Audio
          </button>
          <p className="init-hint">Web audio requires user interaction to start</p>
        </div>
      )}

      {/* Compact Header with Controls */}
      <header className="app-header-compact">
        <div className="header-title">
          <h1>🎵 Web Sequencer</h1>
        </div>
        <div className="header-controls">
          {!isPlaying ? (
            <button className="play-button compact" onClick={handlePlay}>
              ▶
            </button>
          ) : (
            <button className="stop-button compact" onClick={handleStop}>
              ⏹
            </button>
          )}
          <div className="bpm-control compact">
            <label>BPM</label>
            <input
              type="range"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => handleBpmChange(Number(e.target.value))}
            />
            <span>{bpm}</span>
          </div>
          <div className="volume-control compact">
            <label>🔊</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <button 
            className={`toggle-button ${showPatternEditor ? 'active' : ''}`}
            onClick={() => setShowPatternEditor(!showPatternEditor)}
            title="Toggle Pattern Editor"
          >
            📝 Code
          </button>
        </div>
      </header>

      <main className="app-main compact">
        {error && (
          <div className="error-message compact">
            ⚠️ {error}
          </div>
        )}

        <div className="main-content">
          <Sequencer
            pattern={pattern}
            onPatternChange={handlePatternChange}
            activeStep={activeStep}
          />
        </div>
        
        {/* Pattern Editor Overlay */}
        {showPatternEditor && (
          <div className="pattern-editor-overlay">
            <div className="pattern-editor-modal">
              <PatternEditor
                pattern={pattern}
                onPatternChange={handlePatternChange}
                onClose={() => setShowPatternEditor(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
