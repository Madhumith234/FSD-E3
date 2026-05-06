<?php
// my_bookings.php
include 'includes/header.php';
include 'config/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$query = "SELECT b.*, e.name as event_name, e.date, e.location 
          FROM bookings b 
          JOIN events e ON b.event_id = e.id 
          WHERE b.user_id = $user_id 
          ORDER BY b.booking_date DESC";
$result = $conn->query($query);
?>

<h2 style="margin-bottom: 20px;">My Bookings</h2>

<?php if ($result->num_rows > 0): ?>
    <table>
        <thead>
            <tr>
                <th>Event Name</th>
                <th>Date & Location</th>
                <th>Tickets</th>
                <th>Booking Date</th>
            </tr>
        </thead>
        <tbody>
            <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td style="font-weight: bold;"><?php echo $row['event_name']; ?></td>
                    <td>
                        <div style="font-size: 14px;"><?php echo date('M d, Y', strtotime($row['date'])); ?></div>
                        <div style="font-size: 12px; color: #777;"><?php echo $row['location']; ?></div>
                    </td>
                    <td><?php echo $row['tickets']; ?></td>
                    <td><?php echo date('M d, Y H:i', strtotime($row['booking_date'])); ?></td>
                </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
<?php else: ?>
    <div style="text-align: center; padding: 50px; background: #fff; border-radius: 10px;">
        <p style="color: #777;">You haven't booked any tickets yet.</p>
        <a href="index.php" style="color: #27ae60; font-weight: bold; text-decoration: none; margin-top: 10px; display: inline-block;">Browse Events</a>
    </div>
<?php endif; ?>

<?php include 'includes/footer.php'; ?>
