import { imageInput } from "./artistItemsPage.js";

const liveStreamVideo = document.querySelector("#liveStream");
export function stopStream() {
  const stream = liveStreamVideo.srcObject;
  if (!stream) return;

  const allTracks = stream.getTracks();
  allTracks.forEach((track) => track.stop());
}

export function initArtistCaptureImage() {
  const captureStreamCanvas = document.querySelector("#captureStream");
  const capturedImageBtn = document.querySelector("#captureImage");

  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
      },
    })
    .then((stream) => {
      liveStreamVideo.srcObject = stream;
    })

  liveStreamVideo.addEventListener("canplay", () => {
    captureStreamCanvas.width = liveStreamVideo.videoWidth;
    captureStreamCanvas.height = liveStreamVideo.videoHeight;
  });

  capturedImageBtn.addEventListener("click", () => {
    const ctx = captureStreamCanvas.getContext("2d");
    ctx.drawImage(liveStreamVideo, 0, 0);

    const imgUrl = captureStreamCanvas.toDataURL("image/png");
    location.hash = "#addNewItemPage";
    imageInput.value = imgUrl;
    const imageInputheh = document.createElement("img");
    imageInputheh.src = imgUrl;
    document.querySelector(".photo").innerHTML = "";
    const tryAgain = document.createElement("span");
    tryAgain.innerHTML =
      'Take a picture again <i class="fa-solid fa-camera"></i>';
    tryAgain.classList.add("try-again");
    tryAgain.addEventListener("click", () => {
      location.hash = "#artistCaptureImage";
    });
    document.querySelector(".photo").append(imageInputheh, tryAgain);
  });
}
