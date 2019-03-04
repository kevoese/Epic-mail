const messageContainer = document.querySelector(".msgcontain");
const hideCompose = document.querySelector(".cutmsg");
const composeBtns = document.querySelector(".groupcontent");
const newMsg = document.querySelector(".composewrapper");
const inboxes = document.querySelector(".thread");
const inboxList = document.querySelector(".inbox");
const slider = document.querySelector(".show");
const navIcon = document.querySelector(".menu");
const menuList = document.querySelector(".navmenu");

composeBtns.addEventListener("click", event => {
  newMsg.style.display = "block";
  inboxes.style.display = "none";
});

hideCompose.addEventListener("click", event => {
  newMsg.style.display = "none";
  inboxes.style.display = "block";
});

slider.addEventListener("click", event => {
  let status = event.target.id;

  if (status == "close") {
    inboxList.classList.add("open");
    event.target.id = "open";
  } else {
    inboxList.classList.remove("open");
    event.target.id = "close";
  }
});

navIcon.addEventListener("click", event => {
  let status = event.target.id;

  if (status == "navhide") {
    menuList.style.transform = "scale(1)";
    event.target.id = "navshow";
  } else {
    menuList.style.transform = "scale(0)";
    event.target.id = "navhide";
  }
});
