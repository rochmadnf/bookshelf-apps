const addBtn = document.getElementById('add-book');
const backBtn = document.getElementById('back-btn');
const listBook = document.getElementById('books-section');
const allBooks = document.getElementById('all-books');
const completedBooks = document.getElementById('completed-books');
const notCompletedBooks = document.getElementById('not-completed-books');
const booksSection = document.getElementById('books-section');
const searchBook = document.getElementById('search-btn');

const confirmAlert = () => {
  return Swal.fire({
    title: 'Apakah anda yakin?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Saya Yakin!',
    cancelButtonText: 'Tidak',
  });
}

const listInput = [
  {
    'name': 'title',
    'label': 'Judul',
  },
  {
    'name': 'author',
    'label': 'Penulis',
  },
  {
    'name': 'year',
    'label': 'Tahun',
    'type': 'number',
    'min': 1000,
    'max': new Date().getFullYear(),
  },
];

let number = 1;

let componentInput = ``;
listInput.forEach((input, index) => componentInput += `<div class="form-group">
<label for="${input.name}" class="form-label">${input.label}</label>
<input type="${input.type ?? 'text'}" id="${input.name}" name="${input.name}" class="form-input" tabindex="${++index}" required="required" min="${input.min ?? ""}" max="${input.max ?? ""}" />
</div>`)

const newForm = document.createElement('form');
newForm.classList.add("my-5");
newForm.setAttribute('onsubmit', "addBook(this, event)");
newForm.innerHTML = `<div class="row">
                      ${componentInput}
                      <div class="form-group flex items-center gap-2">
                        <label for="isComplete" class="form-label cursor-pointer">Selesai dibaca</label>
                        <input type="checkbox" id="isComplete" name="isComplete" onclick="complete(this)" class="form-checkbox" tabindex="4" />
                      </div>
                      <div class="form-group">
                        <button class="btn-submit" type="submit">Masukkan Buku ke rak <span class="text-white" id="rack">Belum selesai dibaca</span</button>
                      </div>
                    </div>`;

addBtn.addEventListener('click', (e) => {
  document.querySelector('.tabs').style.visibility = "hidden";
  document.querySelector('.search').parentElement.style.display = 'none';
  addBtn.style.display = "none";
  listBook.style.display = "none";
  backBtn.style.display = "flex";

  document.querySelector('.card-body').appendChild(newForm);
  newForm.reset();
  document.querySelector('#title').focus();
});

backBtn.addEventListener('click', (e) => {
  document.querySelector('.tabs').style.visibility = null;
  document.querySelector('.search').parentElement.style.display = null;
  addBtn.style.display = "flex";
  backBtn.style.display = "none";
  listBook.style.display = null;
  document.querySelector("form").remove();
});

allBooks.addEventListener('click', (e) => {
  setActiveTab(e.target, 'all');
  renderBooks(JSON.parse(localStorage.getItem("books")));
})

completedBooks.addEventListener('click', (e) => {
  setActiveTab(e.target, 'done');
  renderBooks(JSON.parse(localStorage.getItem("books")).filter(book => book.isComplete == true));
})

notCompletedBooks.addEventListener('click', (e) => {
  setActiveTab(e.target, 'progress');
  renderBooks(JSON.parse(localStorage.getItem("books")).filter(book => book.isComplete == false));
})

searchBook.addEventListener('click', (e) => {
  const keyword = e.target.previousElementSibling.value;
  if (keyword.length < 3) {
    Swal.fire({
      icon: 'error',
      title: 'Galat',
      text: 'Kata kunci minimal 3 karakter',
      showConfirmButton: false,
      timer: 1500,
    })
  }
  else {
    const tab = booksSection.getAttribute('data-tab');
    const books = JSON.parse(localStorage.getItem("books"));
    if (e.target.getAttribute('data-method') == 'search') {
      e.target.innerText = 'X';
      e.target.setAttribute('data-method', 'reset');
      e.target.classList.remove('btn-search');
      e.target.classList.add('btn-danger');
      switch (tab) {
        case 'all':
          renderBooks(books.filter(book => book.title.toLowerCase().includes(keyword)));
          break;
        case 'done':
          renderBooks(books.filter(book => book.title.toLowerCase().includes(keyword)).filter(book => book.isComplete === true));
          break;
        default:
          renderBooks(books.filter(book => book.title.toLowerCase().includes(keyword)).filter(book => book.isComplete === false));
          break;
      }
    }
    else {
      resetSearchButton();
      e.target.previousElementSibling.focus();
      switch (tab) {
        case 'all':
          allBooks.dispatchEvent(new Event('click'));
          break;
        case 'done':
          completedBooks.dispatchEvent(new Event('click'));
          break;
        default:
          notCompletedBooks.dispatchEvent(new Event('click'));
          break;
      }
    }
  }
})

function resetSearchButton() {
  searchBook.innerHTML = 'Cari';
  searchBook.previousElementSibling.value = '';
  searchBook.setAttribute('data-method', 'search');
  searchBook.classList.add('btn-search');
  searchBook.classList.remove('btn-danger');
}

function setActiveTab(element, tab) {
  const activeTab = document.querySelector('.tab.active');
  booksSection.setAttribute('data-tab', tab);
  resetSearchButton();

  if (Boolean(activeTab)) {
    activeTab.classList.remove('active');
  }
  element.classList.add("active");
}

function complete(element) {
  if (element.checked) {
    document.getElementById('rack').innerText = "Selesai dibaca";
  } else {
    document.getElementById('rack').innerText = "Belum selesai dibaca";
  }
}

function addBook(el, ev) {
  ev.preventDefault();
  confirmAlert().then((result) => {
    if (result.isConfirmed) {
      const book = new FormData(el);
      let books = JSON.parse(localStorage.getItem("books"));

      books.unshift({
        id: new Date().getTime(),
        title: book.get('title'),
        author: book.get('author'),
        year: Number(book.get('year')),
        isComplete: Boolean(book.get('isComplete')),
      });

      localStorage.setItem("books", JSON.stringify(books));
      backBtn.dispatchEvent(new Event('click'));
      allBooks.dispatchEvent(new Event('click'));

      Swal.fire('Berhasil', 'Buku berhasil dimasukkan ke rak', 'success')
    }
  })
}

function isCompleted(el) {
  const books = JSON.parse(localStorage.getItem("books"));
  const indexBook = books.findIndex(book => book.id === Number(el.parentElement.getAttribute('data-id')));
  books[indexBook].isComplete = !books[indexBook].isComplete;
  localStorage.setItem("books", JSON.stringify(books));
  if (booksSection.getAttribute('data-tab') == 'all') {
    renderBooks(books)
  } else {
    renderBooks(books.filter(book => book.isComplete === !books[indexBook].isComplete))
  }
}

function deleteBook(el) {
  confirmAlert().then((result) => {
    if (result.isConfirmed) {
      el.parentElement.parentElement.remove();
      const books = JSON.parse(localStorage.getItem("books"));
      let filterBooks = books.filter(book => book.id !== Number(el.parentElement.getAttribute('data-id')));
      localStorage.setItem("books", JSON.stringify(filterBooks));
      renderBooks(filterBooks, booksSection.getAttribute('data-tab'));
    }
  });
}

function renderBooks(data) {
  booksSection.innerHTML = '';
  if (data.length > 0) {
    data.forEach(book => {
      const dataBook = document.createElement("div");
      if (book.isComplete) {
        dataBook.classList.add('data-book', 'completed');
      } else {
        dataBook.classList.add('data-book', 'not-completed');
      }
      dataBook.innerHTML = `
                <div class="detail">
                  <h1 class="text-2xl font-bold text-gray-900">${book.title}</h1>
                  <h3 class="text-base font-normal text-gray-800">${book.author}</h3>
                  <h5 class="text-sm font-bold text-gray-800">${book.year}</h3>
                </div>
                <div class="buttons" data-id="${book.id}">
                  <button title="${(book.isComplete) ? 'Belum selesai dibaca' : 'Selesai dibaca'}" class="btn ${(book.isComplete) ? 'btn-warning' : 'btn-success'}" onclick="isCompleted(this)">
                    <i class="${(book.isComplete) ? 'ph-circle-notch-bold' : 'ph-check-bold'} text-xl"></i>
                  </button>
                  <button title="Hapus" class="btn btn-danger" onclick="deleteBook(this)">
                    <i class="ph-trash-bold text-xl"></i>
                  </button>
                </div>`;
      booksSection.appendChild(dataBook);
    });
  } else {
    booksSection.innerHTML = `<div class="bg-gray-800 text-slate-50 py-1 px-4 rounded-full">Belum ada buku yang terdaftar.</div>`;
  }
}

window.addEventListener("load", function () {
  if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("books") === null) {
      localStorage.setItem("books", JSON.stringify([]));
    }
    allBooks.dispatchEvent(new Event('click'));
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage")
  }
});