$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal();

    $('.tasks__row').sortable({
        group: 'row',
        animation: 250,
        ghostClass: 'grey',
        handle: ".row-drag-handle"
    });

    $('.tasks__column').sortable({
        group: 'column',
        animation: 250,
        ghostClass: 'grey',
        handle: ".column-drag-handle"
    });

});