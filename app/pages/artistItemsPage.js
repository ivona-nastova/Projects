import { itemTypes } from "../../data/data.js";
import { formatDate } from "../utils/dates.js";
import { initAuctionTimer } from "./auctionPage.js";
import { createSelectOption,  getCurrentArtist, updateHeader,} from "./global.js";

let isEditing;
let editingItem;
let currentAuctionItem;
export const imageInput = document.querySelector("#image");
const artistItemsContainer = document.querySelector("#artistItemsContainer .row");

const cancelBtn = document.querySelector("#cancelBtn");
const isPublishedCheckbox = document.querySelector("#isPublishedCheckbox");
const addItemBtn = document.querySelector("#addItem");
const photoDiv = document.querySelector(".photo");
const addNewItemDiv = document.querySelector("#addNewItem .div-inner");

// Selecting Form Inputs
const titleInput = document.querySelector("#title");
const descriptionTextArea = document.querySelector("#description");
const priceInput = document.querySelector("#price");
const typeSelect = document.querySelector("#type");

createSelectOption(typeSelect, itemTypes);

// Event For Add New Item Div
addNewItemDiv.addEventListener("click", () => {
  isEditing = false;
  addItemBtn.innerText = "Add New Item";
  resetInputs();
  photoDiv.removeEventListener("click", preventDefault);
  photoDiv.innerHTML = `<a href="#artistCaptureImage" id="photoDiv" class="d-flex flex-column justify-content-center align-items-center">
<i class="fa-solid fa-camera fa-4x text-color-light"></i>
<span>Take a snapshot</span>
</a>`;
});

export function initArtistItemsPage() {
  updateHeader();

  // Display Of Arts By Selected Artist
  const items = JSON.parse(localStorage.getItem("items"));
  let artistItems = items.filter((item) => item.artist == getCurrentArtist());
  displayArtistItems(artistItems);
}

// Event For Add New Item Button
addItemBtn.addEventListener("click", () => {
  if (isEditing) {
    // Save changes to existing item
    editingItem.title = titleInput.value;
    editingItem.description = descriptionTextArea.value;
    editingItem.price = priceInput.value;
    editingItem.isPublished = isPublishedCheckbox.checked;
    editingItem.image = imageInput.value;
    editingItem.type = typeSelect.value;

    const items = JSON.parse(localStorage.getItem("items"));
    const index = items.findIndex((item) => item.id === editingItem.id);
    items[index] = editingItem;
    localStorage.setItem("items", JSON.stringify(items));

    location.hash = "#artistItemsPage";
  } else {
    // Add new item
    if (
      titleInput.value &&
      descriptionTextArea.value &&
      priceInput.value > 0 &&
      imageInput.value &&
      typeSelect.value
    ) {
      const artData = {
        id: new Date().valueOf(),
        title: titleInput.value,
        description: descriptionTextArea.value,
        price: priceInput.value,
        image: imageInput.value,
        type: typeSelect.value,
        dateCreated: new Date(),
        isAuctioning: false,
        isPublished: isPublishedCheckbox.checked,
        artist: localStorage.getItem("currentArtist"),
      };

      const items = JSON.parse(localStorage.getItem("items"));
      items.push(artData);
      location.hash = "#artistItemsPage";
      localStorage.setItem("items", JSON.stringify(items));
    }
  }
});

export function createArtCard(array) {
  array.forEach((element) => {
    const card = document.createElement("div");
    card.id = "art";
    card.classList.add('col-sm-12', "col-md-6")
    card.innerHTML = `<div class="art text-color-primary background-light">
    <img src=${element.image} alt="art-photo">
    <div class="content">
    <div class="d-flex justify-content-between align-items-center">
    <div>
            <span>${element.title}</span>
            <span class="d-block small-font-size">${formatDate(
              element.dateCreated
            )}</span>
          </div>
            <span class="background-primary text-color-light btn-style">${
              element.price
            }$</span>
            </div>
            <p class="normal-font-size">${element.description}.</p>
            </div>
            </div>`;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add(
      "background-primary",
      "p-2",
      "normal-font-size"
    );

    // Send To Auction Button
    const sendToAuctionBtn = document.createElement("button");
    sendToAuctionBtn.innerText = "Send to Auction";
    sendToAuctionBtn.classList.add(
      "btn-style",
      "background-blue",
      "text-color-white"
    );

    sendToAuctionBtn.addEventListener("click", () => {
      sendToAuctionClickEvent(element, sendToAuctionBtn);
    });

    // Unpublish Button
    const unpublishBtn = document.createElement("button");
    unpublishBtn.classList.add(
      "btn-style",
      "background-green",
      "text-color-white",
      "ms-2"
    );

    if (element.isPublished) {
      unpublishBtn.innerText = "Unpublish";
    } else {
      unpublishBtn.innerText = "Publish";
    }

    unpublishBtn.addEventListener("click", () => {
      unpublishBtnClickEvent(element, unpublishBtn);
    });

    // Remove Button
    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.classList.add(
      "btn-style",
      "background-red",
      "text-color-white",
      "ms-2"
      );

    removeBtn.addEventListener("click", () => {
      removeItem(element, card);
    });

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add(
      "btn-style",
      "background-light",
      "text-color-primary",
      "ms-2"
    );

    editBtn.addEventListener("click", () => {
      editItem(element);
    });

    buttonsDiv.append(sendToAuctionBtn, unpublishBtn, removeBtn, editBtn);
    card.appendChild(buttonsDiv);

    artistItemsContainer.insertBefore(card, artistItemsContainer.firstChild);
  });
}

// Function For Unpublish Button
function unpublishBtnClickEvent(element, unpublishBtn) {
  if (!element.isPublished) {
    element.isPublished = true;
    unpublishBtn.innerText = "Unpublish";
  } else {
    element.isPublished = false;
    unpublishBtn.innerText = "Publish";
  }

  const items = JSON.parse(localStorage.getItem("items"));
  const index = items.findIndex((item) => item.id === element.id);

  if (index !== -1) {
    // Check if element exists in the items array
    items[index].isPublished = element.isPublished;
    localStorage.setItem("items", JSON.stringify(items));
  }
}

// Function For Remove Button
function removeItem(element, card) {
  let itemId = element.id;
  let result = confirm("Are you sure you want to delete this item?");
  if (result) {
    const items = JSON.parse(localStorage.getItem("items"));
    // Index Of The Ttem To Be Removed
    let index = items.findIndex(function (item) {
      return item.id === itemId;
    });
    if (index !== -1) {
      // Remove The Item From The Array
      items.splice(index, 1);

      // Save The Updated Array To Local Storage
      localStorage.setItem("items", JSON.stringify(items));
    }
    card.remove();
  }
}

// Function For Edit Button
function editItem(element) {
  location.hash = "#addNewItemPage";
  isEditing = true;
  if (isEditing) {
    editingItem = element;
    addItemBtn.innerText = "Save Item";
    photoDiv.innerHTML = `<input type = "image" class = "img-width" src = ${element.image}>`;
    photoDiv.addEventListener("click", preventDefault);
  }

  // Input Fields Are The Values Of Item
  titleInput.value = element.title;
  descriptionTextArea.value = element.description;
  typeSelect.value = element.type;
  priceInput.value = element.price;
  imageInput.value = element.image;
}

// Function For Send To Auction Button
function sendToAuctionClickEvent(element, sendToAuctionBtn) {
  biddingInput.min = element.price;
  biddingInput.value = element.price;
  localStorage.setItem("highestBidSum", JSON.stringify(element.price));

  if (!element.dateSold) {
    if (!localStorage.getItem("currentAuctionItem")) {
      // Reset Timer Value And Clear localStorage
      localStorage.setItem("timer", "120");
      localStorage.removeItem("currentAuctionItem");
      location.hash = "#auctionPage";
      currentAuctionItem = element;
      element.isAuctioning = true;
      localStorage.setItem(
        "currentAuctionItem",
        JSON.stringify(currentAuctionItem)
      );
      sendToAuctionBtn.disabled = true;

      // Initialize Auction Timer
      let timerId;
      timerId = initAuctionTimer();

      if (timerId) {
        clearInterval(timerId);
      }
    } else {
      alert("An item is already in auction.");
    }
  } else {
    alert("This item has already been sold.");
  }
}


//Display Items
function displayArtistItems(items) {
  artistItemsContainer.innerHTML = "";
  createArtCard(items);
}

function preventDefault(event) {
  event.preventDefault();
}

// Function To Reset Inputs
function resetInputs() {
  titleInput.value = "";
  descriptionTextArea.value = "";
  priceInput.value = "";
  imageInput.value = "";
  typeSelect.value = "choose";
}

cancelBtn.addEventListener("click", () => {
  location.hash = "#artistItemsPage";
});
