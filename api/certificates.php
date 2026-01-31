<?php
include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM certificates ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data[0]))
        $data = $data[0];

    $sql = "INSERT INTO certificates (Img) VALUES (?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['Img']]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
}
?>