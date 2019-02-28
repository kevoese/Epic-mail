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

const registerBtn = document.querySelector(".register");
const backgroundStyle = document.querySelector(".backgnd").style;
const loginStyle = document.querySelector(".Login").style;
const signUpStyle = document.querySelector(".SignUp").style;
const content = document.querySelector(".pageContent").style;
const close = document.querySelector(".close");

registerBtn.addEventListener("click", event => {
  loginStyle.display = "none";
  signUpStyle.transform = "scale(1)";
  signUpStyle.opacity = "1";
  backgroundStyle.filter = "blur(10px)";
  content.display = "none";
});

close.addEventListener("click", event => {
  loginStyle.display = "initial";
  signUpStyle.transform = "scale(0)";
  signUpStyle.opacity = "0";
  backgroundStyle.filter = "blur(0px)";
  content.display = "initial";
});
