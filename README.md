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
