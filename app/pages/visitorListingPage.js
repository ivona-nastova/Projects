import { items, itemTypes } from "../../data/data.js";
import { createCard, createSelectOption, showHeader } from "./global.js";

export const filterLogo = document.querySelector(".filter-logo");
const filtersDiv = document.querySelector(".filters");
const hideFiltersBtn = document.querySelector("#hideFilters");
const filterCheckIcon = document.querySelector(".check-icon");
const typeSelect = document.querySelector("#chooseType");
const listingCardContainer = document.querySelector("#listingCardContainer .row");

let publishedItems;
export function initVisitorPage() {
  showHeader();
  localStorage.setItem("user", "visitor");
}

export function initVisitorListingPage() {
  showHeader();
  const itemsFromLs = JSON.parse(localStorage.getItem("items"));

  if (itemsFromLs) {
    // Retrieve The Items Array From LocalStorage And Parse It
    createPublishedItems(itemsFromLs);
  } else {
    localStorage.setItem("items", JSON.stringify(items));
    createPublishedItems(items);
  }
}

function createPublishedItems(myItems) {
  let publishedItems = myItems.filter((item) => item.isPublished);
  createSelectOption(typeSelect, itemTypes);
  createCard(publishedItems, listingCardContainer);
}

// Filters
function initFiltredListingPage() {
  const titleInput = document.querySelector("#filterTitle");
  const artistSelect = document.querySelector("#chooseArtist");
  const minPriceInput = document.querySelector("#minPrice");
  const maxPriceInput = document.querySelector("#maxPrice");
  const itemsFromLs = JSON.parse(localStorage.getItem("items"));

  publishedItems = itemsFromLs.filter((item) => item.isPublished);

  let filtered = publishedItems.filter(
    (item) =>
      (titleInput.value
        ? item.title.toLowerCase().includes(titleInput.value.toLowerCase())
        : true) &&
      (artistSelect.value && artistSelect.value !== "choose"
        ? item.artist === artistSelect.value
        : true) &&
      (minPriceInput.value ? item.price >= minPriceInput.value : true) &&
      (maxPriceInput.value ? item.price <= maxPriceInput.value : true) &&
      (typeSelect.value && typeSelect.value !== "choose"
        ? item.type === typeSelect.value
        : true)
  );

  if (filtered.length == 0) {
    listingCardContainer.innerHTML = `<div id = "emptyArray">
    <div class = "d-flex text-color-dark"> 
    <h3 class = "text-center">Items Not Found</h3>
    <i class="fa-solid fa-2x fa-magnifying-glass"></i>
    </div>
     </div>`;
  } else {
    listingCardContainer.innerHTML = "";
    createCard(filtered, listingCardContainer);
  }

  titleInput.value = "";
  artistSelect.value = "choose";
  minPriceInput.value = "";
  maxPriceInput.value = "";
  typeSelect.value = "choose";

  filtersDiv.classList.remove("show");
  document.body.classList.remove("show-filters");
}

filterCheckIcon.addEventListener("click", initFiltredListingPage);

// Function For Hiding Filters
export function hideFilters() {
  filtersDiv.classList.remove("show");
  document.body.classList.remove("show-filters");
}

hideFiltersBtn.addEventListener("click", hideFilters);

filterLogo.addEventListener("click", () => {
  document.body.classList.add("show-filters");
  filtersDiv.classList.toggle("show");
});
