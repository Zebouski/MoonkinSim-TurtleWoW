import Tools from './Tools'
import Equipment from '../class/Equipment'
import Item from '../class/Item'
import Options from '../interface/Options'
import PlayableRace from '../enum/PlayableRace'

import jszip from 'jszip'
import filesaver from 'file-saver'
import ItemClass from '../enum/ItemClass'

export default class ClassicSim {
  static GenerateItemXML(item: Item): string {
    let printStat = (name: string, value: any) => {
      if (value !== 0 && value !== '') {
        return `\t\t<stat type="${name}" value="${value}"/>\n`
      }
      return ``
    }

    let subclassName = item.subclassName
    if (subclassName) {
      subclassName = subclassName.toUpperCase()
    }

    let qualityName = item.qualityName
    if (qualityName) {
      qualityName = qualityName.toUpperCase()
    }

    let _info =
      `\t<info name="${item.name}" type="${subclassName}" ` +
      `slot="${item.classicSimSlotName}" unique="${item.isUnique ? 'yes' : 'no'}" ` +
      `req_lvl="${item.reqLevel}" item_lvl="${item.level}" ` +
      `quality="${qualityName}" ` +
      `boe="${item.isBop ? 'no' : 'yes'}" icon="${item.classicSimIcon}"/>`

    let _cr = item.classicSimClassRestrictions

    let _dr = ''
    if (item.class === ItemClass.Weapon) {
      _dr = `<dmg_range min="${item.minDmg}" max="${item.maxDmg}" speed="${item.speed}"/>`
    }

    let _stats = `\t<stats>\n`
    _stats += printStat('ARMOR', item.armor)
    _stats += printStat('STAMINA', item.stamina)
    _stats += printStat('INTELLECT', item.intellect)
    _stats += printStat('SPIRIT', item.spirit)
    _stats += printStat('MANA_PER_5', item.mp5)
    _stats += printStat('SPELL_DAMAGE', item.spellDamage)
    _stats += printStat('SPELL_DAMAGE_ARCANE', item.arcaneDamage)
    _stats += printStat('SPELL_DAMAGE_NATURE', item.natureDamage)
    _stats += printStat('SPELL_HIT_CHANCE', item.spellHit * 0.01)
    _stats += printStat('SPELL_CRIT_CHANCE', item.spellCrit * 0.01)
    _stats += printStat('SPELL_PENETRATION', item.spellPenetration)
    _stats += `\t</stats>`

    let _source = '\t<source>\n'
    if (item.location) {
      _source += `\t\t${item.location}`
    }

    if (item.boss) {
      _source += `${item.boss}`
    }
    _source += '\n\t</source>\n'

    let _item =
      `<item id="${item.id}" phase="${item.phase}">\n` +
      `${_info}\n` +
      `${_cr}` +
      `${_stats}\n` +
      `${_source}` +
      `</item>`

    /*
      <item id="16824" phase="1">
      <info name="Nightslayer Boots" type="LEATHER" slot="BOOTS" unique="no" req_lvl="60" item_lvl="66" quality="EPIC" boe="no" icon="Inv_boots_08.png"/>
      <class_restriction class="ROGUE"/>
      <stats>
        <stat type="ARMOR" value="138"/>
        <stat type="AGILITY" value="26"/>
        <stat type="STAMINA" value="18"/>
        <stat type="SHADOW_RESISTANCE" value="7"/>
      </stats>
      <source>
      Drops from Shazzrah in Molten Core.
      </source>
    </item>
    */
    return _item
  }

  static GenerateDruidSetupXML(options: Options, equipment: Equipment): string {
    let open = `<?xml version="1.0" encoding="UTF-8"?>\n<setups>\n<setup_string>`
    let close = `</setup_string>\n</setups>`
    let phase = `PHASE=${options.phase}`
    let race = `Race=${options.character.race === PlayableRace.Tauren ? 'Tauren' : 'Night-elf'}`
    let target = `TARGET_LVL=63|TARGET_TYPE=Dragonkin|TARGET_BASE_ARMOR=3750`
    let party = `PARTY=0|PARTY_MEMBER=0`
    let items = `${equipment.head.classicSimSave}|${equipment.neck.classicSimSave}|${equipment.waist.classicSimSave}|${equipment.shoulder.classicSimSave}|${equipment.hands.classicSimSave}|${equipment.legs.classicSimSave}|${equipment.back.classicSimSave}|${equipment.feet.classicSimSave}|${equipment.chest.classicSimSave}|${equipment.wrist.classicSimSave}|${equipment.finger.classicSimSave}|${equipment.finger2.classicSimSave}|${equipment.trinket.classicSimSave}|${equipment.trinket2.classicSimSave}|${equipment.idol.classicSimSave}|${equipment.mainhand.classicSimSave}|${equipment.offhand.classicSimSave}`
    let talents = `LEFT[1LL=5:2ML=5:2RR=3:3LL=3:3RR=2:4ML=5:4MR=5:5ML=1:5MR=3:6ML=5:7ML=1]|RIGHT[1ML=5:2LL=5:3ML=3]`
    let buffs = `BUFFS[Mark of the Wild=N/A:Runn Tum Tuber Surprise=N/A:Greater Arcane Elixir=N/A:Flask of Supreme Power=N/A:Slip'kik's Savvy=N/A:Fengus' Ferocity=N/A:Rallying Cry of the Dragonslayer=N/A:Songflower Serenade=N/A]`
    let debuffs = `DEBUFFS[Curse of Shadow=N/A]`
    let basic = `${phase}|${race}|Class=Druid|${party}|${target}|${talents}|${buffs}|${debuffs}|${items}`

    return `${open}${basic}${close}`
  }

  static GenerateGUISetupXML(options: Options): string {
    let race = `${options.character.race === PlayableRace.Tauren ? 'Tauren' : 'Night-elf'}`

    return `<?xml version="1.0" encoding="UTF-8"?>
<settings>
    <class>Druid</class>
    <race>${race}</race>
    <window>EQUIPMENT</window>
    <num_iterations_quick_sim>1000</num_iterations_quick_sim>
    <num_iterations_full_sim>10000</num_iterations_full_sim>
    <combat_length>${options.encounterLength}</combat_length>
    <phase>${options.phase}</phase>
    <ruleset>0</ruleset>
    <target_creature_type>Dragonkin</target_creature_type>
    <threads>8</threads>
</settings`
  }

  static ExportGear(options: Options, equipment: Equipment) {
    let zip = new jszip()

    zip.file('Saves/Druid-setup.xml', ClassicSim.GenerateDruidSetupXML(options, equipment))
    zip.file('Saves/GUI-setup.xml', ClassicSim.GenerateGUISetupXML(options))
    void zip.generateAsync({ type: 'blob' }).then(function(blob) {
      filesaver.saveAs(blob, 'moonkin-classicsim-saves.zip')
    })
  }
}
