<?php
// index.php
include 'includes/header.php';
include 'config/db.php';

$query = "SELECT * FROM events ORDER BY date ASC";
$result = $conn->query($query);
?>

<header style="margin-bottom: 40px; text-align: center;">
    <h1 style="font-size: 42px; margin-bottom: 10px;">Discover Upcoming Events</h1>
    <p style="color: #777; font-size: 18px;">Find and book tickets for the best events in your city.</p>
</header>

<div class="event-grid">
    <?php if ($result->num_rows > 0): ?>
        <?php while($row = $result->fetch_assoc()): ?>
            <div class="event-card">
                <div class="event-info">
                    <h3><?php echo $row['name']; ?></h3>
                    <div class="event-meta">
                        <p>📍 <?php echo $row['location']; ?></p>
                        <p>📅 <?php echo date('F d, Y', strtotime($row['date'])); ?></p>
                        <p>🎟️ <?php echo $row['available_tickets']; ?> Tickets Left</p>
                    </div>
                    <p style="margin-bottom: 20px; font-size: 14px; color: #555;">
                        <?php echo substr($row['description'], 0, 100); ?>...
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 20px; font-weight: bold; color: #27ae60;">$<?php echo $row['price']; ?></span>
                        <a href="book_ticket.php?id=<?php echo $row['id']; ?>" class="btn-book" style="width: auto; padding: 8px 20px;">Book Now</a>
                    </div>
                </div>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p style="grid-column: 1/-1; text-align: center; padding: 50px; background: #fff; border-radius: 10px;">No events found.</p>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>
