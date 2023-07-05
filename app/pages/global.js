export let currentArtist;
export const header = document.querySelector("header");
const headerTitle = document.querySelector(".title");
const headerIcon = document.querySelector(".icon");
const artistMenu = document.querySelector("#artistMenu");

// Header Show Function
export function showHeader() {
  header.style.display = "flex";
  headerTitle.innerText = "street ARTists";
  headerIcon.innerHTML = `<a href = "#auctionPage">
    <svg
    width="70"
    height="35"
    viewBox="0 0 30 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
   
    <path
      d="M17.25 27.5V30.25H0.75V27.5H17.25ZM18.0557 0.943237L28.7505 11.638L26.8063 13.585L25.3487 13.0982L21.9429 16.5L29.7212 24.2784L27.777 26.2226L20 18.4442L16.6945 21.7497L17.0836 23.3062L15.138 25.2505L4.44325 14.5557L6.38888 12.6115L7.94263 12.9992L16.5969 4.34636L16.1115 2.88886L18.0557 0.943237Z"
      fill="#A26A5E"></path>
  </svg>
   </a>`;
}

// Header Update Function For The Artist Page
export function updateHeader() {
  showHeader();
  headerTitle.innerHTML = getCurrentArtist();
  const menuBtn = document.createElement("button");
  menuBtn.classList.add("btn", "text-color-primary", "menu-btn", "p-0");
  menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  headerIcon.innerHTML = "";
  headerIcon.appendChild(menuBtn);

  menuBtn.addEventListener("click", () => {
    artistMenu.classList.toggle("show-menu");
  });
}

// Function for creating option for select
export function createSelectOption(select, array) {
  array.forEach((element) => {
    select.innerHTML += `<option value="${element}">${element}</option>`;
  });
}

// Hide Menu Function
export function hideMenu() {
  if (artistMenu.classList.contains("show-menu")) {
    artistMenu.classList.remove("show-menu");
  }
}

// Set Current Artist To Local Storage
export function setCurrentArtists(artist) {
  currentArtist = artist;
  localStorage.setItem("currentArtist", currentArtist);
}

// Get Current Artist To Local Storage
export function getCurrentArtist() {
  return localStorage.getItem("currentArtist") ?? currentArtist;
}

// Function For Creating Cards
export function createCard(array, container) {
  array.forEach((element, idx) => {
    const card = document.createElement("div");
    card.classList.add("art-card", "col-sm-12", "col-md-6","col-lg-4");
    let elementIdx = idx;

    card.innerHTML = `
    <div class="art ${elementIdx % 2 === 0 ? "light" : "dark"}-card mb-4">
        <img src="${element.image}" alt="art-photo">
        <div class="content">
        <div class="d-flex justify-content-between align-items-center">
            <h2 class="font-family-reenie big-font-size">${element.artist}</h2>
            <span class="${
              elementIdx % 2 === 0 ? "dark" : "light"
            }-card btn-style cursor-default">${element.price}$</span>
        </div>
        <span>${element.title}</span>
        <p class="normal-font-size">${element.description}</p>
    </div>
    </div>`;

    container.appendChild(card);
  });
}
