const goldDisplay = document.querySelector("#gold-display");
const _id = document.body.dataset._id;

document.addEventListener("click", event => {
  if (event.target.localName !== "button") return;
  let buttonType = 0;

  const id = event.target.id;
  
  switch (id) {
    case "gold-button-1":
      buttonType = 1;
      break;
    case "gold-button-2":
      buttonType = 2;
      break;
    case "gold-button-3":
      buttonType = 3;
      break;
    case "gold-button-4":
      buttonType = 4;
      break;
    case "reset-button":
      buttonType = 5;
      break;
  }

  console.log(buttonType);

  if (buttonType !== 0) {
    fetch("/getGold", {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        _id,
        buttonType
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      goldDisplay.innerText = +goldDisplay.innerText + +data.gold;
    });  
  }
});