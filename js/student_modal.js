const end_of_year_modal = document.getElementById('end-modal');

fetch("/api/library/year_is_ended", {
    method: "POST"
})
    .then((res) => {
        if (res.ok){
            res.json()
                .then(({is_ending}) => {
                    if (is_ending && !is_empty) {
                        end_of_year_modal.classList.toggle('visible')
                    }
                });
        } else alert("Ошибка определения конца года");
    });

document.getElementById('end-close').addEventListener('click', () => end_of_year_modal.classList.toggle('visible'));
document.getElementById('end-got').addEventListener('click', () => end_of_year_modal.classList.toggle('visible'));
