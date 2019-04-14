const inboxList = document.querySelector('.inbox');
const slider = document.querySelector('.openinbox');
const navIcon = document.querySelector('.menu');
const menuList = document.querySelector('.navmenu');
const modal = document.querySelector('.wrapper');


const inboxCard = (status) => {
  if (status === 'hide') {
    inboxList.classList.remove('open');
    modal.classList.remove('modal');
  } else {
    inboxList.classList.add('open');
    modal.classList.add('modal');
  }
};

slider.addEventListener('click', (event) => {
  const status = event.target.id;
  if (status === 'close') {
    inboxCard('show');
    event.target.id = 'open';
  } else {
    inboxCard('hide');
    event.target.id = 'close';
  }
});

modal.addEventListener('click', (event) => {
  let { target } = event;
  do {
    if (target.id === 'inbox') return;
    if (target.classList.contains('delete')) return;
    if (target.classList.contains('sureDelete')) return;
    if (target.parentElement.classList[0] === ('wrapmsghead')) break;
    target = target.parentNode;
  } while (target.classList.length > 0);
  inboxCard('hide');
});


navIcon.addEventListener('click', (event) => {
  let status = event.target.id;
  console.log('here bro');
  if (status === 'navhide') {
    menuList.style.transform = 'scale(1)';
    event.target.id = 'navshow';
  } else {
    menuList.style.transform = 'scale(0)';
    event.target.id = 'navhide';
  }
});
