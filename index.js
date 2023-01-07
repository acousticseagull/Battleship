import './style.css';

const game = document.getElementById('game');

const SHIP = {
  Carrier: 'Carrier',
  Battleship: 'Battleship',
  Cruiser: 'Crusier',
  Submarine: 'Submarine',
  Destroyer: 'Destroyer',
};

const players = [
  {
    ships: [
      {
        name: 'Carrier',
        size: 5,
        pos: {
          x: 0,
          y: 0,
        },
        hits: [],
        orientation: 'vertical',
      },
      {
        name: 'Battleship',
        size: 4,
        pos: {
          x: 1,
          y: 0,
        },
        hits: [],
        orientation: 'vertical',
      },
      {
        name: 'Cruiser',
        size: 3,
        pos: {
          x: 2,
          y: 0,
        },
        hits: [],
        orientation: 'vertical',
      },
      {
        name: 'Submarine',
        size: 3,
        pos: {
          x: 3,
          y: 0,
        },
        hits: [],
        orientation: 'vertical',
      },
      {
        name: 'Destroyer',
        size: 2,
        pos: {
          x: 4,
          y: 0,
        },
        hits: [],
        orientation: 'horizontal',
      },
    ],
    radar: [],
  },
  {
    ships: [
      {
        name: 'Carrier',
        size: 5,
        pos: {
          x: 0,
          y: 0,
        },
        hits: [],
        orientation: 'vertical',
      },
      {
        name: 'Battleship',
        size: 4,
        pos: {
          x: 3,
          y: 0,
        },
        hits: [],
        orientation: 'horizontal',
      },
      {
        name: 'Cruiser',
        size: 3,
        pos: {
          x: 8,
          y: 0,
        },
        hits: [],
        orientation: 'vertical',
      },
      {
        name: 'Submarine',
        size: 3,
        pos: {
          x: 7,
          y: 6,
        },
        hits: [],
        orientation: 'vertical',
      },
      {
        name: 'Destroyer',
        size: 2,
        pos: {
          x: 6,
          y: 0,
        },
        hits: [],
        orientation: 'vertical',
      },
    ],
    radar: [],
  },
];

const grid = createGrid(10);
const gridNode = renderGrid(grid, 40);

game.append(gridNode);

function getShip(player, name) {
  return players[player].ships.find((ship) => ship.name === name);
}

function positionShip(player, name, x, y, orientation) {
  const orientations = {
    0: 'vertical',
    1: 'horizontal',
  };

  const ship = getShip(player, name);

  if (
    y < 0 ||
    x < 0 ||
    y > grid.length - 1 ||
    (orientation === 0 && y + ship.size > grid.length - 1) ||
    x > grid.length - 1 ||
    (orientation === 1 && x + ship.size > grid.length - 1)
  ) {
    console.error(`x: ${x} y: ${y} is outside the grid.`);
    return;
  }

  ship.pos = { x: x, y: y };
  ship.orientation = orientations[orientation];

  renderShips(player);
}

function createGrid(size) {
  return new Array(size).fill(new Array(size).fill(0));
}

function renderGrid(grid, cellSize) {
  const gridNode = document.createElement('div');
  gridNode.className = 'grid';

  for (let y = 0; y < grid.length; y++) {
    const rowNode = document.createElement('div');
    rowNode.className = 'row';

    Object.assign(rowNode.style, {
      width: `${grid.length * cellSize}px`,
      height: `${cellSize}px`,
    });

    for (let x = 0; x < grid[y].length; x++) {
      const cellNode = document.createElement('div');
      cellNode.className = 'cell';

      cellNode.textContent = `${x},${y}`;

      Object.assign(cellNode.style, {
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      });

      rowNode.append(cellNode);
    }

    gridNode.append(rowNode);
  }

  return gridNode;
}

function renderShips(player) {
  Array.from(document.getElementsByClassName('ship')).forEach((ship) =>
    ship.remove()
  );

  const ships = players[player].ships;

  ships.forEach((ship) => {
    const shipNode = document.createElement('div');
    shipNode.className = 'ship';

    Object.assign(shipNode.style, {
      width: `${ship.orientation === 'horizontal' ? 40 * ship.size : 40}px`,
      height: `${ship.orientation === 'vertical' ? 40 * ship.size : 40}px`,
      top: `${ship.pos.y * 40}px`,
      left: `${ship.pos.x * 40}px`,
    });

    gridNode.append(shipNode);
  });
}

function renderHits(player) {
  Array.from(document.getElementsByClassName('hit')).forEach((ship) =>
    ship.remove()
  );

  players[player].ships.forEach((ship) => {
    ship.hits.forEach((hit) => {
      const node = document.createElement('div');
      node.className = 'hit';

      Object.assign(node.style, {
        top: `${hit.y * 40}px`,
        left: `${hit.x * 40}px`,
      });

      gridNode.append(node);
    });
  });
}

function renderRadar(player) {
  Array.from([
    ...document.getElementsByClassName('hit'),
    ...document.getElementsByClassName('miss'),
    ...document.getElementsByClassName('ship'),
  ]).forEach((item) => item.remove());

  players[player].radar.forEach((item) => {
    const node = document.createElement('div');
    node.className = item.name;

    Object.assign(node.style, {
      top: `${item.y * 40}px`,
      left: `${item.x * 40}px`,
    });

    gridNode.append(node);
  });
}

function target(a, b, x, y) {
  const ship = players[b].ships.find((ship) => {
    const pos = [];

    for (let i = 0; i < ship.size; i++) {
      if (ship.orientation === 'vertical')
        pos.push({ x: ship.pos.x, y: ship.pos.y + i });
      else pos.push({ x: ship.pos.x + i, y: ship.pos.y });
    }

    const hit = pos.find((pos) => pos.x === x && pos.y === y);

    if (hit) {
      ship.hits.push(hit);
      players[a].radar.push({
        name: 'hit',
        ...hit,
      });
    } else {
      players[a].radar.push({
        name: 'miss',
        x,
        y,
      });
    }

    return hit;
  });

  if (ship) console.info(`You hit the ${ship.name}!`);
  else console.info(`You missed!`);
  if (ship && ship.hits.length === ship.size)
    console.info(`You sunk the ${ship.name}!`);

  renderRadar(a);
}

window.bs = {
  SHIP: SHIP,
  positionShip: positionShip,
  target: target,
  getShip: getShip,
  renderRadar: renderRadar,
};
