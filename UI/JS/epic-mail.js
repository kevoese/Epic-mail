/* eslint-disable no-undef */
const validClr = 'var(--myColor)';
const invalidClr = 'var(--myLightcolor)';
const inputs = main.querySelectorAll('input');

const regHere = document.querySelector('.regHere');
const regbtn = document.querySelector('.regbtn');
const logHere = document.querySelector('.logHere');
const logbtn = document.querySelector('.logbtn');
const slider = document.querySelector('.slider');
const mobileLogin = document.querySelector('.mobilelog');
const mobileReg = document.querySelector('.mobilereg');
const loginForm = document.querySelector('.Login');
const signupForm = document.querySelector('.SignUp');
const contactlink = document.querySelector('#contactlink');
const closebox = document.querySelector('.closebox');
const closereset = document.querySelector('.closereset');
const forgetP = document.querySelector('.forgetp');

const mediaBreakpoint1 = window.matchMedia('screen and (min-width: 900px)');
mediaBreakpoint1.addListener(() => {
  if (mediaBreakpoint1.matches) {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'flex';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
  }
});

const required = {
  name: /^[\w]{3,20}$/,
  email: /^\w+@[\w]{2,20}.[a-z]{2,5}$/i,
  password: /^[\w@.]{7,20}$/,
};

const isValid = (name, value) => {
  if (required[name].test(value)) return true;
  return false;
};

inputs.forEach((input) => {
  input.addEventListener('keyup', (event) => {
    const thisInput = event.target;
    const inputWrap = thisInput.parentElement;
    if (checkclass(inputWrap, 'wrongemail')) inputWrap.classList.remove('wrongemail');
    if (checkclass(buttons[0], 'hideElement')) {
      buttons.forEach(button => unhide(button));
      const errormsg = inputWrap.parentElement.querySelector('.invalid');
      hide(errormsg);
    }
    const validate = isValid(thisInput.getAttribute('testP'), thisInput.value);
    if (validate) inputWrap.style.color = validClr;
    else inputWrap.style.color = invalidClr;
  });
});


const backgroundStyle = document.querySelector('.back').style;
const formWrap = document.querySelector('.formswrap');
const content = document.querySelector('.pageContent');
const footer = document.querySelector('footer');
const navbar = document.querySelector('nav');

document.addEventListener('click', (event) => {
  const linkId = event.target.id;
  if (linkId === 'register') {
    formWrap.classList.add('showform');
    backgroundStyle.filter = 'blur(10px)';
    hide(content);
    hide(footer);
    hide(navbar);
  } else if (linkId === 'close') {
    formWrap.classList.remove('showform');
    backgroundStyle.filter = 'grayscale(50%)';
    unhide(content);
    unhide(footer);
    unhide(navbar);
  }
});

regbtn.addEventListener('click', () => {
  slider.classList.remove('moveleft');
  slider.classList.add('moveright');
  unhide(logHere);
  hide(regHere);
});

logbtn.addEventListener('click', () => {
  slider.classList.remove('moveright');
  slider.classList.add('moveleft');
  unhide(regHere);
  hide(logHere);
});

mobileLogin.addEventListener('click', () => {
  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';
});

mobileReg.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'flex';
});

contactlink.addEventListener('click', () => {
  document.querySelector('.contactdialog').showModal();
});

closebox.addEventListener('click', () => {
  document.querySelector('.contactdialog').close();
});

forgetP.addEventListener('click', () => {
  document.querySelector('.resetPass').showModal();
});

closereset.addEventListener('click', () => {
  addClass(resetPasswordForm, 'hideElement');
  addClass(resetMethodForm, 'hideElement');
  removeClass(resetUsernameForm, 'hideElement');
  document.querySelector('.resetPass').close();
});
