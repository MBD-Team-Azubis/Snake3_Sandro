import "./style.css";

const mapsize = 15;
const snake: { x: number; y: number }[] = [{ x: 1, y: 1 }];
const food: { x: number; y: number } = { x: 5, y: 5 };

//playground data
const playground = <HTMLDivElement>document.getElementById("playground");
playground.setAttribute("style", `display:flex;flex-wrap:wrap;`);
const tile = 500 / mapsize;
let snakelength = 1;
let tmpInput = "s";
//one time map render
function mapRender() {
  for (let i = 0; i < mapsize * mapsize; i++) {
    const div = document.createElement("div");
    playground.appendChild(div);
  }
}

function playerRender() {
  for (let i = 0; i < snake.length; i++) {
    const snakeDiv = document.createElement("snake");
    snakeDiv.classList.add("snake");
    snakeDiv.id = `${snake[snake.length - 1].y.toString()}${snake[
      snake.length - 1
    ].x.toString()}`;
    snakeDiv.setAttribute(
      "style",
      `position: absolute;top: calc(${tile.toString()}px * ${snake[
        snake.length - 1
      ].y.toString()} + 8px);left: calc(${tile.toString()}px * ${snake[
        snake.length - 1
      ].x.toString()} + 8px)`
    );
    playground.appendChild(snakeDiv);
  }
}

function playerInput(keycode: { key: string }) {
  if (tmpInput === "a" && keycode.key === "d") {
    return;
  }
  if (tmpInput === "d" && keycode.key === "a") {
    return;
  }
  if (tmpInput === "w" && keycode.key === "s") {
    return;
  }
  if (tmpInput === "s" && keycode.key === "w") {
    return;
  } else {
    tmpInput = keycode.key;
  }
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const foodDiv = document.createElement("food");
// position define, tile size * snake y or x + body margin
foodDiv.setAttribute(
  "style",
  `position: absolute;top: calc(${tile.toString()}px * ${food.y.toString()}.25 + 8px);left: calc(${tile.toString()}px * ${food.x.toString()}.25 + 8px)`
);
playground.appendChild(foodDiv);

function foodInteraction() {
  //console.log(food, snake[snake.length - 1]);

  food.x = randomIntFromInterval(0, 14);
  food.y = randomIntFromInterval(0, 14);
  foodDiv.id = `${food.y.toString()}${food.x.toString()}`;
  const snakeclass = document.querySelectorAll(".snake");
  for (let i = 0; i < snakeclass.length; i++) {
    if (foodDiv.id === snakeclass[i].id) {
      foodInteraction();
    }
  }
  foodDiv.setAttribute(
    "style",
    `position: absolute;top: calc(${tile.toString()}px * ${food.y.toString()}.25 + 8px);left: calc(${tile.toString()}px * ${food.x.toString()}.25 + 8px)`
  );
}

function inputToMovment(input: string) {
  switch (input) {
    case "w": {
      snake.push({
        x: snake[snake.length - 1].x,
        y: snake[snake.length - 1].y - 1,
      });
      snake.shift();
      break;
    }
    case "s": {
      snake.push({
        x: snake[snake.length - 1].x,
        y: snake[snake.length - 1].y + 1,
      });
      snake.shift();
      // console.log(snake);
      break;
    }
    case "a": {
      snake.push({
        x: snake[snake.length - 1].x - 1,
        y: snake[snake.length - 1].y,
      });
      snake.shift();
      break;
    }
    case "d": {
      snake.push({
        x: snake[snake.length - 1].x + 1,
        y: snake[snake.length - 1].y,
      });
      snake.shift();
      break;
    }
  }
}

function hasDuplicates(array: string[]) {
  return new Set(array).size !== array.length;
}

function collision() {
  if (
    snake[snake.length - 1].y < 0 ||
    snake[snake.length - 1].x < 0 ||
    snake[snake.length - 1].y > mapsize - 1 ||
    snake[snake.length - 1].x > mapsize - 1
  ) {
    clearInterval(intervalId);
    alert("Pall collision");
    window.location.reload();
  }

  const snakeclass = document.querySelectorAll(".snake");
  const classarr: string[] = [];
  for (let i = 0; i < snakeclass.length; i++) {
    classarr.push(snakeclass[i].id);
  }
  if (hasDuplicates(classarr)) {
    clearInterval(intervalId);
    alert("Player collision");
    window.location.reload();
  }
}

function renderInteractibles() {
  const sclass = document.querySelectorAll(".snake");
  console.log({
    snake,
    sclass,
    snakelength,
    food,
    foodDiv,
    playerInput,
    tmpInput,
  });
  addEventListener("keydown", playerInput);
  inputToMovment(tmpInput);
  playerRender();
  collision();
  if (
    snake[snake.length - 1].x === food.x &&
    snake[snake.length - 1].y === food.y
  ) {
    foodInteraction();
    snakelength++;
  }
  const snakeclass = document.querySelectorAll(".snake");
  // console.log(snakeclass);
  if (snakeclass.length > snakelength) {
    for (let i = 0; i < snake.length; i++) {
      snakeclass[i].remove();
    }
  }
  // once();
  // executed = true;
}

// function once() {
//   if (!executed) {
//     snake.shift();
//   }
// }
//game execution
mapRender();
const intervalId = setInterval(() => {
  renderInteractibles();
}, 500);
