const triangularNumber = (n: number) => {
  return (n * (n + 1)) / 2
}

const _trinketEffectiveSpellDamage = (
  trinketBonus: number,
  trinketDuration: number,
  trinketCooldown: number,
  trinketReductionPerCast: number,
  encounterLength: number,
  castTime: number
) => {
  let activeTime = 0
  if (trinketDuration >= encounterLength) {
    activeTime = encounterLength
  } else if (encounterLength > trinketCooldown) {
    let x = trinketCooldown / encounterLength - trinketDuration / encounterLength
    activeTime = encounterLength * (1 - x)
  } else {
    activeTime = trinketDuration
  }

  let activeCasts = Math.floor(activeTime / castTime)
  let totalCasts = Math.floor(encounterLength / castTime)
  let totalSpellDamage = trinketBonus * activeCasts
  if (trinketReductionPerCast) {
    totalSpellDamage -= triangularNumber(activeCasts - 1) * trinketReductionPerCast
  }
  let effectiveSpellDamage = totalSpellDamage / activeCasts / (totalCasts / activeCasts)

  console.log(
    `totalCasts=${totalCasts},` +
      `activeCasts=${activeCasts},` +
      `totalSpellDamage=${totalSpellDamage},` +
      `activeTime=${activeTime},` +
      `effectiveSpellDamage=${effectiveSpellDamage}`
  )
  return effectiveSpellDamage
}

const trinketEffectiveSpellDamage = (itemName: string, encounterLength: number, castTime: number) => {
  if (itemName === 'Draconic Infused Emblem') {
    return _trinketEffectiveSpellDamage(100, 15, 75, 0, encounterLength, castTime)
  }

  if (itemName === 'Talisman of Ephemeral Power') {
    return _trinketEffectiveSpellDamage(172, 15, 90, 0, encounterLength, castTime)
  }

  if (itemName === 'Zandalarian Hero Charm') {
    return _trinketEffectiveSpellDamage(204, 20, 120, 17, encounterLength, castTime)
  }

  if (itemName === 'The Restrained Essence of Sapphiron') {
    return _trinketEffectiveSpellDamage(130, 20, 120, 0, encounterLength, castTime)
  }

  return 0
}

const trinketSim = (
  trinketBonus: number,
  trinketDuration: number,
  trinketCooldown: number,
  trinketReductionPerCast: number,
  encounterLength: number,
  castTime: number
) => {
  let encounterElapsed = 0
  let totalCasts = 0
  let totalSpellDamage = 0

  console.log(
    `trinketBonus: ${trinketBonus}, ` +
      `trinketDuration: ${trinketDuration}, ` +
      `trinketCooldown: ${trinketCooldown}, ` +
      `trinketReductionPerCast: ${trinketReductionPerCast}, ` +
      `encounterLength: ${encounterLength}, ` +
      `castTime: ${castTime}`
  )

  while (encounterElapsed < encounterLength) {
    const encounterTimeLeft = encounterLength - encounterElapsed

    console.log(`encounterElapsed = ${encounterElapsed}, ` + `encounterTimeLeft = ${encounterTimeLeft}`)

    if (encounterTimeLeft < castTime) {
      console.log(`not enough time left to cast another spell`)
      encounterElapsed = encounterLength
      continue
    }

    // pop trinket
    // trinketElapsed

    console.log(`casting spell with castTime of ${castTime}`)
    totalCasts += 1
    encounterElapsed += castTime
  }

  console.log(`totalCasts = ${totalCasts}`)
}

const encounterLength = 90
const castTime = 2.87
/*
const trinkets = [
  'Draconic Infused Emblem',
  'Talisman of Ephemeral Power',
  'Zandalarian Hero Charm',
  'The Restrained Essence of Sapphiron'
]
*/

// $AW14 =
// $CG$7 =
// $CG$86 =
// $BZ$7 =
// $BZ$86 =
// $AX14 =

// =IF($AW14="","",SUMIFS($CG$7:$CG$86,$BZ$7:$BZ$86,$AX14))

/*
const trinkets = [
  'Talisman of Ephemeral Power',
  'Zandalarian Hero Charm'
]

for ( const i in trinkets ) {
  const trinketName = trinkets[i]
  const result = trinketEffectiveSpellDamage(trinketName, encounterLength, castTime)
  console.log(trinkets[i] + ' = ' + result)
}
*/

// 'Talisman of Ephemeral Power')
trinketSim(172, 15, 90, 0, encounterLength, castTime)
