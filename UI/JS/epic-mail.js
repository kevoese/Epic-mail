const validClr = "var(--myPurple)";
const invalidClr = "rgba(21, 11, 90, 0.4)";
const inputs = document.querySelectorAll("input");

let required = {
  name: /^\w+$/,
  email: /^\w+@epicmail.com$/i,
  password: /^[\w@.]{7,20}$/
};

const isValid = (name, value) => {
  if (required[name].test(value)) return true;
  else return false;
};

inputs.forEach(input => {
  input.addEventListener("keyup", event => {
    let validate = isValid(event.target.id, event.target.value);
    if (validate) event.target.parentElement.style.color = validClr;
    else event.target.parentElement.style.color = invalidClr;
  });
});

const backgroundStyle = document.querySelector(".back").style;
const loginStyle = document.querySelector(".Login").style;
const signUp = document.querySelector(".SignUp");
const content = document.querySelector(".pageContent").style;


document.addEventListener("click", event => {
  linkId = event.target.id;
  if (linkId === "signuplink" || linkId === "register") {
    loginStyle.display = "none";
    signUp.classList.add("showsignup");
    backgroundStyle.filter = "blur(10px)";
    content.display = "none";
  } else if (linkId == "loginlink" || linkId == "close") {
    loginStyle.display = "initial";
    signUp.classList.remove("showsignup");
    backgroundStyle.filter = "blur(0px)";
    content.display = "initial";
  }
});
