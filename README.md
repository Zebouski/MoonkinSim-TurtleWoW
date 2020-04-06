### [Moonkin Calculator](https://kmmiles.gitlab.io/moonkin-calc/)

##### Version 0.2.6
  - Share public link beta
  - Can pass certain options in by URL (phase, raids, worldbosses, pvprank)
    - e.g. https://kmmiles.gitlab.io/moonkin-calc?phase=4&raids=false&worldbosses=true&pvprank=14
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
