'use strict';

//Labels
const labelgoldNumber = document.querySelector(`.gold`);
const labelHistoryText = document.querySelector(`.history-text`);
const labelItemList = document.getElementById(`items-list`);
//Inputs
const inputFarmName = document.getElementById(`farm-name`);

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
const inventoryUnique = new Set(inventory);

const items = [
  `Soldier's Syringe`,
  `Lens Maker`,
  `Tri-tip Dagger`,
  `Roll of Pennies`,
  `Crowbar`,
];
const counts =
  JSON.parse(localStorage.getItem(`counts`)) || new Array(items.length).fill(0);
const enemies = [`Lesser Wisp`, `Beetle`, `Lemurian`, `Stone Golem`];
let enemyHealth;
let randomNumber;
const randomItemNumber = () => Math.trunc(Math.random() * items.length);
//Get the object from localStorage if exists (|| if it doesn't)
//property:[cost,how many you have, how much this property has made]
const properties = JSON.parse(localStorage.getItem(`properties`)) || {
  survivor: [20, 0, 0],
  clickMultiplier: [40, 1, 0],
  chests: [10, 0, 0],
};

//Have only one decimal place
labelgoldNumber.textContent = gold.toFixed(1);

String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }

  return this.substring(0, index) + replacement + this.substring(index + 1);
};

function enemyPicker() {
  randomNumber = Math.trunc(Math.random() * enemies.length);
  enemyHealth = (randomNumber + 1) * 5;
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

function updategoldCount() {
  //Every 33 milliseconds (around 30 frames per second)
  setInterval(function () {
    //Add the current gold to localStorage
    localStorage.setItem(`gold`, gold);

    //Set the text to be fixed to have 1 decimal place
    labelgoldNumber.textContent = gold.toFixed(1);

    //Add the current properties object to localStorage
    localStorage.setItem(`properties`, JSON.stringify(properties));

    //And add gold for each property per 33 milsec
    gold = gold + properties.survivor[1] * 0.001;
    enemyHealth = enemyHealth - properties.survivor[1] * 0.001;
    if (enemyHealth <= 0) {
      gold = gold + (randomNumber + 1) * 2.5;
      updateHistoryText((randomNumber + 1) * 2.5);
      enemyPicker();
    } else {
      btngold.value = `${enemies[randomNumber]}\nHealth:${enemyHealth.toFixed(
        1
      )}`;
    }
  }, 33);

  //Get the farm name from localStorage
  inputFarmName.value = localStorage.getItem(`farmName`);
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

// localStorage.clear(`gold`);
// Call them instantly
enemyPicker();
updateButtonValues();
updategoldCount();

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
    labelItemList.textContent = labelItemList.textContent.replaceAt(
      whereThatItemIsLocated,
      whatNumberYouCurrentlyHave + 1
    );
  } else {
    labelItemList.textContent += `${
      inventory.filter(mov => mov === `${item}`).length + 1
    }x ${item},`;
  }

  return Number(counts[whereIsItem]);
}

//Clicking the button, adds a gold
btngold.addEventListener(`click`, function () {
  gold = gold + properties.clickMultiplier[1];
  enemyHealth =
    enemyHealth.toFixed(1) - properties.clickMultiplier[1].toFixed(1);
});

//Buying the survivor button
btnsurvivor.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.survivor[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.survivor[0];

    //Add the property to the object
    properties.survivor[1] = properties.survivor.at(1) + 1;

    //Oh boy
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
    inventoryUnique.add(randomItem);

    localStorage.setItem(`inventory`, JSON.stringify(inventory));
    localStorage.setItem(`counts`, JSON.stringify(counts));
    localStorage.setItem(`inventoryText`, labelItemList.textContent);
    updateHistoryText(randomItem);
  }
});
