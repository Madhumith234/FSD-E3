<?php
// includes/header.php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventFlow - Ticketing Platform</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav>
        <div class="container">
            <a href="index.php" class="logo">EventFlow</a>
            <div class="nav-links">
                <a href="index.php">Home</a>
                <?php if(isset($_SESSION['user_id'])): ?>
                    <?php if($_SESSION['role'] == 'user'): ?>
                        <a href="my_bookings.php">My Bookings</a>
                    <?php else: ?>
                        <a href="admin_dashboard.php">Admin Dashboard</a>
                        <a href="manage_events.php">Manage Events</a>
                    <?php endif; ?>
                    <span class="user-name">Hi, <?php echo $_SESSION['name']; ?></span>
                    <a href="logout.php" class="btn-logout">Logout</a>
                <?php else: ?>
                    <a href="login.php">Login</a>
                    <a href="register.php" class="btn-register">Register</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
    <div class="container main-content">
