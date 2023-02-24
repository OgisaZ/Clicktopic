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
const btnChests = document.querySelector(`.chests`);
//Property Buttons
const btnClickMultiplier = document.getElementById(`clickMultiplier`);
const btnsurvivor = document.getElementById(`survivor`);
//Get cash from localStorage if exists (|| if it doesn't)
let gold = Number(localStorage?.getItem(`gold`)) || 0;
const inventory = JSON.parse(localStorage.getItem(`inventory`)) || [];
const items = [
  `Soldier's Syringe`,
  `Lens Maker`,
  `Tri-tip Dagger`,
  `Roll of Pennies`,
  `Crowbar`,
];
const counts =
  JSON.parse(localStorage.getItem(`counts`)) || new Array(items.length).fill(0);
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
let enemyMaxHealth;
let enemyKillCount = Number(localStorage.getItem(`enemyKillCount`)) || 0;
let enemyLevel = Number(localStorage.getItem(`enemyLevel`)) || 1;
let nextLevelReq;
let nextLevelReqText;
let enemyGoldOnKill = enemyLevel * 1.5;
let randomNumber;
let rollOfPenniesBuff = Number(localStorage.getItem(`rollOfPenniesBuff`)) || 0;
let crowbarBuff = counts[4] * 0.5 + 1;
const randomItemNumber = () => Math.trunc(Math.random() * items.length);
//Get the object from localStorage if exists (|| if it doesn't)
//property:[cost,how many you have, how much this property has made]
const properties = JSON.parse(localStorage.getItem(`properties`)) || {
  survivor: [20, 0, 0.001, 0],
  clickMultiplier: [40, 1, 0],
  chests: [10, 0, 0],
};
let idleGold = Number(localStorage?.getItem(`idleGold`)) || 0;
let damageOnClick = properties.clickMultiplier[1];

//Have only one decimal place
labelgoldNumber.textContent = gold.toFixed(1);
labelEnemyLevel.textContent = enemyLevel;

String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }

  return this.substring(0, index) + replacement + this.substring(index + 1);
};

function enemyLevelUp() {
  if (enemyLevel >= 15) {
    //Requirement za sledeci level je (ako je level >= od 15)
    nextLevelReq = enemyLevel * 3 + 20;
  } else {
    //Requirement za sledeci level je
    nextLevelReq = enemyLevel * 2 + 10;
  }
  if (enemyKillCount === nextLevelReq) {
    enemyLevel++;
    console.log(`Level up! Now enemies are level ${enemyLevel}`);
    labelEnemyLevel.textContent = enemyLevel;
    enemyKillCount = 0;
    // enemyHealth = enemyHealth * (enemyLevel * 1.2);
    enemyGoldOnKill = enemyLevel * 3;
  }
  localStorage.setItem(`enemyLevel`, enemyLevel);
  localStorage.setItem(`enemyKillCount`, enemyKillCount);
  nextLevelReqText = nextLevelReq - enemyKillCount;
  labelToolTip.textContent = `Kills required for next level:${nextLevelReqText}`;
}

function enemyPicker() {
  randomNumber = Math.trunc(Math.random() * enemies.length);
  enemyHealth = (randomNumber + 1) * 2.5 * (enemyLevel * 1.2);
  enemyMaxHealth = enemyHealth;
  const randomEnemy = enemies[randomNumber];
  btngold.value = `${randomEnemy} \n`;
}
function updateHistoryText(string) {
  labelHistoryText.style.opacity = 1;
  labelHistoryText.style.transition = `1s`;
  labelHistoryText.textContent = `Got ${string}!`;
  if (labelHistoryText.style.opacity <= 1) {
    setTimeout(e => {
      labelHistoryText.style.opacity = 0;
      labelHistoryText.style.transition = `1s`;
    }, 500);
  }
}
function updateIdleGold() {
  idleGold = properties.survivor[2] * properties.survivor[1];
  idleGold =
    idleGold + properties.clickMultiplier[2] * properties.clickMultiplier[1];
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
    gold = gold + (randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff);
    updateHistoryText(
      ((randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff)).toFixed(2)
    );
    enemyKillCount++;

    enemyPicker();
    enemyLevelUp();
  } else {
    btngold.value = `${enemies[randomNumber]}\nHealth:${enemyHealth.toFixed(
      1
    )}`;
  }
}
function automatedDamage() {
  enemyHealth = enemyHealth - idleGold;
}

function updateButtonValues() {
  //Update survivor numbers
  btnsurvivor.value = `Buy survivor(${properties.survivor[1].toFixed(
    1
  )}) \n ${properties.survivor[0].toFixed(1)}`;

  //Update gold multiplier numbers
  btnClickMultiplier.value = `Buy click multiplier(${properties.clickMultiplier[1].toFixed(
    1
  )}) \n ${properties.clickMultiplier[0].toFixed(1)}`;

  //Update chest numbers
  btnChests.value = `Buy chest\n ${properties.chests[0].toFixed(1)}`;

  labelItemList.textContent = localStorage.getItem(`inventoryText`);
}
//TODO
// localStorage.clear(`gold`);
// Call them instantly
enemyLevelUp();
enemyPicker();
updateButtonValues();
updateIdleGold();
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

function numberOfItems(item) {
  const whereIsItem = items.findIndex(mov => mov === item);
  counts[whereIsItem]++;
  if (inventory.includes(item)) {
    let whatNumberYouCurrentlyHave = Number(
      labelItemList.textContent[labelItemList.textContent.indexOf(item) - 3]
    );
    let whereThatItemIsLocated = labelItemList.textContent.indexOf(item) - 3;
    if (counts[whereIsItem] >= 10) {
      labelItemList.textContent = labelItemList.textContent
        ?.replaceAt(whereThatItemIsLocated, String(counts[whereIsItem])[1])
        ?.replaceAt(whereThatItemIsLocated - 1, String(counts[whereIsItem])[0]);
    } else if (counts[whereIsItem] < 10 && counts[whereIsItem] > 1) {
      labelItemList.textContent = labelItemList.textContent.replaceAt(
        whereThatItemIsLocated,
        whatNumberYouCurrentlyHave + 1
      );
    }
  } else {
    labelItemList.textContent += `${
      inventory.filter(mov => mov === `${item}`).length + 1
    }x ${item}, `;
  }

  return Number(counts[whereIsItem]);
}
//Clicking the button, adds a gold
btngold.addEventListener(`click`, function () {
  if (inventory.includes(`Crowbar`)) {
    if (enemyHealth >= enemyMaxHealth * 0.9) {
      damageOnClick = damageOnClick * crowbarBuff;
    } else {
      damageOnClick = properties.clickMultiplier[1];
    }
  }
  if (inventory.includes(`Lens Maker`)) {
    const chance = counts[1] * 0.1;
    if (chance >= Math.random()) {
      document.querySelector(`.crit-text`).style.opacity = 1;
      setTimeout(
        e => (document.querySelector(`.crit-text`).style.opacity = 0),
        500
      );
      gold = gold + damageOnClick;
      enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
    }
  }
  gold = gold + damageOnClick;
  enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
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

    //Oh boy
    updateIdleGold();
    updatePrice(`survivor`);
    updateHistoryText(`survivor`);
    btnsurvivor.value = `Buy survivor(${properties.survivor[1].toFixed(
      1
    )})\n ${properties.survivor[0].toFixed(1)}`;
  }
});

btnClickMultiplier.addEventListener(`click`, function () {
  if (gold >= properties.clickMultiplier[0]) {
    gold = gold - properties.clickMultiplier[0];

    properties.clickMultiplier[1] = properties.clickMultiplier[1] + 0.2;
    updateIdleGold();
    updatePrice(`clickMultiplier`);
    btnClickMultiplier.value = `Buy click multiplier (${properties.clickMultiplier[1].toFixed(
      1
    )}) \n ${properties.clickMultiplier[0].toFixed(1)}`;
    updateHistoryText(`Click Multiplier`);
  }
});

//Not really on click, more like on pressing "Enter" key
btnFarmName.addEventListener(`click`, function (e) {
  //So it doesn't automatically reset the page
  e.preventDefault();

  //Put the farm name in localStorage
  localStorage.setItem(`farmName`, inputFarmName.value);

  //Lose focus on input field
  inputFarmName.blur();
});

//Insted of pressing "Enter" key, click anywhere to lose focus, and it will save it
inputFarmName.onblur = e =>
  localStorage.setItem(`farmName`, inputFarmName.value);

btnChests.addEventListener(`click`, function (e) {
  if (gold >= properties.chests[0]) {
    gold = gold - properties.chests[0];
    let randomItem = items[randomItemNumber()];
    updatePrice(`chests`);
    btnChests.value = `Buy chest\n ${properties.chests[0].toFixed(1)}`;
    numberOfItems(randomItem);
    inventory.push(randomItem);

    localStorage.setItem(`inventory`, JSON.stringify(inventory));
    localStorage.setItem(`counts`, JSON.stringify(counts));
    localStorage.setItem(`inventoryText`, labelItemList.textContent);
    updateHistoryText(randomItem);
    itemFunctions(randomItem);
  }
});

//ITEMS
const triTipInterval = setInterval(itemFunctions, 500, `Tri-tip Dagger`);

function itemFunctions(item) {
  switch (item) {
    case `Soldier's Syringe`:
      for (const mov in properties) {
        if (properties[mov][2] > 0) {
          properties[mov][2] =
            properties[mov][2].toFixed(3) * 0.05 + properties[mov][2];
        }
      }
      updateIdleGold();
      break;
    case `Tri-tip Dagger`:
      const chance = counts[2] * 0.05;
      const currentIdleGold = idleGold;
      if (chance >= Math.random()) {
        idleGold = idleGold * 2;
        setTimeout(e => {
          idleGold = currentIdleGold;
          updateIdleGold();
        }, 1000);
      }

      break;
    case `Roll of Pennies`:
      rollOfPenniesBuff = 2.5 * 0.005 + rollOfPenniesBuff;
      rollOfPenniesBuff = Number(rollOfPenniesBuff.toFixed(4));
      localStorage.setItem(`rollOfPenniesBuff`, rollOfPenniesBuff);
      break;
    case `Crowbar`:
      crowbarBuff = counts[4] * 0.5 + 1;
      break;
    default:
      break;
  }
}
