# Spirit Quest Music Files

**🎵 Place your music files in this directory:**

- `main_theme.mp3` — Plays on menu, path selection, hub, and result screens
- `during_battle.mp3` — Plays during combat encounters

---

## Supported Formats
- `.mp3` (recommended for widest browser support)
- `.ogg` (alternative, good compression)
- `.wav` (uncompressed, larger files)

## Music Behavior
- **Automatic looping** — All tracks loop seamlessly
- **Fade transitions** — Smooth fade-out/fade-in when switching tracks (500ms)
- **Persistent controls** — Volume and mute settings saved to localStorage
- **Auto-resume** — Returns to main theme after battles
- **No errors if missing** — Game works fine without music files

## In-Game Controls
- **Floating button** in bottom-right corner (🎵 icon)
- **Hover** over button to reveal volume slider
- **Click** button to toggle mute (🔇 when muted)
- Volume adjusts from 0-100% with smooth transitions
- Settings persist across sessions

## File Requirements
- Keep file sizes reasonable (< 5MB recommended for web)
- Use loopable tracks (seamless start/end points)
- Consider ambient/orchestral for main theme
- Use energetic/intense music for battle theme
- Normalize audio levels between tracks (avoid volume jumps)

## Recommended Music Styles

**Main Theme:**
- Ambient/atmospheric
- Orchestral fantasy themes
- Calm, mysterious tones
- 60-90 BPM tempo

**Battle Theme:**
- Upbeat, energetic
- Driving percussion
- Epic orchestral or electronic
- 120-140 BPM tempo

## Free Music Resources
- [Incompetech](https://incompetech.com/music/royalty-free/) — Kevin MacLeod's royalty-free library
- [Free Music Archive](https://freemusicarchive.org/) — Curated free music
- [OpenGameArt](https://opengameart.org/art-search?keys=music) — Game-specific tracks
- [Purple Planet](https://www.purple-planet.com/) — Royalty-free game music
- [Zapsplat](https://www.zapsplat.com/music/) — Free music and SFX

---

**Note:** If no music files are present, the game will run silently. The music controls will still appear but won't play anything. Add your `.mp3` files here to enable the music system!
