form_el = document.querySelector("#id_form");
form_el.addEventListener('submit', async function (e) {
    const data = [];
    const files = e.target.file.files;
    if (files.length != 0) {
        for (const single_file of files) {
            data.push('file', single_file)
        }
    }
});
