/* =====================================================
   ЦВЕТА НОВЫХ ЗАПИСОК
===================================================== */

const noteColors = [
    { background: "#f1d6a8", color: "#665b4d" },
    { background: "#a9c3d4", color: "#ffffff" },
    { background: "#e5a18c", color: "#ffffff" },
    { background: "#b8c9b7", color: "#ffffff" },
    { background: "#d6b4c7", color: "#ffffff" },
    { background: "#c8b9d9", color: "#ffffff" },
    { background: "#e4c98e", color: "#665b4d" },
    { background: "#b7c8d9", color: "#ffffff" }
];


/* =====================================================
   ДОБАВЛЕНИЕ ЗАДАЧИ
===================================================== */

function addTask() {

    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        return;
    }

    const board = document.querySelector(".board");
    const note = document.createElement("div");

    note.className = "note new-note";


    /* СЛУЧАЙНЫЙ ЦВЕТ */

    const randomColor =
        noteColors[
            Math.floor(
                Math.random() * noteColors.length
            )
        ];

    note.style.background = randomColor.background;
    note.style.color = randomColor.color;


    /* ТЕКСТ */

    note.innerHTML = `
        <b>ЗАДАЧА:</b>

        <p>${taskText}</p>

        <button class="complete-note">
            ✓ Виконано
        </button>

        <button class="delete-note">
            ×
        </button>
    `;


    /* СЛУЧАЙНАЯ ПОЗИЦИЯ */

    const maxX = board.clientWidth - 140;
    const maxY = board.clientHeight - 120;

    const x = Math.random() * Math.max(maxX, 0);
    const y = Math.random() * Math.max(maxY, 0);

    note.style.left = x + "px";
    note.style.top = y + "px";


    /* СЛУЧАЙНЫЙ НАКЛОН */

    const rotation =
        Math.random() * 10 - 5;

    note.style.transform =
        `rotate(${rotation}deg)`;


    board.appendChild(note);


    /* =================================================
       УДАЛЕНИЕ
    ================================================= */

    const deleteButton =
        note.querySelector(".delete-note");

    deleteButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            note.remove();

            updateProgress();
        }
    );


    /* =================================================
       ВЫПОЛНЕНО
    ================================================= */

    const completeButton =
        note.querySelector(".complete-note");

    completeButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            note.classList.toggle("completed");

            if (
                note.classList.contains("completed")
            ) {

                completeButton.textContent =
                    "↩ Скасувати";

            } else {

                completeButton.textContent =
                    "✓ Виконано";
            }

            updateProgress();
        }
    );


    /* ПЕРЕТАСКИВАНИЕ */

    makeDraggable(note);


    /* ОЧИСТКА */

    input.value = "";
    input.focus();


    /* ПРОГРЕСС */

    updateProgress();
}


/* =====================================================
   ПРОГРЕСС
===================================================== */

function updateProgress() {

    const tasks =
        document.querySelectorAll(".new-note");

    const completed =
        document.querySelectorAll(
            ".new-note.completed"
        );

    const total = tasks.length;
    const done = completed.length;

    let percent = 0;

    if (total > 0) {
        percent =
            Math.round(
                (done / total) * 100
            );
    }


    /* ПРОЦЕНТ */

    const percentElement =
        document.getElementById(
            "progressPercent"
        );

    if (percentElement) {
        percentElement.textContent =
            percent + "%";
    }


    /* ПОЛОСКА */

    const progressFill =
        document.getElementById(
            "progressFill"
        );

    if (progressFill) {
        progressFill.style.width =
            percent + "%";
    }
}


/* =====================================================
   ПЕРЕТАСКИВАНИЕ
===================================================== */

function makeDraggable(note) {

    let isDragging = false;

    let offsetX = 0;
    let offsetY = 0;


    note.addEventListener(
        "mousedown",
        startDrag
    );


    function startDrag(event) {

        if (
            event.target.classList.contains(
                "delete-note"
            ) ||
            event.target.classList.contains(
                "complete-note"
            )
        ) {
            return;
        }

        isDragging = true;

        const noteRect =
            note.getBoundingClientRect();

        offsetX =
            event.clientX -
            noteRect.left;

        offsetY =
            event.clientY -
            noteRect.top;

        note.style.zIndex = 100;
        note.style.cursor = "grabbing";

        document.addEventListener(
            "mousemove",
            drag
        );

        document.addEventListener(
            "mouseup",
            stopDrag
        );
    }


    function drag(event) {

        if (!isDragging) {
            return;
        }

        const board =
            note.parentElement;

        const boardRect =
            board.getBoundingClientRect();

        let x =
            event.clientX -
            boardRect.left -
            offsetX;

        let y =
            event.clientY -
            boardRect.top -
            offsetY;

        const maxX =
            board.clientWidth -
            note.offsetWidth;

        const maxY =
            board.clientHeight -
            note.offsetHeight;

        x = Math.max(
            0,
            Math.min(x, maxX)
        );

        y = Math.max(
            0,
            Math.min(y, maxY)
        );

        note.style.left =
            x + "px";

        note.style.top =
            y + "px";

        note.style.transform =
            "rotate(0deg)";
    }


    function stopDrag() {

        if (!isDragging) {
            return;
        }

        isDragging = false;

        note.style.cursor = "grab";

        document.removeEventListener(
            "mousemove",
            drag
        );

        document.removeEventListener(
            "mouseup",
            stopDrag
        );
    }
}


/* =====================================================
   КНОПКА ДОБАВИТЬ
===================================================== */

document
    .getElementById("addButton")
    .addEventListener(
        "click",
        addTask
    );


/* =====================================================
   ENTER
===================================================== */

document
    .getElementById("taskInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                addTask();
            }

        }
    );


/* =====================================================
   СТАРЫЕ ЗАПИСКИ
===================================================== */

document
    .querySelectorAll(".note")
    .forEach(function(note) {

        makeDraggable(note);

    });


/* =====================================================
   НАЧАЛЬНЫЙ ПРОГРЕСС
===================================================== */

updateProgress();