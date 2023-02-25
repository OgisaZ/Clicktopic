'use strict';

//Labels
const labelgoldNumber = document.querySelector(`.gold`);
const labelHistoryText = document.querySelector(`.history-text`);
const labelItemList = document.getElementById(`items-list`);
const labelEnemyLevel = document.getElementById(`enemy-level`);
const labelToolTip = document.querySelector(`.tool-tip-level`);
//Inputs
const inputFarmName = document.getElementById(`farm-name`);
//Get the farm name from localStorage
inputFarmName.value = localStorage.getItem(`farmName`);
//Buttons
const btngold = document.querySelector(`.gold-button`);
const btnFarmName = document.getElementById(`farm-name-button`);
//Property Buttons
const btnClickMultiplier = document.getElementById(`clickMultiplier`);
const btnsurvivor = document.getElementById(`survivor`);
const btnChests = document.querySelector(`.chests`);
const btnDrone = document.getElementById(`drone`);
//Get cash from localStorage if exists (|| if it doesn't)
let gold = Number(localStorage?.getItem(`gold`)) || 0;
//All the items you have (from chests)
const inventory = JSON.parse(localStorage.getItem(`inventory`)) || [];
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
  `Lesser Wisp`, //3 hp
  `Jellyfish`, //6 hp
  `Vermin`, //9 hp
  `Alpha Construct`, //12 hp
  `Beetle`, //15 hp
  `Blind Pest`, //18 hp
  `Lemurian`, //21 hp
  `Imp`, //24 hp
  `Vulture`, //27 hp
  `Stone Golem`, //30 hp
  `Mini Mushrum`, //33 hp
  `Brass Contraption`, //36 hp
  `Beetle Guard`, //39 hp
  `Bison`, //42 hp
  `Greater Wisp`, //45 hp
  `Gup`, //48 hp
  `Clay Templar`, //51 hp
  `Elder Lemurian`, //54 hp
  //Ovi gore su svi hp na level 1, ovako se scaluje hp sa levelima:
  //enemyHealth = (gde se nalaze u array(npr wisp je 1)) * 2.5 * (enemyLevel * 1.2);
  //Znaci wisp se nalazi na poziciji 1, znaci 1 * 2.5 = 2.5 i ako je level 1   2.5* 1.2 = 3 hp
];

let enemyHealth;
//For crowbar item
let enemyMaxHealth;
//Used to see when you will level up. Hold your mouse over the level number to see how many more you need to kill to level up
let enemyKillCount = Number(localStorage.getItem(`enemyKillCount`)) || 0;
let enemyLevel = Number(localStorage.getItem(`enemyLevel`)) || 1;
//How many you need to kill for them to level up
let nextLevelReq;
//Just used to display on screen
let nextLevelReqText;
//This plus some other stuff is used to calculate gold on kill. I guess i should've named it different
let enemyGoldOnKill = enemyLevel * 1.5;
//Used for enemy health calculation
let randomNumber;
//How much money roll of pennies item gets you on kill
let rollOfPenniesBuff = Number(localStorage.getItem(`rollOfPenniesBuff`)) || 0;
//How much damage you deal according to how many crowbars you have
let crowbarBuff = counts[4] * 0.5 + 1;
//Arrow function to give you a random item
const randomItemNumber = () => Math.trunc(Math.random() * items.length);
//Get the object from localStorage if exists (|| if it doesn't)
//property:[cost,how many you have, how much this property makes]
const properties = JSON.parse(localStorage.getItem(`properties`)) || {
  survivor: [20, 0, 0.001, 0],
  clickMultiplier: [40, 1, 0],
  chests: [100, 0, 0],
  drone: [300, 0, 0.005, 0],
};
//Get idle gold from localStorage. Will explain how it is calculated it its function
let idleGold = Number(localStorage?.getItem(`idleGold`)) || 0;
//How much damage you deal on click. Mostly used with crowbar calculations
let damageOnClick = properties.clickMultiplier[1];

//Display on screen
labelgoldNumber.textContent = gold.toFixed(1);
labelEnemyLevel.textContent = enemyLevel;

//REPLACE AT
String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }

  return this.substring(0, index) + replacement + this.substring(index + 1);
};

function enemyLevelUp() {
  if (enemyLevel >= 15) {
    //Requirement for next enemy level is:
    nextLevelReq = enemyLevel * 3 + 20;
  } else {
    //Requirement for next enemy level is:
    nextLevelReq = enemyLevel * 2 + 10;
  }
  //If you kill enough enemies:
  if (enemyKillCount === nextLevelReq) {
    //Updates the enemy level
    enemyLevel++;
    //Change the text
    labelEnemyLevel.textContent = enemyLevel;
    //Set the kill count back to 0
    enemyKillCount = 0;
    //Get more gold on kill
    enemyGoldOnKill = enemyLevel * 3;
  }
  //Add stuff to localStorage
  localStorage.setItem(`enemyLevel`, enemyLevel);
  localStorage.setItem(`enemyKillCount`, enemyKillCount);
  //The text changes every kill
  nextLevelReqText = nextLevelReq - enemyKillCount;
  labelToolTip.textContent = `Kills required for next level:${nextLevelReqText}`;
}

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
function updateHistoryText(string) {
  //Change the opacity from 0 to 1 with a transition effect...
  labelHistoryText.style.opacity = 1;
  labelHistoryText.style.transition = `1s`;
  labelHistoryText.textContent = `Got ${string}!`;
  //...then back to 0
  if (labelHistoryText.style.opacity <= 1) {
    setTimeout(e => {
      labelHistoryText.style.opacity = 0;
      labelHistoryText.style.transition = `1s`;
    }, 500);
  }
}
function updateIdleGold() {
  //Idle gold is summing up what every property makes every 33 millisecs

  idleGold = properties.survivor[2] * properties.survivor[1];
  idleGold =
    idleGold + properties.clickMultiplier[2] * properties.clickMultiplier[1];
  idleGold =
    idleGold + properties.clickMultiplier[2] * properties.clickMultiplier[1];
  idleGold = idleGold + properties.drone[2] * properties.drone[1];
  localStorage.setItem(`idleGold`, idleGold);
}

function updategoldCount() {
  //Every 33 milliseconds (around 30 frames per second)
  //Add the current gold to localStorage
  localStorage.setItem(`gold`, gold);
  //Set the text to be fixed to have 1 decimal place
  labelgoldNumber.textContent = gold.toFixed(1);
  //Add the current properties object to localStorage
  localStorage.setItem(`properties`, JSON.stringify(properties));
  //And add gold for each property per 33 milsec
  gold = gold + idleGold;
  if (enemyHealth <= 0) {
    //The gold you get on kill is calculated:
    gold = gold + (randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff);
    updateHistoryText(
      ((randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff)).toFixed(2)
    );
    enemyKillCount++;

    enemyPicker();
    enemyLevelUp();
  } else {
    //Display the current enemy and their health
    btngold.value = `${enemies[randomNumber]}\nHealth:${enemyHealth.toFixed(
      1
    )}`;
  }
  if (gold >= 200 || properties.drone[1] >= 1) {
    btnDrone.style.opacity = 1;
  }
}
function automatedDamage() {
  //Do automated damage every 33 milisec
  enemyHealth = enemyHealth - idleGold;
}

function updateButtonValues() {
  //Update survivor numbers
  btnsurvivor.value = `Buy survivor(${properties.survivor[1].toFixed(
    1
  )}) \n ${properties.survivor[0].toFixed(1)}`;
  btnDrone.value = `Buy drone(${
    properties.drone[1]
  })\n${properties.drone[0].toFixed(1)}`;

  //Update gold multiplier numbers
  btnClickMultiplier.value = `Buy click multiplier(${properties.clickMultiplier[1].toFixed(
    1
  )}) \n ${properties.clickMultiplier[0].toFixed(1)}`;

  //Update chest numbers
  btnChests.value = `Buy chest\n ${properties.chests[0].toFixed(1)}`;

  //Probably shouldn't of named it inventoryText
  labelItemList.textContent = localStorage.getItem(`inventoryText`);
}
//TODO
// localStorage.clear(`gold`);
// To get all the stuff on screen
enemyLevelUp();
enemyPicker();
updateButtonValues();
updateIdleGold();
//I made them variables so i could cancel them, and also looks better without the setInterval thing on the whole function
let updategoldCountInterval = setInterval(updategoldCount, 33);
let automatedDamageInterval = setInterval(automatedDamage, 33);

function updatePrice(property) {
  //Locate the current price of property

  const currentPrice = properties[property][0];

  //The new price is the current(previous) price times 0.2
  let price = Number(currentPrice + currentPrice * 0.2);

  //Add it to the object, and set it to 1 decimal place
  properties[property][0] = Number(price.toFixed(1));

  //This is pretty smart im proud of myself
  //Change the text on the buttons, to add how many you have, and the price to buy another one
}
//TODO
//Waaay to over-engineered
function numberOfItems(item) {
  //Find the index of that item in the items array
  const whereIsItem = items.findIndex(mov => mov === item);
  //+1 that item that you got
  counts[whereIsItem]++;
  //If you already have the item:
  if (inventory.includes(item)) {
    //Find what number of that item you currently have (looks at the string)
    let whatNumberYouCurrentlyHave = Number(
      labelItemList.textContent[labelItemList.textContent.indexOf(item) - 3]
    );
    //Find where that item is located in the string
    let whereThatItemIsLocated = labelItemList.textContent.indexOf(item) - 3;
    //Super badly made here, will change later, but if you have a two-digit number
    if (counts[whereIsItem] >= 10) {
      //Replace the last digit with the last digit in the counts array, then the first
      labelItemList.textContent = labelItemList.textContent
        ?.replaceAt(whereThatItemIsLocated, String(counts[whereIsItem])[1])
        ?.replaceAt(whereThatItemIsLocated - 1, String(counts[whereIsItem])[0]);
      //If you have between 1 and 9
    } else if (counts[whereIsItem] < 10 && counts[whereIsItem] > 1) {
      //Then just replace that number with how many you currently have
      labelItemList.textContent = labelItemList.textContent.replaceAt(
        whereThatItemIsLocated,
        whatNumberYouCurrentlyHave + 1
      );
    }
    //If you don't have that item already, just write 1x plus the item name
  } else {
    labelItemList.textContent += `${
      inventory.filter(mov => mov === `${item}`).length + 1
    }x ${item}, `;
  }
  //Just in case, not really needed
  return Number(counts[whereIsItem]);
}
//Clicking the button, adds a gold
btngold.addEventListener(`click`, function () {
  //If you have a crowbar
  if (inventory.includes(`Crowbar`)) {
    //If enemy health is above 90% of their max health
    if (enemyHealth >= enemyMaxHealth * 0.9) {
      //Then do the crowbar buff
      damageOnClick = damageOnClick * crowbarBuff;
    } else {
      //If not, then do normal damage
      damageOnClick = properties.clickMultiplier[1];
    }
  }
  //If you have Crit glasses
  if (inventory.includes(`Lens Maker`)) {
    //Calculate the chance you have of critting on hit, if you have 10 glasses, then you have a 100% chance to crit
    const chance = counts[1] * 0.1;
    //Randomly see if you crit
    if (chance >= Math.random()) {
      //Make "CRIT" text visible for 500 millisecs
      document.querySelector(`.crit-text`).style.opacity = 1;
      setTimeout(
        e => (document.querySelector(`.crit-text`).style.opacity = 0),
        500
      );
      //Double the damage on click
      gold = gold + damageOnClick;
      enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
    }
  }
  //Deal normal damage
  gold = gold + damageOnClick;
  enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
  //Prevents crowbar from bugging out if you constantly hit them for double damage(if they die before they can reach below 90% hp)
  damageOnClick = properties.clickMultiplier[1];
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
    updateHistoryText(`survivor`);
    btnsurvivor.value = `Buy survivor(${properties.survivor[1].toFixed(
      1
    )})\n ${properties.survivor[0].toFixed(1)}`;
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
    updateHistoryText(`Click Multiplier`);
    btnClickMultiplier.value = `Buy click multiplier (${properties.clickMultiplier[1].toFixed(
      1
    )}) \n ${properties.clickMultiplier[0].toFixed(1)}`;
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
    updateHistoryText(`drone`);
    btnDrone.value = `Buy drone(${properties.drone[1].toFixed(
      1
    )})\n ${properties.drone[0].toFixed(1)}`;
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
});

//Insted of pressing "Enter" key, click anywhere to lose focus, and it will save it
inputFarmName.onblur = e =>
  localStorage.setItem(`farmName`, inputFarmName.value);

//The fun part!
btnChests.addEventListener(`click`, function (e) {
  //If you can buy it
  if (gold >= properties.chests[0]) {
    gold = gold - properties.chests[0];
    //Pick random item from items array, update the price,and text
    let randomItem = items[randomItemNumber()];
    updatePrice(`chests`);
    numberOfItems(randomItem);
    updateHistoryText(randomItem);
    btnChests.value = `Buy chest\n ${properties.chests[0].toFixed(1)}`;
    //Put the item in your inventory
    inventory.push(randomItem);

    //Local storage scary
    localStorage.setItem(`inventory`, JSON.stringify(inventory));
    localStorage.setItem(`counts`, JSON.stringify(counts));
    localStorage.setItem(`inventoryText`, labelItemList.textContent);

    //ITEM FUNCTIONS!!!(below)
    itemFunctions(randomItem);
  }
});

//ITEMS
//I made it a variable so i can cancel it (maybe a debuff??)
const triTipInterval = setInterval(itemFunctions, 500, `Tri-tip Dagger`);

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
