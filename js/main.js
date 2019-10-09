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

    getColumnsAndTasks();
});