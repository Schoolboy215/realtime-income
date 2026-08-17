const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']
import { RateUnit } from "./constants"

export function formatScore(value: number, rateUnit: string = RateUnit.YEAR): string {
  const rateUnitFactor =
    rateUnit == RateUnit.YEAR ? 1 :
    rateUnit == RateUnit.MONTH ? 1/12 :
    rateUnit == RateUnit.WEEK ? 1/52 :
    rateUnit == RateUnit.HOUR ? 1/8760 :
    rateUnit == RateUnit.MINUTE ? 1/525600 :
    1/31536000;
  const valueAdjustedForRate = value * rateUnitFactor;
  if (valueAdjustedForRate < 1000) return valueAdjustedForRate.toFixed(valueAdjustedForRate < 10 ? 2 : 1)
  const tier = Math.min(Math.floor(Math.log10(valueAdjustedForRate) / 3), SUFFIXES.length - 1)
  const scaled = valueAdjustedForRate / Math.pow(1000, tier)
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
