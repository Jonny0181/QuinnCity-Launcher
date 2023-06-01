const ipcRenderer = require("electron").ipcRenderer;
const Shell = require("node-powershell");

// ?  --------------  Events  --------------
ipcRenderer.send("serverStatus", "aj8a3e");
ipcRenderer.on("StatusChecker", (event, data) => {
  const totalPlayers = document.getElementById("connectedPlayers");

  if (data) {
    serverStatusText = "Server Status: Online";

    ipcRenderer.send("getConnectedPlayers", "aj8a3e");
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
      ps.addCommand("start https://discord.gg/e2zvMk64");
      ps.invoke();
    }
  }
}

function StartFiveM() {
  let ps = new Shell({ executionPolicy: "Bypass", noProfile: true });
  let audio = document.getElementById("connectAudio");
  audio.play();

  ps.addCommand(`start fivem://connect/${"aj8a3e"}`);
  ps.invoke();
}

// ? ----------- Update Images and Text ----------------
const sliderBars = document.querySelectorAll('.slider-bar');

// Function to handle slider change
async function changeSlider(index) {
  const responseImages = await fetch('https://api.github.com/repos/Jonny0181/QuinnCity-Launcher/contents/updateInformation/images');
  const responseText = await fetch('https://api.github.com/repos/Jonny0181/QuinnCity-Launcher/contents/updateInformation/text');
  const dataImages = await responseImages.json();
  const dataText = await responseText.json();

  if (dataImages && Array.isArray(dataImages) && dataText && Array.isArray(dataText)) {
    const imageInfo = dataImages[index];

    const sortedTextFiles = dataText
      .filter(fileInfo => fileInfo.name.endsWith('.txt'))
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

    const textInfo = sortedTextFiles[index];

    if (imageInfo && imageInfo.name.endsWith('.jpg') || imageInfo.name.endsWith('.png')) {
      const imageSrc = imageInfo.download_url;
      const imageElement = document.querySelector('.picture-slider img');
      if (imageElement) {
        imageElement.src = imageSrc;
      }
    }

    if (textInfo && textInfo.name.endsWith('.txt')) {
      const textContent = await fetch(textInfo.download_url).then(response => response.text());
      const textElement = document.querySelector('.update-text');
      if (textElement) {
        textElement.textContent = textContent;
      }
    }
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

  async function handleSliderChange() {
    await changeSlider(index);
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