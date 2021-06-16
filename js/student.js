const book_form = document.getElementById("books-table");
const send_button = document.getElementById("send_button");

let is_empty = true;

function SendBooks(e){
    e.preventDefault()
    const taken_books_checks = document.querySelectorAll(".student-books__checkbox:checked");
    const taken_books_id = [];
    for (let i = 0; i<taken_books_checks.length; i++){
        taken_books_id.push(taken_books_checks[i].value)
    }
    const id = localStorage.getItem("id");
    const taken_books = taken_books_id.map((book_id) => {
        return {
            book_id: Number(book_id),
            child_id: Number(id)
        }
    });
    fetch("/api/library/update_child_books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "jwt": localStorage.getItem("jwt")
        },
        body: JSON.stringify(taken_books)
    })
        .then((res) => {
            if (!res.ok) alert("Ошибка обновления списка учебников");
            else alert('Список учебников успешно обновлён');
        })
}

function CreateBooksRow(id, title, taken){
    const row = document.createElement("tr");
    row.className = "col"
    row.innerHTML = `<td>${title}</td><td><input type="checkbox" class="student-books__checkbox" value="${id}" ${taken ? "checked" : null}></td>`;
    if (taken) is_empty = false;
    book_form.appendChild(row);
}

fetch("/api/library/get_child_books", {
    method:"POST",
    headers:{
        "Content-Type": "application/json",
        "jwt": localStorage.getItem("jwt")
    }
})
.then((res) => {
    if (res.ok){
        res.json()
            .then((res) => {
                res.forEach(({book_id, book_title, is_taken}) =>{
                    CreateBooksRow(book_id, book_title, is_taken);
                })
            })
    } else {
        alert('Ошибка загрузки списка учебников');
    }
})

const site = document.getElementById("web-site");
site.addEventListener("click", () => {
    window.location = "https://www.lit.msu.ru/"
})


send_button.addEventListener("click", (e) => SendBooks(e));