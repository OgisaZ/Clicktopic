'use strict';

const saveCode = document.querySelector(`.save`);
const loadCode = document.querySelector(`.load`);
const saveFile = document.querySelector(`.save-file`);
const loadFile = document.querySelector(`.load-file`);

const key = 'Random Encryption Key ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const iv = 'Random IV ZYXWVUTSRQPONMLKJIHGFEDCBA';

saveCode.addEventListener(`click`, function () {
  const saveStuff = [
    bossesKillCountCounter,
    timesLooped,
    time,
    globalEnemyKillCount,
    goldSpendCount,
    goldCollectCountCounter,
    Number(localStorage.getItem(`then`)),
    timeBuff,
    enemyLevel,
    goldSpendCountCounter,
    rollOfPenniesBuff,
    enemyKillCount,
    priceNerf,
    firstLoginDate,
    idleGold,
    clickBoostBuff,
    bossBuff,
    `"${localStorage.getItem(`farmName`)}"` || `"aa"`,
    gold,
    bossesKilledCount,
    globalEnemyKillCountCounter,
    lCoins,
    goldCollectCount,
    buttonClicks,
    chestOpened,
  ];
  const saveStuffObjects = [
    JSON.stringify(properties),
    JSON.stringify(lCoinProperties),
  ];

  const saveStuffArrays = [
    JSON.stringify(inventory),
    JSON.stringify(bosses),
    JSON.stringify(counts),
  ];
  const saveStuffString = saveStuff.join();
  const saveStuffObjectsString = saveStuffObjects.join();
  const saveStuffArraysString = saveStuffArrays.join();
  const saveInfo = `${saveStuffString}${saveStuffObjectsString}${saveStuffArraysString}`;

  const stringify = JSON.stringify(
    `[` + saveInfo.slice(0, saveInfo.indexOf(`{`)) + `]`
  );
  const beforeSave = JSON.parse(JSON.parse(stringify));

  //Properties
  const propertiesSave = JSON.parse(
    saveInfo.slice(saveInfo.indexOf(`{`), saveInfo.indexOf(`}`)) + `}`
  );

  //Lcoin properties
  const lCoinPropertiesSave = JSON.parse(
    saveInfo.slice(saveInfo.lastIndexOf(`{`), saveInfo.lastIndexOf(`}`)) + `}`
  );

  //Inventory
  const inventorySave = JSON.parse(
    `[` +
      saveInfo.slice(
        saveInfo.indexOf(`"` + inventory[0]),
        saveInfo.indexOf(`],[["Cedonj"`)
      ) +
      `]`
  );

  //Bosses
  const bossesSave = JSON.parse(
    `[[` +
      saveInfo.slice(saveInfo.indexOf(`"Cedonj"`), saveInfo.indexOf(`]],[`)) +
      `]]`
  );

  //   Counts
  const countsSave = JSON.parse(
    (saveInfo.slice(saveInfo.indexOf(`]],[`), -1) + `]`).slice(3)
  );

  const everythingSave = [
    beforeSave,
    propertiesSave,
    lCoinPropertiesSave,
    inventorySave,
    bossesSave,
    countsSave,
  ];
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(everythingSave), key, {
    iv: iv,
  }).toString();
  setTimeout(() => {
    navigator.clipboard
      .writeText(ciphertext)
      .then(() =>
        alert(
          `Code Copied to Clipboard! Save it and put it in Load Code when you want to load your save.`
        )
      )
      .catch(() =>
        alert(
          `Whoops! Seems like something is wrong. Try again. If that doesn't work try refreshing the page`
        )
      );

    let decryption = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
    }).toString(CryptoJS.enc.Utf8);
  }, 33);
});

let decryption;
loadCode.addEventListener(`click`, function () {
  let cryptedText = prompt(`Enter your Save Code here.`);

  try {
    decryption = CryptoJS.AES.decrypt(cryptedText, key, {
      iv: iv,
    }).toString(CryptoJS.enc.Utf8);

    const fullArrayLoad = JSON.parse(decryption);
    bossesKillCountCounter = fullArrayLoad[0][0];
    timesLooped = fullArrayLoad[0][1];
    time = fullArrayLoad[0][2];
    globalEnemyKillCount = fullArrayLoad[0][3];
    goldSpendCount = fullArrayLoad[0][4];
    goldCollectCountCounter = fullArrayLoad[0][5];
    then = fullArrayLoad[0][6];
    timeBuff = fullArrayLoad[0][7];
    enemyLevel = fullArrayLoad[0][8];
    goldSpendCountCounter = fullArrayLoad[0][9];
    rollOfPenniesBuff = fullArrayLoad[0][10];
    enemyKillCount = fullArrayLoad[0][11];
    priceNerf = fullArrayLoad[0][12];
    firstLoginDate = fullArrayLoad[0][13];
    idleGold = fullArrayLoad[0][14];
    clickBoostBuff = fullArrayLoad[0][15];
    bossBuff = fullArrayLoad[0][16];
    inputFarmName.value =
      fullArrayLoad[0][17] === `null`
        ? ``
        : (inputFarmName.value = fullArrayLoad[0][17]);
    gold = fullArrayLoad[0][18];
    bossesKilledCount = fullArrayLoad[0][19];
    globalEnemyKillCountCounter = fullArrayLoad[0][20];
    lCoins = fullArrayLoad[0][21];
    goldCollectCount = fullArrayLoad[0][22];
    buttonClicks = fullArrayLoad[0][23];
    chestOpened = fullArrayLoad[0][24];
    properties = fullArrayLoad[1];
    lCoinProperties = fullArrayLoad[2];
    inventory = fullArrayLoad[3];
    bosses = fullArrayLoad[4];
    counts = fullArrayLoad[5];
    localStorage.setItem(`bossesKillCountCounter`, bossesKillCountCounter);
    localStorage.setItem(`timesLooped`, timesLooped);
    localStorage.setItem(`time`, time);
    localStorage.setItem(`globalEnemyKillCount`, globalEnemyKillCount);
    localStorage.setItem(`goldSpendCount`, goldSpendCount);
    localStorage.setItem(`goldCollectCountCounter`, goldCollectCountCounter);
    localStorage.setItem(`then`, then);
    localStorage.setItem(`timeBuff`, timeBuff);
    localStorage.setItem(`enemyLevel`, enemyLevel);
    localStorage.setItem(`goldSpendCountCounter`, goldSpendCountCounter);
    localStorage.setItem(`rollOfPenniesBuff`, rollOfPenniesBuff);
    localStorage.setItem(`enemyKillCount`, enemyKillCount);
    localStorage.setItem(`priceNerf`, priceNerf);
    localStorage.setItem(`firstLoginDate`, firstLoginDate);
    localStorage.setItem(`idleGold`, idleGold);
    localStorage.setItem(`clickBoostBuff`, clickBoostBuff);
    localStorage.setItem(`bossBuff`, bossBuff);
    localStorage.setItem(`farmName`, inputFarmName.value);
    localStorage.setItem(`gold`, gold);
    localStorage.setItem(`bossesKilledCount`, bossesKilledCount);
    localStorage.setItem(
      `globalEnemyKillCountCounter`,
      globalEnemyKillCountCounter
    );
    localStorage.setItem(`lCoins`, lCoins);
    localStorage.setItem(`goldCollectCount`, goldCollectCount);
    localStorage.setItem(`buttonClicks`, buttonClicks);
    localStorage.setItem(`chestOpened`, chestOpened);
    localStorage.setItem(`properties`, JSON.stringify(properties));
    localStorage.setItem(`lCoinProperties`, JSON.stringify(lCoinProperties));
    localStorage.setItem(`inventory`, JSON.stringify(inventory));
    localStorage.setItem(`bosses`, JSON.stringify(bosses));
    localStorage.setItem(`counts`, JSON.stringify(counts));
    setTimeout(() => location.reload(), 500);
  } catch (error) {
    alert(`Invalid Input. Check Console for details.`);
    console.error(error);
    console.error(
      `Did you maybe enter nothing, or delete something? Try saving again and loading.`
    );
  }
});

// saveFile.addEventListener(`click`, function () {
//   const saveStuff = [
//     bossesKillCountCounter,
//     timesLooped,
//     time,
//     globalEnemyKillCount,
//     goldSpendCount,
//     goldCollectCountCounter,
//     Number(localStorage.getItem(`then`)),
//     timeBuff,
//     enemyLevel,
//     goldSpendCountCounter,
//     rollOfPenniesBuff,
//     enemyKillCount,
//     priceNerf,
//     firstLoginDate,
//     idleGold,
//     clickBoostBuff,
//     bossBuff,
//     `"${localStorage.getItem(`farmName`)}"` || `"aa"`,
//     gold,
//     bossesKilledCount,
//     globalEnemyKillCountCounter,
//     lCoins,
//     goldCollectCount,
//     buttonClicks,
//     chestOpened,
//   ];
//   const saveStuffObjects = [
//     JSON.stringify(properties),
//     JSON.stringify(lCoinProperties),
//   ];

//   const saveStuffArrays = [
//     JSON.stringify(inventory),
//     JSON.stringify(bosses),
//     JSON.stringify(counts),
//   ];
//   const saveStuffString = saveStuff.join();
//   const saveStuffObjectsString = saveStuffObjects.join();
//   const saveStuffArraysString = saveStuffArrays.join();
//   const saveInfo = `${saveStuffString}${saveStuffObjectsString}${saveStuffArraysString}`;

//   const stringify = JSON.stringify(
//     `[` + saveInfo.slice(0, saveInfo.indexOf(`{`)) + `]`
//   );
//   const beforeSave = JSON.parse(JSON.parse(stringify));
//   console.log(beforeSave);

//   //Properties
//   const propertiesSave = JSON.parse(
//     saveInfo.slice(saveInfo.indexOf(`{`), saveInfo.indexOf(`}`)) + `}`
//   );

//   //Lcoin properties
//   const lCoinPropertiesSave = JSON.parse(
//     saveInfo.slice(saveInfo.lastIndexOf(`{`), saveInfo.lastIndexOf(`}`)) + `}`
//   );

//   //Inventory
//   const inventorySave = JSON.parse(
//     `[` +
//       saveInfo.slice(
//         saveInfo.indexOf(`"` + inventory[0]),
//         saveInfo.indexOf(`],[["Cedonj"`)
//       ) +
//       `]`
//   );

//   //Bosses
//   const bossesSave = JSON.parse(
//     `[[` +
//       saveInfo.slice(saveInfo.indexOf(`"Cedonj"`), saveInfo.indexOf(`]],[`)) +
//       `]]`
//   );

//   //   Counts
//   const countsSave = JSON.parse(
//     (saveInfo.slice(saveInfo.indexOf(`]],[`), -1) + `]`).slice(3)
//   );

//   const everythingSave = [
//     beforeSave,
//     propertiesSave,
//     lCoinPropertiesSave,
//     inventorySave,
//     bossesSave,
//     countsSave,
//   ];
//   console.log(everythingSave);
//   const ciphertext = CryptoJS.AES.encrypt(everythingSave.toString(), key, {
//     iv: iv,
//   }).toString();

//   const textToWrite = ciphertext;
//   const filename = `save.txt`;

//   const blob = new Blob([textToWrite], { type: 'text/plain' });

//   saveAs(blob, filename);
// });

// loadFile.addEventListener(`click`, function () {
//   const file = fileInput.files[0];
//   console.log(file);
//   const reader = new FileReader();
//   console.log(reader);
//   reader.onload = function (e) {
//     console.log(`Loaded`);
//     // The file has been successfully read
//     const fileContents = e.target.result;
//     const decryption = CryptoJS.AES.decrypt(fileContents, key, {
//       iv: iv,
//     }).toString(CryptoJS.enc.Utf8);
//     const fullArrayLoad = JSON.parse(decryption);
//     bossesKillCountCounter = fullArrayLoad[0][0];
//     timesLooped = fullArrayLoad[0][1];
//     time = fullArrayLoad[0][2];
//     globalEnemyKillCount = fullArrayLoad[0][3];
//     goldSpendCount = fullArrayLoad[0][4];
//     goldCollectCountCounter = fullArrayLoad[0][5];
//     then = fullArrayLoad[0][6];
//     timeBuff = fullArrayLoad[0][7];
//     enemyLevel = fullArrayLoad[0][8];
//     goldSpendCountCounter = fullArrayLoad[0][9];
//     rollOfPenniesBuff = fullArrayLoad[0][10];
//     enemyKillCount = fullArrayLoad[0][11];
//     priceNerf = fullArrayLoad[0][12];
//     firstLoginDate = fullArrayLoad[0][13];
//     idleGold = fullArrayLoad[0][14];
//     clickBoostBuff = fullArrayLoad[0][15];
//     bossBuff = fullArrayLoad[0][16];
//     inputFarmName.value =
//       fullArrayLoad[0][17] === `null`
//         ? ``
//         : (inputFarmName.value = fullArrayLoad[0][17]);
//     gold = fullArrayLoad[0][18];
//     bossesKilledCount = fullArrayLoad[0][19];
//     globalEnemyKillCountCounter = fullArrayLoad[0][20];
//     lCoins = fullArrayLoad[0][21];
//     goldCollectCount = fullArrayLoad[0][22];
//     buttonClicks = fullArrayLoad[0][23];
//     chestOpened = fullArrayLoad[0][24];
//     properties = fullArrayLoad[1];
//     lCoinProperties = fullArrayLoad[2];
//     inventory = fullArrayLoad[3];
//     bosses = fullArrayLoad[4];
//     counts = fullArrayLoad[5];
//     localStorage.setItem(`bossesKillCountCounter`, bossesKillCountCounter);
//     localStorage.setItem(`timesLooped`, timesLooped);
//     localStorage.setItem(`time`, time);
//     localStorage.setItem(`globalEnemyKillCount`, globalEnemyKillCount);
//     localStorage.setItem(`goldSpendCount`, goldSpendCount);
//     localStorage.setItem(`goldCollectCountCounter`, goldCollectCountCounter);
//     localStorage.setItem(`then`, then);
//     localStorage.setItem(`timeBuff`, timeBuff);
//     localStorage.setItem(`enemyLevel`, enemyLevel);
//     localStorage.setItem(`goldSpendCountCounter`, goldSpendCountCounter);
//     localStorage.setItem(`rollOfPenniesBuff`, rollOfPenniesBuff);
//     localStorage.setItem(`enemyKillCount`, enemyKillCount);
//     localStorage.setItem(`priceNerf`, priceNerf);
//     localStorage.setItem(`firstLoginDate`, firstLoginDate);
//     localStorage.setItem(`idleGold`, idleGold);
//     localStorage.setItem(`clickBoostBuff`, clickBoostBuff);
//     localStorage.setItem(`bossBuff`, bossBuff);
//     localStorage.setItem(`farmName`, inputFarmName.value);
//     localStorage.setItem(`gold`, gold);
//     localStorage.setItem(`bossesKilledCount`, bossesKilledCount);
//     localStorage.setItem(
//       `globalEnemyKillCountCounter`,
//       globalEnemyKillCountCounter
//     );
//     localStorage.setItem(`lCoins`, lCoins);
//     localStorage.setItem(`goldCollectCount`, goldCollectCount);
//     localStorage.setItem(`buttonClicks`, buttonClicks);
//     localStorage.setItem(`chestOpened`, chestOpened);
//     localStorage.setItem(`properties`, JSON.stringify(properties));
//     localStorage.setItem(`lCoinProperties`, JSON.stringify(lCoinProperties));
//     localStorage.setItem(`inventory`, JSON.stringify(inventory));
//     localStorage.setItem(`bosses`, JSON.stringify(bosses));
//     localStorage.setItem(`counts`, JSON.stringify(counts));
//     setTimeout(() => location.reload(), 2000);
//     try {
//     } catch (error) {
//       alert(`Invalid Input. Check Console for details.`);
//       console.log(error);
//     }
//   };
//   setTimeout(() => {
//     console.log(file);
//     reader.readAsText(file.toString());
//   }, 1000);
// });
