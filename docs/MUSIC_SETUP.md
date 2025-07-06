# Background Music Setup

## Overview
This portfolio now includes a background music feature that automatically starts playing when users visit the site. Users can toggle the music on/off using the volume button in the navigation bar.

## Setup Instructions

### 1. Add Your Music File
Place your background music file in the `public/music/` directory:
- File name: `background-music.mp3`
- Supported formats: MP3, WAV, OGG
- Recommended: Ambient, instrumental, or lo-fi music that won't be distracting

### 2. File Requirements
- Keep the file size reasonable (under 5MB for better loading)
- Use royalty-free music or music you have rights to use
- Consider using loop-friendly music for seamless playback

### 3. Alternative Music Files
If you want to use a different filename, update the path in `src/context/MusicContext.tsx`:
```typescript
const audio = new Audio('/music/your-music-file.mp3');
```

## Features

### Automatic Playback
- Music starts automatically when the page loads
- Loops continuously for seamless background audio
- Volume is set to 30% by default for pleasant background listening

### User Controls
- **Mute/Unmute**: Click the volume icon in the navigation bar
- **Visual Feedback**: Icon changes between volume and muted states
- **Persistent State**: Mute state is maintained during navigation

### Browser Compatibility
- Works with modern browsers that support HTML5 Audio API
- Gracefully handles autoplay restrictions
- Falls back silently if audio fails to load

## Customization

### Volume Control
To adjust the default volume, modify the `volume` state in `MusicContext.tsx`:
```typescript
const [volume, setVolume] = useState(0.3); // 0.0 to 1.0
```

### Autoplay Delay
To change when music starts playing, modify the timeout in `MusicContext.tsx`:
```typescript
const timer = setTimeout(startMusic, 1000); // 1000ms = 1 second
```

## Troubleshooting

### Music Not Playing
1. Check that the music file exists in `public/music/background-music.mp3`
2. Verify the file format is supported by the browser
3. Check browser console for any audio-related errors

### Autoplay Blocked
Modern browsers may block autoplay. The music will start playing after the first user interaction with the page.

### File Not Found
Ensure the music file is in the correct location and the filename matches exactly (case-sensitive).

## Recommended Music Sources
- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/) (Kevin MacLeod)
- [Bensound](https://www.bensound.com/)
- [Pixabay Music](https://pixabay.com/music/)

Remember to respect copyright and licensing when using background music. 