'use strict';

//Labels
const labelCookiesNumber = document.querySelector(`.cookies`);
const labelHistoryText = document.querySelector(`.history-text`);

//Inputs
const inputFarmName = document.getElementById(`farm-name`);

//Buttons
const btnCookie = document.querySelector(`.cookie-button`);
const btnFarmName = document.getElementById(`farm-name-button`);
//Property Buttons
const btnClickMultiplier = document.getElementById(`clickMultiplier`);
const btnFactory = document.getElementById(`factory`);

//Get cash from localStorage if exists (|| if it doesn't)
let cookies = Number(localStorage?.getItem(`cookies`)) || 0;

//How many cookies you get per click
let cookiesPerClick = 1;

//Get the object from localStorage if exists (|| if it doesn't)
//property:[cost,how many you have, how much this property has made]
const properties = JSON.parse(localStorage.getItem(`properties`)) || {
  factory: [20, 0, 0],
  clickMultiplier: [40, 1, 0],
};

//Have only one decimal place
labelCookiesNumber.textContent = cookies.toFixed(1);

labelCookiesNumber.textContent = ``;
// localStorage.clear(`cookies`);

function updateHistoryText(property) {
  labelHistoryText.style.opacity = 1;
  labelHistoryText.style.transition = `1s`;
  labelHistoryText.textContent = `Bought ${property}!`;
  setTimeout(e => {
    labelHistoryText.style.opacity = 0;
    labelHistoryText.style.transition = `1s`;
  }, 1000);
}

function updateCookieCount() {
  //Every 33 milliseconds (around 30 frames per second)
  setInterval(function () {
    //Add the current cookies to localStorage
    localStorage.setItem(`cookies`, cookies);

    //Set the text to be fixed to have 1 decimal place
    labelCookiesNumber.textContent = cookies.toFixed(1);

    //Add the current properties object to localStorage
    localStorage.setItem(`properties`, JSON.stringify(properties));

    //And add cookies for each property per 33 milsec
    cookies = cookies + properties.factory[1] * 0.001;
  }, 33);

  //Get the farm name from localStorage
  inputFarmName.value = localStorage.getItem(`farmName`);
}
function updateButtonValues() {
  //Update factory numbers
  btnFactory.value = `Buy factory(${properties.factory[1]}) \n ${properties.factory[0]}`;

  //Update cookie multiplier numbers
  btnClickMultiplier.value = `Buy click multiplier(${properties.clickMultiplier[1].toFixed(
    1
  )}) \n ${properties.clickMultiplier[0]}`;
}

//Call them instantly

updateButtonValues();
updateCookieCount();
function updatePrice(property) {
  //Locate the current price of property

  const currentPrice = properties[property][0];

  //The new price is the current(previous) price times 0.2
  let price = Number(currentPrice + currentPrice * 0.2);

  //Add it to the object, and set it to 1 decimal place
  properties[property][0] = Number(price.toFixed(1));

  //This is pretty smart im proud of myself
  //Change the text on the buttons, to add how many you have, and the price to buy another one
  document.getElementById(`${property}`).value = `Buy ${property}(${properties[
    property
  ][1].toFixed(1)})\n ${price.toFixed(1)}`;
}

//Clicking the button, adds a cookie
btnCookie.addEventListener(`click`, function () {
  cookies = cookies + properties.clickMultiplier[1];
});

//Buying the factory button
btnFactory.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (cookies >= properties.factory[0]) {
    //"Spend" cash (cash-price)
    cookies = cookies - properties.factory[0];

    //Add the property to the object
    properties.factory[1] = properties.factory.at(1) + 1;

    //Oh boy
    updatePrice(`factory`);
    updateHistoryText(`Factory`);
  }
});

btnClickMultiplier.addEventListener(`click`, function () {
  if (cookies >= properties.clickMultiplier[0]) {
    cookies = cookies - properties.clickMultiplier[0];

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
