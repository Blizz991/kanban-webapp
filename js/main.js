$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal({
        dismissible: false,
        endingTop: '2%'
    });
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();

    $.ajax({
        url: 'https://api.kanban.weibel.dev/api/Task',
        data: data,
        success: success,
        dataType: dataType
    });

    $('.tasks__row').sortable({
        group: 'row',
        animation: 250,
        ghostClass: 'grey',
        handle: ".row-drag-handle"
    });

    $('.tasks__column').sortable({
        swapThreshold: 1,
        invertSwap: true,
        group: 'column',
        animation: 250,
        ghostClass: 'grey',
        handle: ".column-drag-handle"
    });

    // sendNotification('Hello world!', 1000, 'green');
});