// init variable
const addBtn = document.getElementById('add-book');
const backBtn = document.getElementById('back-btn');

addBtn.addEventListener('click', (e) => {
  document.querySelector('.tabs').style.visibility = "hidden";
  addBtn.style.display = "none";
  backBtn.style.display = "flex";
});

backBtn.addEventListener('click', (e) => {
  document.querySelector('.tabs').style.visibility = null;
  addBtn.style.display = "flex";
  backBtn.style.display = "none";
});
