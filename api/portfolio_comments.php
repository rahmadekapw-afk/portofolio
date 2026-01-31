<?php
include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM portfolio_comments ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data[0]))
        $data = $data[0];

    // For simplicity, we trust the client for now, but usually validation is needed
    $sql = "INSERT INTO portfolio_comments (content, user_name, profile_image, is_pinned) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['content'],
        $data['user_name'],
        $data['profile_image'] ?? null,
        $data['is_pinned'] ?? 0
    ]);

    echo json_encode(["success" => true]);
}
?>