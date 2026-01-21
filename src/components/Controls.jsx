import { memo } from 'react'

function Controls({ isPlaying, bpm, volume, onPlay, onStop, onBpmChange, onVolumeChange }) {
  return (
    <div className="controls">
      {!isPlaying ? (
        <button className="play-button" onClick={onPlay}>
          ▶ Play
        </button>
      ) : (
        <button className="stop-button" onClick={onStop}>
          ⏹ Stop
        </button>
      )}
      
      <div className="bpm-control">
        <label>BPM:</label>
        <input
          type="range"
          min="60"
          max="200"
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
        />
        <span>{bpm}</span>
      </div>
      
      <div className="volume-control">
        <label>🔊 Vol:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  )
}

export default memo(Controls)
