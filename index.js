const EventEmitter = require('events');
const _ = require('underscore');
const Game = require('./game');
const AI = require('./ai');

const game = new Game();
// put the game on the global variable to allow debugging
global.game = game;

game.join(new AI({ id: 'A', token: 'X', difficulty: 'expert' }));
game.join(new AI({ id: 'B', token: '0', difficulty: 'novice' }));

game.start();

const maxSets = 1;
const maxGames = 1;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// global.game.players[1].brain.memory.load('./data/brain.json');
// console.log("Memory", Object.keys(global.game.players[1].brain.memory.data).length);
(async () => {
	let set = 0;
	console.time("Duration");
	while (set < maxSets)
	{
		let played = 0;
		let results = { 'Red': 0, 'Yellow': 0, 'draw': 0 };
		while (played < maxGames)
		{
			game.restart();

			let winner = false;
			while (!winner)
			{
				game.nextTurn();
				game.board.display(true);

				winner = game.checkForEndOfGame();
				if (winner)
				{
					// console.log(`=========== Game ${played} Winner: ${winner} ===========`);
					results[winner === 'X' ? 'Red' : 'Yellow'] += 1;
				}

				// await snooze(500);
			}

			++played;
		}

		results.percent = Math.floor((results['X'] / maxGames) * 100);
		console.log("Finished", results);

		++set;
	}
})();
console.timeEnd("Duration");

// global.game.players[1].brain.memory.save('./data/brain.json');
// console.log("Memory", Object.keys(global.game.players[1].brain.memory.data).length);
