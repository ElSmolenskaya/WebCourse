document.addEventListener("DOMContentLoaded", function () {
    var addButton = document.getElementById("add-button");
    var newTodoTextInput = document.getElementById("new-todo-text");
    var todoList = document.getElementById("todo-list");
    var form = document.getElementById("form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    addButton.addEventListener("click", function () {
        var newTodoText = newTodoTextInput.value.trim();
        newTodoTextInput.classList.remove("invalid");

        if (newTodoText.length === 0) {
            newTodoTextInput.classList.add("invalid");

            return;
        }

        function setEditMode() {
            todoItem.innerHTML = "<div class='todo-text-line'><div><input class='edit-todo-item' type='text'>\
                <div class='error-message'>Field is required</div></div>\
                <button class='save-button' type='button'>Save</button>\
                <button class='cancel-button' type='button'>Cancel</button></div>";

            var editTodoTextInput = todoItem.querySelector(".edit-todo-item");
            editTodoTextInput.value = newTodoText;

            todoItem.querySelector(".cancel-button").addEventListener("click", function () {
                setViewMode();
            });

            var saveButton = todoItem.querySelector(".save-button");

            saveButton.addEventListener("click", function () {
                var editedTodoText = editTodoTextInput.value.trim();

                editTodoTextInput.classList.remove("invalid");

                if (editedTodoText.length === 0) {
                    editTodoTextInput.classList.add("invalid");

                    return;
                }

                newTodoText = editedTodoText;

                setViewMode();
            });

            editTodoTextInput.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    saveButton.click();
                }
            });
        }

        function setViewMode() {
            todoItem.innerHTML = "<div class='todo-text-line'><span class='todo-item-text'></span>\
                <button class='edit-button' type='button'>Edit</button>\
                <button class='delete-button' type='button'>Delete</button></div>";

            todoItem.querySelector(".todo-item-text").textContent = newTodoText;

            todoItem.querySelector(".delete-button").addEventListener("click", function () {
                todoItem.remove();
            });

            todoItem.querySelector(".edit-button").addEventListener("click", function () {
                setEditMode();
            });
        }

        var todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");

        setViewMode();

        todoList.appendChild(todoItem);

        newTodoTextInput.value = "";
    });
});