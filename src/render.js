const CFG = require("../config.json");
const ipcRenderer = require("electron").ipcRenderer;
const Shell = require("node-powershell");

// ?  --------------  Events  --------------
ipcRenderer.send("serverStatus", CFG.server.ip);
ipcRenderer.on("StatusChecker", (event, data) => {
  const totalPlayers = document.getElementById("connectedPlayers");

  if (data) {
    serverStatusText = "Server Status: Online";

    ipcRenderer.send("getConnectedPlayers", CFG.server.ip);
    ipcRenderer.on("sendPlayerCount", (event, count, max) => {
      totalPlayers.innerText = `Players Connected: ${count.length}/${max}`;
    });
  } else {
    totalPlayers.innerText = "Not available.";
  }
});

// ?  -----------   Functions   ------------
function adjustWindow(action) {
  ipcRenderer.send(`${action}App`);
}

function openSocialAccount(account) {
  let audio = document.getElementById("checkAudio");
  audio.play();
  let ps = new Shell();

  switch (account) {
    case "discord": {
      ps.addCommand("start " + JSON.stringify(CFG.discord));
      ps.invoke();
    }
  }
}

function StartFiveM() {
  let ps = new Shell({ executionPolicy: "Bypass", noProfile: true });
  let audio = document.getElementById("connectAudio");
  audio.play();

  ps.addCommand(`start fivem://connect/${CFG.server.ip}`);
  ps.invoke();
}

// ? ----------- Update Images and Text ----------------
const sliderBars = document.querySelectorAll('.slider-bar');

// Function to handle slider change
function changeSlider(index) {
  const imageSrc = sliderBars[index].dataset.image;
  const textContent = sliderBars[index].dataset.text;

  const imageElement = document.querySelector('.picture-slider img');
  const textElement = document.querySelector('.update-text');
  if (imageElement) {
    imageElement.src = imageSrc;
  }
  if (textElement) {
    textElement.textContent = textContent;
  }

  sliderBars.forEach((sliderBar) => {
    sliderBar.classList.remove('active');
  });

  sliderBars[index].classList.add('active');
}

// Function to automatically change the slider every 5 seconds
function autoChangeSlider() {
  let index = 0;
  const totalSlides = sliderBars.length;
  let intervalId;

  function handleSliderChange() {
    changeSlider(index);
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      index = (index + 1) % totalSlides;
      handleSliderChange();
    }, 5000);
  }

  handleSliderChange();

  sliderBars.forEach((sliderBar, idx) => {
    sliderBar.addEventListener('click', () => {
      index = idx;
      handleSliderChange();
    });
  });
}

autoChangeSlider();