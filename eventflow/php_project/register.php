<?php
// register.php
include 'includes/header.php';
include 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $check_query = "SELECT * FROM users WHERE email = '$email'";
    $check_result = $conn->query($check_query);

    if ($check_result->num_rows > 0) {
        $error = "Email already exists.";
    } else {
        $query = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";
        if ($conn->query($query)) {
            header("Location: login.php?msg=Registration successful");
            exit();
        } else {
            $error = "Registration failed.";
        }
    }
}
?>

<div class="form-container">
    <h2>Create Account</h2>
    <?php if(isset($error)): ?>
        <p style="color: #e74c3c; text-align: center; margin-bottom: 15px;"><?php echo $error; ?></p>
    <?php endif; ?>
    <form method="POST">
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="name" required>
        </div>
        <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required>
        </div>
        <button type="submit" class="btn-submit">Register</button>
    </form>
    <p style="text-align: center; margin-top: 15px; font-size: 14px;">
        Already have an account? <a href="login.php" style="color: #27ae60; font-weight: bold;">Login</a>
    </p>
</div>

<?php include 'includes/footer.php'; ?>
