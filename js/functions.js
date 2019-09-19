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
    //TODO: Save collapse state to web storage
}

function editColumn(editBtn) {
    sendNotification('Sorry, I haven\'t finished editing of columns.', "blue lighten-2");
    //TODO: Fix editing columns
    // let editingColumn = $(editBtn.closest('section'));
    // // console.log(editingColumn);

    // //Split classes
    // let classArray = editingColumn.data('classes').split(" ");

    // $('#columnModalTitle').html('Editing a column');
    // $('#columnTitleInput').val(editingColumn.data('name'));
    // $('#columnBackgroundColorSelect').val(classArray[0]).change(); //First class will always be the background color
    // $('#columnBackgroundColorSelect').val(classArray[1]).change(); //Second class will always be the text color

    // //Reinitialize dropdown to force update the selected value
    // $('select').select();
}

function prepareColumnModal() {
    $('#columnModalTitle').html('Creating new column');
}

function resetColumnModal() {
    $('#columnPreviewTitle').html("Preview title");
    // $('#columnPreview').attr('class', 'card preview-card');
    // $('#columnTitleInput').val("");
    // $('#columnBackgroundColorSelect').val("");
    // $('#columnBackgroundColorSelect').val("");
}

function updateColumnPreview() {
    $('#columnPreviewTitle').html($('#columnTitleInput').val());
    $('#columnPreview').attr('class', 'card preview-card')
        .addClass($('#columnBackgroundColorSelect').val())
        .addClass($('#columnTextColorSelect').val());
}