var allColumns;
var allTasks;

$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    var $box = $('#columnBackgroundColorPicker');
    $('.modal').modal({
        // Didn't manage to get Tiny Color Picker working sadly.
        // onOpenStart: function () {
        //     // Initialize a colorpicker like this.
        //     //
        //     var $box = $('#columnBackgroundColorPicker');
        //     $box.tinycolorpicker();

        //     // Try this to get access to the actual colorpicker instance.
        //     //
        //     var box = $box.data("plugin_tinycolorpicker");

        //     // Now you have access to all the methods and properties.
        //     //
        //     // box.setColor("#cccccc");
        //     // console.log(box.colorRGB);
        //     //
        //     // etc..

        //     // You can bind to the change event like this.
        //     //
        //     $box.bind("change", function () {
        //         console.log("do something when a new color is set");
        //     });
        // }
        // dismissible: false,
        // endingTop: '2%'
    });
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();

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
                    // sendNotification("Column ordering doesn't save currently.", "blue lighten-2");
                    // if (evt.to !== evt.from) {
                    //     updateTask($(itemEl));
                    // }
                    // evt.to;    // target list
                    // evt.from;  // previous list
                    // evt.oldIndex;  // element's old index within old parent
                    // evt.newIndex;  // element's new index within new parent
                    // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
                    // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
                    // evt.clone // the clone element
                    // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
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
                    // evt.to;    // target list
                    // evt.from;  // previous list
                    // evt.oldIndex;  // element's old index within old parent
                    // evt.newIndex;  // element's new index within new parent
                    // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
                    // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
                    // evt.clone // the clone element
                    // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
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
                    let taskDeadlineClasses = "";
                    let daysTillDeadline = moment(task.Deadline).diff(moment(), 'days');

                    if (daysTillDeadline <= 2) {
                        taskDeadlineClasses = "red darken-3";
                    } else if (daysTillDeadline <= 7) {
                        taskDeadlineClasses = "orange darken-3";
                    } else if (daysTillDeadline > 7) {
                        taskDeadlineClasses = "green darken-3";
                    } else {
                        taskDeadlineClasses = "d-none";
                    }
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
                        .replace('##taskDeadlineClasses##', taskDeadlineClasses)
                        .replace('##taskDeadlineFormatted##', moment(task.Deadline).format("Do of MMM. YYYY"))
                        // .replace('##taskDeadline##', moment(task.Deadline).format("Do of MMM. YY")) 
                        .replace('##taskPriorityUrgency##', taskUrgency)
                        .replace('##taskPriorityIcon##', taskPriorityIcon)
                        .replace('##taskPriorityClasses##', taskPriorityClasses)
                        .replace('##taskPriority##', task.Priority)
                        .replace('##taskTimestamp##', task.Timestamp);
                    let columnId = '#tasksColumn-' + task.KanbanColumnId;
                    // if (columnId === "#tasksColumn-1") {
                    //     $(taskFromTemplate).appendTo($('#tasksColumn-0'));
                    // } else {
                    $(taskFromTemplate).appendTo($(columnId));
                    // }
                });
            } else {
                alert('Task API call failed');
            }
        });

    });
});