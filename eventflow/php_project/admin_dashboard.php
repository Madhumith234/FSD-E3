<?php
// admin_dashboard.php
include 'includes/header.php';
include 'config/db.php';

if ($_SESSION['role'] != 'admin') {
    header("Location: index.php");
    exit();
}

$events_count = $conn->query("SELECT COUNT(*) as count FROM events")->fetch_assoc()['count'];
$bookings_count = $conn->query("SELECT COUNT(*) as count FROM bookings")->fetch_assoc()['count'];
$users_count = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'user'")->fetch_assoc()['count'];
?>

<h2 style="margin-bottom: 30px;">Admin Dashboard</h2>

<div class="stats-grid">
    <div class="stat-box">
        <h3>Total Events</h3>
        <p><?php echo $events_count; ?></p>
    </div>
    <div class="stat-box">
        <h3>Total Bookings</h3>
        <p><?php echo $bookings_count; ?></p>
    </div>
    <div class="stat-box">
        <h3>Total Users</h3>
        <p><?php echo $users_count; ?></p>
    </div>
</div>

<div style="background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <h3 style="margin-bottom: 20px;">Quick Actions</h3>
    <div style="display: flex; gap: 20px;">
        <a href="manage_events.php" class="btn-submit" style="text-decoration: none; text-align: center; width: auto; padding: 15px 30px;">Manage Events</a>
        <a href="index.php" class="btn-submit" style="text-decoration: none; text-align: center; width: auto; padding: 15px 30px; background: #34495e;">View Site</a>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
