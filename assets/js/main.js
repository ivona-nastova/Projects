// All Cards

function hideAllCards() {
  let allCards = document.querySelectorAll(".mycard");

  allCards.forEach((mycard) => {
    mycard.style.display = "none";
  });
}

function showAllCards() {
  let allCards = document.querySelectorAll(".mycard");

  allCards.forEach((mycard) => {
    mycard.style.display = "inline-block";
  });
}

// Coding Cards Filter

document
  .querySelector("#filter-coding")
  .addEventListener("change", filterCoding);
function filterCoding() {
  hideAllCards();

  if (document.querySelector("#filter-coding").checked) {
    let codingCards = document.querySelectorAll(".coding");
    codingCards.forEach((codingCard) => {
      codingCard.style.display = "inline-block";
      loading.style.display = "none";
    });

    document.querySelector("#filter-design").checked = false;
    document.querySelector("#filter-marketing").checked = false;
  } else {
    showAllCards();
  }
}

// Design Cards Filter

document
  .querySelector("#filter-design")
  .addEventListener("change", filterDesign);
function filterDesign() {
  hideAllCards();

  if (document.querySelector("#filter-design").checked) {
    let designCards = document.querySelectorAll(".design");
    designCards.forEach((designCard) => {
      designCard.style.display = "inline-block";
      loading.style.display = "none";
    });

    document.querySelector("#filter-coding").checked = false;
    document.querySelector("#filter-marketing").checked = false;
  } else {
    showAllCards();
  }
}

// Marketing Cards Filter

document
  .querySelector("#filter-marketing")
  .addEventListener("change", filterMarketing);
function filterMarketing() {
  hideAllCards();

  if (document.querySelector("#filter-marketing").checked) {
    let marketingCards = document.querySelectorAll(".marketing");
    marketingCards.forEach((marketingCard) => {
      marketingCard.style.display = "inline-block";
      loading.style.display = "none";
    });

    document.querySelector("#filter-design").checked = false;
    document.querySelector("#filter-coding").checked = false;
  } else {
    showAllCards();
  }
}

// Pagination for mobile

let loading = document.querySelector("#loadMore");
let item = 6;
let cardsAll = document.querySelectorAll(".mycard");

loading.addEventListener("click", loadMoreBtn);
function loadMoreBtn() {
  for (let i = item; i < item + 6; i++) {
    if (cardsAll[i]) {
      cardsAll[i].style.display = "inline-block";
    }
  }
  item += 6;
  if (item >= cardsAll.length) {
    loading.style.display = "none";
  }
}
