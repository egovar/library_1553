const table = document.getElementById("books-tbody");
const assigned_books_form = document.getElementById('assigned_books');

function CreateTableRow(title, id){
    const row = document.createElement("tr");
    row.className = "col";
    row.innerHTML = `<td class="table__list">${title}</td>`
    for (let i = 1; i <= 18; i++) {
        row.innerHTML += `<td>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" data-class="${i}" data-book="${id}">
                            </div>
                        </td>`;
    }
    table.appendChild(row);
}

assigned_books_form.addEventListener('submit', (e) => AssignBooks(e));

fetch("/api/library/get_books", {
    method: "POST"
})
    .then((res) => {
        if (res.ok){
            res.json()
                .then((res) => {
                    res.forEach(({title, id}) => CreateTableRow(title, id))
                })
                .then(() => CheckAssignedBooks())
        } else {
            alert("Ошибка загрузки списка книг");
        }
    })



function CheckAssignedBooks() {
    fetch('/api/library/get_teacher_books', {
        method: "POST",
        headers: {
            jwt: localStorage.getItem('jwt')
        }
    })
        .then((res) => {
            if (res.ok) {
                res.json()
                    .then((res) => {
                        const assigned_books = res.filter(({is_asigned}) => is_asigned === true);
                        assigned_books.forEach(({class_id, book_id}) => {
                            document.querySelector(`.form-check-input[data-class="${class_id}"][data-book="${book_id}"]`)
                                .checked = true;
                        })
                    })
            } else {
                alert('Ошибка загрузки списка назначенных книг')
            }
        })
}

function AssignBooks(e) {
    e.preventDefault();
    const assigned_books_checks = document.querySelectorAll('.form-check-input:checked');
    const assigned_books = [];
    for (let i = 0; i < assigned_books_checks.length; i++) {
        assigned_books.push({
            book_id: Number(assigned_books_checks[i].dataset.book),
            class_id: Number(assigned_books_checks[i].dataset.class)
        });
    }
    fetch('/api/library/update_teacher_books', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            jwt: localStorage.getItem('jwt')
        },
        body: JSON.stringify(assigned_books)
    })
        .then((res) => {
            if (res.ok) {
                alert('Учебники успешно назначены');
            } else {
                alert('Ошибка назначения учебников');
            }
        })
}

const site = document.getElementById("web-site");
site.addEventListener("click", () => {
    window.location = "https://www.lit.msu.ru/"
})

