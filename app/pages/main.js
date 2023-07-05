// Handle Route
import { header } from "./global.js";
import { filterLogo, initVisitorPage, initVisitorListingPage, } from "./visitorListingPage.js";
import { removeAllChanges } from "./landingPage.js";
import { initArtistHomePage } from "./artistHomePage.js";
import { initArtistItemsPage } from "./artistItemsPage.js";
import { initArtistCaptureImage, stopStream } from "./artistCaptureImage.js";
import { initAuctionPage } from "./auctionPage.js";

function handleRoute() {
  const hash = location.hash === "" ? "#landingPage" : location.hash;

  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => (page.style.display = "none"));
  document.querySelector(hash).style.display = "block";

  if (hash !== "#artistCaptureImage") {
    stopStream();
  }

  switch (hash) {
    case "#landingPage":
      header.style.display = "none";
      break;

    case "#visitorPage":
      initVisitorPage();

      break;

    case "#visitorListingPage":
      initVisitorListingPage();
      filterLogo.style.position = "fixed";
      break;

    case "#artistHomePage":
      initArtistHomePage();
      break;

    case "#artistItemsPage":
      initArtistItemsPage();
      break;

    case "#artistCaptureImage":
      initArtistCaptureImage();
      break;

    case "#auctionPage":
      initAuctionPage();
      break;

    default:
      break;
  }
}

window.addEventListener("hashchange", () => {
  handleRoute();
  removeAllChanges();
});

window.addEventListener("load", handleRoute);
