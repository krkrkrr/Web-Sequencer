// Strudel audio engine wrapper
let initialized = false;
let stepTracker = null;
let gainNode = null;
let audioContext = null;
let currentVolume = 0.8;

export async function initStrudel() {
  if (initialized) return;
  
  try {
    const { initStrudel: init, samples, getAudioContext } = await import('@strudel/web');
    
    // Initialize Strudel with samples
    await init({
      prebake: async () => {
        // Load default drum samples
        await samples('github:tidalcycles/dirt-samples');
      }
    });
    
    // Set up gain node for volume control
    audioContext = getAudioContext();
    if (audioContext) {
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0.8;
      gainNode.connect(audioContext.destination);
    }
    
    initialized = true;
    console.log('Strudel initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Strudel:', error);
    throw error;
  }
}

export async function startScheduler(patternCode, bpm, onStep) {
  try {
    const { evaluate, setcps } = await import('@strudel/web');
    
    // Ensure Strudel is initialized
    if (!initialized) {
      await initStrudel();
    }
    
    // Set tempo (cycles per second = bpm / 60 / 4)
    const cps = bpm / 60 / 4;
    
    // Create full pattern code with tempo and volume
    const fullCode = `setcps(${cps})\n${patternCode}.gain(${currentVolume})`;
    
    console.log('Evaluating pattern:', fullCode);
    
    // Evaluate the pattern
    await evaluate(fullCode);
    
    // Start step tracking for visual feedback
    if (onStep) {
      if (stepTracker) {
        clearInterval(stepTracker);
      }
      
      let step = 0;
      const stepInterval = (60 / bpm / 4) * 1000; // Time per 16th note in ms
      
      stepTracker = setInterval(() => {
        onStep(step % 16);
        step++;
      }, stepInterval);
    }
    
    console.log('Pattern started successfully');
  } catch (error) {
    console.error('Pattern evaluation error:', error);
    throw error;
  }
}

export async function stopScheduler() {
  // Clear step tracker
  if (stepTracker) {
    clearInterval(stepTracker);
    stepTracker = null;
  }
  
  try {
    const { hush } = await import('@strudel/web');
    hush();
    console.log('Scheduler stopped');
  } catch (error) {
    console.warn('Error stopping scheduler:', error);
  }
}

export function isInitialized() {
  return initialized;
}

export function setVolume(value) {
  currentVolume = value;
  console.log('Volume set to:', value);
}
