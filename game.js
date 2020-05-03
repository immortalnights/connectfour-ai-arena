const _ = require('underscore');
const Game = require('noughtsandcrossesbattle/game');

class Connect4 extends Game
{
	start()
	{
		this.status = 'PLAYING';
		this.turnIndex = -1;
		this.initBoard(7, 6);
	}

	place(player, location)
	{
		let ok;

		// drop placement down Y
		if (this.board.at(location) !== '')
		{
			this.board.display();
			console.error(`Failed to place token at ${location.x}: Column is full`);
		}
		else
		{
			for (let y = this.board.height - 1; y >= 0 && !ok; y--)
			{
				const dropLocation = { x: location.x, y };
				// console.debug(dropLocation);
				if (this.board.at(dropLocation) === '')
				{
					ok = this.board.place(dropLocation, player.token);
				}
			}
		}

		return ok;
	}

	checkForEndOfGame(board)
	{
		board = board || this.board;
		let winner = null;

		const paths = board.paths(4);
		const winPath = paths.find(path => {
			// Use the first token to match against the rest
			const token = path[0].token;

			return path.every(cell => cell.token === token);
		});

		if (_.isEmpty(winPath) === false)
		{
			winner = winPath[0].token;
		}
		else if (this.board.freeCount() === 0)
		{
			winner = 'draw';
		}

		return winner;
	}
};

module.exports = Connect4;
