<?php
// login.php
include 'includes/header.php';
include 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // For simplicity, we compare plain text. In real projects, use password_verify()
        if ($password == $user['password']) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['role'] = $user['role'];
            header("Location: index.php");
            exit();
        } else {
            $error = "Invalid password.";
        }
    } else {
        $error = "User not found.";
    }
}
?>

<div class="form-container">
    <h2>Login to EventFlow</h2>
    <?php if(isset($error)): ?>
        <p style="color: #e74c3c; text-align: center; margin-bottom: 15px;"><?php echo $error; ?></p>
    <?php endif; ?>
    <form method="POST">
        <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required>
        </div>
        <button type="submit" class="btn-submit">Login</button>
    </form>
    <p style="text-align: center; margin-top: 15px; font-size: 14px;">
        Don't have an account? <a href="register.php" style="color: #27ae60; font-weight: bold;">Register</a>
    </p>
</div>

<?php include 'includes/footer.php'; ?>
