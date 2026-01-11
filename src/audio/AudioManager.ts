import { Howler, Howl } from 'howler'

class AudioManager {
  private sounds: Record<string, Howl> = {}
  private muted: boolean = false

  constructor() {
    this.initializeSounds()
  }

  private initializeSounds() {
    // Create minimal sound objects with data URIs for now
    // In production, these would load from actual audio files

    this.sounds['success'] = new Howl({
      src: ['/audio/success.ogg'],
      preload: true,
      volume: 0.5,
    })

    this.sounds['tap'] = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      preload: true,
      volume: 0.3,
    })

    this.sounds['hint'] = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      preload: true,
      volume: 0.4,
    })

    this.sounds['error'] = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      preload: true,
      volume: 0.4,
    })
  }

  playSuccess() {
    if (!this.muted) {
      this.sounds['success']?.play()
    }
  }

  playTap() {
    if (!this.muted) {
      this.sounds['tap']?.play()
    }
  }

  playHint() {
    if (!this.muted) {
      this.sounds['hint']?.play()
    }
  }

  playError() {
    if (!this.muted) {
      this.sounds['error']?.play()
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    Howler.mute(muted)
  }

  isMuted(): boolean {
    return this.muted
  }

  unmute() {
    this.setMuted(false)
  }

  mute() {
    this.setMuted(true)
  }
}

export const audioManager = new AudioManager()
