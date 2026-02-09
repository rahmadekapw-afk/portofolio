<?php
include_once 'db.php';

// Auto-migration for parent_id if it doesn't exist
// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Ensure database table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS portfolio_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content LONGTEXT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        profile_image LONGTEXT DEFAULT NULL,
        is_pinned TINYINT(1) DEFAULT 0,
        parent_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
} catch (Exception $e) {
    // Attempt to upgrade existing columns if they are not LONGTEXT
    try {
        $pdo->exec("ALTER TABLE portfolio_comments MODIFY COLUMN content LONGTEXT");
        $pdo->exec("ALTER TABLE portfolio_comments MODIFY COLUMN profile_image LONGTEXT");
    } catch (Exception $upgradeError) {
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM portfolio_comments ORDER BY created_at ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $raw_data = file_get_contents("php://input");
    file_put_contents("debug.txt", "POST RECEIVED: " . date('H:i:s') . " SIZE: " . strlen($raw_data) . "\n", FILE_APPEND);
    $data = json_decode($raw_data, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        file_put_contents("debug.txt", "JSON ERROR: " . json_last_error_msg() . "\n", FILE_APPEND);
        http_response_code(400);
        echo json_encode([
            "error" => "Malformed JSON or payload too large",
            "json_error" => json_last_error_msg(),
            "payload_size" => strlen($raw_data)
        ]);
        exit;
    }

    if (isset($data[0]))
        $data = $data[0];

    if (!isset($data['content']) || !isset($data['user_name'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields", "received_keys" => array_keys((array) $data)]);
        exit;
    }

    $profile_image_path = null;

    // Handle Base64 Image Upload
    if (isset($data['profile_image']) && !empty($data['profile_image']) && strpos($data['profile_image'], 'base64') !== false) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        try {
            $image_parts = explode(";base64,", $data['profile_image']);
            if (count($image_parts) >= 2) {
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_type = count($image_type_aux) > 1 ? $image_type_aux[1] : 'png';
                $image_base64 = base64_decode($image_parts[1]);
                $file_name = uniqid() . '.' . $image_type;
                $file_path = $upload_dir . $file_name;

                if (file_put_contents($file_path, $image_base64)) {
                    $profile_image_path = 'http://' . $_SERVER['HTTP_HOST'] . '/portofolio/api/' . $file_path;
                }
            }
        } catch (Exception $e) {
            // Log error but continue with null image
        }
    }

    try {
        $sql = "INSERT INTO portfolio_comments (content, user_name, profile_image, is_pinned, parent_id) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['content'],
            $data['user_name'],
            $profile_image_path,
            $data['is_pinned'] ?? 0,
            $data['parent_id'] ?? null
        ]);

        echo json_encode(["success" => true, "id" => $pdo->lastInsertId(), "image_url" => $profile_image_path]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing ID"]);
        exit;
    }

    try {
        // Recursive delete: delete children first, then parent
        $stmt_children = $pdo->prepare("DELETE FROM portfolio_comments WHERE parent_id = ?");
        $stmt_children->execute([$id]);

        $stmt = $pdo->prepare("DELETE FROM portfolio_comments WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>