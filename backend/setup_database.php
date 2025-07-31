<?php
// Database setup script for Medi Guru Portal

$servername = "localhost";
$username = "root";
$password = "";

try {
    // Create connection without specifying database
    $pdo = new PDO("mysql:host=$servername;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS mediguru CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database 'mediguru' created successfully\n";

    // Select the database
    $pdo->exec("USE mediguru");

    // Create users table
    $userTableSQL = "
    CREATE TABLE IF NOT EXISTS `users` (
        `id` int(255) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `email` varchar(255) NOT NULL UNIQUE,
        `password` varchar(255) NOT NULL,
        `role` varchar(10) NOT NULL DEFAULT 'doctor',
        `department` varchar(255) DEFAULT NULL,
        `registration_number` varchar(100) DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    $pdo->exec($userTableSQL);
    echo "Users table created successfully\n";

    // Insert sample users
    $insertUsers = "
    INSERT IGNORE INTO `users` (`name`, `email`, `password`, `role`, `department`, `registration_number`) VALUES
    ('Dr. Amit Verma', 'admin@mediguru.com', 'admin123', 'admin', 'Administration', 'CG/ADMIN/2018/005'),
    ('Dr. Rajesh Kumar', 'doctor@mediguru.com', 'doctor123', 'doctor', 'General Medicine', 'CG/MED/2019/001'),
    ('Dr. Priya Sharma', 'priya@mediguru.com', 'priya123', 'doctor', 'Pediatrics', 'CG/MED/2020/045'),
    ('Dr. Sunita Verma', 'sunita@mediguru.com', 'sunita123', 'doctor', 'Gynecology', 'CG/MED/2021/078'),
    ('Dr. Vikram Singh', 'vikram@mediguru.com', 'vikram123', 'doctor', 'Emergency Medicine', 'CG/MED/2022/102')";

    $pdo->exec($insertUsers);
    echo "Sample users inserted successfully\n";

    echo "\n=== Database Setup Complete ===\n";
    echo "Sample Login Credentials:\n";
    echo "Admin: admin@mediguru.com / admin123\n";
    echo "Doctor: doctor@mediguru.com / doctor123\n";
    echo "==============================\n";

} catch(PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>
