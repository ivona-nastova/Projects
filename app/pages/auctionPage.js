import { showHeader, updateHeader } from "./global.js";

let timerId;
let timer;
let highestBidSum = 0;

const highestBid = document.querySelector(".highest-bid");
const biddingInput = document.querySelector("#biddingInput");
const biddingHistory = document.querySelector("#biddingHistory");
const bidBtn = document.querySelector("#bidBtn");

const auctionItemContainer = document.querySelector("#auctionItemContainer");
const auctionDiv = document.querySelector(".auctionDiv");

// Converting Seconds
function formatTimer(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }
  return `${minutes} : ${remainingSeconds}`;
}

export function initAuctionTimer() {
  clearInterval(timerId); // clear any existing interval
  timer = localStorage.getItem("timer");

  if (timer) {
    timer = parseInt(timer);
  } else {
    timer = 120;
    localStorage.setItem("timer", timer.toString());
  }
  const currentItem = localStorage.getItem("currentAuctionItem");
  const currentAuctionItemLs = JSON.parse(currentItem);
  if (timer == 0 && !currentAuctionItemLs) {
    auctionOver();
    return;
  }

  const auctionTimer = document.querySelector(".timer");
  auctionTimer.innerText = formatTimer(timer);

  timerId = setInterval(function () {
    // store interval ID in a variable
    timer -= 1;
    localStorage.setItem("timer", timer.toString());
    auctionTimer.innerText = formatTimer(timer);
    if (timer == 0) {
      auctionOver();
      clearInterval(timerId); // clear interval when timer reaches 0
    }
  }, 1000);

  return timerId; // return interval ID
}

export function initAuctionPage() {
  const highestBidSumFromLs = JSON.parse(localStorage.getItem("highestBidSum"));
  highestBid.innerHTML = highestBidSumFromLs;

  const userFromLs = localStorage.getItem("user");

  if (userFromLs == "artist") {
    bidBtn.disabled = true;
    updateHeader();
  } else {
    showHeader();
    bidBtn.disabled = false;
  }
  const currentAuctionItemFromLs = JSON.parse(
    localStorage.getItem("currentAuctionItem")
  );

  if (currentAuctionItemFromLs) {
    clearInterval(timerId); // Clear Any Existing Interval
    timerId = initAuctionTimer(); // initialize A New Timer And Store The Interval ID
    auctionItemContainer.innerHTML = `<div>
        <img src = ${currentAuctionItemFromLs.image}>
        <h4 class = "text-color-primary" >${currentAuctionItemFromLs.title}</h4>
      </div>`;

    auctionDiv.style.display = "flex";
    biddingInput.value = highestBidSumFromLs;
  }

  bidBtn.removeEventListener("click", bidButtonEvent);
  bidBtn.addEventListener("click", bidButtonEvent);
}

// Function For Bid Button
function bidButtonEvent() {
  // Disable the button and show a loading spinner
  bidBtn.disabled = true;
  bidBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Bidding...';

  // Increase The Timer By 60 Seconds
  timer += 60;
  localStorage.setItem("timer", timer.toString());

  // Create a new FormData object and set the amount field
  const formData = new FormData();
  formData.set("amount", biddingInput.value);

  fetch("https://projects.brainster.tech/bidding/api", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {

      // If isBidding Is True, Update With The New Bid Amount
      if (data.isBidding) {
        highestBidSum = parseFloat(data.bidAmount);
        localStorage.setItem("highestBidSum", JSON.stringify(highestBidSum));

        biddingInput.min = data.bidAmount;
        // Increase The Value Of The Input Field By 50
        biddingInput.value = parseFloat(data.bidAmount) + 50;

        highestBid.innerHTML = highestBidSum;
        bidBtn.disabled = false;
        bidBtn.innerHTML = "+50$ BID";
      }
      // If isBidding is false, update with the auction result
      else {
        biddingInput.disabled = true;
        highestBid.innerHTML = biddingInput.value;
        highestBidSum = parseFloat(biddingInput.value);
        localStorage.setItem("highestBidSum", JSON.stringify(highestBidSum));
        biddingHistory.innerHTML = "I give up!";
        bidBtn.innerHTML = "+50$ BID";
        bidBtn.disabled = true;
      }
    });
}

// Function When Auction Is Over
function auctionOver() {
  clearInterval(timerId);
  highestBid.innerHTML = biddingInput.value;
  const items = JSON.parse(localStorage.getItem("items"));
  const currentAuctionItem = JSON.parse(
    localStorage.getItem("currentAuctionItem")
  );
  const index = items.findIndex((item) => item.id === currentAuctionItem.id);
  bidBtn.disabled = true;

  // Update The Item's Properties With The Relevant Values
  items[index].isAuctioning = false;
  items[index].priceSold = parseInt(highestBid.textContent);
  items[index].dateSold = new Date();

  localStorage.setItem("items", JSON.stringify(items));

  localStorage.removeItem("currentAuctionItem");

  alert(`The auction has ended`);
  location.hash = '#'

  auctionDiv.style.display = "none";
  auctionItemContainer.innerHTML = 
  ` <div class="d-flex flex-column align-items-center text-color-primary big-font-size">
  <span>Auction Is Over</span>
  <img src="./app/images/auction-gf6c73fadf_640-removebg-preview.png" alt="auction">
  <a href="#" class="p-2 btn background-primary text-color-light">Go Home</a>
</div>`
}
