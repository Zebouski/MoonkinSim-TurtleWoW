### [Moonkin Calculator](https://kmmiles.gitlab.io/moonkin-calc/)

### BiS Quick Links
  - phase 3
    - [pre-raid BiS (no worldbosses / rank 14)](https://kmmiles.gitlab.io/moonkin-calc/?phase=3&raids=false&worldbosses=false&pvprank=1)
    - [BiS (no worldbosses / rank 14)](https://kmmiles.gitlab.io/moonkin-calc/?phase=3&raids=true&worldbosses=false&pvprank=1)
    - [BiS (optimal)](https://kmmiles.gitlab.io/moonkin-calc/?phase=3&raids=true&worldbosses=true&pvprank=14)
  - phase 4
    - [pre-raid BiS (no worldbosses / rank 14)](https://kmmiles.gitlab.io/moonkin-calc/?phase=4&raids=false&worldbosses=false&pvprank=1)
    - [BiS (no worldbosses / rank 14)](https://kmmiles.gitlab.io/moonkin-calc/?phase=4&raids=true&worldbosses=false&pvprank=1)
    - [BiS (optimal)](https://kmmiles.gitlab.io/moonkin-calc/?phase=4&raids=true&worldbosses=true&pvprank=14)
  - phase 5
    - [pre-raid BiS (no worldbosses / rank 14)](https://kmmiles.gitlab.io/moonkin-calc/?phase=5&raids=false&worldbosses=false&pvprank=1)
    - [BiS (optimal)](https://kmmiles.gitlab.io/moonkin-calc/?phase=5&raids=true&worldbosses=true&pvprank=14)
  - phase 6
    - [pre-raid BiS (no worldbosses / rank 14)](https://kmmiles.gitlab.io/moonkin-calc/?phase=6&raids=false&worldbosses=false&pvprank=1)
    - [BiS (optimal)](https://kmmiles.gitlab.io/moonkin-calc/?phase=6&raids=true&worldbosses=true&pvprank=14)

### Changelog
##### Version 0.3.5
  - Display regeneration information when hovering over mana

##### Version 0.3.4
  - Experimental feature: Export to ClassicSim
  - Remove enchant exploit option
  - Fix shimmer bonus slightly undershooting due to wowhead's weird verbiage
  - Fix bug that erronously added 1 crit to all casts
  - Fix bug where item/enchant select lists have improper scores
  - Update DPS and weight display in header
  - Improvements to display of spell crit in attributes box
  - Groundwork for future support of activated trinkets
  
##### Version 0.3.3
  - Fix bug where itemsets (e.g. bloodvine) did not honor options (e.g. phase)
  - Show warning when setting target below 63
  - More cleanup/refactoring of equipment
  - Gloves of Delusional Power and Trance Stone not obeying World Boss option
  - Show total spell hit in attributes box (not just to cap)

##### Version 0.3.2
  - First phase of equipment reworking
    - Items can now be unequipped
    - Items no longer unlocked when clicking them
    - New icons for unequipping, unlocking and sharing gear
    
##### Version 0.3.1
  - Add enchant exploit
  - Remove boe limitation
  - Add Ironbark Staff to horde

##### Version 0.3.0
  - Sync item database with spreadsheet
  
##### Version 0.2.9
  - Change abyssal items and Glowing Black Orb to phase 4
  - Abyssal Cloth Amice of Restoration is healing not spell damage
  - Change Moonshadow Stave to phase 3
  - Show intellect in item list
  - Allow passing 'tailoring' option on url
  - Fix cast time reduction from natures grace in cases where it dips below GCD

##### Version 0.2.8
  - Fix sorting error in item selection
  - Enchantments not showing on two handed / one handed weapons

##### Version 0.2.7
  - Phase 4 now default
  - Allow filtering by random enchant gear
  - Enchantments are customizable
  - Custom enchantments are shared in public links
  - Gear now automatically locked when creating public link
  - Added backwards compatability for old public links

##### Version 0.2.6
  - Share public link beta
  - Can pass certain options in by URL (phase, raids, worldbosses, pvprank)
    - e.g. https://kmmiles.gitlab.io/moonkin-calc/?phase=4&raids=false&worldbosses=true&pvprank=14
  - Fix issue with shared gearsets sometimes not loading
  - Stop page from shifting when opening gear select and share link
  - Item Database Changes:
    - Added dreamweave set
    - Changed Arlokks Hoodoo Stick to healing instead of damage
    - Removed Deep Rooted Ring
    - Changed Mindfang, Sageclaw, and Ironbark stafff to phase 3

##### Version 0.2.5
  - Item selection beta
  - Bloodvine legs and boots always overriding custom selections
  - Not optimizing for set bonus if bloodvine item manually selected

##### Version 0.2.4
  - Experimental item selection
    - Fix weapons / offhands 
    - Fix trinkets
    - Highlight mouseovered item in item table
    - Add lock icon to items that are manually selected
##### Version 0.2.3
  - Updated UI
  - Add Spirit of Zandalar buff

##### Version 0.2.2
  - Smarter gear recommendation
  - Filter items by tailoring
  - Factors in item set bonuses
  - Target level selection
  
##### Version 0.2.1
  - Filter items by Raids, World Bosses and PVP Rank
  - Support shimmer targets
  - Show boss / location on tooltips
  - Various bug fixes

### Project setup
```
yarn install
```

#### Compiles and hot-reloads for development
```
yarn serve
```

#### Compiles and minifies for production
```
yarn build
```

#### Lints and fixes files
```
yarn lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
