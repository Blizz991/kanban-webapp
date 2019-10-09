//Used for prototyping (User tests)
// function postTask(modalId) {
//     let modalEl = $(modalId);
//     let modalInstance = M.Modal.getInstance(modalEl);

//     let taskObj = {
//         title: $('#taskTitleInput').val(),
//         userId: $('#taskUserSelect').val(),
//         kanbanColumnId: 1, //Backlog
//         description: $('#taskDescriptionTextArea').val(),
//         estimate: $('#taskEstimateInput').val(),
//         deadline: (moment($('#taskDeadlineDateInput').val() + " " + $('#taskDeadlineTimeInput').val()).toISOString()),
//         priority: $('#taskPrioritySelect').val(),
//     };

//     let jsonTask = JSON.stringify(taskObj);
//     console.log(jsonTask);
//     $.ajax({
//         url: "https://api.kanban.weibel.dev/api/Task",
//         type: "POST",
//         crossDomain: true,
//         headers: {
//             "Accept": "application/json; charset=utf-8",
//             "Content-Type": "application/json; charset=utf-8"
//         },
//         data: jsonTask,
//         dataType: "json",
//         success: function () {
//             console.log('Successfully added task to API');
//             sendNotification('New task created!', 'green darken-3 white-text');
//             // console.log(response);
//         },
//         error: function (xhr, status) {
//             console.log('Failed adding task to API');
//             sendNotification('There was an error creating the task', 'red darken-3 white-text');
//             // console.log(response);
//         }
//     });

//     modalInstance.close();
// }

//#region Columns CRUD
function addColumn() {
    let modalEl = $('#columnModal');
    let modalInstance = M.Modal.getInstance(modalEl);

    let columnObj = {
        name: $('#columnTitleInput').val(),
        color: $('#columnBackgroundColorSelect').val() + " " + $('#columnTextColorSelect').val(),
        order: $('[data-order]').last().data('order') + 1, //Put it at the end of the list
    };

    let jsonColumn = JSON.stringify(columnObj);

    $.ajax({
        url: "https://api.kanban.weibel.dev/api/KanbanColumns",
        type: "POST",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: jsonColumn,
        dataType: "json",
        success: function (response) {
            //TODO: Add column to DOM
            sendNotification('Column added', "green darken-3 white-text");
            closeModal('#columnModal');
            resetView();
        },
        error: function (xhr, status) {
            sendNotification(xhr.responseJSON + " try refreshing the page", "red darken-3 white-text", 10000);
        }
    });

    modalInstance.close();
    resetColumnModal();
}

function getColumns(callback) {
    $.ajax({
        url: "https://api.kanban.weibel.dev/api/KanbanColumns",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            let columnList = [];
            response.forEach(column => {
                columnList.push(KanbanColumn.fromJson(column));
            });
            console.log('Successfully pulled columns from API');
            callback(columnList);
        },
        error: function (xhr, status) {
            callback(null);
        }
    });
};

function updateColumn() {
    let columnId = $('#columnIdHiddenInput').val();
    editingColumn = '#tasksColumn-' + columnId;
    let column = $(editingColumn);
    let columnToUpdate = new KanbanColumn(
        columnId,
        $('#columnTitleInput').val(),
        $('#columnBackgroundColorSelect').val() + " " + $('#columnTextColorSelect').val(),
        column.data('order'),
        column.data('last-updated') //Timestamp of when the element was last edited
    );

    $.ajax({
        url: "https://api.kanban.weibel.dev/api/KanbanColumns/" + columnToUpdate.Id,
        type: "PUT",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: JSON.stringify(columnToUpdate),
        success: function (response) {
            sendNotification('Column successfully updated', "green darken-3 white-text");
            let updatedColumn = KanbanColumn.fromJson(response);
            column.data('name', updatedColumn.Name);
            column.data('classes', updatedColumn.Color);
            column.data('order', updatedColumn.Order)
            column.data('last-updated', updatedColumn.Timestamp);
            closeModal('#columnModal');
            resetView();
        },
        error: function (xhr, status) {
            sendNotification(xhr.responseJSON + " try refreshing the page", "red darken-3 white-text", 10000);
        }
    });
}

function updateColumnOrder(editingColumn) {
    let column = $(editingColumn);
    // console.log($(column).data('column-id'));
    let columnId = column.data('column-id');
    let columnToUpdate = new KanbanColumn(
        columnId,
        column.data('name'),
        column.data('classes'),
        column.data('order'),
        column.data('last-updated') //Timestamp of when the element was last edited
    );
    // console.log(columnToUpdate);
    $.ajax({
        url: "https://api.kanban.weibel.dev/api/KanbanColumns/" + columnToUpdate.Id,
        type: "PUT",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: JSON.stringify(columnToUpdate),
        success: function (response) {
            column.data('last-updated', KanbanColumn.fromJson(response).Timestamp);
        },
        error: function (xhr, status) {
            sendNotification(xhr.responseJSON + " try refreshing the page", "red darken-3 white-text", 10000);
        }
    });
}

function updateColumnsOrder() {
    //TODO: logic for updating column order

    $('.tasks__column').each(function (i) {
        $(this).data('order', i)
        updateColumnOrder(this);
    });

    sendNotification('Columns updated', "green darken-3 white-text");
}

function deleteColumn() {
    let columnId = $('#columnIdHiddenInput').val();
    deletingColumn = '#tasksColumn-' + columnId;
    let column = $(deletingColumn);
    let columnToDelete = new KanbanColumn(
        columnId,
        column.data('name'),
        column.data('classes'),
        column.data('order'),
        column.data('last-updated') //Timestamp of when the element was last edited
    );

    $.ajax({
        url: "https://api.kanban.weibel.dev/api/KanbanColumns/" + columnToDelete.Id,
        type: "DELETE",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: JSON.stringify(columnToDelete),
        success: function (response) {
            sendNotification('Column successfully deleted', "green darken-3 white-text");
            closeModal('#columnModal');
            resetView();
        },
        error: function (xhr, status) {
            switch (xhr.status) {
                case 404:
                    sendNotification("Column not found, try refreshing the page", "red darken-3 white-text", 10000);
                    break;
                case 409: //Column has tasks
                    sendNotification(xhr.responseJSON, "red darken-3 white-text", 10000);
                    break;
                case 500:
                    sendNotification('The servers are on fire, please try again later.', "red darken-3 white-text", 10000);
                default:
                    sendNotification('No idea what went wrong, sorry.', "red darken-3 white-text", 10000);
                    break;
            }
        }
    });
}
//#endregion Columns CRUD

//#region Tasks CRUD
function addTask() {
    let taskObj = {
        title: "New task title",
        kanbanColumnId: 1, //Backlog
        description: "New task description",
        estimate: 0,
        // deadline: (moment($('#taskDeadlineDateInput').val() + " " + $('#taskDeadlineTimeInput').val()).toISOString()),
        priority: 6,
    };

    let jsonTask = JSON.stringify(taskObj);

    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task",
        type: "POST",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: jsonTask,
        dataType: "json",
        success: function (response) {
            sendNotification('Task successfully added.', "green darken-3 white-text");
            //Add task to DOM
            buildTaskFromTemplate(Task.fromJson(response));
        },
        error: function (xhr, status) {
            sendNotification(xhr.responseJSON + " try refreshing the page", "red darken-3 white-text", 10000);
        }
    });
}

function getTasks(callback) {
    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            let tasksList = [];
            response.forEach(task => {
                tasksList.push(Task.fromJson(task));
            });
            console.log('Successfully pulled tasks from API');
            callback(tasksList);

            //Initialize tooltips
            $('.tooltipped').tooltip();
        },
        error: function (xhr, status) {
            callback(null);
        }
    });
};

function updateTask(task) {
    let taskToUpdate = new Task(
        task.data('task-id'),
        task.find('[data-name="task-title"]').html(),
        task.parent('section').data('column-id'),
        $.trim(task.find('[data-name="task-content"]').html().replace('/\r?\n|\r/g', '')), //It was adding random new lines and 
        task.find('[data-name="task-estimate"]').html(),
        null, //Not being used currently
        task.find('[data-name="task-priority"]').html(),
        task.find('[data-name="task-timestamp"]').data('last-updated') //Timestamp of when the element was last edited
    );
    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task/" + taskToUpdate.Id,
        type: "PUT",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: JSON.stringify(taskToUpdate),
        success: function (response) {
            //Update timestamp in DOM
            task.find('[data-name="task-timestamp"]').data('last-updated', Task.fromJson(response).Timestamp);
            sendNotification('Task updated', "green darken-3 white-text");
            //TODO: Refresh task view
        },
        error: function (xhr, status) {
            sendNotification(xhr.responseJSON + " try refreshing the page", "red darken-3 white-text", 10000);
        }
    });
}

function deleteTask(btn) {
    let task = $(btn).closest('section');

    let taskToUpdate = new Task(
        task.data('task-id'),
        task.find('[data-name="task-title"]').html(),
        task.parent('section').data('column-id'),
        $.trim(task.find('[data-name="task-content"]').html().replace('/\r?\n|\r/g', '')), //It was adding random new lines and 
        task.find('[data-name="task-estimate"]').html(),
        null, //Not being used currently
        task.find('[data-name="task-priority"]').html(),
        task.find('[data-name="task-timestamp"]').data('last-updated') //Timestamp of when the element was last edited
    );
    console.log(taskToUpdate);

    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task/" + taskToUpdate.Id,
        type: "DELETE",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: JSON.stringify(taskToUpdate),
        success: function (response) {
            //Delete task from DOM
            task.remove();
            sendNotification('Task successfully deleted', "green darken-3 white-text");
        },
        error: function (xhr, status) {
            sendNotification("Task changed by another user, try refreshing the page", "red darken-3 white-text", 10000);
        }
    });
}

//#endregion Tasks CRUD