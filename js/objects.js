var Task = function Task(Id, Title, /*UserId,*/ KanbanColumnId, Description, Estimate, Deadline, Priority, /*Order, */ Timestamp) {
    this.Id = Id;
    this.Title = Title;
    // this.UserId = UserId;
    this.KanbanColumnId = KanbanColumnId;
    this.Description = Description;
    this.Estimate = Estimate;
    this.Deadline = Deadline;
    this.Priority = Priority;
    // this.Order = Order;
    this.Timestamp = Timestamp;
}

Task.fromJson = function (json) {
    return new Task(
        json.id,
        json.title,
        // json.userId,
        json.kanbanColumnId,
        json.description,
        json.estimate,
        json.deadline,
        json.priority,
        // json.order,
        json.timestamp
    );
}

function KanbanColumn(Id, Name, Color, Order, Timestamp) {
    this.Id = Id;
    this.Name = Name;
    this.Color = Color;
    this.Order = Order;
    this.Timestamp = Timestamp;
}

KanbanColumn.fromJson = function (json) {
    return new KanbanColumn(
        json.id,
        json.name,
        json.color,
        json.order,
        json.timestamp
    );
}

function User(Id, Username, ImagePath, Timestamp) {
    this.Id = Id;
    this.Username = Username;
    this.ImagePath = ImagePath;
    this.Timestamp = Timestamp;
}