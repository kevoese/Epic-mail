/* eslint-disable no-undef */
const messageBtns = document.querySelector('.msgbuttons');
const checkbox = document.querySelector('.checkbox');

messageBtns.addEventListener('click', (event) => {
  const btnType = event.target.id;
  if (btnType === 'allbutton') {
    messageContainer.style.left = '0';
    unhide(checkbox);
  } else if (btnType === 'sentbutton') {
    messageContainer.style.left = '-100%';
    hide(checkbox);
  } else if (btnType === 'draftbutton') {
    messageContainer.style.left = '-200%';
    hide(checkbox);
  }
});
