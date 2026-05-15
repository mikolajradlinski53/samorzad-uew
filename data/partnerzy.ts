export interface Partner {
  name: string
  tier: 'strategic' | 'regular'
  /** TODO: replace with real logo path when files are available */
  logo?: string
}

export const partnerStrategiczny: Partner = {
  name: 'BNY',
  tier: 'strategic',
}

export const partnerzy: Partner[] = [
  { name: 'PwC',             tier: 'regular' },
  { name: 'Pasibus',         tier: 'regular' },
  { name: 'Phinance',        tier: 'regular' },
  { name: 'Raben',           tier: 'regular' },
  { name: 'Techland',        tier: 'regular' },
  { name: 'Pyszne.pl',       tier: 'regular' },
  { name: 'UPS',             tier: 'regular' },
  { name: 'Bielenda',        tier: 'regular' },
  { name: 'MU1 Drukarnia',   tier: 'regular' },
  { name: 'Slice of Heaven', tier: 'regular' },
  { name: 'UPM',             tier: 'regular' },
]
