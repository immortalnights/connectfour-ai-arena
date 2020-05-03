const _ = require('underscore');
const AIBase = require('noughtsandcrossesbattle/ai');
const { findWinningPaths, findBlockingPaths } = require('noughtsandcrossesbattle/brains/common');

class Novice {
	run(player, board)
	{
		const random = (min, max) => {
			return Math.floor(Math.random() * (max - min) ) + min;
		};

		let location;
		while (!location)
		{
			const test = { x: random(0, 6), y: 0 };
			// console.log("T", test);
			if (board.at(test) === '')
			{
				location = test;
			}
		}

		return location;
	}

	finish(winner)
	{
	}
};

class Expert {
	run(player, board)
	{
		let location;

		const displayPaths = paths => {
			paths.map(p => {
				console.log(p);
			});
		};

		const paths = board.paths(4);
		const winningPaths = findWinningPaths(paths, player.token);
		const blockingPaths = findBlockingPaths(paths, player.token);

		displayPaths(winningPaths);
		displayPaths(blockingPaths);

		const tryMove = loc => {
			const ok = board.at(loc) === '';

			if (ok)
			{
				// player.emit('place:token', loc);
				location = loc;
			}

			return ok;
		};

		const tryMoves = paths => {
			let moved = false;
			if (_.isEmpty(paths) === false)
			{
				moved = paths.some(path => {
					return path.some(cell => {
						return tryMove(cell.location);
					});
				});
			}

			return moved;
		}

		if (tryMoves(winningPaths))
		{
			// console.debug("Took a winning move", player.token);
		}
		else if (tryMoves(blockingPaths))
		{
			// console.debug("Took a blocking move", player.token);
		}
		else if (board.at({ x: 3, y: 0 }) === '')
		{
			location = { x: 3, y: 0 };
			// console.debug("Took center", player.token);
		}
		else
		{
			const random = (min, max) => {
				return Math.floor(Math.random() * (max - min) ) + min;
			};

			while (!location)
			{
				const test = { x: random(0, 6), y: 0 };
				// console.log("T", test);
				if (board.at(test) === '')
				{
					location = test;
				}
			}
		}


		return location;
	}

	finish(winner)
	{
	}
};

const Brains = {
	novice: Novice,
	expert: Expert
};


class AI extends AIBase
{
	constructor(options)
	{
		super(options);

		if (this.difficulty !== 'Learning')
		{
			const brain = Brains[this.difficulty] ? Brains[this.difficulty] : Brains['novice'];
			this.brain = new brain(this, {});
		}
	}
}

module.exports = AI;