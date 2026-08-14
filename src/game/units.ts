// The full pool of units a player can be offered. Each has a fixed
// score/year production rate. Balance is loosely exponential so later
// picks feel like meaningful upgrades, AD-style.
export interface UnitDef {
  id: string
  name: string
  icon: string
  rate: number // score per in-game year
}

export const UNITS: UnitDef[] = [
  { id: 'lemonade', name: 'Lemonade Stand', icon: '🍋', rate: 1 },
  { id: 'paperRoute', name: 'Paper Route', icon: '📰', rate: 3 },
  { id: 'vending', name: 'Vending Machine', icon: '🥤', rate: 7 },
  { id: 'partTime', name: 'Part-Time Job', icon: '🧑‍💼', rate: 12 },
  { id: 'etsy', name: 'Etsy Shop', icon: '🧶', rate: 18 },
  { id: 'freelance', name: 'Freelance Gig', icon: '💻', rate: 28 },
  { id: 'rideshare', name: 'Rideshare Driving', icon: '🚗', rate: 40 },
  { id: 'royalties', name: 'Book Royalties', icon: '📚', rate: 55 },
  { id: 'rental', name: 'Rental Property', icon: '🏠', rate: 80 },
  { id: 'dividends', name: 'Stock Dividends', icon: '📈', rate: 110 },
  { id: 'consulting', name: 'Consulting Contract', icon: '📋', rate: 150 },
  { id: 'foodtruck', name: 'Food Truck', icon: '🚚', rate: 200 },
  { id: 'smallBiz', name: 'Small Business', icon: '🏪', rate: 280 },
  { id: 'indexFund', name: 'Index Fund', icon: '💹', rate: 380 },
  { id: 'franchise', name: 'Franchise', icon: '🍔', rate: 520 },
  { id: 'angel', name: 'Angel Investment', icon: '👼', rate: 700 },
  { id: 'startup', name: 'Tech Startup', icon: '🚀', rate: 950 },
  { id: 'hedgeFund', name: 'Hedge Fund', icon: '💰', rate: 1300 },
  { id: 'oilField', name: 'Oil Field', icon: '🛢️', rate: 1800 },
  { id: 'conglomerate', name: 'Conglomerate', icon: '🏢', rate: 2500 },
]

export const UNIT_BY_ID: Record<string, UnitDef> = Object.fromEntries(
  UNITS.map(u => [u.id, u]),
)

/** Pick `count` distinct random units from the pool. */
export function rollChoices(count = 3): string[] {
  const pool = [...UNITS]
  const picked: string[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    picked.push(pool[idx].id)
    pool.splice(idx, 1)
  }
  return picked
}
