var allColumns;
var allTasks;

$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    $('.modal').modal({
        dismissible: false,
        endingTop: '2%'
    });
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();

    getColumns(function (columnList) {
        if (columnList !== null) {
            allColumns = columnList; //Save columns to manipulate later
            // console.log(columnList);
            // columnList = columnList.sort(function (a, b) { return a.Order - b.Order });
            // console.log(columnList);
            columnList.forEach(column => {
                let columnFromTemplate = $('#tasksColumnTemplate').html()
                    .replace('##tasksColumnID##', column.Id)
                    .replace('##tasksColumnId##', column.Id)
                    .replace('##tasksColumnTitle##', column.Name)
                    .replace('##tasksColumnClasses##', column.Color);
                // .replace('##taskEstimate##', column.Order)
                // .replace('##taskTimestamp##', column.Timestamp);
                if (column.Id !== 1) {
                    $(columnFromTemplate).appendTo($('#mainColumnContainer'));
                }
                // console.log(columnFromTemplate);
            });
            //TODO: Order before appending
            $('.tasks__row').sortable({
                group: 'row',
                animation: 250,
                ghostClass: 'grey',
                handle: ".row-drag-handle",
            });

            $('.tasks__column').sortable({
                swapThreshold: 1,
                // invertSwap: true,
                sort: false,
                group: 'column',
                animation: 250,
                ghostClass: 'grey',
                handle: ".column-drag-handle",
                onEnd: function (/**Event*/evt) {
                    var itemEl = evt.item;  // dragged HTMLElement

                    
                    if (evt.to !== evt.from) {
                        updateTask($(itemEl));    
                    }else{
                        console.log("Same column");
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
            alert('Column API call failed');
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
                    if (columnId === "#tasksColumn-1") {
                        $(taskFromTemplate).appendTo($('#tasksColumn-0'));
                    } else {
                        $(taskFromTemplate).appendTo($(columnId));
                    }
                });
            } else {
                alert('Task API call failed');
            }
        });

    });
});