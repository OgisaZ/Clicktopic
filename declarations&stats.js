'use strict';

//Labels
const labelgoldNumber = document.querySelector(`.gold`);
const labelHistoryText = document.querySelector(`.history-text`);
const labelItemHistoryText = document.querySelector(`.item-history-text`);
const labelItemList = document.getElementById(`items-list`);
const labelEnemyLevel = document.getElementById(`enemy-level`);
const labelToolTip = document.querySelector(`.tool-tip-level`);
const labelBossToolTip = document.querySelector(`.tool-tip-boss`);
const labelWelcome = document.querySelector(`.welcome-text`);
const labelCharactersRemain = document.querySelector(`.char-remaining`);
const labelIdleDPS = document.querySelector(`.dps`);
//Property labels
const labelSurvivor = document.getElementById(`survivor-text`);
const labelClickMultiplier = document.getElementById(`click-multiplier-text`);
const labelDrone = document.getElementById(`drone-text`);
const labelTurret = document.getElementById(`turret-text`);
const labelClickMachine = document.getElementById(`click-machine-text`);
const labelMinions = document.getElementById(`minions-text`);

//Boss timer label
const labelTimer = document.querySelector(`.timer`);
const progressBar = document.getElementById(`progress`);
//Inputs
const inputFarmName = document.getElementById(`farm-name`);
//Get the farm name from localStorage
inputFarmName.value = localStorage.getItem(`farmName`);
//Buttons
const btngold = document.querySelector(`.gold-button`);
const btnFarmName = document.getElementById(`farm-name-button`);
const btnBoss = document.querySelector(`.boss-button`);
//Property Buttons
const btnsurvivor = document.getElementById(`survivor`);
const btnClickMultiplier = document.getElementById(`clickMultiplier`);
const btnDrone = document.getElementById(`drone`);
const btnTurret = document.getElementById(`turret`);
const btnClickMachine = document.getElementById(`click-machine`);
const btnMinions = document.getElementById(`minions`);
const btnChests = document.querySelector(`.chests`);
const btnMonsterTooth = document.querySelector(`.monster-tooth`);
//Get cash from localStorage if exists (|| if it doesn't)
const modal = document.querySelector(`.modal`);
const modalText = document.querySelector(`.modal-content`);
const modalInfo = document.querySelector(`.info-modal`);
const modalInfoText = document.querySelector(`.info-modal-content`);
const modalProperties = document.querySelector(`.info-properties`);
const modalStats = document.querySelector(`.info-stats`);
const modalItem = document.querySelector(`.info-item`);
const modalAchievements = document.querySelector(`.info-achievements`);
let gold = Number(localStorage?.getItem(`gold`)) || 0;
let buttonClicks = localStorage.getItem(`buttonClicks`) || 0;

//All the items you have (from chests)
const inventory = JSON.parse(localStorage.getItem(`inventory`)) || [];
const inventoryUnique = new Set(inventory);
//Array of all the items
const items = [
  `Iron Fist`,
  `Brass Knuckles`,
  `Poison Dagger`,
  `Gold Pouch`,
  `Crowbar`,
  `Old Man's Watch`,
  `Gold Tooth`,
  `Hollow-Point Rounds`,
  `Glass Pane`,
];
//Number of items you have. Arragement is important.
const counts =
  JSON.parse(localStorage.getItem(`counts`)) || new Array(items.length).fill(0);
let chestOpened = localStorage.getItem(`chestOpened`) || 0;
let goldCollectCount = Number(localStorage.getItem(`goldCollectCount`)) || 0;
let goldSpendCount = Number(localStorage.getItem(`goldSpendCount`)) || 0;
//Array of enemies. The arrangement of enemies are in the array are important
const enemies = [
  `Francua`,
  `Astal`,
  `Kliker`,
  `Apple`,
  `Vermin`,
  `X-RAY`,
  `Squirrel`,
  `Kobasica`,
  `Baboon`,
  `Plastic Bag`,
  `Gaysus`,
  `Footer`,
  `Emperor on Dhar`,
  `Imp`,
  `STBK`,
  `AjVharr`,
  `Krankenstein`,
  `AhhPollo`,
  `Ormar & Orman`,
  `Receipt`,
  `Randall`,
  `Howler`,
  `Bactery Lamp`,
  `Kutreh`,
  `Mica Copper`,
  `H20`,
  `Microwave`,
  `CoffeeBohn`,
  `Guperino`,
  `Vuxna`,
  `PVC Stolarija`,
  `Elder Grandpa`,
];
//Seeing what the next boss is
let nextBoss;
//Current boss health
let bossHealth;
//It's true if you're currently fighting the boss
let bossFightCurrent = false;
//It's defined here so i can cancel it inside a function
let bossFightInterval;
let clickMachineInterval;
//Max current boss health (used for crowbar and progress bar)
let maxBossHealth;
//After defeating final boss, things change like prices,boss health, how much time you have (looping)
let bossBuff = Number(localStorage.getItem(`bossBuff`)) || 0;
let timeBuff = Number(localStorage.getItem(`timeBuff`)) || 0;
let priceNerf = Number(localStorage.getItem(`priceNerf`)) || 0.2;
let time = localStorage.getItem(`time`) || 30;
//Used for selecting nextBoss (badly named i know)
let bossesNumero = 0;
//Used for seeing if you defeated the current boss
let bossKilled = false;
let bossesKilledCount = Number(localStorage.getItem(`bossesKilledCount`)) || 0;
//Used for timer (bossFight function)
let i = 1;
//Boss names, the further down the array the more health they have
let bosses = JSON.parse(localStorage.getItem(`bosses`)) || [
  [`Cedonj`, false],
  [`Pablo`, false],
  [`lane`, false],
  [`Orbito`, false],
  [`Sebastian`, false],
  [`Gojak`, false],
  [`Dizna`, false],
  [`M3S-B0R`, false],
  [`Cabron`, false],
  [`Coaxial fi-bro`, false],
  [`UTP RJ-45`, false],
  [`Stiropor`, false],
  [`Kukri`, false],
  [`ByBaj`, false],
  [`Kharton`, false],
  [`Ivca`, false],
  [`Jovan Fajnisevic`, false],
];
//Current enemy health
let enemyHealth;
//For crowbar item
let enemyMaxHealth;
//Used to see when you will level up. Hold your mouse over the level number to see how many more you need to kill to level up
let enemyKillCount = Number(localStorage.getItem(`enemyKillCount`)) || 0;
let globalEnemyKillCount =
  Number(localStorage.getItem(`globalEnemyKillCount`)) || 0;
let enemyLevel = Number(localStorage.getItem(`enemyLevel`)) || 1;
//How many you need to kill for them to level up
let nextLevelReq;
//Just used to display on screen
let nextLevelReqText;
//This plus some other stuff is used to calculate gold on kill. I guess i should've named it different
let enemyGoldOnKill = enemyLevel * 1.5;
//Used for enemy health calculation
let randomNumber;
//Used for calculating your current Idle DPS
let dpsCalc = [];
//Your damage per second (used for calculations and displaying dps onscreen)
let dps;
//Used for calculating afk gold (timeAway function)
let j = 0;
//How long you weren't playing in seconds
let awayTimeSec;
let firstLoginDate =
  Number(localStorage.getItem(`firstLoginDate`)) || undefined;
//How much money Gold Pouch item gets you on kill
let rollOfPenniesBuff = Number(localStorage.getItem(`rollOfPenniesBuff`)) || 0;
//Used for displaying text onscreen
let changeBackCrit;
let changeBackHistory;
let chnageBackItemHistory;
let changeBackClickMachine;
//How much damage you deal according to how many crowbars you have
let crowbarBuff = counts[4] * 0.5 + 1;
//If you have more than 10 Brass Knuckless, just deal more damage on click. I feel like getting lenses after you have 10 is useless and not fun, so they might as well do something minor
let lensMakerBuff = counts[1] >= 11 ? counts[1] - 10 : 0;
const clickEvent = new Event(`click`);
//Arrow function to give you a random item
const randomItemNumber = () => Math.trunc(Math.random() * items.length);
//Get the object from localStorage if exists (|| if it doesn't)
//property:[cost,how many you have, how much this property makes]
const properties = JSON.parse(localStorage.getItem(`properties`)) || {
  survivor: [20, 0, 0.003, 0],
  clickMultiplier: [40, 1, 0, 0],
  chests: [100, 0, 0, 0],
  drone: [250, 0, 0.02, 0],
  turret: [400, 0, 0.05, 0],
  clickMachine: [500, 0, 2000, 0],
  minions: [600, 0, 0.1, 0],
};
//Used for checking if you have an old save, if i added new properties
const propertyOriginal = {
  survivor: [20, 0, 0.003, 0],
  clickMultiplier: [40, 1, 0, 0],
  chests: [100, 0, 0, 0],
  drone: [250, 0, 0.02, 0],
  turret: [400, 0, 0.05, 0],
  clickMachine: [500, 0, 2000, 0],
  minions: [600, 0, 0.1, 0],
};
let monsterToothBuff = counts[6] * (enemyLevel + 7) * (rollOfPenniesBuff + 1);
//Get idle gold from localStorage. Will explain how it is calculated it its function
let idleGold = Number(localStorage?.getItem(`idleGold`)) || 0;
//How much damage you deal on click. Mostly used with crowbar calculations
let glassPaneBuff = counts[8] * 0.2;

let damageOnClick =
  properties.clickMultiplier[1] +
  (enemyLevel - 1) * (glassPaneBuff + 1) +
  lensMakerBuff;

//Seeing the current time
const now = new Date();
//Welcome text array
const welcomeText = [
  `Hello`,
  `Happy ${new Intl.DateTimeFormat(navigator.language, {
    weekday: `long`,
  }).format(now)}`,
  `G'day`,
  `Welcome back`,
  `What's up`,
  `Thanks`,
  `Ready, Set`,
];
//Display on screen
//Current gold with thousand seperator
labelgoldNumber.textContent = addCurrency(gold);
labelEnemyLevel.textContent = enemyLevel;
localStorage.getItem(`farmName`)
  ? (labelWelcome.textContent = `${
      welcomeText[Math.trunc(Math.random() * welcomeText.length)]
    }, ${localStorage.getItem(`farmName`)}`)
  : (labelWelcome.textContent = ``);
labelItemList.innerHTML = ``;
for (const mov of items) {
  const positionInArray = items.indexOf(mov);
  if (counts[positionInArray] === 0) continue;
  labelItemList.innerHTML += `${counts[positionInArray]}x ${mov}<br>`;
}
if (firstLoginDate === undefined) {
  firstLoginDate = new Date().getTime();
  localStorage.setItem(`firstLoginDate`, firstLoginDate);
}
modalText.textContent = ``;
btnMonsterTooth.style.visibility = `hidden`;
document.querySelector(`title`).textContent = `Clicktopic. ${
  inputFarmName.value ? inputFarmName.value : ``
}`;
setInterval(
  () =>
    (document.querySelector(`title`).textContent = `Clicktopic. ${
      inputFarmName.value ? inputFarmName.value : ``
    }`),
  3000
);
function addCurrency(property) {
  //Adding the $ and 1000 seperators to numbers(also adds 2 decimal places i don't know why)
  return new Intl.NumberFormat(`en-US`, {
    style: `currency`,
    currency: `USD`,
  }).format(property);
}
/////////////////////////////////////////////////////////////////
//OVDEEEE
let x = Math.floor(Math.random() * 10) + 45;
let y = Math.floor(Math.random() * 10) + 47;
btnMonsterTooth.style.left = `50vw`;
btnMonsterTooth.style.top = `50vh`;

function infoModals(string) {
  modal.style.display = `none`;
  modalInfo.style.display = `block`;
  if (string === `Properties`) {
    modalProperties.style.backgroundColor = `gainsboro`;
    modalStats.style.backgroundColor = `gray`;
    modalItem.style.backgroundColor = `gray`;
    // modalAchievements.style.backgroundColor = `gray`;
    let htmlInfo = `<br>Survivor: This is an IDLE property. This means it's only use is to generate gold passively. Current survivor dps is ${(
      properties.survivor[2] *
      properties.survivor[1] *
      31
    ).toFixed(3)}.<br><br>
      Click Multiplier: This is a CLICK property. On click you gain more gold. The more you have the more damage you deal on click. On click, you deal ${damageOnClick.toFixed(
        2
      )} damage.<br><br>
      ${
        btnDrone.style.opacity > 0
          ? `Drone: This is an IDLE property. This means it's only use is to generate gold passively. Current drone dps is ${
              properties.drone[2] * properties.drone[1] * 31
            }<br><br>`
          : `<br><br>`
      }${
      btnTurret.style.opacity > 0
        ? `Turret: This is an IDLE property. This means it's only use is to generate gold passively. Current turret dps is ${
            properties.turret[2] * properties.turret[1] * 31
          }<br><br> `
        : `<br><br>`
    }${
      btnClickMachine.style.opacity > 0
        ? `Click Machine: This is a IDLE-CLICK property. This means that it simulates a click, and thus gets all the item bonuses that clicking has. Currently clicks once every ${(
            properties.clickMachine[2] / 1000
          ).toFixed(3)} second.<br><br>`
        : `<br></br>`
    }
    
    ${
      btnMinions.style.opacity > 0
        ? `Minions: This is an IDLE property. This means it's only use is to generate gold passively. Current minions dps is ${
            properties.minions[2] * properties.minions[1] * 31
          }<br><br> `
        : `<br><br>`
    }`;
    modalInfoText.innerHTML = htmlInfo;
  }
  if (string === `Item`) {
    modalProperties.style.backgroundColor = `gray`;
    modalStats.style.backgroundColor = `gray`;
    modalItem.style.backgroundColor = `gainsboro`;
    // modalAchievements.style.backgroundColor = `gray`;
    let htmlInfo = `<br>${
      inventory.includes(`Iron Fist`) || inventory.includes(`Soldier's Syringe`)
        ? `Iron Fist: Boost the damage that properties do by +20% (+20% per stack).<br><br>`
        : `<b>???</b><br><br>`
    } ${
      inventory.includes(`Brass Knuckles`) || inventory.includes(`Lens Maker`)
        ? `Brass Knuckles: Has a +10% chance (+10% per stack) to CRIT, dealing double damage on click. After you have 10 Brass Knuckles, for every one that you have over 10, deal one more damage on click.<br><br>`
        : `<b>???</b><br><br>`
    }${
      inventory.includes(`Poison Dagger`) ||
      inventory.includes(`Tri-tip Dagger`)
        ? `Poison Dagger: Has a +5% chance (+5% per stack)  to double the IDLE damage you deal for a second.Tests for hit every half a second.<br><br>`
        : `<b>???</b><br><br>`
    }${
      inventory.includes(`Gold Pouch`) || inventory.includes(`Roll of Pennies`)
        ? `Gold Pouch: Gain +10% (+10% per stack) more money on enemy kill.${
            inventory.includes(`Gold Tooth`) ||
            inventory.includes(`Roll of Pennies`)
              ? `Affects Gold Tooth.`
              : ``
          }<br><br>`
        : `<b>???</b><br><br>`
    }${
      inventory.includes(`Crowbar`)
        ? `Crowbar: Deal +50% (+50% per stack) more damage to enemies above 90% health.<br><br>`
        : `<b>???</b><br><br>`
    }${
      inventory.includes(`Old Man's Watch`) ||
      inventory.includes(`Delicate Watch`)
        ? `Old Man's Watch: Gain +1s (+1s per stack) to boss timer.<br><br>`
        : `<b>???</b><br><br>`
    }${
      inventory.includes(`Gold Tooth`) || inventory.includes(`Monster Tooth`)
        ? `Gold Tooth: On enemy kill, spawn a GOLD ORB. When clicked the gold orb gives extra gold. Current Gold Tooth gold on click ${addCurrency(
            monsterToothBuff
          )}.<br><br>`
        : `<b>???</b><br><br>`
    }
    ${
      inventory.includes(`Hollow-Point Rounds`) ||
      inventory.includes(`Armor Piercing Rounds`)
        ? `Hollow-Point Rounds: Deal +20% (+20% per stack) more click damage on bosses.<br><br>`
        : `<b>???</b><br><br>`
    }${
      inventory.includes(`Glass Pane`)
        ? `Glass Pane: Deal +20% (+20% per stack) more damage on click. Lose all Glass Panes if you fail a boss fight.<br><br>`
        : `<b>???</b><br><br>`
    }`;
    modalInfoText.innerHTML = htmlInfo;
  }
  if (string === `Stats`) {
    modalProperties.style.backgroundColor = `gray`;
    modalStats.style.backgroundColor = `gainsboro`;
    modalItem.style.backgroundColor = `gray`;
    // modalAchievements.style.backgroundColor = `gray`;
    let firstLoginSec = (new Date().getTime() - firstLoginDate) / 1000;
    let min = firstLoginSec / 60;
    if (min >= 60) min = min - 60 * Math.trunc(firstLoginSec / 60 / 60);
    let htmlInfo = `<br>Total Enemies Defeated: ${globalEnemyKillCount}<br><br>
      Total Time Played: ${String(Math.trunc(firstLoginSec / 60 / 60)).padStart(
        2,
        0
      )}:${String(Math.trunc(min)).padStart(2, 0)}:${String(
      Math.trunc(firstLoginSec % 60)
    ).padStart(2, 0)}<br><br>
      Total Chests Opened: ${chestOpened}<br><br>
      Total Button Clicks: ${buttonClicks}<br><br>
      Total Gold Collected: ${addCurrency(goldCollectCount)}<br><br>
      Total Gold Spent: ${addCurrency(goldSpendCount)}<br><br>
      Total Bosses Defeated: ${bossesKilledCount}`;
    modalInfoText.innerHTML = htmlInfo;
  }
  // if (string === `Achievements`) {
  //   modalProperties.style.backgroundColor = `gray`;
  //   modalStats.style.backgroundColor = `gray`;
  //   modalItem.style.backgroundColor = `gray`;
  //   modalAchievements.style.backgroundColor = `gainsboro`;
  //   let htmlInfo = `Hello!`;
  //   modalInfoText.innerHTML = htmlInfo;
  // }
}

modalProperties.addEventListener(`click`, () => infoModals(`Properties`));
modalItem.addEventListener(`click`, () => infoModals(`Item`));
modalStats.addEventListener(`click`, () => infoModals(`Stats`));
// modalAchievements.addEventListener(`click`, () => infoModals(`Achievements`));
