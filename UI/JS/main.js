const messageBtns = document.querySelector(".msgbuttons");

messageBtns.addEventListener("click", event => {
  let btnType = event.target.id;
  if (btnType == "allbutton") messageContainer.style.left = "0";
  else if (btnType == "sentbutton") messageContainer.style.left = "-100%";
  else if (btnType == "draftbutton") messageContainer.style.left = "-200%";
});
