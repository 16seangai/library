const myLibrary = [];

function Book(id, author, title, numberOfPages, hasBeenRead) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.numberOfPages = numberOfPages;
    this.hasBeenRead = hasBeenRead;
}

Book.prototype.toggleRead = function() {
    this.hasBeenRead = !this.hasBeenRead;
}

function addBookToLibrary(author, title, numberOfPages, hasBeenRead) {
    id = crypto.randomUUID()
    const book = new Book(id, author, title, numberOfPages, hasBeenRead);
    myLibrary.push(book);
}

function removeBookById(id) {
    const index = myLibrary.findIndex(book => book.id === id);
    if (index !== -1) {
        myLibrary.splice(index, 1);
    }
}

function displayBooks() {
    const tbody = document.querySelector("#libraryTable tbody");
    tbody.innerHTML = "";

    myLibrary.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.author}</td>
            <td>${book.title}</td>
            <td>${book.numberOfPages}</td>
            <td>${book.hasBeenRead ? "✅" : "❌"}</td>
            <td><button class="removeBtn" data-id="${book.id}">Remove</button></td>
            <td><button class="toggleReadBtn" data-id="${book.id}">Toggle Read</button></td>
        `;

        tbody.appendChild(row);
    });

    const removeButtons = document.querySelectorAll(".removeBtn");
    removeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            removeBookById(id);
            displayBooks();
        });
    });

    const toggleButtons = document.querySelectorAll(".toggleReadBtn");
    toggleButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            const book = myLibrary.find(b => b.id === id);
            if (book) {
                book.toggleRead();
                displayBooks();
            }
        });
    });
}

const newBookDialog = document.getElementById("newBookDialog");
const newBookBtn = document.getElementById("newBookBtn");

newBookBtn.addEventListener("click", () => {
    newBookDialog.showModal();
});

const newBookForm = document.getElementById("newBookForm");
const cancelBtn = document.getElementById("cancelBtn");

newBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

  const author = document.getElementById("authorInput").value;
  const title = document.getElementById("titleInput").value;
  const pages = parseInt(document.getElementById("pagesInput").value, 10);
  const hasBeenRead = document.getElementById("readInput").checked;

  addBookToLibrary(author, title, pages, hasBeenRead);
  displayBooks();

  newBookForm.reset();
  newBookDialog.close();
});

cancelBtn.addEventListener("click", () => {
    newBookDialog.close();
});