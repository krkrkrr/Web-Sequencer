# 🎵 Web Sequencer

A modern web-based music sequencer powered by [Strudel](https://strudel.cc/) - the JavaScript implementation of Tidal Cycles for algorithmic music patterns.

![Strudel](https://img.shields.io/badge/Powered%20by-Strudel-667eea)
![React](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-7-646cff)

## ✨ Features

- **Step Sequencer**: 16-step grid sequencer with 4 instruments (Kick, Snare, Hi-Hat, Clap)
- **Pattern Editor**: Write Strudel patterns directly using mini notation
- **Presets**: Quick-start with built-in patterns (House, Techno, Breakbeat, etc.)
- **BPM Control**: Adjustable tempo from 60-200 BPM
- **Real-time Feedback**: Visual step indicators synced with playback
- **Help Reference**: Built-in Strudel syntax guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Web-Sequencer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## 🎹 Usage

1. **Enable Audio**: Click "Click to Enable Audio" (required by browser autoplay policy)
2. **Use Step Sequencer**: Click grid cells to activate/deactivate beats
3. **Try Presets**: Click preset buttons to load example patterns
4. **Edit Patterns**: Modify Strudel code in the Pattern Editor
5. **Adjust Tempo**: Use the BPM slider to change speed

## 📝 Strudel Quick Reference

```javascript
// Play samples in sequence
s("bd sd hh sd")

// Play 4 times per cycle
s("bd*4")

// Group sounds
s("[bd sd] hh")

// Play simultaneously
s("bd, sd, hh")

// Euclidean rhythm
s("bd(3,8)")

// Play notes
note("c3 e3 g3")

// Effects
.gain(0.5)    // Volume
.lpf(1000)    // Low pass filter
.room(0.5)    // Reverb
.delay(0.5)   // Delay

// Layer patterns
stack(pattern1, pattern2)
```

Learn more at [strudel.cc](https://strudel.cc/workshop/getting-started/)

## 🏗️ Project Structure

```
Web-Sequencer/
├── src/
│   ├── components/
│   │   ├── Controls.jsx      # Play/Stop/BPM controls
│   │   ├── Sequencer.jsx     # Step sequencer grid
│   │   └── PatternEditor.jsx # Code editor & presets
│   ├── strudel/
│   │   └── engine.js         # Strudel audio engine wrapper
│   ├── App.jsx               # Main application
│   ├── App.css               # Styles
│   └── main.jsx              # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **@strudel/web** - Strudel audio engine
- **Web Audio API** - Browser audio

## 📄 License

This project uses [Strudel](https://codeberg.org/uzu/strudel/) which is licensed under AGPL-3.0.

## 🙏 Acknowledgments

- [Strudel](https://strudel.cc/) - By Alex McLean and Felix Roos
- [Tidal Cycles](https://tidalcycles.org/) - The original pattern language
