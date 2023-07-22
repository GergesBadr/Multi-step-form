// Needed elements
const allSteps = document.querySelectorAll(".all-steps"),
  stepListItems = document.querySelectorAll(".step-list-item"),
  goBackBtn = document.getElementById("go-back-btn"),
  nextStepBtn = document.getElementById("next-step-btn"),
  confirmBtn = document.getElementById("confirm-btn"),
  nameInput = document.getElementById("name-input"),
  emailInput = document.getElementById("email-input"),
  phoneNumberInput = document.getElementById("phone-number-input");

// save user selectd data
let userData = {};
// target current step div
let currentStep = 0;

nextStepBtn.addEventListener("click", forwardStep);
goBackBtn.addEventListener("click", backwardStep);
confirmBtn.addEventListener("click", showEnd);

function forwardStep() {
  // Valid steps
  if (currentStep === 0) {
    validFirstStep();
  } else if (currentStep === 1) {
    validSecStep();
  } else if (currentStep === 2) {
    validThirdStep();
    finishUp();
  }
  // Show or hide backward button
  handleBackwardBtn();
  console.log(userData);
}

function backwardStep() {
  if (currentStep > 0) {
    goBack();
  }
  // Show or hide backward button
  handleBackwardBtn();
  console.log(userData);
}

function validFirstStep() {
  if (
    validInputs(document.querySelectorAll("#step-one-sec input")) &&
    validEmail()
  ) {
    goNext();
  } else {
    return false; // Do not go to next step untill all inputs are valid
  }
  // Save data related to the first step
  userData[nameInput.name] = nameInput.value;
  userData[emailInput.name] = emailInput.value;
  userData[phoneNumberInput.name] = phoneNumberInput.value;
}

function validSecStep() {
  let plansError = document.getElementById("plans-error"),
    isSelectedPlan = Array.from(plans).some((plan) =>
      plan.classList.contains("selected")
    );
  if (isSelectedPlan) {
    plansError.classList.replace("block", "hidden");
    goNext();
  } else {
    // Error to show that no plan has been selected
    plansError.setAttribute("role", "alert");
    plansError.classList.replace("hidden", "block");
    return false;
  }
  // Save selected plan name
  userData["selected-plan-name"] = document.querySelector(
    ".selected .plan-name"
  ).innerText;
  userData["selected-plan-price"] = document.querySelector(
    ".selected .plan-price"
  ).innerText;

  // Detect show monthly or early on add-ons (step 3) based on user selection in step 2
  const onlineServicePrice = document.getElementById("online-service-price"),
    largerStoragePrice = document.getElementById("larger-storage-price"),
    customizableProfilePrice = document.getElementById(
      "customizable-profile-price"
    );
  if (!isMonthly) {
    onlineServicePrice.innerText = "+10$/yr";
    largerStoragePrice.innerText = "+20$/yr";
    customizableProfilePrice.innerText = "+20$/yr";
  } else {
    onlineServicePrice.innerText = "+1$/mo";
    largerStoragePrice.innerText = "+2$/mo";
    customizableProfilePrice.innerText = "+2$/mo";
  }
}

function validThirdStep() {
  goNext();
  // Save selected data
  let selectedAddOns = document.querySelectorAll(".selected-add-ons");
  let addOnsObj = {
    "add-ons-names": [],
    "add-ons-prices": [],
  };
  selectedAddOns.forEach((el) => {
    let addOnsNames = el.querySelector(".add-on-name").innerText;
    let addOnsPrices = el.querySelector(".add-on-price").innerText;
    addOnsObj["add-ons-names"].push(addOnsNames);
    addOnsObj["add-ons-prices"].push(addOnsPrices);
  });
  userData["selected-add-ons"] = addOnsObj;
}

function finishUp() {
  nextStepBtn.classList.add("hidden");
  confirmBtn.classList.remove("hidden");
  // Clear previously displayed information
  document.getElementById("last-step-content").innerHTML = "";
  // Show selected plan
  const finishUpDiv = document.createElement("div");
  finishUpDiv.innerHTML = `
  <div id="main-plan" class="bg-magnolia p-4 rounded-lg mt-6">
    <div class="flex items-center justify-between pb-4 border-light-gray border-b">
      <p class="font-bold text-lg">${userData["selected-plan-name"]} (${
    isMonthly ? "Monthly" : "Yearly"
  }) </p>
      <span class="font-bold">${userData["selected-plan-price"]}</span>
    </div>
  </div>
  `;
  document.getElementById("last-step-content").append(finishUpDiv);
  // If there is any selected add-ons, show it
  if (userData["selected-add-ons"]) {
    const addOnsDiv = document.createElement("div");
    addOnsDiv.innerHTML = `
    <div class="bg-magnolia">
      <ul>
        ${userData["selected-add-ons"]["add-ons-names"]
          .map(
            (name, index) =>
              `<li class="mt-4 flex items-center justify-between"> 
                <span class="text-cool-gray">${name}</span>
                <span class="font-bold">${userData["selected-add-ons"]["add-ons-prices"][index]}</span>
              </li>`
          )
          .join("")}
      </ul>
    </div>
  `;
    document.getElementById("main-plan").append(addOnsDiv);
  }
  // show total
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `
  <div id="total-div" class="mt-6 flex items-center justify-between px-4">
    <p class="text-cool-gray">Total (${
      isMonthly ? "per month" : "per year"
    })</p>
    <p class="text-purplish-blue font-bold text-xl">${calculateTotal()}</p>
  </div>
  `;
  document.getElementById("last-step-content").append(totalDiv);
}

function showEnd() {
  const finishingUp = document.getElementById("finishing-up"),
    end = document.getElementById("end");
  // Hide finishing up div
  finishingUp.classList.add("hidden");
  // Hide buttons
  document.getElementById("controls").classList.add("hidden");
  // Show end div
  end.classList.remove("hidden");
}

function calculateTotal() {
  let total = parseFloat(userData["selected-plan-price"]);
  if (userData["selected-add-ons"]) {
    const addOnPrices = userData["selected-add-ons"]["add-ons-prices"];
    addOnPrices.forEach((price) => {
      const value = parseFloat(price);
      total += value;
    });
  }
  return `+$${total}/${isMonthly ? "mo" : "yr"}`;
}

function goNext() {
  allSteps[currentStep].classList.add("hidden");
  stepListItems[currentStep].classList.remove("active");
  currentStep++;
  allSteps[currentStep].classList.remove("hidden");
  stepListItems[currentStep].classList.add("active");
}

function goBack() {
  allSteps[currentStep].classList.add("hidden");
  stepListItems[currentStep].classList.remove("active");
  currentStep--;
  allSteps[currentStep].classList.remove("hidden");
  stepListItems[currentStep].classList.add("active");
  if (currentStep === 2) {
    // Suffle buttons
    nextStepBtn.classList.remove("hidden");
    confirmBtn.classList.add("hidden");
    // Clear previously selected add-ons data
    delete userData["selected-add-ons"];
  }
  if (currentStep === 1) {
    // Clear previously selected plan data
    delete userData["selected-plan-name"];
    delete userData["selected-plan-price"];
    // Clear previously selected add-ons data
    delete userData["selected-add-ons"];
  }
}

function handleBackwardBtn() {
  if (currentStep >= 1) {
    goBackBtn.classList.remove("hidden");
  } else {
    goBackBtn.classList.add("hidden");
  }
}
// Check empty inputs
function validInputs(inputs) {
  let hasNonValidInput = false;
  inputs.forEach((input) => {
    if (input.value === "") {
      input.parentElement.classList.add("has-error");
      // For accessability, specially screen readers.
      input.setAttribute("aria-invalid", "true");
      input.parentElement.querySelector("span").setAttribute("role", "alert");
      hasNonValidInput = true;
    } else {
      input.parentElement.classList.remove("has-error");
      input.setAttribute("aria-invalid", "false");
    }
  });
  // return true if there are no empty inputs (all inputs are non-empty) and false otherwise
  return !hasNonValidInput;
}

// Valid email
function isEmail(emailVal) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    emailVal
  );
}

function validEmail() {
  if (!isEmail(emailInput.value)) {
    emailInput.parentElement.classList.add("has-error");
    return false;
  } else {
    emailInput.parentElement.classList.remove("has-error");
    return true;
  }
}

// Handle plan selection
const plans = document.querySelectorAll(".plan"),
  monthly = document.getElementById("monthly"),
  yearly = document.getElementById("yearly"),
  togglePlan = document.getElementById("toggle-plan"),
  arcadePrice = document.getElementById("arcade-price"),
  advancedPrice = document.getElementById("advanced-price"),
  proPrice = document.getElementById("pro-price"),
  yearOfferSpans = Array.from(document.querySelectorAll(".year-offer"));

plans.forEach((plan) => {
  plan.addEventListener("click", (e) => {
    plans.forEach((plan) => {
      plan.classList.remove("selected");
    });
    e.currentTarget.classList.add("selected");
    e.currentTarget.setAttribute("aria-checked", "true");
    let isSelectedPlan = Array.from(plans).some((plan) =>
      plan.classList.contains("selected")
    );
  });
});

let isMonthly = true;
togglePlan.addEventListener("click", () => {
  isMonthly ? showEarly() : showMonthly()
});

function showEarly() {
  // Make screen readers and assistive technology knows that it has been clicked
  togglePlan.setAttribute("aria-pressed", "true");
  // Handle styles
  monthly.classList.replace("text-marine-blue", "text-cool-gray");
  yearly.classList.replace("text-cool-gray", "text-marine-blue");
  togglePlan.classList.replace("before:left-1", "before:left-7");
  yearOfferSpans.forEach((offer) => {
    offer.classList.remove("hidden");
  });
  // Change plans value
  arcadePrice.innerText = "90$/yr";
  advancedPrice.innerText = "120$/yr";
  proPrice.innerText = "150$/yr";
  isMonthly = false;
}
function showMonthly() {
  // Make screen readers and assistive technology knows that it has NOT been clicked
  togglePlan.setAttribute("aria-pressed", "false");
  monthly.classList.replace("text-cool-gray", "text-marine-blue");
  yearly.classList.replace("text-marine-blue", "text-cool-gray");
  togglePlan.classList.replace("before:left-7", "before:left-1");
  yearOfferSpans.forEach((offer) => {
    offer.classList.add("hidden");
  });
  arcadePrice.innerText = "9$/mo";
  advancedPrice.innerText = "12$/mo";
  proPrice.innerText = "15$/mo";
  isMonthly = true;
}

// handle add-ons selection
const addOns = Array.from(document.querySelectorAll(".add-ons"));

addOns.forEach((el) => {
  el.addEventListener("click", () => {
    el.classList.toggle("selected-add-ons");
    const addOnInput = el.querySelector("input");
    addOnInput.checked = el.classList.contains("selected-add-ons");
  });
});
