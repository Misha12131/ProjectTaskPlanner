/* =====================================================
   ЦВЕТА НОВЫХ ЗАПИСОК
===================================================== */

const noteColors = [
    {
        background: "#f1d6a8",
        color: "#665b4d"
    },
    {
        background: "#a9c3d4",
        color: "#ffffff"
    },
    {
        background: "#e5a18c",
        color: "#ffffff"
    },
    {
        background: "#b8c9b7",
        color: "#ffffff"
    },
    {
        background: "#d6b4c7",
        color: "#ffffff"
    },
    {
        background: "#c8b9d9",
        color: "#ffffff"
    },
    {
        background: "#e4c98e",
        color: "#665b4d"
    },
    {
        background: "#b7c8d9",
        color: "#ffffff"
    }
];


/* =====================================================
   ДОБАВЛЕНИЕ ЗАДАЧИ
===================================================== */

function addTask() {

    const input = document.getElementById("taskInput");

    const taskText = input.value.trim();


    // Если поле пустое
    if (taskText === "") {
        return;
    }


    // Находим доску
    const board = document.querySelector(".board");


    // Создаём записку
    const note = document.createElement("div");

    note.className = "note new-note";


    /* =================================================
       ВЫБИРАЕМ СЛУЧАЙНЫЙ ЦВЕТ
    ================================================= */

    const randomColor =
        noteColors[
            Math.floor(
                Math.random() * noteColors.length
            )
        ];


    note.style.background =
        randomColor.background;

    note.style.color =
        randomColor.color;


    /* =================================================
       ТЕКСТ ЗАПИСКИ
    ================================================= */

    note.innerHTML = `
        <b>ЗАДАЧА:</b>

        <p>${taskText}</p>

        <button class="delete-note">
            ×
        </button>
    `;


    /* =================================================
       СЛУЧАЙНАЯ ПОЗИЦИЯ
    ================================================= */

    const maxX =
        board.clientWidth - 125;

    const maxY =
        board.clientHeight - 105;


    const x =
        Math.random() * maxX;

    const y =
        Math.random() * maxY;


    note.style.left =
        x + "px";

    note.style.top =
        y + "px";


    /* =================================================
       СЛУЧАЙНЫЙ НАКЛОН
    ================================================= */

    const rotation =
        Math.random() * 10 - 5;


    note.style.transform =
        `rotate(${rotation}deg)`;


    /* =================================================
       ДОБАВЛЯЕМ НА ДОСКУ
    ================================================= */

    board.appendChild(note);


    /* =================================================
       КНОПКА УДАЛЕНИЯ
    ================================================= */

    const deleteButton =
        note.querySelector(".delete-note");

    deleteButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            note.remove();

        }
    );


    /* =================================================
       ВКЛЮЧАЕМ ПЕРЕТАСКИВАНИЕ
    ================================================= */

    makeDraggable(note);


    /* =================================================
       ОЧИЩАЕМ ПОЛЕ
    ================================================= */

    input.value = "";

    input.focus();
}


/* =====================================================
   ПЕРЕТАСКИВАНИЕ ЗАПИСКИ
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

        // Если нажали на кнопку удаления
        if (
            event.target.classList.contains(
                "delete-note"
            )
        ) {
            return;
        }


        isDragging = true;


        const board =
            note.parentElement;


        const boardRect =
            board.getBoundingClientRect();


        const noteRect =
            note.getBoundingClientRect();


        offsetX =
            event.clientX -
            noteRect.left;

        offsetY =
            event.clientY -
            noteRect.top;


        // Поднимаем записку наверх
        note.style.zIndex = 100;

        note.style.cursor =
            "grabbing";


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


        /* =============================================
           НЕ ДАЁМ ЗАПИСКЕ ВЫЛЕТЕТЬ ЗА ДОСКУ
        ============================================= */

        const maxX =
            board.clientWidth -
            note.offsetWidth;


        const maxY =
            board.clientHeight -
            note.offsetHeight;


        x =
            Math.max(
                0,
                Math.min(x, maxX)
            );


        y =
            Math.max(
                0,
                Math.min(y, maxY)
            );


        note.style.left =
            x + "px";

        note.style.top =
            y + "px";


        // Убираем rotate во время движения
        note.style.transform =
            "rotate(0deg)";

    }


    function stopDrag() {

        if (!isDragging) {
            return;
        }


        isDragging = false;


        note.style.cursor =
            "grab";


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
   КНОПКА "ДОДАТИ"
===================================================== */

document
    .getElementById("addButton")
    .addEventListener(
        "click",
        addTask
    );


/* =====================================================
   ENTER = ДОБАВИТЬ
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
   ДЕЛАЕМ СТАРЫЕ ЗАПИСКИ ПЕРЕТАСКИВАЕМЫМИ
===================================================== */

document
    .querySelectorAll(".note")
    .forEach(function(note) {

        makeDraggable(note);

    });