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

    const author = document.getElementById("authorInput");
    const title = document.getElementById("titleInput");
    const pages = document.getElementById("pagesInput");
    const read = document.getElementById("readInput");
    console.log('validating form');

    if (author.validity.valueMissing) {
        console.log("author is missing");
        author.setCustomValidity("The author name must be filled!");
    } else {
        author.setCustomValidity("");
    }

    if (title.validity.valueMissing) {
        title.setCustomValidity("The book title must be filled!");
    } else {
        title.setCustomValidity("");
    }

    if (pages.validity.valueMissing) {
        pages.setCustomValidity("The number of pages must be filled!");
    } else if (pages.validity.rangeUnderflow) {
        pages.setCustomValidity("The number of pages must be at least 1!");
    } else {
        pages.setCustomValidity("");
    }

    if (!newBookForm.reportValidity()) {
        return;
    }

    library.addBookToLibrary(author.value, title.value, parseInt(pages.value), read.checked);
    displayBooks(library);

    newBookForm.reset();
    newBookDialog.close();
});

cancelBtn.addEventListener("click", () => {
    newBookDialog.close();
});