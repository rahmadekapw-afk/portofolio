<?php
include_once 'db.php';

// Auto-migration for parent_id if it doesn't exist
try {
    $pdo->query("SELECT parent_id FROM portfolio_comments LIMIT 1");
} catch (Exception $e) {
    try {
        $pdo->exec("ALTER TABLE portfolio_comments ADD COLUMN parent_id INT DEFAULT NULL");
    } catch (Exception $e2) {
        // Ignore if failed
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM portfolio_comments ORDER BY created_at ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data[0]))
        $data = $data[0];

    // For simplicity, we trust the client for now, but usually validation is needed
    $sql = "INSERT INTO portfolio_comments (content, user_name, profile_image, is_pinned, parent_id) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['content'],
        $data['user_name'],
        $data['profile_image'] ?? null,
        $data['is_pinned'] ?? 0,
        $data['parent_id'] ?? null
    ]);

    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
}
?>