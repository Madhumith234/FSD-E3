<?php
// book_ticket.php
include 'includes/header.php';
include 'config/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$event_id = $_GET['id'];
$query = "SELECT * FROM events WHERE id = $event_id";
$result = $conn->query($query);
$event = $result->fetch_assoc();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $tickets = $_POST['tickets'];
    $user_id = $_SESSION['user_id'];

    if ($tickets > $event['available_tickets']) {
        $error = "Not enough tickets available.";
    } else {
        // Transaction simulation
        $conn->begin_transaction();
        try {
            $conn->query("UPDATE events SET available_tickets = available_tickets - $tickets WHERE id = $event_id");
            $conn->query("INSERT INTO bookings (user_id, event_id, tickets) VALUES ($user_id, $event_id, $tickets)");
            $conn->commit();
            header("Location: my_bookings.php?msg=Booking successful");
            exit();
        } catch (Exception $e) {
            $conn->rollback();
            $error = "Booking failed.";
        }
    }
}
?>

<div class="form-container">
    <h2>Book Tickets</h2>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-bottom: 5px;"><?php echo $event['name']; ?></h3>
        <p style="font-size: 14px; color: #777;">Price: $<?php echo $event['price']; ?> per ticket</p>
    </div>

    <?php if(isset($error)): ?>
        <p style="color: #e74c3c; text-align: center; margin-bottom: 15px;"><?php echo $error; ?></p>
    <?php endif; ?>

    <form method="POST">
        <div class="form-group">
            <label>Number of Tickets</label>
            <input type="number" name="tickets" min="1" max="<?php echo $event['available_tickets']; ?>" value="1" required>
        </div>
        <button type="submit" class="btn-submit">Confirm Booking</button>
    </form>
</div>

<?php include 'includes/footer.php'; ?>
