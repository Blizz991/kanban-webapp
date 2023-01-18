function sendNotification(content, _classes, _displayLength = 4000) {
    M.toast({
        html: content,
        displayLength: _displayLength,
        classes: _classes
    });
}

function confirmCloseModal(modalId) {
    let modalEl = $(modalId);
    let modalInstance = M.Modal.getInstance(modalEl);

    let confirmed = confirm('Are you sure you wish to cancel?');
    if (confirmed == true) {
        modalInstance.close();
    }
}

function closeModal(modalId) {
    let modalEl = $(modalId);
    let modalInstance = M.Modal.getInstance(modalEl);

    modalInstance.close();
}

function setEditTaskState(editBtn) {
    let btn = $(editBtn);
    let task = $(btn.closest('section'));

    if (btn.data('editing-state') === false) {
        task.attr('contenteditable', "true");
        btn.data('editing-state', true);
        btn.html('save');
        sendNotification('Editing enabled', "green darken-3 white-text");
    } else {
        task.attr('contenteditable', "false");
        btn.data('editing-state', false);
        btn.html('edit');
        updateTask(task);
    }
}

function triggerTaskCollapseState(collapseBtn) {
    let btn = $(collapseBtn);
    let task = btn.closest('section');
    let taskId = task.attr('id');
    let taskContent = task.find('article');
    let collapseState = task.data('collapsed-state');

    if (collapseState) {
        btn.html('expand_less');
        task.data('collapsed-state', false);
        taskContent.slideDown("fast");
        localStorage.setItem((taskId + "-collapsed"), true);
    } else {
        btn.html('expand_more');
        task.data('collapsed-state', true);
        taskContent.slideUp("fast");
        localStorage.removeItem((taskId + "-collapsed"));
    }
}

function editColumn(editBtn) {
    // sendNotification('Sorry, I haven\'t finished editing of columns.', "blue lighten-2");
    //TODO: Fix editing columns
    let editingColumn = $(editBtn.closest('section'));
    // console.log(editingColumn);

    //Split classes
    let classArray = editingColumn.data('classes').split(" ");

    $('#columnModalTitle').html('Editing a column');
    $('#columnTitleInput').val(editingColumn.data('name'));
    $('#columnBackgroundColorSelect').val(classArray[0]).change(); //First class will always be the background color
    $('#columnTextColorSelect').val(classArray[1]).change(); //Second class will always be the text color
    $('#columnIdHiddenInput').val(editingColumn.data('column-id'));

    //Reinitialize dropdowns to force update the selected value
    $('#columnBackgroundColorSelect').formSelect();
    $('#columnTextColorSelect').formSelect();

    $('#modalColumnDeleteBtn').show();
    $('#modalColumnUpdateBtn').show();
    $('#modalColumnAddBtn').hide();
}

function prepareColumnModal() {
    resetColumnModal();
    $('#columnModalTitle').html('Creating new column');
    $('#modalColumnDeleteBtn').hide();
    $('#modalColumnUpdateBtn').hide();
    $('#modalColumnAddBtn').show();
}

function resetColumnModal() {
    $('#columnPreviewTitle').html("Preview title");
    $('#columnPreview').attr('class', 'card preview-card');
    $('#columnTitleInput').val("");
    $('#columnBackgroundColorSelect').val("").change();
    $('#columnTextColorSelect').val("").change();
    $('#columnBackgroundColorSelect').formSelect();
    $('#columnTextColorSelect').formSelect();
}

function updateColumnPreview() {
    $('#columnPreviewTitle').html($('#columnTitleInput').val());
    $('#columnPreview').attr('class', 'card preview-card')
        .addClass($('#columnBackgroundColorSelect').val())
        .addClass($('#columnTextColorSelect').val());
}

function buildTaskFromTemplate(task) {
    let taskUrgency = "";
    let taskPriorityClasses = "";
    let taskPriorityIcon = "";
    switch (task.Priority) {
        case 0:
        case 1:
            taskUrgency = "Urgent";
            taskPriorityClasses = "red darken-3";
            taskPriorityIcon = "priority_high";
            break;
        case 2:
            taskUrgency = "Soon";
            taskPriorityClasses = "red darken-1";
            taskPriorityIcon = "priority_high";
            break;
        case 3:
            taskUrgency = "When possible";
            taskPriorityClasses = "orange darken-3";
            taskPriorityIcon = "low_priority";
            break;
        case 4:
            taskUrgency = "If possible";
            taskPriorityClasses = "orange darken-1";
            taskPriorityIcon = "low_priority";
            break;
        case 5:
            taskUrgency = "If time allows";
            taskPriorityClasses = "green darken-3";
            taskPriorityIcon = "timelapse";
            break;
        default:
            taskUrgency = "At some point";
            taskPriorityClasses = "green darken-1";
            taskPriorityIcon = "timer_off";
            break;
    }
    // if (task.Deadline !== null) {
    // let taskDeadlineClasses = "";
    // let daysTillDeadline = moment(task.Deadline).diff(moment(), 'days');

    // if (daysTillDeadline <= 2) {
    //     taskDeadlineClasses = "red darken-3";
    // } else if (daysTillDeadline <= 7) {
    //     taskDeadlineClasses = "orange darken-3";
    // } else if (daysTillDeadline > 7) {
    //     taskDeadlineClasses = "green darken-3";
    // } else {
    //     taskDeadlineClasses = "d-none";
    // }
    // }

    let taskId = "task-" + task.Id;
    let taskCollapseState = false;
    let taskCollapseIndicator = "expand_less";

    if (localStorage.getItem((taskId + "-collapsed")) !== null) {
        taskCollapseState = true;
        taskCollapseIndicator = "expand_more";
    }

    let taskFromTemplate = $('#taskTemplate').html()
        .replace('##taskID##', taskId)
        .replace('##taskId##', task.Id)
        .replace('##taskCollapseState##', taskCollapseState)
        .replace('##taskCollapseIndicator##', taskCollapseIndicator)
        .replace('##taskTitle##', task.Title)
        .replace('##taskContent##', task.Description)
        .replace('##taskEstimate##', task.Estimate)
        .replace('##taskDeadline##', moment(task.Deadline).format("DD/M-YY"))
        // .replace('##taskDeadlineClasses##', taskDeadlineClasses)
        .replace('##taskDeadlineFormatted##', moment(task.Deadline).format("Do of MMM. YYYY"))
        // .replace('##taskDeadline##', moment(task.Deadline).format("Do of MMM. YY")) 
        .replace('##taskPriorityUrgency##', taskUrgency)
        .replace('##taskPriorityIcon##', taskPriorityIcon)
        .replace('##taskPriorityClasses##', taskPriorityClasses)
        .replace('##taskPriority##', task.Priority)
        .replace('##taskTimestamp##', task.Timestamp);
    let columnId = '#tasksColumn-' + task.KanbanColumnId;
    $(taskFromTemplate).appendTo($(columnId));
    // }
}

function getColumnsAndTasks(){
    getColumns(function (columnList) {
        if (columnList !== null) {
            allColumns = columnList; //Save columns to manipulate later
            //Order columns by their set order before itterating through them
            columnList = columnList.sort(function (a, b) { return a.Order - b.Order });
            columnList.forEach(column => {
                let columnFromTemplate = $('#tasksColumnTemplate').html()
                    .replace('##tasksColumnID##', column.Id)
                    .replace('##tasksColumnId##', column.Id)
                    .replace('##tasksColumnTitle##', column.Name)
                    .replace('##tasksColumnName##', column.Name)
                    .replace('##tasksColumnClasses##', column.Color)
                    .replace('##tasksColumnDataClasses##', column.Color)
                    .replace('##tasksColumnColors##', column.Color)
                    .replace('##tasksColumnOrder##', column.Order)
                    .replace('##tasksColumnTimestamp##', column.Timestamp);
                $(columnFromTemplate).appendTo($('#mainColumnContainer'));
            });

            //Insert add task button into first column
            let addTaskBtn = $('#addNewTaskBtnTemplate').html();
            $(addTaskBtn).appendTo($('[data-order="0"]').find('.column-top-btns'));

            let addColumnBtn = $('#addNewColumnBtnTemplate').html();
            $(addColumnBtn).appendTo($('#mainColumnContainer'));

            $('.tasks__row').sortable({
                group: 'row',
                animation: 250,
                ghostClass: 'grey',
                handle: ".row-drag-handle",
                onStart: function () {
                    $('.tooltipped').tooltip('close');
                },
                onEnd: function (evt) {
                    var itemEl = evt.item;  // dragged HTMLElement
                    if (evt.oldIndex !== evt.newIndex) {
                        updateColumnsOrder();
                    }
                },
            });

            $('.tasks__column').sortable({
                swapThreshold: 1,
                // invertSwap: true,
                sort: false,
                group: 'column',
                animation: 250,
                ghostClass: 'grey',
                // filter: ".tasks__column-top-container", //We don't want the top part of columns be dragable like tasks.
                handle: ".column-drag-handle",
                onStart: function () {
                    $('.tooltipped').tooltip('close');
                },
                onEnd: function (evt) {
                    let itemEl = evt.item;  // dragged HTMLElement
                    if (evt.to !== evt.from) {
                        updateTask($(itemEl));
                    }
                },
            });
        }
        else {
            sendNotification('Column API call failed', "red darken-3", 0);
        }
        getTasks(function (tasksList) {
            if (tasksList !== null) {
                allTasks = tasksList;
                tasksList.forEach(task => {
                    buildTaskFromTemplate(task);
                });
            } else {
                alert('Task API call failed');
            }
        });
    });
}

function resetView(){
    $('#mainColumnContainer').html("");
    getColumnsAndTasks();
}