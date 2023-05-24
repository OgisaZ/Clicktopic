# Clicktopic

Clicktopic is a web game that falls into the genre of "Incremental" or "Idle" games.

The objective of the research was to examine the applicability of JavaScript in the development of web games and to explore the potential of this genre of games in a fun context.

The achieved results of the research have shown that JavaScript is highly suitable for developing web games, and that "Idle" games can be very interesting and educational. The key values of this research can be emphasized as the simplicity and flexibility of the JavaScript programming language, as well as the ability to create games that provide entertainment to players.

The conclusion of this research is that the use of JavaScript in the development of web games, particularly in "Idle" games, can be highly successful, and there is great potential for this genre of games in both educational and entertaining senses.

Clicktopic is made without any JavaScript frameworks, and doesn't use any databases. Just vanilla JavaScript.

**This project was used for Serbia's district competition(Bor), regional competition(won 3rd place!), and national competition(Vranje)(lost :( (but got first place for presentation and work)).**

## Idle game

"Incremental" or "Idle" games are types of video games that are based on gradual progression through the game without the need for constant player activity. In these games, the player starts with a small amount of resources that they can use to earn more resources and progress in the game. As the player advances, they gain access to new resources and game mechanics that motivate them to continue further. After a longer period of gameplay, the player doesn't have to actively play or be on the page to earn resources and progress. Some "Idle" games have features where the player starts the game from scratch but gains new ways to earn resources faster than the first time. One well-known "Idle" game is "Cookie Clicker." Most games in this genre give the user the ability to purchase upgrades for faster resource generation.

## Basic elements of the game:

For a game to fall into the "Idle" genre, it must have functionalities for automatic or passive earning of a specific currency. To ensure continuous earning, a timer is added that calculates the income every few milliseconds. After research, it has been determined that 33 milliseconds is the most effective and fastest interval for this purpose. The same time interval is used in other parts of the program for displaying and calculating certain elements.

Passive earning can be achieved by the player purchasing `properties` that can be seen on the left side of the page. Each `property` has its own price and how much it earns every 33 milliseconds. Acquiring more than one `property` increases its price and income. One of the `properties` improves the player's earnings when actively playing, so the player will always earn more by playing the game passively. The function updateIdleGold is used to accurately calculate the user's passive earnings.

### Earning via active playing

Clicking on the big button in the center will give you gold. How much gold you get depends on some parameters. Clicking the button also loweres the "Health" of the enemy. The enemy name and health are displayed on the button. When enemy health reaches 0, you will earn some bonus gold for defeating them.

### Earning via `properties`

With the gold you've collected, you can buy `properties`. With `properties`, you will earn gold and deal damage without having to press the button. The more `properties` you have the more expensive they are, but also the more they will earn and do damage. `properties`' damage per second (also earns gold per second) and what they do, can be seen on the "`properties`" tab in the bottom right corner.

## New ideas

"Clicktopic" introduces new ways of playing the game that other popular "Idle" games don't have. One of the primary and most interesting methods is the addition of enemies.

### Enemies

Every time the user clicks the button, there is an illusion of "attacking" the enemy by decreasing the number displayed on the button. When that number reaches 0, the enemy is defeated, rewards are obtained, and a new enemy is created. The size of these rewards depends on several parameters. An algorithm has been created to determine the magnitude of rewards a particular enemy should provide. The addition of enemies introduces a significant element of interaction and challenge into the game. Overcoming difficult enemies can give players a sense of satisfaction and success, which can motivate them to continue playing. This is particularly important in "Idle" games where players can easily lose interest if they don't feel they are making progress.

Enemies are constantly challenging, and this is achieved through two parameters: their level and their complexity. The enemy's level makes it easier to adjust the difficulty of the enemy based on the player's skills. Adding complexity to enemies can make the game more interesting and challenging. Players will have to face enemies with different abilities and characteristics. If players are confronted with stronger enemies, they will need to change their play style and strategy in order to quickly and effectively defeat the tough enemies.

### `Items`

Another new addition to the game is "`items`." Each `item` has a special function that enhances other aspects of the game. The game can be played without these `items`, but the player will progress faster and more efficiently with their help. Some `items` are interconnected, meaning they work better when used with another specific `item`. `items` can be obtained infinitely, and in the case of duplicates, the effect of the `item` is simply strengthened. `items` are divided into active and passive `items`. Active `items` enhance active parts of the game, such as button clicking. An example of an active `item` is the "Feral Claw," which improves production provided by properties only if the player has more than 6 CPS (Clicks Per Second). The enhancement depends on how many of that `item` the player possesses and can be endlessly upgraded. Passive `items` are `items` that work without the player pressing a button. An example of a passive `item` is the "Poison Dagger," which has a chance to double property production for half a second, and the more of this `item` the player has, the higher the chance.

One of the most interesting active `items` is the "Gold Tooth," which creates a small golden circle on the button that, when pressed, rewards the player. The circle is created every time an enemy is defeated, and the reward depends on how many "Gold Tooth" `items` the player possesses.

**(Inspired by amazing rougelike game Risk of Rain 2)**

### Looping

After some time, the player has bought everything they could and achieved a certain goal, and the game becomes boring. To help with this, the player has the option to start over, where they lose everything they have accomplished in order to reach the goal faster and more efficiently again. Starting over, or "looping," can be achieved by clicking the "Loop" button. The game asks the player if they are sure and if they want to proceed with this decision. If they agree, the player will receive a new currency with which they can purchase new properties that facilitate the process of earning and spending currency. The new currency, called "LCoins," can only be obtained if the player starts over. The amount of "LCoins" a user earns is determined using an algorithm that takes into account the player's achievements up to that point. It considers the properties the player has purchased, the `items` they have, enemy levels, and more. The properties that can be purchased with "LCoins" have different abilities and functions designed for a wide range of players. If the player wants to earn currency faster, earn more when actively playing, earn more when not playing, and more, they can buy specific properties that give them the ability to do so.

### Saving

Clicktopic is played on a web page, which means it can be accessed anytime, anywhere, and on any device. If a player has been playing the game on a computer and wants to switch to playing on a phone, they won't have all the resources they had on the computer. That's why a game-saving functionality has been implemented. When the player clicks the "Save Code" button, a large encrypted code is copied, which they can paste anywhere to restore every value. This encrypted code contains all the information about the current game, and when these values are read, each value is restored as indicated in the code. With this feature, players can also test and attempt things they weren't willing to do before because if something doesn't go as planned, they can simply restore the saved game and continue from that point in the game. The ability to play over a large distance and on multiple devices is also added.

## Gratitude

I would like to express my gratitude to the following individuals for their assistance in testing and troubleshooting:
Aleksandar Gojković, Mladen Žurkić, Branislav Ivković, Miloš Milošević.

This was a really fun project to work on and develop. I have learnt a huge amount from this project and i am really proud of how i made it. There will probably be no updates to the game, except if i feel like adding new things. Hopefully next year i will win the national competition (have some great ideas cooking up).

Most of all, thank **you** for looking at this project.
