function Task(Id, Title, UserId, KanbanColumnId, Description, Estimate, Deadline, Priority, Order, Timestamp) {
    this.Id = Id;
    this.Title = Title;
    this.UserId = UserId;
    this.KanbanColumnId = KanbanColumnId;
    this.Description = Description;
    this.Estimate = Estimate;
    this.Deadline = Deadline;
    this.Priority = Priority;
    this.Order = Order;
    this.Timestamp = Timestamp;
}

function KanbanColumn(Id, Name, Color, Order, Timestamp) {
    this.Id = Id;
    this.Name = Name;
    this.Color = Color;
    this.Order = Order;
    this.Timestamp = Timestamp;
}

function User(Id, Username, ImagePath, Timestamp) {
    this.Id = Id;
    this.Username = Username;
    this.ImagePath = ImagePath;
    this.Timestamp = Timestamp;
}