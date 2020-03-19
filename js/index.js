let currentUser;


document.addEventListener("DOMContentLoaded", function () {
    fetchBooks();

    fetch("http://localhost:3000/users/1")
        .then(function (response) {
            return response.json();
        })
        .then(function (user) {
            currentUser = user;
        });
});

document.addEventListener("click", function (event) {
    if (event.target.className === "list book") {
        fetchOneBook(event.target);
    } else if (event.target.className === "bttn") {
        showUsers(event.target);
    } else if (event.target.className === "bttn-read-user") {
        validateUser(event.target);
    }
});

const fetchBooks = function () {
    fetch("http://localhost:3000/books")
        .then(function (response) {
            return response.json();
        })
        .then(function (books) {
            displayBooks(books);
        });
};

function displayBooks(books) {
    let ul = document.getElementById("list");
    books.forEach(function (book) {
        ul.innerHTML += `
        <li class="list book" data-book-id=${book.id}>${book.title}</li>
        `;
    });
}

function fetchOneBook(click) {
    fetch(`http://localhost:3000/books/${click.dataset.bookId}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (book) {
            displayOneBook(book);
        });
}

function displayOneBook(book) {
    let div = document.getElementById("show-panel");

    div.innerHTML = `
    <h3>${book.title}</h3>
    <div>
    <img src=${book.img_url}/>>
    </div >
    <p>${book.description}</p>
    <div id="div-users"></div>
    <button class="bttn" data-book-id=${book.id}>Read Book</button>
        `;

    let divUsers = document.getElementById("div-users");
    divUsers.style.display = "none";

    book.users.forEach(function (user) {
        divUsers.innerHTML += `<li>${user.username}</li>`;
    });
};

function showUsers(click) {
    let div = click.parentElement.querySelector("#div-users");
    div.style.display = "inline";

    click.className = "bttn-read-user";
}

function validateUser(click) {
    users = Array.from(click.parentElement.querySelector("#div-users").childNodes);

    const findCurrentUser = function () {
        return users.filter(function (user) {
            return user.innerText === currentUser.username;
        });
    }();

    if (findCurrentUser.length > 0) {
        click.className = "bttn-read-user";
        return alert("You read this already!");
    } else if (findCurrentUser.length === 0) {
        click.className = "bttn";

        let div = click.parentElement.querySelector("#div-users");
        div.innerHTML += `<li>${currentUser.username}</li>`;

        return updateBook(click);
    }
}

function updateBook(click) {
    fetch(`http://localhost:3000/books/${click.dataset.bookId}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (book) {
            updateUserBook(book);
        });
    return showUsers(click);
}

function updateUserBook(book) {

    book.users.push(currentUser);

    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "users": book.users })
    })
        .then(function (response) {
            return response.json();
        });

}