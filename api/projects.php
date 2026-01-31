<?php
include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC");
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode JSON fields if they are strings (MySQL sometimes returns JSON as string)
        foreach ($projects as &$project) {
            if (is_string($project['Features']))
                $project['Features'] = json_decode($project['Features']);
            if (is_string($project['TechStack']))
                $project['TechStack'] = json_decode($project['TechStack']);
        }

        echo json_encode($projects);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if it's an array wrapper (sometimes clients send [{}])
    if (isset($data[0]))
        $data = $data[0];

    $sql = "INSERT INTO projects (Title, Description, Img, Link, Github, Features, TechStack) VALUES (?, ?, ?, ?, ?, ?, ?)";

    try {
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            $data['Title'],
            $data['Description'],
            $data['Img'],
            $data['Link'],
            $data['Github'],
            json_encode($data['Features']),
            json_encode($data['TechStack'])
        ]);

        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>