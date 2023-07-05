import { items } from "../../data/data.js";
import { lastDays } from "../utils/dates.js";
import { getCurrentArtist, updateHeader } from "./global.js";

let myChart;
export const lastDaysButtons = document.querySelectorAll(".last-days-btn");

export function initArtistHomePage() {
  updateHeader();

  updateAuctionPrice();
  localStorage.setItem("user", "artist");

  if (!localStorage.getItem("items")) {
    localStorage.setItem("items", JSON.stringify(items));
  }

  const itemsFromLs = JSON.parse(localStorage.getItem("items"));

  const artistItems = itemsFromLs.filter(
    (item) => item.artist == getCurrentArtist()
  );
  const soldArtistItems = artistItems.filter((item) => Boolean(item.priceSold));

  // Price Sum For Sold Items
  let totalIncome = 0;
  soldArtistItems.forEach((item) => {
    totalIncome += parseFloat(item.priceSold);
  });

  const totalIncomeSpan = document.querySelector(".total-income");
  totalIncomeSpan.innerHTML = `$${totalIncome}`;

  const soldItemsSpan = document.querySelector(".total-sold-items");
  soldItemsSpan.innerHTML = `${soldArtistItems.length}/${artistItems.length}`;

  if (myChart) {
    myChart.destroy();
  }

  const PrimaryBackgroundColor = "#a16a5e";

  // Creating Chart
  const ctx = document.querySelector("#myChart");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Amount",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
          backgroundColor: PrimaryBackgroundColor,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    },
  });

  // Events For Last Days Buttons
  const last7DaysBtn = document.querySelector("#btn7Days");
  const last14DaysBtn = document.querySelector("#btn14Days");
  const last30DaysBtn = document.querySelector("#btn30Days");

  function clickedButtonStyle(button) {
    // Remove 'active' class from all buttons
    lastDaysButtons.forEach((btn) => {
      if (btn !== button) {
        btn.classList.remove("active");
      }
    });
    button.classList.add("active");
  }

  lastDaysButtons.forEach((button) => {
    button.addEventListener("click", () => {
      clickedButtonStyle(button);
    });
  });

  last7DaysBtn.addEventListener("click", () => {
    lastDays(7, myChart, soldArtistItems);
  });

  last14DaysBtn.addEventListener("click", () => {
    lastDays(14, myChart, soldArtistItems);
  });

  last30DaysBtn.addEventListener("click", () => {
    lastDays(30, myChart, soldArtistItems);
  });
}

// Updating Auction Price
function updateAuctionPrice() {
  const currentAuctionItem = JSON.parse(
    localStorage.getItem("currentAuctionItem")
  );
  const auctionPrice = document.querySelector("#auctionPrice");

  const highestBidSumFromLs = parseFloat(
    JSON.parse(localStorage.getItem("highestBidSum"))
  );
  if (currentAuctionItem && highestBidSumFromLs !== 0) {
    if (highestBidSumFromLs) {
      auctionPrice.innerHTML = `$${highestBidSumFromLs}`;
    }
  } else {
    auctionPrice.innerHTML = "No Item In Auction";
  }
}
