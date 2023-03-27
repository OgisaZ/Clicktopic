'use strict';

//----------------------------------------------------------------------------
let displayEnemy;
let hypeBuff = false;
let estaticBuff = false;
let extremeBuff = false;
displayEnemy = enemyPicker();

//FUNCTIONS
function oldSaveUpdate() {
  if (counts.length !== items.length) {
    for (let i = 0; i <= items.length - counts.length; i++) {
      welcomeText.textContent = `UPDATING...`;
      counts.push(0);
      localStorage.setItem(`counts`, JSON.stringify(counts));
      location.reload();
    }
  }
  if (Object.keys(properties).length !== Object.keys(propertyOriginal).length) {
    for (let i = 0; i <= Object.keys(propertyOriginal).length; i++) {
      if (Object.keys(propertyOriginal)[i] === Object.keys(properties)[i]) {
        console.log(`Everything is okay!`);
      } else {
        welcomeText.textContent = `UPDATING...`;
        properties[Object.keys(propertyOriginal)[i]] =
          Object.values(propertyOriginal)[i];
        localStorage.setItem(`properties`, JSON.stringify(properties));
      }
    }
    location.reload();
  }
}

oldSaveUpdate();

function timeAway() {
  if (j === 0) {
    awayTimeSec = Math.trunc((now - localStorage.getItem(`then`)) / 1000);

    //If you were away for 10 secs or less, if you have no dps, or if you didn't have a previous time
    if (
      awayTimeSec <= 10 ||
      idleGold === 0 ||
      localStorage.getItem(`then`) === null
    ) {
      //If you weren't set awayTimeSec to 0 and don't display the modal
      awayTimeSec = 0;
      modal.style.display = `none`;
      //Else
    } else {
      //If you have been on the site before and have dps:(after 3 seconds)
      //Display the modal after 3 seconds
      modal.style.display = `block`;
      //Calculate the minutes that you were away
      let min = String(Math.trunc(awayTimeSec / 60)).padStart(2, 0);
      //This helps with calculations of minutes (if there are hours, minutes bug out a little)
      if (min >= 60) min = min - 60 * Math.trunc(awayTimeSec / 60 / 60);
      //Modal text, include hours:minutes:seconds that you were away (thousand seperator, currency)
      modalText.textContent = `You were away for ${String(
        Math.trunc(awayTimeSec / 60 / 60)
      ).padStart(2, 0)}:${String(min).padStart(2, 0)}:${String(
        Math.trunc(awayTimeSec % 60)
      ).padStart(2, 0)} and your dps was ${dps}.\n ${
        lCoinProperties.afkBoost[1] >= 1
          ? `Thanks to your AFK Boosters, you earned ${addCurrency(
              awayTimeSec * dps * lCoinProperties.afkBoost[2]
            )} `
          : `You earned ${addCurrency((awayTimeSec * dps).toFixed(1))}.`
      }`;
      //Give you the gold that you were away
      gold = (gold + awayTimeSec * dps) * lCoinProperties.afkBoost[2];
      goldCollectCount += awayTimeSec * dps * lCoinProperties.afkBoost[2];
      goldCollectCountCounter +=
        awayTimeSec * dps * lCoinProperties.afkBoost[2];
    }
  }
  //Every 2.2 seconds update the current time as then and put it in local storage
  const then = new Date().getTime();
  localStorage.setItem(`then`, then);
  //Used to check if you've been in this interval before
  j++;
}
//Clicking anywhere except the modal will close it
window.onclick = function (e) {
  if (e.target !== modal) {
    modal.style.display = `none`;
  }
};

function loopCheck() {
  if (enemyLevel >= 18 && goldCollectCount >= 250000000 && timesLooped === 0) {
    btnLoop.style.visibility = `visible`;
    btnLoop.style.opacity = 1;
  }
  if (enemyLevel >= 32 && goldCollectCount >= 500000000 && timesLooped >= 1) {
    btnLoop.style.visibility = `visible`;
    btnLoop.style.opacity = 1;
  }
}
let loopCheckInterval = setInterval(loopCheck, 2000);
function enemyPicker() {
  //Take a random item from 0 to the length of enemies array

  randomNumber = Math.trunc(Math.random() * enemies.length);
  //Calculate enemy health:
  enemyHealth = (randomNumber + 1) * 2.5 * (enemyLevel * 1.2);
  //For crowbar use
  enemyMaxHealth = enemyHealth;
  //Display and choose the enemy name
  const randomEnemy = enemies[randomNumber];
  //Chooses the first enemy on load
  if (displayEnemy === undefined) {
    return enemies[randomNumber];
  }
  if (enemyLevel >= 4) {
    //0.01
    const chance = Number(enemyLevel) * 0.01;
    if (chance >= Math.random()) {
      const enemyBuff =
        enemyBuffs[Math.trunc(Math.random() * enemyBuffs.length)];
      switch (enemyBuff) {
        case `Big`:
          enemyHealth = enemyHealth * 4;
          enemyMaxHealth = enemyHealth;
          displayEnemy = `${enemyBuff} ${randomEnemy}`;
          hypeBuff = false;
          estaticBuff = false;
          extremeBuff = false;
          break;
        case `Hyper`:
          enemyHealth = enemyHealth * 2.5;
          idleGold = idleGold / 2;
          enemyMaxHealth = enemyHealth;
          displayEnemy = `${enemyBuff} ${randomEnemy}`;
          hypeBuff = true;
          estaticBuff = false;
          extremeBuff = false;
          break;
        case `Ecstatic`:
          enemyHealth = enemyHealth * 0.8;
          idleGold = idleGold / 100000;
          enemyMaxHealth = enemyHealth;
          displayEnemy = `${enemyBuff} ${randomEnemy}`;
          hypeBuff = false;
          estaticBuff = true;
          extremeBuff = false;
          break;
        case `Extreme`:
          enemyHealth = enemyHealth * 3;
          enemyMaxHealth = enemyHealth;
          displayEnemy = `${enemyBuff} ${randomEnemy}`;
          hypeBuff = false;
          estaticBuff = false;
          extremeBuff = true;

          break;
        case `The Great`:
          enemyHealth = enemyHealth * 3;
          enemyMaxHealth = enemyHealth;
          displayEnemy = `${enemyBuff} ${randomEnemy}`;
          idleGold = idleGold / 2;
          hypeBuff = true;
          estaticBuff = false;
          extremeBuff = true;
          break;
        default:
          displayEnemy = `${randomEnemy} `;
          btngold.value = `${displayEnemy}\n`;
          hypeBuff = false;
          estaticBuff = false;
          extremeBuff = false;
          break;
      }
    } else {
      displayEnemy = `${randomEnemy} `;
      btngold.value = `${displayEnemy}\n`;
      hypeBuff = false;
      estaticBuff = false;
      extremeBuff = false;
    }
  } else {
    displayEnemy = `${randomEnemy} `;
    btngold.value = `${displayEnemy}\n`;
    hypeBuff = false;
    estaticBuff = false;
    extremeBuff = false;
  }
}
// let displayEnemy = enemyPicker();
//Default bossKilled is false (self-explanitory)
function bossPicker(bossKilled = false) {
  //yaay forof loop
  for (const boss of bosses) {
    //Used for finding next boss and calculating boss health. This finds the boss you haven't defeated yet in the bosses array
    if (bosses[bosses.indexOf(boss)][1] === false) {
      bossesNumero = bosses.indexOf(boss);
    }
    //If you have killed the current boss
    if (bossKilled) {
      //Set the boss as killed (true)
      bosses[bossesNumero][1] = true;
      bossesKilledCount++;
      bossesKillCountCounter++;
      //Set bossKilled to false so that you can enter here again after defeating next boss, and put the new bosses array to localStorage
      bossKilled = false;
      localStorage.setItem(`bossesKilledCount`, bossesKilledCount);
      localStorage.setItem(`bossesKillCountCounter`, bossesKillCountCounter);
      localStorage.setItem(`bosses`, JSON.stringify(bosses));
    }
    //If you have killed the final boss (looping)
    if (bosses[bosses.length - 1][1]) {
      for (const boss of bosses) {
        //Put every boss back to false,as if you haven't defeated them, so they can loop all over again
        boss[1] = false;
      }
      //Prices on everything is significantly lower, put it to localStorage
      priceNerf = 0.05;
      localStorage.setItem(`priceNerf`, priceNerf);
      //Buff the boss health to the normal * bossBuff
      bossBuff = Number(bossBuff) + 9;
      //Get more time after looping and put everything to localStorage
      timeBuff += 5;
      time = 30 + Number(timeBuff);
      localStorage.setItem(`time`, time);
      localStorage.setItem(`timeBuff`, timeBuff);
      localStorage.setItem(`bossBuff`, bossBuff);
      localStorage.setItem(`bosses`, JSON.stringify(bosses));
      //Put the next boss as the first boss
      nextBoss = bosses[0][0];
      bossesNumero = bosses.indexOf(boss);
      //Calculation of boss health and maximum boss health with bossBuff
      bossHealth =
        enemyLevel *
        3 *
        ((bossesNumero + 1) * 100) *
        (bossBuff === 0 ? 1 : bossBuff + 1);
      maxBossHealth = bossHealth;
      //On button mouseover put new health and time to beat
      labelBossToolTip.textContent = `Boss health: ${bossHealth}\r\n Time to beat: ${
        30 + Number(timeBuff)
      }s`;
      //Just in case return the nextBoss
      return nextBoss;
    }
    //After finding the new boss
    if (bosses[bossesNumero][1] === false) {
      //Find the name of the boss
      nextBoss = bosses[bossesNumero][0];
      //Calculate the health and maximum health of the boss
      bossHealth =
        enemyLevel *
        3 *
        ((bossesNumero + 1) * 100) *
        (bossBuff === 0 ? 1 : bossBuff);
      maxBossHealth = bossHealth;
      localStorage.setItem(`bosses`, JSON.stringify(bosses));
      //On button mouseover put new health and time to beat
      labelBossToolTip.textContent = `Boss Health: ${bossHealth}\r\n Time to beat: ${
        30 + Number(timeBuff)
      }s`;
      //Just in case return the nextBoss
      return nextBoss;
    }
  }
}

function enemyLevelUp() {
  //If level is over or equal 15
  if (enemyLevel >= 15) {
    //Requirement for next enemy level is:
    nextLevelReq = enemyLevel * 3 + 20;
    enemyGoldOnKill = enemyLevel * 6.5;
  } else {
    //Requirement for next enemy level is:
    nextLevelReq = enemyLevel * 2 + 10;
    enemyGoldOnKill = enemyLevel * 3;
  }
  //If you kill the current boss
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
//Used for displaying on boss button and tooltip
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

//uuuu boss fiiiiight
function bossFight() {
  //Stop spawning normal enemies
  clearInterval(enemyTesterInterval);
  if (i === 1) {
    hypeBuff = false;
    estaticBuff = false;
    extremeBuff = false;
    updateIdleGold();
  }

  //Set the current killCount to 0 so that you can't cheat by refreshing the page
  enemyKillCount = 0;
  localStorage.setItem(`enemyKillCount`, enemyKillCount);
  //You are currently fighting the boss
  bossFightCurrent = true;
  //This is for the timer, so it doesn't bug out. This is only entered once per fight
  if (i === 1) {
    //Set the current time
    time = 30 + Number(timeBuff);
    //Every second update the timer
    const timer = setInterval(function () {
      //Calculate minutes and seconds, and display them
      let min = String(Math.trunc(time / 60)).padStart(2, 0);
      let sec = String(time % 60).padStart(2, 0);
      labelTimer.textContent = `${min}:${sec}`;
      //Every second take a second off
      time--;
      //If time reaches 0
      if (time <= -1) {
        //Stop executing the timer and boss fight interval. Update everything else and tell the user that they failed
        clearInterval(timer);
        clearInterval(bossFightInterval);

        bossFightCurrent = false;
        enemyTesterInterval = setInterval(enemyTester, 33);
        //You get the nextBoss name here
        bossPicker();
        enemyPicker();
        updateButtonValues();
        labelTimer.textContent = ``;

        i = 1;
        labelHistoryText.style.color = `red`;
        updateHistoryText(
          `Failed to defeat ${nextBoss}. Lost ${counts[8]}x Glass Pane`
        );
        counts[8] = 0;
        localStorage.setItem(`counts`, JSON.stringify(counts));
        for (const mov of inventory) {
          const where = inventory.indexOf(mov);
          mov === `Glass Pane` ? inventory.splice(where, 1) : ``;
        }
        localStorage.setItem(`inventory`, JSON.stringify(inventory));
        numberOfItems();
        progressBar.style.visibility = `hidden`;
        setTimeout(() => (labelHistoryText.style.color = `black`), 1500);
        btnBoss.disabled = false;
      }
      //If you are not currently fighting the boss stop the timer and hide progress bar(used to stop timer)
      if (!bossFightCurrent) {
        clearInterval(timer);
        labelTimer.textContent = ``;
        progressBar.style.visibility = `hidden`;
        i = 1;
        btnBoss.disabled = false;
      }
    }, 1000);
  }
  //If you beat the boss
  if (bossHealth <= 0) {
    //Put it so you aren't fighting the boss
    bossFightCurrent = false;
    //The gold you get on kill is calculated:
    gold = gold + (maxBossHealth / 2) * (enemyGoldOnKill + rollOfPenniesBuff);
    goldCollectCount +=
      (maxBossHealth / 2) * (enemyGoldOnKill + rollOfPenniesBuff);
    goldCollectCountCounter +=
      (maxBossHealth / 2) * (enemyGoldOnKill + rollOfPenniesBuff);
    updateHistoryText(
      `Got` +
        addCurrency(
          ((maxBossHealth / 2) * (enemyGoldOnKill + rollOfPenniesBuff)).toFixed(
            2
          )
        )
    );

    time = 30 + Number(timeBuff);
    labelTimer.textContent = ``;
    //Stop boss fight interval and update everything
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
    //Get 2 random items
    //This should be in a for loop. I'm not sure how to display both items that you get in one string with a for loop so i did it like this
    let randomItem = items[randomItemNumber()];
    let randomItem2 = items[randomItemNumber()];
    numberOfItems(randomItem);
    numberOfItems(randomItem2);
    //Put the item in your inventory
    inventory.push(randomItem);
    inventory.push(randomItem2);
    //Local storage scary
    localStorage.setItem(`inventory`, JSON.stringify(inventory));
    localStorage.setItem(`counts`, JSON.stringify(counts));
    updateItemHistoryText(`Got ${randomItem} and ${randomItem2}`);
    updateButtonValues();
    itemFunctions(randomItem);
    itemFunctions(randomItem2);
    if (!bossFightCurrent || !enemyKillCount <= 0) {
      enemyTesterInterval = setInterval(enemyTester, 33);
      enemyPicker();
      clearInterval(bossFightInterval);
    }
    i = 1;
    btnBoss.disabled = false;
  } else {
    clearInterval(enemyTesterInterval);
    //During the boss fight, every 33 milisec

    btngold.value = `${nextBoss}\nHealth:${bossHealth.toFixed(1)}`;
    progressBar.max = maxBossHealth;
    progressBar.value = bossHealth;
    i++;
  }
}

function updateHistoryText(string) {
  //Stop the clearing of history text if it's on screen, and something else happens
  clearTimeout(changeBackHistory);
  //Change the opacity from 0 to 1 with a transition effect...
  labelHistoryText.style.opacity = 1;
  labelHistoryText.style.transition = `1s`;
  labelHistoryText.textContent = `${string}!`;
  //...then back to 0
  changeBackHistory = setTimeout(e => {
    labelHistoryText.style.opacity = 0;
    labelHistoryText.style.transition = `1s`;
  }, 1500);
}
function updateItemHistoryText(string) {
  //Stop the clearing of history text if it's on screen, and something else happens
  clearTimeout(chnageBackItemHistory);
  //Change the opacity from 0 to 1 with a transition effect...
  labelItemHistoryText.style.opacity = 1;
  labelItemHistoryText.style.transition = `1s`;
  labelItemHistoryText.textContent = `${string}!`;
  //...then back to 0
  chnageBackItemHistory = setTimeout(e => {
    labelItemHistoryText.style.opacity = 0;
    labelItemHistoryText.style.transition = `1s`;
  }, 1500);
}
function updateIdleGold() {
  //Idle gold is summing up what every property makes every 33 millisecs
  //Horrible

  idleGold = properties.survivor[2] * properties.survivor[1];
  idleGold = idleGold + properties.drone[2] * properties.drone[1];
  idleGold = idleGold + properties.turret[2] * properties.turret[1];
  idleGold = idleGold + properties.minions[2] * properties.minions[1];
  if (triTipBuff) {
    idleGold = idleGold * 2;
  }
  if (hypeBuff) {
    idleGold = idleGold / 2;
    return `Hyper`;
  }
  if (estaticBuff) {
    idleGold = idleGold / 100000;
    return `Estatic`;
  }
  localStorage.setItem(`idleGold`, idleGold);
}

function enemyTester() {
  if (enemyHealth <= 0) {
    //The gold you get on kill is calculated:
    hypeBuff = false;
    estaticBuff = false;
    extremeBuff = false;
    updateIdleGold();
    gold = gold + (randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff);
    goldCollectCount +=
      (randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff);
    goldCollectCountCounter +=
      (randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff);
    updateHistoryText(
      `Got ` +
        addCurrency(
          ((randomNumber + 1) * (enemyGoldOnKill + rollOfPenniesBuff)).toFixed(
            2
          )
        )
    );
    enemyKillCount++;
    globalEnemyKillCount++;
    globalEnemyKillCountCounter++;
    localStorage.setItem(`globalEnemyKillCount`, globalEnemyKillCount);

    enemyPicker();
    enemyLevelUp();
    if (inventory.includes(`Gold Tooth`)) {
      btnMonsterTooth.style.visibility = `visible`;
    } else {
      btnMonsterTooth.style.visibility = `hidden`;
    }
  } else if (!bossFightCurrent && enemyHealth > 0) {
    //Display the current enemy and their health
    btngold.value = `${displayEnemy}\nHealth:${enemyHealth.toFixed(1)}`;
    // btngold.value = `Clicktopic \nOgisaZ`;
  }
}

function updategoldCount() {
  //Every 33 milliseconds (around 30 frames per second)
  //Add the current gold to localStorage
  localStorage.setItem(`gold`, gold);
  localStorage.setItem(`lCoins`, lCoins);
  //Set the text to be fixed to have 1 decimal place
  labelgoldNumber.textContent = addCurrency(gold.toFixed(2));
  //Add the current properties object to localStorage
  localStorage.setItem(`properties`, JSON.stringify(properties));
  localStorage.setItem(`lCoinProperties`, JSON.stringify(lCoinProperties));
  //And add gold for each property per 33 milsec
  gold = gold + idleGold;
  goldCollectCount += idleGold;
  goldCollectCountCounter += idleGold;
  localStorage.setItem(`goldCollectCount`, goldCollectCount);
  localStorage.setItem(`goldCollectCountCounter`, goldCollectCountCounter);
  localStorage.setItem(`goldSpendCount`, goldSpendCount);
  localStorage.setItem(`goldSpendCountCounter`, goldSpendCountCounter);
  localStorage.setItem(
    `globalEnemyKillCountCounter`,
    globalEnemyKillCountCounter
  );
  if (timesLooped >= 1) {
    lCoinsStyling.style.display = `block`;
    // lCoins.style.display = `inline`;
    btngold.style.marginTop = `7%`;
    lCoinsStyling.innerHTML = `<img src="LCoins.png">${lCoins.toLocaleString(
      `en-US`
    )}`;
  }
  //Hide properties for the first time if you don't have enough gold
  if (goldCollectCount >= 200) {
    labelDrone.style.opacity = 1;
    btnDrone.style.opacity = 1;
    labelTurret.style.opacity = 1;
    btnTurret.style.opacity = 1;
  }
  if (goldCollectCount >= 500) {
    labelClickMachine.style.opacity = 1;
    btnClickMachine.style.opacity = 1;
  }
  //Same for minions
  if (goldCollectCount >= 600) {
    labelMinions.style.opacity = 1;
    btnMinions.style.opacity = 1;
  }
  if (timesLooped >= 1) {
    labelLCoinShop.style.opacity = 1;
    labelIdleBoost.style.opacity = 1;
    btnIdleBoost.style.opacity = 1;
    labelClickBoost.style.opacity = 1;
    btnClickBoost.style.opacity = 1;
    labelAFKBoost.style.opacity = 1;
    btnAFKBoost.style.opacity = 1;
    labelChestBoost.style.opacity = 1;
    btnChestBoost.style.opacity = 1;
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
  labelClickMultiplier.textContent = `Click Multiplier (${Number(
    properties.clickMultiplier[1]
  ).toFixed(1)})`;

  //Update drone numbers
  btnDrone.value = `Buy ${addCurrency(properties.drone[0])}`;
  labelDrone.textContent = `Drone (${properties.drone[1]})`;
  //Update turret numbers
  btnTurret.value = `Buy ${addCurrency(properties.turret[0])}`;
  labelTurret.textContent = `Turret (${properties.turret[1]})`;
  //Update minions numbers
  btnMinions.value = `Buy ${addCurrency(properties.minions[0])}`;
  btnClickMachine.value = `Buy ${addCurrency(properties.clickMachine[0])}`;
  labelClickMachine.textContent = `Click Machine (${properties.clickMachine[1]})`;
  labelMinions.textContent = `Minions (${properties.minions[1]})`;
  //Update chest numbers
  btnChests.value = `Buy chest\n ${addCurrency(properties.chests[0])}`;

  btnIdleBoost.value = `Buy L ${lCoinProperties.idleBoost[0].toLocaleString(
    `en-US`
  )}`;
  labelIdleBoost.textContent = `Idle Booster (${lCoinProperties.idleBoost[1]})`;
  btnClickBoost.value = `Buy L ${lCoinProperties.clickBoost[0].toLocaleString(
    `en-US`
  )}`;
  labelClickBoost.textContent = `Click Booster (${lCoinProperties.clickBoost[1]})`;
  btnAFKBoost.value = `Buy L ${lCoinProperties.afkBoost[0].toLocaleString(
    `en-US`
  )}`;
  labelAFKBoost.textContent = `AFK Booster (${lCoinProperties.afkBoost[1]})`;
  btnChestBoost.value = `Buy L ${lCoinProperties.chestBoost[0].toLocaleString(
    `en-US`
  )}`;
  labelChestBoost.textContent = `Chest Booster (${lCoinProperties.chestBoost[1]})`;

  //Update boss button so it has the next boss name on it
  btnBoss.value = `Fight ${nextBoss}`;

  //Turn buttons you can't afford to red
  //Vomiting currently. Super horrible.
  setInterval(e => {
    if (gold < properties.survivor[0])
      btnsurvivor.style.backgroundColor = `crimson`;
    else btnsurvivor.style.backgroundColor = `gainsboro`;

    if (gold < properties.clickMultiplier[0])
      btnClickMultiplier.style.backgroundColor = `crimson`;
    else btnClickMultiplier.style.backgroundColor = `gainsboro`;

    if (gold < properties.drone[0]) btnDrone.style.backgroundColor = `crimson`;
    else btnDrone.style.backgroundColor = `gainsboro`;

    if (gold < properties.turret[0])
      btnTurret.style.backgroundColor = `crimson`;
    else btnTurret.style.backgroundColor = `gainsboro`;

    if (gold < properties.clickMachine[0])
      btnClickMachine.style.backgroundColor = `crimson`;
    else btnClickMachine.style.backgroundColor = `gainsboro`;

    if (gold < properties.minions[0])
      btnMinions.style.backgroundColor = `crimson`;
    else btnMinions.style.backgroundColor = `gainsboro`;

    if (gold < properties.chests[0])
      btnChests.style.backgroundColor = `crimson`;
    else btnChests.style.backgroundColor = `gainsboro`;

    if (lCoins < lCoinProperties.idleBoost[0])
      btnIdleBoost.style.backgroundColor = `crimson`;
    else btnIdleBoost.style.backgroundColor = `gainsboro`;
    if (lCoins < lCoinProperties.clickBoost[0])
      btnClickBoost.style.backgroundColor = `crimson`;
    else btnClickBoost.style.backgroundColor = `gainsboro`;
    if (lCoins < lCoinProperties.afkBoost[0])
      btnAFKBoost.style.backgroundColor = `crimson`;
    else btnAFKBoost.style.backgroundColor = `gainsboro`;
    if (lCoins < lCoinProperties.chestBoost[0])
      btnChestBoost.style.backgroundColor = `crimson`;
    else btnChestBoost.style.backgroundColor = `gainsboro`;
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
setTimeout(() => {
  const gameTextChangerInterval = setInterval(gameTextChanger, 1000);
}, 5000);
let cps;
const cpsInterval = setInterval(() => (cps = 0), 1000);
//-----------------------------------------------------------------------------------------------
//BUTTONS AND EVENT LISTENERS
//Clicking the button, adds gold
btngold.addEventListener(`click`, function () {
  //If you have a crowbar
  buttonClicks++;
  localStorage.setItem(`buttonClicks`, buttonClicks);
  if (extremeBuff && l === 0) {
    l++;
    return `Nothing ¯\_(ツ)_/¯"`;
  }
  l = 0;
  cps++;
  setInterval(() => (labelCPS.textContent = cps), 33);
  if (inventory.includes(`Crowbar`)) {
    //If enemy health is above 90% of their max health
    if (
      bossFightCurrent
        ? bossHealth >= maxBossHealth * 0.9
        : enemyHealth >= enemyMaxHealth * 0.9
    ) {
      //Then do the crowbar buff
      damageOnClick = damageOnClick * crowbarBuff;
    } else {
      //If not, then do normal damage
      damageOnClick =
        properties.clickMultiplier[1] +
        (enemyLevel - 1) * (glassPaneBuff + 1) +
        lensMakerBuff;
    }
  }
  if (bossFightCurrent && inventory.includes(`Hollow-Point Rounds`)) {
    damageOnClick = damageOnClick + damageOnClick * (counts[7] * 0.2);
  }
  //If you have Crit glasses
  if (
    inventory.includes(`Brass Knuckles`) ||
    inventory.includes(`Lens Maker`)
  ) {
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
      goldCollectCount += damageOnClick;
      goldCollectCountCounter += damageOnClick;
      if (bossFightCurrent) {
        bossHealth = bossHealth.toFixed(1) - damageOnClick.toFixed(1);
      } else {
        enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
      }
    }
  }
  //Deal normal damage
  gold = gold + damageOnClick;
  goldCollectCount += damageOnClick;
  goldCollectCountCounter += damageOnClick;
  if (bossFightCurrent) {
    bossHealth = bossHealth.toFixed(1) - damageOnClick.toFixed(1);
  } else {
    enemyHealth = enemyHealth.toFixed(1) - damageOnClick.toFixed(1);
  }

  //Prevents crowbar from bugging out if you constantly hit them for double damage(if they die before they can reach below 90% hp)
  damageOnClick =
    properties.clickMultiplier[1] +
    (enemyLevel - 1) * (glassPaneBuff + 1) +
    lensMakerBuff;
});

//Buying the survivor button
btnsurvivor.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.survivor[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.survivor[0];
    goldSpendCount += properties.survivor[0];
    goldSpendCountCounter += properties.survivor[0];
    //Add the property to the object
    properties.survivor[1] = properties.survivor[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`survivor`);
    updateHistoryText(`Got Survivor`);
    updateButtonValues();
  }
});
//Click multiplier is also used to calculate how much damage you deal on click, even if you don't have any
btnClickMultiplier.addEventListener(`click`, function () {
  //If you have enough gold
  if (gold >= properties.clickMultiplier[0]) {
    //Cost
    gold = gold - properties.clickMultiplier[0];
    goldSpendCount += properties.clickMultiplier[0];
    goldSpendCountCounter += properties.clickMultiplier[0];
    damageOnClick =
      properties.clickMultiplier[1] +
      (enemyLevel - 1) * (glassPaneBuff + 1) +
      lensMakerBuff;
    //Deal more damage every click, update idle gold (may change stuff),the price, and text
    properties.clickMultiplier[1] =
      Number(properties.clickMultiplier[1]) + Number(clickBoostBuff);
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
    goldSpendCount += properties.drone[0];
    goldSpendCountCounter += properties.drone[0];
    //Add the property to the object
    properties.drone[1] = properties.drone[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`drone`);
    updateHistoryText(`Got Drone`);
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
  if (inputFarmName.value === `resetLS`)
    document.querySelector(`.reset`).style.visibility = `visible`;
  if (inputFarmName.value.toLowerCase() === `slab u vic`) {
    labelWelcome.textContent = `biljan petrol`;
    localStorage.setItem(`farmName`, `Biljana`);
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

if (properties.clickMachine[1] >= 1) {
  clickMachineInterval = setInterval(() => {
    btngold.dispatchEvent(clickEvent);
    buttonClicks--;
  }, Number(properties.clickMachine[2]));
} else clickMachineInterval = undefined;
btnClickMachine.addEventListener(`click`, function (e) {
  if (gold >= properties.clickMachine[0]) {
    gold = gold - properties.clickMachine[0];
    goldSpendCount += properties.clickMachine[0];
    goldSpendCountCounter += properties.clickMachine[0];
    properties.clickMachine[1] += 1;
    properties.clickMachine[2] =
      properties.clickMachine[2] - properties.clickMachine[2] * 0.03;
    clickMachineInterval === undefined
      ? ``
      : clearInterval(clickMachineInterval);
    clickMachineInterval = setInterval(() => {
      btngold.dispatchEvent(clickEvent);
      buttonClicks--;
    }, Number(properties.clickMachine[2]));
    updatePrice(`clickMachine`);
    updateHistoryText(`Got Click Machine`);
    updateButtonValues();
  }
});
btnTurret.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.turret[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.turret[0];
    goldSpendCount += properties.turret[0];
    goldSpendCountCounter += properties.turret[0];
    //Add the property to the object
    properties.turret[1] = properties.turret[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`turret`);
    updateHistoryText(`Got Turret`);
    updateButtonValues();
  }
});

btnMinions.addEventListener(`click`, function (e) {
  //Do you have enough cash?
  if (gold >= properties.minions[0]) {
    //"Spend" cash (cash-price)
    gold = gold - properties.minions[0];
    goldSpendCount += properties.minions[0];
    goldSpendCountCounter += properties.minions[0];
    //Add the property to the object
    properties.minions[1] = properties.minions[1] + 1;

    //Update the idle gold production,the price of the property, and text
    updateIdleGold();
    updatePrice(`minions`);
    updateHistoryText(`Got Minions`);
    updateButtonValues();
  }
});

//The fun part!
btnChests.addEventListener(`click`, function (e) {
  //If you can buy it
  if (gold >= properties.chests[0]) {
    gold = gold - properties.chests[0];
    for (let i = 0; i <= lCoinProperties.chestBoost[2]; i++) {
      goldSpendCount += properties.chests[0];
      goldSpendCountCounter += properties.chests[0];
      chestOpened++;
      localStorage.setItem(`chestOpened`, chestOpened);
      //Pick random item from items array, update the price,and text
      let randomItem = items[randomItemNumber()];

      numberOfItems(randomItem);
      updateItemHistoryText(`Got ${randomItem}`);
      btnChests.value = `Buy chest\n ${properties.chests[0].toFixed(1)}`;
      //Put the item in your inventory
      inventory.push(randomItem);

      //Local storage scary
      localStorage.setItem(`inventory`, JSON.stringify(inventory));
      localStorage.setItem(`counts`, JSON.stringify(counts));
      updateButtonValues();
      //ITEM FUNCTIONS!!!(below)
      itemFunctions(randomItem);
      if (i === 0) {
        updatePrice(`chests`);
      }
    }
  }
});
//Boss fight button
btnBoss.addEventListener(`click`, function (e) {
  //Make it visible
  btnBoss.disabled = true;
  btnBoss.style.visibility = `hidden`;
  //Put the right boss name on it
  updateButtonValues();
  //Call bossFight interval every 33 milisec
  bossFightInterval = setInterval(bossFight, 33);
  labelBossToolTip.style.opacity = 0;
  progressBar.style.visibility = `visible`;
});
btnMonsterTooth.addEventListener(`click`, function () {
  btnMonsterTooth.style.visibility = `hidden`;
  let x = Math.floor(Math.random() * 10) + 45;
  let y = Math.floor(Math.random() * 10) + 47;
  btnMonsterTooth.style.left = `${x}vw`;
  btnMonsterTooth.style.top = `${y}vh`;
  gold = gold + monsterToothBuff;
  goldCollectCount += monsterToothBuff;
  goldCollectCountCounter += monsterToothBuff;
});
function clearStatsModal() {
  clearInterval(statsInterval);
  modalProperties.style.backgroundColor = `#3f7d9e`;
  modalStats.style.backgroundColor = `#3f7d9e`;
  modalItem.style.backgroundColor = `#3f7d9e`;
  // modalAchievements.style.backgroundColor = `gray`;
  modalInfo.style.display = `none`;
  modal.style.display = `none`;
  btnLoopYes.style.visibility = `hidden`;
  btnLoopNo.style.visibility = `hidden`;
}
window.onclick = function (e) {
  if (
    e.target !== modalProperties &&
    e.target !== modalItem &&
    e.target !== modalStats &&
    e.target !== modalInfo &&
    e.target !== modalInfoText &&
    e.target !== modal &&
    e.target !== modalText &&
    e.target !== btnLoop &&
    e.target !== btnLoopYes &&
    e.target !== btnLoopNo
    // && e.target !== modalAchievements
  ) {
    clearStatsModal();
  }
};

//LOOPING
btnLoop.addEventListener(`click`, () => infoModals(`Loop`));
btnLoopNo.addEventListener(`click`, clearStatsModal);

btnLoopYes.addEventListener(`click`, function () {
  lCoinsStyling.style.display = `block`;

  // lCoins.style.display = `inline`;
  btngold.style.marginTop = `7%`;
  btnLoop.style.visibility = `hidden`;
  clearStatsModal();
  properties = {
    survivor: [20, 0, 0.003, 0],
    clickMultiplier: [40, 1, 0, 0],
    chests: [100, 0, 0, 0],
    drone: [250, 0, 0.02, 0],
    turret: [400, 0, 0.05, 0],
    clickMachine: [500, 0, 4000, 0],
    minions: [600, 0, 0.1, 0],
  };
  changeBackClickMachine = properties.clickMachine[2];
  for (const mov in properties) {
    if (properties[mov][2] > 0) {
      properties[mov][2] =
        properties[mov][2].toFixed(3) * (counts[0] * 0.2) + properties[mov][2];
    }
    properties[mov][2] =
      properties[mov][2].toFixed(3) * lCoinProperties.idleBoost[2] +
      properties[mov][2];
  }
  properties.clickMachine[2] = changeBackClickMachine;
  updateButtonValues();
  updateIdleGold();
  priceNerf = 0.2;
  localStorage.setItem(`priceNerf`, priceNerf);
  for (const boss of bosses) {
    //Put every boss back to false,as if you haven't defeated them, so they can loop all over again
    boss[1] = false;
  }
  bossBuff = 0;
  localStorage.setItem(`bossBuff`, bossBuff);
  bossPicker();
  lCoins = Math.ceil(enemyLevel / 100) + lCoins;
  lCoinsStyling.innerHTML = `<img src="LCoins.png">${lCoins.toLocaleString(
    `en-US`
  )}`;
  enemyLevel = 1;
  enemyKillCount = 0;
  enemyLevelUp();
  enemyHealth = 0;
  counts = counts.map((mov, index, arr) => {
    return Math.trunc(mov / 5);
  });
  localStorage.setItem(`counts`, JSON.stringify(counts));
  numberOfItems();
  timeBuff = counts[5];
  time = 30 + Number(timeBuff);
  localStorage.setItem(`time`, time);
  localStorage.setItem(`timeBuff`, timeBuff);
  labelEnemyLevel.textContent = enemyLevel;
  rollOfPenniesBuff = enemyGoldOnKill * 0.1;
  localStorage.setItem(`rollOfPenniesBuff`, rollOfPenniesBuff);
  globalEnemyKillCount = 0;
  goldCollectCount = 0;
  goldSpendCount = 0;
  localStorage.setItem(`gold`, gold);
  timesLooped++;
  localStorage.setItem(`timesLooped`, timesLooped);

  const siphonGold = setInterval(() => {
    gold = 0;
    idleGold = 0;
  }, 33);
  setTimeout(() => clearInterval(siphonGold), 5000);
  updateIdleGold();
  clearInterval(clickMachineInterval);
  crowbarBuff = counts[4] * 0.5 + 1;
  lensMakerBuff = counts[1] >= 11 ? counts[1] - 10 : 0;
  glassPaneBuff = counts[8] * 0.2;
  damageOnClick =
    properties.clickMultiplier[1] +
    (enemyLevel - 1) * (glassPaneBuff + 1) +
    lensMakerBuff;
  bossesKilledCount = 0;
  localStorage.setItem(`bossesKilledCount`, bossesKilledCount);
  monsterToothBuff = counts[6] * (enemyLevel + 7) * (rollOfPenniesBuff + 1);
});

//LCOIN PROPERTIES
btnIdleBoost.addEventListener(`click`, function (e) {
  if (lCoins >= lCoinProperties.idleBoost[0]) {
    lCoins = lCoins - lCoinProperties.idleBoost[0];
    lCoinProperties.idleBoost[0]++;
    lCoinProperties.idleBoost[1]++;
    lCoinProperties.idleBoost[2]++;
    changeBackClickMachine = properties.clickMachine[2];
    for (const mov in properties) {
      if (properties[mov][2] > 0) {
        properties[mov][2] =
          properties[mov][2].toFixed(3) * lCoinProperties.idleBoost[2] +
          properties[mov][2];
      }
    }
    updateIdleGold();
    updateHistoryText(`Got Idle Booster`);
    updateButtonValues();
    properties.clickMachine[2] = changeBackClickMachine;
    btnIdleBoost.value = `Buy L ${lCoinProperties.idleBoost[0].toLocaleString(
      `en-US`
    )}`;
  }
});
btnClickBoost.addEventListener(`click`, function (e) {
  if (lCoins >= lCoinProperties.clickBoost[0]) {
    lCoins = lCoins - lCoinProperties.clickBoost[0];
    lCoinProperties.clickBoost[0]++;
    lCoinProperties.clickBoost[1]++;
    lCoinProperties.clickBoost[2]++;
    clickBoostBuff = clickBoostBuff * lCoinProperties.clickBoost[2];
    localStorage.setItem(`clickBoostBuff`, clickBoostBuff);
    updateIdleGold();
    updateHistoryText(`Got Click Booster`);
    updateButtonValues();
  }
});
btnAFKBoost.addEventListener(`click`, function (e) {
  if (lCoins >= lCoinProperties.afkBoost[0]) {
    lCoins = lCoins - lCoinProperties.afkBoost[0];
    lCoinProperties.afkBoost[0]++;
    lCoinProperties.afkBoost[1]++;
    lCoinProperties.afkBoost[2]++;
    updateIdleGold();
    updateHistoryText(`Got AFK Booster`);
    updateButtonValues();
  }
});
btnChestBoost.addEventListener(`click`, function (e) {
  if (lCoins >= lCoinProperties.chestBoost[0]) {
    lCoins = lCoins - lCoinProperties.chestBoost[0];
    lCoinProperties.chestBoost[0]++;
    lCoinProperties.chestBoost[1]++;
    lCoinProperties.chestBoost[2]++;
    updateIdleGold();
    updateHistoryText(`Got Chest Booster`);
    updateButtonValues();
  }
});
//----------------------------------------------------------------------------------
//ITEMS
//I made it a variable so i can cancel it (maybe a debuff??)

let triTipInterval;
let feralClawInterval;
let feralClawTimeout = undefined;
setTimeout(() => {
  triTipInterval = setInterval(itemFunctions, 500, `Poison Dagger`);
}, 3000);
feralClawInterval = setInterval(itemFunctions, 999, `Feral Claw`);

function itemFunctions(item) {
  //If you got...
  switch (item) {
    //... a syringe:
    case `Iron Fist` || `Soldier's Syringe`:
      //For every property boost its damage by 5%
      changeBackClickMachine = properties.clickMachine[2];
      for (const mov in properties) {
        if (properties[mov][2] > 0) {
          properties[mov][2] =
            properties[mov][2].toFixed(3) * 0.2 + properties[mov][2];
        }
      }
      properties.clickMachine[2] = changeBackClickMachine;
      updateIdleGold();
      break;
    //... a tri tip
    case `Poison Dagger` || `Tri-tip Dagger`:
      //See the chances of getting a tri tip effect
      const chance = counts[2] * 0.05;
      //So you can turn it back later
      const currentIdleGold = idleGold;
      //If you do get a tri tip effect to trigger it will:
      if (chance >= Math.random()) {
        //Double you idle gold production (remember the setInterval of 500 milliseconds)
        triTipBuff = true;
        updateIdleGold();
        //Then after a second, turn idle gold back
        setTimeout(e => {
          triTipBuff = false;
          updateIdleGold();
        }, 1000);
      }

      break;
    //... Gold Pouch
    case `Gold Pouch` || `Roll of Pennies`:
      //Increase how much gold you get on kill
      rollOfPenniesBuff = enemyGoldOnKill * 0.1 + rollOfPenniesBuff;
      //This made some problems so i put it as a number before giving it 4 decimal places
      rollOfPenniesBuff = Number(rollOfPenniesBuff.toFixed(4));
      localStorage.setItem(`rollOfPenniesBuff`, rollOfPenniesBuff);
      break;
    //... a crowbar
    case `Crowbar`:
      //Just update the crowbar buff by 50%, what it actually does you can see on button click, along with Brass Knuckles which isn't here in item functions
      crowbarBuff = counts[4] * 0.5 + 1;
      break;
    case `Old Man's Watch` || `Delicate Watch`:
      timeBuff = Number(timeBuff) + 1;
      labelBossToolTip.textContent = `Boss health: ${bossHealth}\r\n Time to beat: ${
        30 + Number(timeBuff)
      }s`;
      localStorage.setItem(`timeBuff`, timeBuff);
      break;
    case `Gold Tooth` || `Monster Tooth`:
      monsterToothBuff = counts[6] * (enemyLevel + 7) * (rollOfPenniesBuff + 1);
      break;
    case `Feral Claw`:
      if (cps >= 6) {
        updateIdleGold();
        idleGold = idleGold * (counts[9] * 0.1 + 1);
      } else {
        updateIdleGold();
      }

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
