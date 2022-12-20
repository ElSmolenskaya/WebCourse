$(function () {
    var addButton = $("#add-button");
    var newTodoTextInput = $("#new-todo-text");
    var todoList = $("#todo-list");
    var form = $("#form");

    form.submit(function (e) {
        e.preventDefault();
    });

    addButton.click(function () {
        var newTodoText = newTodoTextInput.val().trim();
        newTodoTextInput.removeClass("invalid");

        if (newTodoText.length === 0) {
            newTodoTextInput.addClass("invalid");

            return;
        }

        function setEditMode() {
            todoItem.html("<input class='edit-todo-item' type='text'>\
                <button class = 'save-button' type = 'button'>Save</button>\
                <button class = 'cancel-button' type = 'button'>Cancel</button>\
                <div class='error-message'>Field is required</div>");

            var editTodoTextInput = todoItem.find(".edit-todo-item");
            editTodoTextInput.val(newTodoText);

            todoItem.find(".cancel-button").click(function () {
                setViewMode();
            });

            var saveButton = todoItem.find(".save-button");

            saveButton.click(function () {
                var editedTodoText = editTodoTextInput.val().trim();

                editTodoTextInput.removeClass(".invalid");

                if (editedTodoText.length === 0) {
                    editTodoTextInput.addClass("invalid");

                    return;
                }

                newTodoText = editedTodoText;

                setViewMode();
            });

            editTodoTextInput.keyup(function (event) {
                if (event.keyCode === 13) {
                    saveButton.click();
                }
            });
        }

        function setViewMode() {
            todoItem.html("<span class = 'todo-item-text'></span>\
            <button class = 'edit-button' type = 'button'>Edit</button>\
            <button class = 'delete-button' type = 'button'>Delete</button>");

            todoItem.find(".todo-item-text").text(newTodoText);

            todoItem.find(".delete-button").click(function () {
                todoItem.remove();
            });

            todoItem.find(".edit-button").click(function () {
                setEditMode();
            });
        }

        var todoItem = $("<li>").addClass("todo-item");

        setViewMode();

        todoList.append(todoItem);

        newTodoTextInput.val("");
    });
});