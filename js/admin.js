const students = document.getElementById("students");
const teachers = document.getElementById("teachers");
const books = document.getElementById("books");
const add_book_form = document.getElementById("add_book");
const add_teacher_form = document.getElementById("add_teacher");
const add_student_form = document.getElementById("add_student");
const change_year = document.getElementById("change_year_end");

CreateBooksTable();
add_teacher_form.addEventListener('submit', (e) => CreateTeacher(e));
add_student_form.addEventListener('submit', (e) => CreateStudent(e));
change_year.addEventListener("change", ChangeYear);

fetch("/api/library/year_is_ended", {
    method: "POST"
})
    .then((res) => {
        if (res.ok){
            res.json()
                .then(({is_ending}) => change_year.checked = is_ending);
        } else alert("Ошибка определения конца года");
    });


function ChangeYear(){
    fetch("/api/library/toggle_year", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "jwt": localStorage.getItem("jwt")
        }
    })
        .then((res) => {
            if (!res.ok) alert("Ошибка переключения конца года");
        })
}

function DeleteBook(context){
    const id = Number(context.dataset.key);
    fetch("/api/library/delete_book",{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "jwt": localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            id: id
        })
    })
        .then((res) => {
            if (res.ok) {
                CreateBooksTable();
            } else {
                alert("Ошибка удаления книги")
            }
        })
}

function CreateBookRow(title, id){
    const row = document.createElement("tr");
    row.className = "col";
    row.innerHTML = `<td class="text-truncate">${title}</td>
    <td>
        <i class="far fa-trash-alt delete" data-key="${id}" onclick="DeleteBook(this)"></i>
    </td>`;
    books.appendChild(row);
}

function CreateBooksTable() {
    books.innerHTML = `<tr class="col">
                        <th scope="col">Книги</th>
                        <th class='del'></th>
                    </tr>`
    fetch('/api/library/get_books', { method: "POST" })
        .then((result) => {
            if (result.ok) {
                result.json()
                    .then((res) => res.forEach(({title, id}) => CreateBookRow(title, id)))
            } else {
                alert('Ошибка при загрузке книг');
            }
        });
}

function AddBook(e){
    e.preventDefault();
    const book_input = document.getElementById('book_title');
    const book_button = document.getElementById('add_book_button');
    const book_title = book_input.value;

    book_input.disabled = true;
    book_button.disabled = true;

    book_input.value = "";

    fetch("/api/library/add_book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "jwt": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            title: book_title
        })
    })
        .then((res) => {
            if (res.ok) {
                book_input.disabled = false;
                book_button.disabled = false;
                CreateBooksTable();
            } else {
                alert('ошибка при добавлении книги');
                book_input.disabled = false;
                book_button.disabled = false;
            }
        });
}

function CreateTeacher(e) {
    e.preventDefault();
    const login_input = document.getElementById("teacher-login");
    const login = login_input.value;
    const password_input = document.getElementById('teacher-password');
    const password = password_input.value;

    login_input.value = null;
    password_input.value = null;

    fetch('/api/users/create_teacher', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            jwt: localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            name: login,
            last_name: login,
            very_last_name: login,
            login: login,
            pass: password
        })
    })
        .then((res) => {
            if (res.ok) alert(`Создан учитель с логином ${ login } и паролем ${ password }`);
            else alert('Ошибка при создании учителя');
        });
}

function  CreateStudent(e) {
    e.preventDefault();

    const login_input = document.getElementById('student-login');
    const login = login_input.value;
    const class_input = document.getElementById('class-select');
    const class_id = Number(class_input.value);
    const password_input = document.getElementById('student-password');
    const password = password_input.value;

    login_input.value = null;
    class_input.value = 1;
    password_input.value = null;

    fetch('/api/users/create_child', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            jwt: localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            instance: {
                name: login,
                last_name: login,
                very_last_name: login,
                login: login,
                pass: password
            },
            class_id: class_id
        })
    })
        .then((res) => {
            if (res.ok) alert(`Создан ученик с логином ${ login } и паролем ${ password }`);
            else alert('Ошибка при создании уеника');
        });
}

const site = document.getElementById("web-site");

site.addEventListener("click", () => {
    window.location = "https://www.lit.msu.ru/"
});
add_book_form.addEventListener('submit', (e) => AddBook(e));


