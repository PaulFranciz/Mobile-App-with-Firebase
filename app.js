import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-dd2dd-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingInDB = ref(database, "shopping");

const inputEl = document.querySelector(".inputEl");
const btnEl = document.querySelector(".btnEl");
const shoppingListEl = document.querySelector(".shopping-list");

onValue(shoppingInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingArray = Object.entries(snapshot.val());
    console.log(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < shoppingArray.length; i++) {
      //currentShoppingList has both th IDs and Values
      const currentShoppingList = shoppingArray[i];
      let currentItemID = currentShoppingList[0];
      let currentItemValue = currentShoppingList[1];

      renderListItems(currentShoppingList);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet.";
    shoppingListEl.style.color = "lightGray";
    shoppingListEl.style.textAlign = "center";
  }
});

function renderListItems(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  shoppingListEl.append(newEl);

  newEl.addEventListener("dblclick", function () {
    let geTExactItemLocationInDB = ref(database, `shopping/${itemID}`);
    remove(geTExactItemLocationInDB);
  });
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputField() {
  inputEl.value = "";
}

btnEl.addEventListener("click", function () {
  let inputValue = inputEl.value;

  if (inputValue.trim() !== "" && inputValue !== text) {
    push(shoppingInDB, inputValue);
    clearInputField();
    console.log(`${inputValue} added to the database`);
  } else {
    shoppingListEl.innerHTML =
      "Input value is empty. Please enter a valid item.";
  }
});

const text = "Create your shopping lists";
let index = 0;
let animationInterval;
let animatedText = "";

function animateText() {
  animatedText = text.slice(0, index);
  inputEl.placeholder = animatedText;
  index++;

  if (index > text.length) {
    index = 0;
  }
}

function updateInputValue() {
  if (!animationInterval) {
    inputEl.placeholder = animatedText;
  }
}

function startAnimation() {
  animationInterval = setInterval(function () {
    if (index <= text.length) {
      animateText();
      updateInputValue();
    } else {
      index = 0;
    }
  }, 200); // Adjust the interval to control the animation speed
}

function stopAnimation() {
  clearInterval(animationInterval);
  inputEl.placeholder = "Bread"; // Reset the placeholder text
}

function clearInput() {
  if (!animationInterval) {
    inputEl.value = "";
  }
}

inputEl.addEventListener("click", function () {
  stopAnimation();
});

inputEl.addEventListener("input", function () {
  clearInput();
});

startAnimation();
