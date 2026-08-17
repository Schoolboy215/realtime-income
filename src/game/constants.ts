export const RateUnit = {
    YEAR: "Year",
    MONTH: "Month",
    WEEK: "Week",
    HOUR: "Hour",
    MINUTE: "Minute",
    SECOND: "Second"
} as const

export type RateUnit = (typeof RateUnit)[keyof typeof RateUnit]