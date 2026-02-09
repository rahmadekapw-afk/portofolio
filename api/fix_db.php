<?php
$host = 'localhost';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS portofolio_db");
    $pdo->exec("USE portofolio_db");

    // Create table with correct structure
    $pdo->exec("CREATE TABLE IF NOT EXISTS portfolio_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content LONGTEXT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        profile_image LONGTEXT DEFAULT NULL,
        is_pinned TINYINT(1) DEFAULT 0,
        parent_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (parent_id)
    )");

    // Ensure columns are LONGTEXT for existing tables
    $pdo->exec("ALTER TABLE portfolio_comments MODIFY COLUMN content LONGTEXT");
    $pdo->exec("ALTER TABLE portfolio_comments MODIFY COLUMN profile_image LONGTEXT");

    // Ensure parent_id column exists for older tables
    try {
        $pdo->query("SELECT parent_id FROM portfolio_comments LIMIT 1");
    } catch (Exception $e) {
        $pdo->exec("ALTER TABLE portfolio_comments ADD COLUMN parent_id INT DEFAULT NULL");
    }

    echo json_encode(["status" => "success", "message" => "Database and table verified/created successfully."]);
} catch (PDOException $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>