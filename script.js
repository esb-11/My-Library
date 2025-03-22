let myLibrary = [];
const newBookButton = document.querySelector(".new-book");
const newBookDialog = document.querySelector("#new-book-dialog");
const dialogConfirmButton = document.querySelector(".confirm-dialog") 
const newBookForm = document.querySelector("#new-book-form");
const cancelDialogButton = document.querySelector(".cancel-dialog");

cancelDialogButton.addEventListener("click", (e) => {
    newBookForm.reset();
    newBookDialog.close();
});

newBookButton.addEventListener("click", () => {
    newBookDialog.show();
});

newBookDialog.addEventListener("close", (e) => {
    event.preventDefault();
    newBookForm.reset();
    newBookDialog.close();
});

newBookForm.addEventListener("submit", (e) => {
    event.preventDefault();
    const formResult = newBookForm.elements;
    let title = formResult['title'].value;
    let author = formResult['author'].value;
    let pages = formResult['pages'].value;
    let read = (formResult['read-yes'] == true) ? "Yes" : "No";
    if ([title, author, pages].includes('')) {
        return;
    }
    addBookToLibrary(title, author, pages, read);
    newBookDialog.close();
});

function Book(title, author, pages, read) {
  // the constructor...
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function() {
    let message = `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
    return message;
}

Book.prototype.changeRead = function() {
    this.read = (this.read == "No") ? "Yes" : "No";
}

function addBookToLibrary(title, author, pages, read) {
  // take params, create a book then store it in the array
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  displayLibrary();
}

function displayLibrary() {
    // Iterate over myLybrary, turn each item into a table row
    const libraryTable = document.createElement("table");
    libraryTable.appendChild(makeTableHeader());

    myLibrary.forEach((book) => {
        const bookRow = makeTableRow(book);
        libraryTable.appendChild(bookRow);
    });

    const div = document.querySelector(".library-table");
    if (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }
    div.appendChild(libraryTable);
}

function makeTableRow(book) {
    const row = document.createElement("tr");
    for (const property in book) {
        // Do not show book id or object methods
        if ((book[property] instanceof Function) || property == "id") {
            continue;
        }
        const data = document.createElement("td");
        data.innerText = book[property];

        if (property == "read") {
            data.addEventListener("click", (e) => {
                book.changeRead();
                displayLibrary();
            });
        }

        row.appendChild(data);
    }

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", (e) => {
        const newLibrary = [];
        myLibrary.forEach((b) => {
            if (!(b.id == book.id)) {
                newLibrary.push(b);
            }
        });
        myLibrary = newLibrary;
        displayLibrary();
    });
    row.append(deleteButton);

    return row;
}

function makeTableHeader() {
    let headerContent = ["Title", "Author", "Pages", "Read"];
    const row = document.createElement("tr");
    headerContent.forEach((item) => {
        const header = document.createElement("th");
        header.innerText = item;
        row.appendChild(header);
    });
    return row;
}
