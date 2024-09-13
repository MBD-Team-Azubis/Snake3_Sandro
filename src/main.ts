import "./style.css";

const mapsize = 15;
const snake: { x: number; y: number }[] = [{ x: 1, y: 1 }];
const food: { x: number; y: number }[] = [];

const playground = <HTMLDivElement>document.getElementById("playground");
playground.setAttribute("style", `display:flex;flex-wrap:wrap;`);
const tile = 500 / mapsize;
let tmpInput = "s";
let wasPressed = false;
const foodcount = 5;

function mapRender() {
  for (let i = 0; i < mapsize * mapsize; i++) {
    const div = document.createElement("div");
    playground.appendChild(div);
  }
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

for (let i = 0; i < foodcount; i++) {
  const x = randomIntFromInterval(0, 14);
  const y = randomIntFromInterval(0, 14);
  if (!(x === snake[0].x && y === snake[0].y)) {
    food.push({ x: x, y: y });
  }
}

function foodInteraction(index: number) {
  const foodDiv = document.createElement("food");
  const snakeclass = document.querySelectorAll(".snake");
  food[index].x = randomIntFromInterval(0, 14);
  food[index].y = randomIntFromInterval(0, 14);
  foodDiv.id = `${food[index].y.toString()} ${food[index].x.toString()}`;
  const foodstr: string[] = [];
  for (let i = 0; i < food.length; i++) {
    foodstr.push(`${food[i].x.toString()}${food[i].y.toString()}`);
  }
  for (let i = 0; i < snakeclass.length - 1; i++) {
    if (foodDiv.id === snakeclass[i].id || hasDuplicates(foodstr)) {
      foodInteraction(index);
    }
  }
  foodDiv.classList.add("food");
  foodDiv.setAttribute(
    "style",
    `position: absolute;top: calc(${tile.toString()}px * ${food[
      index
    ].y.toString()}.25 + 8px);left: calc(${tile.toString()}px * ${food[
      index
    ].x.toString()}.25 + 8px)`
  );
}

function eat() {
  for (let i = 0; i < food.length - 1; i++) {
    if (snake[0].x === food[i].x && snake[0].y === food[i].y) {
      foodInteraction(i);
      return true;
    }
  }
  return false;
}
function inputToMovment(input: { key: string }) {
  if (tmpInput === "a" && input.key === "d") {
    return;
  }
  if (tmpInput === "d" && input.key === "a") {
    return;
  }
  if (tmpInput === "w" && input.key === "s") {
    return;
  }
  if (tmpInput === "s" && input.key === "w") {
    return;
  } else {
    tmpInput = input.key;
  }

  switch (tmpInput) {
    case "w": {
      snake.unshift({
        x: snake[0].x,
        y: snake[0].y - 1,
      });
      break;
    }
    case "s": {
      snake.unshift({
        x: snake[0].x,
        y: snake[0].y + 1,
      });
      break;
    }
    case "a": {
      snake.unshift({
        x: snake[0].x - 1,
        y: snake[0].y,
      });
      break;
    }
    case "d": {
      snake.unshift({
        x: snake[0].x + 1,
        y: snake[0].y,
      });
      break;
    }
  }
  if (!eat()) {
    snake.pop();
  }
  wasPressed = true;
}
function playerDerender() {
  const snakeclass = document.querySelectorAll(".snake");
  for (let i = 0; i < snakeclass.length; i++) {
    const element = snakeclass[i];
    // console.log(element);
    playground.removeChild(element);
  }
}
function playerRender() {
  for (let i = 0; i < snake.length; i++) {
    const snakeDiv = document.createElement("snake");
    snakeDiv.classList.add("snake");
    snakeDiv.id = `${snake[i].y.toString()} ${snake[i].x.toString()}`;
    for (let x = 0; x < food.length; x++) {
      if (snake[i].x === food[x].x && snake[i].y === food[x].y) {
        foodInteraction(x);
      }
    }
    snakeDiv.setAttribute(
      "style",
      `position: absolute;top: calc(${tile.toString()}px * ${snake[
        i
      ].y.toString()} + 8px);left: calc(${tile.toString()}px * ${snake[
        i
      ].x.toString()} + 8px)`
    );
    playground.appendChild(snakeDiv);
  }
}

function hasDuplicates(array: string[]) {
  return new Set(array).size !== array.length;
}

function collision() {
  if (
    snake[0].y < 0 ||
    snake[0].x < 0 ||
    snake[0].y > mapsize - 1 ||
    snake[0].x > mapsize - 1
  ) {
    clearInterval(intervalId);
    alert("Wall collision");
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

function foodReload() {
  const foodclass = document.querySelectorAll(".food");
  for (let i = 0; i < foodclass.length; i++) {
    const element = foodclass[i];
    // console.log(element);
    playground.removeChild(element);
  }
  for (let i = 0; i < food.length; i++) {
    const foodDiv = document.createElement("food");
    foodDiv.classList.add("food");
    foodDiv.id = `${food[i].y.toString()} ${food[i].x.toString()}`;
    foodDiv.setAttribute(
      "style",
      `position: absolute;top: calc(${tile.toString()}px * ${food[
        i
      ].y.toString()}.25 + 8px);left: calc(${tile.toString()}px * ${food[
        i
      ].x.toString()}.25 + 8px)`
    );
    playground.appendChild(foodDiv);
  }
}

function renderInteractibles() {
  playerDerender();
  addEventListener("keydown", inputToMovment);
  if (!wasPressed) {
    inputToMovment({ key: tmpInput });
  }
  wasPressed = false;
  foodReload();
  // console.log(food);
  // console.log(snake);
  playerRender();
  // eat();
  collision();
}

mapRender();
const intervalId = setInterval(() => {
  renderInteractibles();
}, 500);
