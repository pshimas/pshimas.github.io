// ==========
//  DOM ELEMENTS
// ==========
const min = document.getElementById("min");
const max = document.getElementById("max");
const submitBtn = document.getElementById("submit");
const container = document.getElementById("number-container");
const title = document.getElementById("title");
const instructions = document.getElementById("instructions");
const start = document.getElementById("num-start");
const end = document.getElementById("num-end");
const numberForm = document.getElementById("number-form");
const numberformErrors = document.getElementById("number-form-errors");
const startBtn = document.getElementById("start-play");
const closeForm = document.querySelector("form span");
const printBtn = document.getElementById("print");
const sizeSelect = document.getElementById("size-select");
const fields = document.querySelector(".input-fields");
const modalOverlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");
const password = document.getElementById("password");
const modalSubmit = document.getElementById("modal-submit");


// =========
// Helpers / Utility functions
// =========

// Takes in a start, end, and interval to create an array of numbers
const range = (from, to, step) =>
  [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);
// picks a random value from an array
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// takes an array and returns a new array of random order
const randomizer = (arr) => {
  let randomArray = [];
  let length = arr.length;
  while (arr.length > 0) {
    let randomIndex = Math.floor(Math.random() * length);
    randomArray.push(arr[randomIndex]);
    arr.splice(randomIndex, 1);
    length--;
  }
  return randomArray;
};
// list of class names that will offset elements vertically and horizontally
const verticals = ["raise", "lower", "raise-2x", "lower-2x"];
const horizontals = [
  "offset-left",
  "offset-right",
  "offset-left-2x",
  "offset-right-2x",
];

// checks if the container has numbers generated. Returns 'true' or 'false'
let containerHasNums = container.childNodes.length > 48;

const calcDimensions = (w, h) => {
  return {
    height: h,
    width: w,
  };
};
const paperSizes = {
  0: calcDimensions(3179, 4494),
  1: calcDimensions(2245, 3179),
  2: calcDimensions(1587, 2245),
  3: calcDimensions(1123, 1587),
  4: calcDimensions(794, 1000),
  letter: calcDimensions(816, 1054),
  5: calcDimensions(559, 794),
  6: calcDimensions(397, 559),
  7: calcDimensions(280, 397),
  8: calcDimensions(197, 280),
  9: calcDimensions(140, 197),
  10: calcDimensions(98, 140),
};

// =========
//  EVENT HANDLERS
// =========

// alternates ability to click the PRINT button
const togglePrint = (setting) => {
  printBtn.disabled = !setting;
}

// this makes the numbers form appear or disappear
const toggleOptions = () => {
  console.log(fields.style.top);
  if (fields.style.top == "33%") {
    fields.style.top = "-50em";
    numberformErrors.classList.add('hidden');
  } else {
    fields.style.top = "33%";
  }
};

// this adjusts the font size under the below conditions
const adjustFontSize = (len, printFormatA) => {

  const defaultSize = "1em";

  switch(true) {
    case len >= 600:  // if more than 600 nums, shrink to half size
      console.log(len + " is higher than 600. Shrinking font")
      container.style.fontSize = "0.5em";
      break;

    case len >= 150 && len < 250:  // if between 150 and 200, 1.5 size
      console.log("numLength is between 150 and 250. Grow font by 50%")
      container.style.fontSize = "1.5em";
      break;

    case len >= 50 && len < 150:  // if between 50 and 150 nums, double the size
      console.log("numLength is between 50 and 250. Grow font by 50%")
      container.style.fontSize = "2em";
      break;

    case len < 50:  // if less than 50 nums, triple the size
      console.log("numLength is between 150 and 250. Grow font by 50%")
      container.style.fontSize = "3em";
      break;

    default:
      console.log("numLength is between 250 and 600. Normal font size")
      container.style.fontSize = defaultSize;
      break;
  }

  if ((printFormatA <= 2 && len <= 100)) {
    container.style.fontSize = "4em"
  } else if ((printFormatA < 5 && len <= 100)) {
    container.style.fontSize = "3em"
  } else if ((printFormatA <= 2 && len <= 250)) {
    container.style.fontSize = "2em"
  } else if ((printFormatA > 4 && len <= 100) || (printFormatA <= 2 && len > 300)) {
    container.style.fontSize = "1.5em"
  } else if ((printFormatA > 4 && (len > 100 && len < 500)) || (printFormatA >= 6 && len > 250)) {
    container.style.fontSize = "1em"
  } else if ((printFormatA >= 8 && len > 150) || (printFormatA >= 6 && len > 250)) {
    container.style.fontSize = "0.5em"
  }
};

// update container h/w dimensions based on the selected paper size
const setPaperSize = (val) => {
  const h = paperSizes[val].height;
  const w = paperSizes[val].width;
  container.style.width = `${w}px`;
  container.style.height = `${h}px`;
  return val;
};

// update minimum width of the individual box elements based on number of boxes and paper size
const adjustNumberWidthToPage = (boxEl, printFormatA, len) => {
  if(len <= 30 && printFormatA < 1) {
    boxEl.style.minWidth = "7em"
    return;
  } else if((len > 30 && len <= 50) || printFormatA < 2) {
    boxEl.style.minWidth = "5em"
    return;
  } else if (len > 100 && printFormatA < 6) {
    boxEl.style.minWidth = "2em"
  } else {
    boxEl.style.minWidth = "1.5em"
  }
}

// Update printed instructions based on selected numbers
const updateInstructions = (first, last) => {
  start.innerHTML = "";
  end.innerHTML = "";
  start.innerHTML = first.toString();
  end.innerHTML = last.toString();
}

// show custom error based on custom form field validation not included in HTML5
const throwFormError = (msg, errorsList) => {
  const errorListItem = document.createElement('li');
  errorListItem.textContent = msg;
  errorsList.push(errorListItem);
  numberformErrors.classList.remove("hidden");
  errorsList.forEach(err => numberformErrors.appendChild(err))
}

// ===========
//  EVENT LISTENERS
// ===========

// when start button is clicked, the numbers form appears and prompt is hidden
startBtn.addEventListener("click", ()=> {
  toggleOptions();
  startBtn.classList.add("hidden");
  container.classList.add("start-play-container");
})

// when 'X' is clicked on the numbers form, the number form closes
closeForm.addEventListener("click", ()=> {
  if(!containerHasNums){
    container.classList.add("start-play-container");
    startBtn.classList.remove("hidden");
  }
  toggleOptions();
})

// when the body of the game is clicked, toggle numbers form
container.addEventListener("dblclick", toggleOptions);

// When number form is valid, generate game board
numberForm.addEventListener("submit", (e) => {
  // reset errors
  numberformErrors.innerHTML = "";
  let errors = [];
  // prevent form URL submission
  e.preventDefault();
  // Validate inputs are numbers
  if (typeof(min.value) != 'number' && typeof(max.value) == 'number') {
      throwFormError("You must enter Numbers only", errors)
      return;
  }
  // Validate the minimum number of elements is 50
  if(max.value - min.value < 50) {
    throwFormError("Number range must be greater than 50", errors)
    return;
  }
  // reset the numbers form before box generation
  container.innerHTML = "";
  // get values for printing instructions
  updateInstructions(min.value, max.value);
  // set paper size based on dropdown
  const paperSizeSelection = setPaperSize(sizeSelect.value);
  // get random array of numbers based on start and end numbers, incrementing by 1
  const nums = randomizer(range(Number(min.value), Number(max.value), 1));
  // adjust font size in the container
  adjustFontSize(nums.length, paperSizeSelection);
 // For each number in range, create a div with a p element inside and add the offset properties.
  // Once elements are created add the elements to the container
  nums.forEach((num) => {
    const el = document.createElement("p");
    const box = document.createElement("div");
    box.classList.add("letter-box");
    adjustNumberWidthToPage(box, paperSizeSelection, nums.length);
    const yClass = pick(verticals);
    const xClass = pick(horizontals);
    el.classList.add("letter");
    el.classList.add(yClass, xClass);
    el.textContent = num;
    box.appendChild(el);
    container.appendChild(box);
  });
  // After container is complete, hide numbers form and enable printing
  toggleOptions();
  togglePrint(true);
});

// check for printing capability
printBtn.addEventListener("click", ()=> {
  if(!containerHasNums){
    throwFormError("Must enter a valid number range and printing size to Print", [])
    return;
  } else {
    console.log('printing enabled')
  }
})


// =========
//  PASSWORD AUTH (optional- uncomment below to add password auth)
// =========

// Allow the game to begin
const passthrough = () => {
  modal.style.display = "none";
  modalOverlay.style.display = "none";
};
// Open password modal
const passwordPrompt = () => {
  modal.style.display = "inline-block";
  modalOverlay.style.display = "inline-block";
};

// If password is correct, set a local storage item for the authenticated session
let secret = 'jordan'
const validatePassword = () => {
  console.log(password.value);
  if (password.value.toLowerCase() !== secret) {
    password.value = "";
    return;
  }
  window.localStorage.setItem("numberAuth", true);
  passthrough();
};

// authenticate password before viewing
password.addEventListener("change", (e) => {
  if (e.target.value) {
    modalSubmit.disabled = false;
    return;
  }
  modalSubmit.disabled = true;
});

// validate password
modalSubmit.addEventListener("click", validatePassword);

// Initialize Application with password modal
if (window.localStorage.getItem("numberAuth")) {
  passthrough();
} else {
  passwordPrompt();
}

