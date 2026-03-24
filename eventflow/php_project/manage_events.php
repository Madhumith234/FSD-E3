<?php
// manage_events.php
include 'includes/header.php';
include 'config/db.php';

if ($_SESSION['role'] != 'admin') {
    header("Location: index.php");
    exit();
}

// Handle Add Event
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['add_event'])) {
    $name = $_POST['name'];
    $date = $_POST['date'];
    $location = $_POST['location'];
    $price = $_POST['price'];
    $available_tickets = $_POST['available_tickets'];
    $description = $_POST['description'];

    $query = "INSERT INTO events (name, date, location, price, available_tickets, description) 
              VALUES ('$name', '$date', '$location', '$price', '$available_tickets', '$description')";
    if ($conn->query($query)) {
        $msg = "Event added successfully";
    }
}

// Handle Delete Event
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $query = "DELETE FROM events WHERE id = $id";
    if ($conn->query($query)) {
        $msg = "Event deleted successfully";
    }
}

$query = "SELECT * FROM events ORDER BY date ASC";
$result = $conn->query($query);
?>

<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
    <h2>Manage Events</h2>
    <a href="#add-event" class="btn-submit" style="width: auto; padding: 10px 20px; text-decoration: none;">Add New Event</a>
</div>

<?php if(isset($msg)): ?>
    <p style="color: #27ae60; text-align: center; margin-bottom: 15px;"><?php echo $msg; ?></p>
<?php endif; ?>

<table>
    <thead>
        <tr>
            <th>Event Name</th>
            <th>Date & Location</th>
            <th>Price</th>
            <th>Tickets</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php while($row = $result->fetch_assoc()): ?>
            <tr>
                <td style="font-weight: bold;"><?php echo $row['name']; ?></td>
                <td>
                    <div style="font-size: 14px;"><?php echo date('M d, Y', strtotime($row['date'])); ?></div>
                    <div style="font-size: 12px; color: #777;"><?php echo $row['location']; ?></div>
                </td>
                <td>$<?php echo $row['price']; ?></td>
                <td><?php echo $row['available_tickets']; ?></td>
                <td>
                    <a href="manage_events.php?delete=<?php echo $row['id']; ?>" style="color: #e74c3c; text-decoration: none; font-weight: bold;" onclick="return confirm('Are you sure?')">Delete</a>
                </td>
            </tr>
        <?php endwhile; ?>
    </tbody>
</table>

<div id="add-event" class="form-container" style="max-width: 600px; margin-top: 60px;">
    <h2>Add New Event</h2>
    <form method="POST">
        <input type="hidden" name="add_event" value="1">
        <div class="form-group">
            <label>Event Name</label>
            <input type="text" name="name" required>
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" required>
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" name="location" required>
        </div>
        <div class="form-group">
            <label>Price ($)</label>
            <input type="number" name="price" step="0.01" required>
        </div>
        <div class="form-group">
            <label>Available Tickets</label>
            <input type="number" name="available_tickets" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" required></textarea>
        </div>
        <button type="submit" class="btn-submit">Create Event</button>
    </form>
</div>

<?php include 'includes/footer.php'; ?>
