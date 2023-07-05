import { lastDaysButtons } from "./artistHomePage.js";
import { createSelectOption, hideMenu, setCurrentArtists } from "./global.js";
import { hideFilters } from "./visitorListingPage.js";

const joinAsArtistSelect = document.querySelector("#joinAsArtist");
const artistSelect = document.querySelector("#chooseArtist");
const artistDiv = document.querySelector(".artist");

// Get Users Names From API
function getUsersNames() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((users) => {
      const nameOptions = users.map((user) => user.name);
      createSelectOption(joinAsArtistSelect, nameOptions);
      createSelectOption(artistSelect, nameOptions);
    });

  joinAsArtistSelect.removeEventListener("change", onArtistChange);
  joinAsArtistSelect.addEventListener("change", onArtistChange);
}
getUsersNames();

function onArtistChange(e) {
  setCurrentArtists(e.target.value);

  location.hash = "#artistHomePage";
}

artistDiv.addEventListener("click", () => {
  joinAsArtistSelect.classList.add("artist-select");
});

joinAsArtistSelect.addEventListener("click", (event) => {
  event.stopPropagation();
  joinAsArtistSelect.classList.remove("artist-select");
});

export function removeAllChanges() {
  hideMenu();
  hideFilters();
  joinAsArtistSelect.value = "choose";
  lastDaysButtons.forEach((button) => {
    button.classList.remove("active");
  });
}
