'use strict';

//Labels
const labelgoldNumber = document.querySelector(`.gold`);
const labelHistoryText = document.querySelector(`.history-text`);
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
const btnMinions = document.getElementById(`minions`);
const btnChests = document.querySelector(`.chests`);
//Get cash from localStorage if exists (|| if it doesn't)
const modal = document.querySelector(`.modal`);
const modalText = document.querySelector(`.modal-content`);
let gold = Number(localStorage?.getItem(`gold`)) || 0;
//All the items you have (from chests)
const inventory = JSON.parse(localStorage.getItem(`inventory`)) || [];
const inventoryUnique = new Set(inventory);
//Array of all the items
const items = [
  `Soldier's Syringe`,
  `Lens Maker`,
  `Tri-tip Dagger`,
  `Roll of Pennies`,
  `Crowbar`,
];
//Number of items you have. Arragement is important.
const counts =
  JSON.parse(localStorage.getItem(`counts`)) || new Array(items.length).fill(0);
//Array of enemies. The arrangement of enemies are in the array are important
const enemies = [
  `Francua`,
  `Lesser Wisp`,
  `Kliker`,
  `Jellyfish`,
  `Vermin`,
  `Alpha Construct`,
  `Beetle`,
  `Kobasica`,
  `Baboon`,
  `Blind Pest`,
  `Gaysus`,
  `Footer`,
  `Lemurian`,
  `Imp`,
  `STBK`,
  `Vulture`,
  `Siptar`,
  `Krankenstein`,
  `Stone Golem`,
  `Ormar & Orman`,
  `Mini Mushrum`,
  `Randall`,
  `Brass Contraption`,
  `Ford F-150`,
  `Beetle Guard`,
  `Bison`,
  `Mica Copper`,
  `H20`,
  `Microwave`,
  `Greater Wisp`,
  `Gup`,
  `Clay Templar`,
  `PVC Stolarija`,
  `Elder Lemurian`,
];
let nextBoss;
let bossHealth;
let bossFightCurrent = false;
let bossFightInterval;
let maxBossHealth;
let bossBuff = localStorage.getItem(`bossBuff`) || 0;
let timeBuff = localStorage.getItem(`timeBuff`) || 0;
let bossesNumero = 0;
let bossKilled = false;
let time = localStorage.getItem(`time`) || 30;
let i = 1;
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
let enemyHealth;
//For crowbar item
let enemyMaxHealth;
//Used to see when you will level up. Hold your mouse over the level number to see how many more you need to kill to level up
let enemyKillCount = Number(localStorage.getItem(`enemyKillCount`)) || 0;
// let globalEnemyKillCount =
// Number(localStorage.getItem(`globalEnemyKillCount`)) || 0;
let enemyLevel = Number(localStorage.getItem(`enemyLevel`)) || 1;
//How many you need to kill for them to level up
let nextLevelReq;
//Just used to display on screen
let nextLevelReqText;
//This plus some other stuff is used to calculate gold on kill. I guess i should've named it different
let enemyGoldOnKill = enemyLevel * 1.5;
//Used for enemy health calculation
let randomNumber;
let dpsCalc = [];
let dps;
let j = 0;
let awayTimeSec;
//How much money roll of pennies item gets you on kill
let rollOfPenniesBuff = Number(localStorage.getItem(`rollOfPenniesBuff`)) || 0;
let priceNerf = Number(localStorage.getItem(`priceNerf`)) || 0.2;
let changeBackCrit;
let changeBackHistory;
//How much damage you deal according to how many crowbars you have
let crowbarBuff = counts[4] * 0.5 + 1;
//Arrow function to give you a random item
const randomItemNumber = () => Math.trunc(Math.random() * items.length);
//Get the object from localStorage if exists (|| if it doesn't)
//property:[cost,how many you have, how much this property makes]
const properties = JSON.parse(localStorage.getItem(`properties`)) || {
  survivor: [20, 0, 0.003, 0],
  clickMultiplier: [40, 1, 0],
  chests: [100, 0, 0],
  drone: [250, 0, 0.02, 0],
  turret: [400, 0, 0.05, 0],
  minions: [600, 0, 0.1],
};
//Get idle gold from localStorage. Will explain how it is calculated it its function
let idleGold = Number(localStorage?.getItem(`idleGold`)) || 0;
//How much damage you deal on click. Mostly used with crowbar calculations
let damageOnClick = properties.clickMultiplier[1] + enemyLevel - 1;
const now = new Date();
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
labelgoldNumber.textContent = addCurrency(gold.toFixed(2));
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
modalText.textContent = ``;
//----------------------------------------------------------------------------

//FUNCTIONS
function timeAway() {
  if (j === 0) {
    awayTimeSec = Math.trunc((now - localStorage.getItem(`then`)) / 1000);

    //If you were away for 10 secs or less
    if (
      awayTimeSec <= 10 ||
      idleGold === 0 ||
      localStorage.getItem(`then`) === null
    ) {
      awayTimeSec = 0;
      modal.style.display = `none`;
      //Else
    } else {
      modal.style.display = `block`;
      let min = String(Math.trunc(awayTimeSec / 60)).padStart(2, 0);
      if (min >= 60) min = min - 60 * Math.trunc(awayTimeSec / 60 / 60);
      modalText.textContent = `You were away for ${String(
        Math.trunc(awayTimeSec / 60 / 60)
      ).padStart(2, 0)}:${String(min).padStart(2, 0)}:${String(
        Math.trunc(awayTimeSec % 60)
      ).padStart(2, 0)} and your dps was ${dps}.\n You earned ${addCurrency(
        (awayTimeSec * dps).toFixed(1)
      )}`;
      gold = gold + awayTimeSec * dps;
    }
  }
  const then = new Date().getTime();
  localStorage.setItem(`then`, then);
  j++;
}
window.onclick = function (e) {
  if (e.target !== modal) {
    modal.style.display = `none`;
  }
};

function enemyPicker() {
  //Take a random item from 0 to the length of enemies array
  randomNumber = Math.trunc(Math.random() * enemies.length);
  //Calculate enemy health:
  enemyHealth = (randomNumber + 1) * 2.5 * (enemyLevel * 1.2);
  //For crowbar use
  enemyMaxHealth = enemyHealth;
  //Display and choose the enemy name
  const randomEnemy = enemies[randomNumber];
  btngold.value = `${randomEnemy} \n`;
}

function bossPicker(bossKilled = false) {
  for (const boss of bosses) {
    if (bosses[bosses.indexOf(boss)][1] === false) {
      bossesNumero = bosses.indexOf(boss);
    }

    if (bossKilled) {
      bosses[bossesNumero][1] = true;
      bossKilled = false;
      localStorage.setItem(`bosses`, JSON.stringify(bosses));
    }
    if (bosses[bosses.length - 1][1]) {
      for (const boss of bosses) {
        boss[1] = false;
      }
      priceNerf = 0.05;
      localStorage.setItem(`priceNerf`, priceNerf);
      bossBuff = bossBuff + 3;
      timeBuff += 30;
      time = 30 + Number(timeBuff);
      localStorage.setItem(`time`, time);
      localStorage.setItem(`timeBuff`, timeBuff);
      localStorage.setItem(`bossBuff`, bossBuff);
      localStorage.setItem(`bosses`, JSON.stringify(bosses));
      nextBoss = bosses[0][0];
      bossesNumero = bosses.indexOf(boss);
      bossHealth =
        enemyLevel *
        2 *
        ((bossesNumero + 1) * 100) *
        (bossBuff === 0 ? 1 : bossBuff + 1);
      maxBossHealth = bossHealth;
      labelBossToolTip.textContent = `Boss health: ${bossHealth}\r\n Time to beat: ${
        30 + Number(timeBuff)
      }s`;
      return nextBoss;
    }
    if (bosses[bossesNumero][1] === false) {
      nextBoss = bosses[bossesNumero][0];
      bossHealth =
        enemyLevel *
        2 *
        ((bossesNumero + 1) * 100) *
        (bossBuff === 0 ? 1 : bossBuff);
      maxBossHealth = bossHealth;
      localStorage.setItem(`bosses`, JSON.stringify(bosses));
      labelBossToolTip.textContent = `Boss Health: ${bossHealth}\r\n Time to beat: ${
        30 + Number(timeBuff)
      }s`;
      return nextBoss;
    }
  }
}
function enemyLevelUp() {
  if (enemyLevel >= 15) {
    //Requirement for next enemy level is:
    nextLevelReq = enemyLevel * 3 + 20;
    enemyGoldOnKill = enemyLevel * 6.5;
  } else {
    //Requirement for next enemy level is:
    nextLevelReq = enemyLevel * 2 + 10;
    enemyGoldOnKill = enemyLevel * 3;
  }
  //If you kill enough enemies:
  if (bossKilled) {
    //Updates the enemy level
    enemyLevel++;
    //Change the text
    labelEnemyLevel.textContent = enemyLevel;
    //Set the kill count back to 0
    enemyKillCount = 0;
    //Get more gold on kill
    bossKilled = false;
    updateHistoryText(`LEVEL UP! Now level ${enemyLevel}`);
  }
  //Add stuff to localStorage
  localStorage.setItem(`enemyLevel`, enemyLevel);
  localStorage.setItem(`enemyKillCount`, enemyKillCount);
  //The text changes every kill
  nextLevelReqText = nextLevelReq - enemyKillCount;
  labelToolTip.textContent = `Kills required for next level:${
    nextLevelReqText <= 0 ? `0` : nextLevelReqText
  }`;
}

function displayBoss() {
  if (enemyKillCount >= nextLevelReq) {
    btnBoss.style.visibility = `visible`;
    labelBossToolTip.style.opacity = 1;
  } else {
    btnBoss.style.visibility = `hidden`;
    labelBossToolTip.style.opacity = 0;
  }
  if (bossFightCurrent === true) {
    btnBoss.style.visibility = `hidden`;
    labelBossToolTip.style.opacity = 0;
  }
}

function bossFight() {
  clearInterval(enemyTesterInterval);

  enemyKillCount = 0;
  localStorage.setItem(`enemyKillCount`, enemyKillCount);
  bossFightCurrent = true;
  if (i === 1) {
    time = 30 + Number(timeBuff);
    console.log(`Ovo je tu prvi put ${time}`);
    const timer = setInterval(function () {
      let min = String(Math.trunc(time / 60)).padStart(2, 0);

      let sec = String(time % 60).padStart(2, 0);
      console.log(`Unutar timer interval ` + time);
      labelTimer.textContent = `${min}:${sec}`;

      time--;
      if (time <= -1) {
        clearInterval(timer);
        clearInterval(bossFightInterval);
        bossFightCurrent = false;
        enemyTesterInterval = setInterval(enemyTester, 33);
        //You get the nextBoss name here
        bossPicker();
        enemyPicker();
        updateButtonValues();
        updateIdleGold();
        labelTimer.textContent = ``;

        i = 1;
        labelHistoryText.style.color = `red`;
        updateHistoryText(`Failed to defeat ${nextBoss}`);
        progressBar.style.visibility = `hidden`;
        setTimeout(() => (labelHistoryText.style.color = `black`), 1500);
      }
      if (!bossFightCurrent) {
        clearInterval(timer);
        labelTimer.textContent = ``;
        progressBar.style.visibility = `hidden`;

        i = 1;
      }
    }, 1000);
  }

  if (bossHealth <= 0) {
    bossFightCurrent = false;
    //The gold you get on kill is calculated:
    gold = gold + (maxBossHealth / 2) * (enemyGoldOnKill + rollOfPenniesBuff);
    updateHistoryText(
      `Got` +
        addCurrency(
          ((maxBossHealth / 2) * (enemyGoldOnKill + rollOfPenniesBuff)).toFixed(
            2
          )
        )
    );
    clearInterval(bossFightInterval);
    enemyTesterInterval = setInterval(enemyTester, 33);
    //You get the nextBoss name here
    bossKilled = true;
    enemyLevelUp();
    bossPicker(true);
    enemyPicker();
    updateButtonValues();
    updateIdleGold();
    labelBossToolTip.style.opacity = 1;
    progressBar.style.visibility = `hidden`;
    console.log(`Ovo je kad si ubio bossa ${time}`);
    i = 1;
  } else {
    btngold.value = `${nextBoss}\nHealth:${bossHealth.toFixed(1)}`;
    progressBar.max = maxBossHealth;
    progressBar.value = bossHealth;
    i++;
  }
}

function updateHistoryText(string) {
  //Change the opacity from 0 to 1 with a transition effect...
  clearTimeout(changeBackHistory);
  labelHistoryText.style.opacity = 1;
  labelHistoryText.style.transition = `1s`;
  labelHistoryText.textContent = `${string}!`;
  //...then back to 0
  changeBackHistory = setTimeout(e => {
    labelHistoryText.style.opacity = 0;
    labelHistoryText.style.transition = `1s`;
  }, 1500);
}

function updateIdleGold() {
  //Idle gold is summing up what every property makes every 33 millisecs

  idleGold = properties.survivor[2] * properties.survivor[1];
  idleGold = idleGold + properties.drone[2] * properties.drone[1];
  idleGold = idleGold + properties.turret[2] * properties.turret[1];
  idleGold = idleGold + properties.minions[2] * properties.minions[1];
  localStorage.setItem(`idleGold`, idleGold);
}

function enemyTester() {
  if (enemyHealth <= 0) {
    //The gold you get on kill is calculated:
    gold = gold + (randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff);
    updateHistoryText(
      `Got ` +
        addCurrency(
          ((randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff)).toFixed(
            2
          )
        )
    );
    enemyKillCount++;
    // globalEnemyKillCount++;
    // localStorage.setItem(`globalEnemyKillCount`, globalEnemyKillCount);

    enemyPicker();
    enemyLevelUp();
  } else {
    //Display the current enemy and their health
    btngold.value = `${enemies[randomNumber]}\nHealth:${enemyHealth.toFixed(
      1
    )}`;
  }
}
function addCurrency(property) {
  //Adding the $ and 1000 seperators to numbers(also adds 2 decimal places i don't know why)
  return new Intl.NumberFormat(`en-US`, {
    style: `currency`,
    currency: `USD`,
  }).format(property);
}
function updategoldCount() {
  //Every 33 milliseconds (around 30 frames per second)
  //Add the current gold to localStorage
  localStorage.setItem(`gold`, gold);
  //Set the text to be fixed to have 1 decimal place
  labelgoldNumber.textContent = addCurrency(gold.toFixed(2));
  //Add the current properties object to localStorage
  localStorage.setItem(`properties`, JSON.stringify(properties));
  //And add gold for each property per 33 milsec
  gold = gold + idleGold;

  if (gold >= 200 || properties.drone[1] >= 1 || btnDrone.style.opacity === 1) {
    labelDrone.style.opacity = 1;
    btnDrone.style.opacity = 1;
    labelTurret.style.opacity = 1;
    btnTurret.style.opacity = 1;
  }
  if (
    gold >= 600 ||
    properties.minions[1] >= 1 ||
    btnMinions.style.opacity === 1
  ) {
    labelMinions.style.opacity = 1;
    btnMinions.style.opacity = 1;
  }
}
function automatedDamage() {
  //Do automated damage every 33 milisec
  if (bossFightCurrent) {
    bossHealth = bossHealth - idleGold;
  } else {
    enemyHealth = enemyHealth - idleGold;
  }
}
//Has to be undefined for calculations to work
let calcDPSTimeout;
function calcDPS() {
  //Every 33 milisec, add your current idleGold to dpsCalc array
  dpsCalc.push(idleGold);
  //If there is no timeout currently happening,
  if (calcDPSTimeout === undefined) {
    //Every second,
    calcDPSTimeout = setTimeout(() => {
      //Calculate your dps. I do this by taking the dpsCalc array and adding every value up, then resetting the array back to empty, so every second it will fill up to 31 values, then back to 0. When at 31 (first 29) sum every value up. That is your dps
      dps = dpsCalc.reduce((acc, mov) => acc + mov, 0).toFixed(3);
      dps <= 0
        ? (labelIdleDPS.textContent = `0`)
        : (labelIdleDPS.textContent = `${dps}`);

      dpsCalc = [];
      //Set it to undefined so program knows that calcDPSTimeout has finished execution
      calcDPSTimeout = undefined;
    }, 1000);
  }
}
function updateButtonValues() {
  //Update survivor numbers
  btnsurvivor.value = `Buy ${addCurrency(properties.survivor[0])}`;
  labelSurvivor.textContent = `Survivor (${properties.survivor[1]})`;

  //Update click multiplier numbers
  btnClickMultiplier.value = `Buy ${addCurrency(
    properties.clickMultiplier[0]
  )}`;
  labelClickMultiplier.textContent = `Click Multiplier (${properties.clickMultiplier[1].toFixed(
    1
  )})`;

  //Update drone numbers
  btnDrone.value = `Buy ${addCurrency(properties.drone[0])}`;
  labelDrone.textContent = `Drone (${properties.drone[1]})`;
  //Update turret numbers
  btnTurret.value = `Buy ${addCurrency(properties.turret[0])}`;
  labelTurret.textContent = `Turret (${properties.turret[1]})`;
  //Update minions numbers
  btnMinions.value = `Buy ${addCurrency(properties.minions[0])}`;
  labelMinions.textContent = `Minions (${properties.minions[1]})`;
  //Update chest numbers
  btnChests.value = `Buy chest\n ${addCurrency(properties.chests[0])}`;

  //Update boss button so it has the next boss name on it
  btnBoss.value = `Fight ${nextBoss}`;

  //Turn buttons you can't afford to red
  setInterval(e => {
    if (gold <= properties.survivor[0])
      btnsurvivor.style.backgroundColor = `crimson`;
    else btnsurvivor.style.backgroundColor = `gainsboro`;

    if (gold <= properties.clickMultiplier[0])
      btnClickMultiplier.style.backgroundColor = `crimson`;
    else btnClickMultiplier.style.backgroundColor = `gainsboro`;

    if (gold <= properties.drone[0]) btnDrone.style.backgroundColor = `crimson`;
    else btnDrone.style.backgroundColor = `gainsboro`;

    if (gold <= properties.turret[0])
      btnTurret.style.backgroundColor = `crimson`;
    else btnTurret.style.backgroundColor = `gainsboro`;
    if (gold <= properties.minions[0])
      btnMinions.style.backgroundColor = `crimson`;
    else btnMinions.style.backgroundColor = `gainsboro`;

    if (gold <= properties.chests[0])
      btnChests.style.backgroundColor = `crimson`;
    else btnChests.style.backgroundColor = `gainsboro`;
  }, 100);
}
// To get all the stuff on screen
enemyLevelUp();
enemyPicker();
bossPicker();
updateButtonValues();
updateIdleGold();
// I made them variables so i could cancel them, and also looks better without the setInterval thing on the whole function
let updategoldCountInterval = setInterval(updategoldCount, 33);
let automatedDamageInterval = setInterval(automatedDamage, 33);
let enemyTesterInterval = setInterval(enemyTester, 33);
let displayBossInterval = setInterval(displayBoss, 33);
let calcDPSInterval = setInterval(calcDPS, 33);
let timeAwayInterval = setInterval(timeAway, 2200);

function updatePrice(property) {
  //Locate the current price of property

  const currentPrice = properties[property][0];

  //The new price is the current(previous) price times 0.2
  let price = Number(currentPrice + currentPrice * priceNerf);

  //Add it to the object, and set it to 1 decimal place
  properties[property][0] = Number(price.toFixed(1));

  //Change the text on the buttons, to add how many you have, and the price to buy another one
}
function numberOfItems(item) {
  const whereIsItem = items.findIndex(mov => mov === item);
  //+1 that item that you got
  counts[whereIsItem]++;
  //if there is something there, change to empty string
  labelItemList.innerHTML = ``;
  for (const mov of items) {
    //see where the item is in items array
    const positionInArray = items.indexOf(mov);
    //if you don't have any, don't go any further in the for loop
    if (counts[positionInArray] === 0) continue;
    //write the text, how many of that item you have, that item, and add a break, so there is a new line
    labelItemList.innerHTML += `${counts[positionInArray]}x ${mov}<br>`;
  }
}
//-----------------------------------------------------------------------------------------------
//BUTTONS AND EVENT LISTENERS
//Clicking the button, adds gold
btngold.addEventListener(`click`, function () {
  //If you have a crowbar
  if (inventory.includes(`Crowbar`)) {
    //If enemy health is above 90% of their max health
    if (
      bossFightCurrent
        ? bossHealth >= maxBossHealth * 0.9
        : enemyHealth >= enemyMaxHealth * 0.9
    ) {
      //Then do the crowbar buff
      damageOnClick = damageOnClick * crowbarBuff;
      console.log(`CROWBAAAAR`);
    } else {
      //If not, then do normal damage
      damageOnClick = properties.clickMultiplier[1] + enemyLevel - 1;
    }
  }
  //If you have Crit glasses
  if (inventory.includes(`Lens Maker`)) {
    //Calculate the chance you have of critting on hit, if you have 10 glasses, then you have a 100% chance to crit
    const chance = counts[1] * 0.1;
    //Randomly see if you crit
    if (chance >= Math.random()) {
      clearTimeout(changeBackCrit);
      //Make "CRIT" text visible for 500 millisecs
      document.querySelector(`.crit-text`).style.opacity = 1;
      changeBackCrit = setTimeout(
        e => (document.querySelector(`.crit-text`).style.opacity = 0),
        150
      );
      //Double the damage on click
      gold = gold + damageOnClick;
      if (bossFightCurrent) {
        bossHealth = bossHealth.toFixed(1) - damageOnClick.toFixed(1);
      } else {
        enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
      }
    }
  }
  //Deal normal damage
  gold = gold + damageOnClick;
  if (bossFightCurrent) {
    bossHealth = bossHealth.toFixed(1) - damageOnClick.toFixed(1);
  } else {
    enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
  }

  //Prevents crowbar from bugging out if you constantly hit them for double damage(if they die before they can reach below 90% hp)
  damageOnClick = properties.clickMultiplier[1] + enemyLevel - 1;
});

//Buying the survivor button
btnsurvivor.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.survivor[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.survivor[0];

    //Add the property to the object
    properties.survivor[1] = properties.survivor[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`survivor`);
    updateHistoryText(`Got survivor`);
    updateButtonValues();
  }
});
//Click multiplier is also used to calculate how much damage you deal on click, even if you don't have any
btnClickMultiplier.addEventListener(`click`, function () {
  //If you have enough gold
  if (gold >= properties.clickMultiplier[0]) {
    //Cost
    gold = gold - properties.clickMultiplier[0];
    //Deal more damage every click, update idle gold (may change stuff),the price, and text
    properties.clickMultiplier[1] = properties.clickMultiplier[1] + 0.2;
    updateIdleGold();
    updatePrice(`clickMultiplier`);
    updateHistoryText(`Got Click Multiplier`);
    updateButtonValues();
  }
});

btnDrone.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.drone[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.drone[0];

    //Add the property to the object
    properties.drone[1] = properties.drone[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`drone`);
    updateHistoryText(`Got drone`);
    updateButtonValues();
  }
});

//Not really on click, more like on pressing "Enter" key
btnFarmName.addEventListener(`click`, function (e) {
  //So it doesn't automatically refresh the page
  e.preventDefault();

  //Put the farm name in localStorage
  localStorage.setItem(`farmName`, inputFarmName.value);

  //Lose focus on input field
  inputFarmName.blur();
  labelCharactersRemain.style.opacity = 0;
  if (inputFarmName.value === `resetLS`) {
    document.querySelector(`.reset`).style.visibility = `visible`;
  }
});
//To see how many characters you can type in farmName
inputFarmName.addEventListener(`keyup`, function (e) {
  labelCharactersRemain.style.opacity = 1;
  labelCharactersRemain.textContent = 10 - inputFarmName.value.length;
});

//Insted of pressing "Enter" key, click anywhere to lose focus, and it will save it
inputFarmName.onblur = e => {
  localStorage.setItem(`farmName`, inputFarmName.value);
  labelCharactersRemain.style.opacity = 0;
};

btnTurret.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.turret[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.turret[0];

    //Add the property to the object
    properties.turret[1] = properties.turret[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`turret`);
    updateHistoryText(`Got turret`);
    updateButtonValues();
  }
});

btnMinions.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.minions[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.minions[0];

    //Add the property to the object
    properties.minions[1] = properties.minions[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`minions`);
    updateHistoryText(`Got minions`);
    updateButtonValues();
  }
});

//The fun part!
btnChests.addEventListener(`click`, function (e) {
  //If you can buy it
  if (gold >= properties.chests[0]) {
    gold = gold - properties.chests[0];
    //Pick random item from items array, update the price,and text
    let randomItem = items[randomItemNumber()];
    updatePrice(`chests`);
    numberOfItems(randomItem);
    updateHistoryText(`Got ${randomItem}`);
    btnChests.value = `Buy chest\n ${properties.chests[0].toFixed(1)}`;
    //Put the item in your inventory
    inventory.push(randomItem);

    //Local storage scary
    localStorage.setItem(`inventory`, JSON.stringify(inventory));
    localStorage.setItem(`counts`, JSON.stringify(counts));
    updateButtonValues();
    //ITEM FUNCTIONS!!!(below)
    itemFunctions(randomItem);
  }
});
//Boss fight button
btnBoss.addEventListener(`click`, function (e) {
  //Make it visible
  btnBoss.style.visibility = `hidden`;
  //Put the right boss name on it
  updateButtonValues();
  //Call bossFight interval every 33 milisec
  bossFightInterval = setInterval(bossFight, 33);
  labelBossToolTip.style.opacity = 0;
  progressBar.style.visibility = `visible`;
});

//----------------------------------------------------------------------------------
//ITEMS
//I made it a variable so i can cancel it (maybe a debuff??)
let triTipInterval;
setTimeout(() => {
  triTipInterval = setInterval(itemFunctions, 500, `Tri-tip Dagger`);
}, 3000);

function itemFunctions(item) {
  //If you got...
  switch (item) {
    //... a syringe:
    case `Soldier's Syringe`:
      //For every property boost its damage by 5%
      for (const mov in properties) {
        if (properties[mov][2] > 0) {
          properties[mov][2] =
            properties[mov][2].toFixed(3) * 0.05 + properties[mov][2];
        }
      }
      updateIdleGold();
      break;
    //... a tri tip
    case `Tri-tip Dagger`:
      //See the chances of getting a tri tip effect
      const chance = counts[2] * 0.05;
      //So you can turn it back later
      const currentIdleGold = idleGold;
      //If you do get a tri tip effect to trigger it will:
      if (chance >= Math.random()) {
        //Double you idle gold production (remember the setInterval of 500 milliseconds)
        idleGold = idleGold * 2;
        //I don't call updateIdleGold() here because it will reset the whole tri tip effect
        //Then after a second, turn idle gold back
        setTimeout(e => {
          idleGold = currentIdleGold;
          updateIdleGold();
        }, 1000);
      }

      break;
    //... roll of pennies
    case `Roll of Pennies`:
      //Increase how much gold you get on kill
      rollOfPenniesBuff = enemyGoldOnKill * 0.005 + rollOfPenniesBuff;
      //This made some problems so i put it as a number before giving it 4 decimal places
      rollOfPenniesBuff = Number(rollOfPenniesBuff.toFixed(4));
      localStorage.setItem(`rollOfPenniesBuff`, rollOfPenniesBuff);
      break;
    //... a crowbar
    case `Crowbar`:
      //Just update the crowbar buff by 50%, what it actually does you can see on button click, along with Lens Maker which isn't here in item functions
      crowbarBuff = counts[4] * 0.5 + 1;
      break;
    default:
      break;
  }
}

//Reset localStorage if your name is "resetLS"
document.querySelector(`.reset`).addEventListener(`click`, function () {
  clearInterval(enemyTesterInterval);
  clearInterval(displayBossInterval);
  clearInterval(updategoldCountInterval);
  clearInterval(automatedDamageInterval);
  localStorage.clear();

  setTimeout(() => location.reload(), 1000);
  setInterval(() => {
    localStorage.clear();
    console.log(`Resetting...`);
  }, 1);
});
