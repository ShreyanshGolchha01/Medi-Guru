<?php
// CORS headers - MUST BE FIRST
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once '../config/database.php';
require_once '../config/helpers.php';

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

// Get and validate token
$token = getAuthHeader();
$decoded = validateToken($token);

// Check if user is admin
if ($decoded->role !== 'admin') {
    sendError('Access denied. Admin privileges required.', 403);
}

try {
    // Fetch all users
    $stmt = $pdo->prepare("
        SELECT 
            id,
            name,
            email,
            role,
            department,
            phone,
            created_at,
            last_login
        FROM users 
        ORDER BY role, name
    ");
    
    $stmt->execute();
    $users = $stmt->fetchAll();

    // Format the response
    $formattedUsers = [];
    foreach ($users as $user) {
        $formattedUsers[] = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'department' => $user['department'] ?? 'Not specified',
            'phone' => $user['phone'] ?? 'Not provided',
            'created_at' => $user['created_at'],
            'last_login' => $user['last_login'],
            'status' => 'active', // Default status
            'trainingsCompleted' => 0, // Will be updated when training system is implemented
            'averageScore' => 0 // Will be updated when quiz system is implemented
        ];
    }

    // Get user statistics
    $stats = [
        'total' => count($formattedUsers),
        'doctors' => count(array_filter($formattedUsers, fn($u) => $u['role'] === 'doctor')),
        'admins' => count(array_filter($formattedUsers, fn($u) => $u['role'] === 'admin')),
        'experts' => count(array_filter($formattedUsers, fn($u) => $u['role'] === 'expert')),
        'monitoring' => count(array_filter($formattedUsers, fn($u) => $u['role'] === 'monitoring'))
    ];

    sendResponse([
        'users' => $formattedUsers,
        'statistics' => $stats,
        'message' => 'Users fetched successfully'
    ]);

} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendError('Unexpected error: ' . $e->getMessage(), 500);
}
?>
