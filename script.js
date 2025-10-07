class Book {
    constructor(id, author, title, numberOfPages, hasBeenRead) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.numberOfPages = numberOfPages;
        this.hasBeenRead = hasBeenRead
    }

    toggleRead() {
        this.hasBeenRead = !this.hasBeenRead;
    }
}

class Library {
    #books = [];

    addBookToLibrary(author, title, numberOfPages, hasBeenRead) {
        let id = crypto.randomUUID();
        const book = new Book(id, author, title, numberOfPages, hasBeenRead);
        this.#books.push(book);
    }

    removeBookById(id) {
        const index = this.#books.findIndex(book => book.id === id);
        if (index !== -1) {
            this.#books.splice(index, 1);
        }
    }

    toggleRead(id) {
        const book = this.#books.find(book => book.id === id);
        if (book) {
            book.toggleRead();
        }
    }

    get books() {
        return [...this.#books];
    }
}

const library = new Library();

function displayBooks(library) {
    const tbody = document.querySelector("#libraryTable tbody");
    tbody.innerHTML = "";

    library.books.forEach(book => {
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
            library.removeBookById(id);
            displayBooks(library);
        });
    });

    const toggleButtons = document.querySelectorAll(".toggleReadBtn");
    toggleButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            library.toggleRead(id);
            displayBooks(library);
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

  library.addBookToLibrary(author, title, pages, hasBeenRead);
  displayBooks(library);

  newBookForm.reset();
  newBookDialog.close();
});

cancelBtn.addEventListener("click", () => {
    newBookDialog.close();
});