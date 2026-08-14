const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']

export function formatScore(value: number): string {
  if (value < 1000) return value.toFixed(value < 10 ? 2 : 1)
  const tier = Math.min(Math.floor(Math.log10(value) / 3), SUFFIXES.length - 1)
  const scaled = value / Math.pow(1000, tier)
  return `${scaled.toFixed(2)}${SUFFIXES[tier]}`
}

export function formatDuration(seconds: number): string {
  const s = Math.floor(seconds)
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const secs = s % 60
  const parts: string[] = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (!days && !hours) parts.push(`${secs}s`)
  return parts.join(' ')
}
