const messageContainer = document.querySelector(".msgcontain");
const messageBtns = document.querySelector(".msgbuttons");
const hideCompose = document.querySelector(".cutmsg");
const composeBtns = document.querySelector(".inboxcontent");
const newMsg = document.querySelector(".composewrapper");
const inboxes = document.querySelector(".thread");

composeBtns.addEventListener("click", event => {
  newMsg.style.display = "block";
  inboxes.style.display = "none";
});

hideCompose.addEventListener("click", event => {
  newMsg.style.display = "none";
  inboxes.style.display = "block";
});

messageBtns.addEventListener("click", event => {
  let btnType = event.target.id;
  console.log(btnType);
  if (btnType == "allbutton") messageContainer.style.left = "0";
  else if (btnType == "sentbutton") messageContainer.style.left = "-100%";
  else if (btnType == "draftbutton") messageContainer.style.left = "-200%";
});
