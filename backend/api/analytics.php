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

// Check if user has appropriate access (admin or monitoring)
if (!in_array($decoded->role, ['admin', 'monitoring'])) {
    sendError('Access denied. Admin or monitoring privileges required.', 403);
}

try {
    // Get total users count
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM users");
    $stmt->execute();
    $totalUsers = $stmt->fetch()['total'];

    // Get total meetings count
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM meetings");
    $stmt->execute();
    $totalMeetings = $stmt->fetch()['total'];

    // Get users by role
    $stmt = $pdo->prepare("
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
    ");
    $stmt->execute();
    $usersByRole = $stmt->fetchAll();

    // Get meetings by status
    $stmt = $pdo->prepare("
        SELECT 
            CASE 
                WHEN date > CURDATE() THEN 'upcoming'
                WHEN date = CURDATE() THEN 'ongoing'
                ELSE 'completed'
            END as status,
            COUNT(*) as count
        FROM meetings 
        GROUP BY status
    ");
    $stmt->execute();
    $meetingsByStatus = $stmt->fetchAll();

    // Get recent meetings
    $stmt = $pdo->prepare("
        SELECT 
            m.id,
            m.name,
            m.date,
            m.time,
            m.topic,
            m.hosters,
            u.name as created_by_name,
            CASE 
                WHEN m.date > CURDATE() THEN 'upcoming'
                WHEN m.date = CURDATE() THEN 'ongoing'
                ELSE 'completed'
            END as status
        FROM meetings m 
        JOIN users u ON m.created_by = u.id 
        ORDER BY m.created_at DESC 
        LIMIT 5
    ");
    $stmt->execute();
    $recentMeetings = $stmt->fetchAll();

    // Get recent users (last 5 registered)
    $stmt = $pdo->prepare("
        SELECT 
            id,
            name,
            email,
            role,
            department,
            created_at
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $stmt->execute();
    $recentUsers = $stmt->fetchAll();

    // Format statistics
    $statistics = [
        'overview' => [
            'totalUsers' => (int)$totalUsers,
            'totalMeetings' => (int)$totalMeetings,
            'activeSessions' => 0, // Will be updated when session tracking is implemented
            'completionRate' => 85 // Mock data for now
        ],
        'userDistribution' => [],
        'meetingDistribution' => [],
        'recentActivity' => [
            'meetings' => $recentMeetings,
            'users' => $recentUsers
        ],
        'monthlyStats' => [
            'newUsers' => 12, // Mock data - will be calculated from actual data
            'newMeetings' => 8,
            'completedTrainings' => 25,
            'averageAttendance' => 78
        ]
    ];

    // Format user distribution
    foreach ($usersByRole as $roleData) {
        $statistics['userDistribution'][] = [
            'role' => $roleData['role'],
            'count' => (int)$roleData['count'],
            'percentage' => round(($roleData['count'] / $totalUsers) * 100, 1)
        ];
    }

    // Format meeting distribution
    foreach ($meetingsByStatus as $statusData) {
        $statistics['meetingDistribution'][] = [
            'status' => $statusData['status'],
            'count' => (int)$statusData['count'],
            'percentage' => round(($statusData['count'] / $totalMeetings) * 100, 1)
        ];
    }

    sendResponse([
        'analytics' => $statistics,
        'message' => 'Analytics data fetched successfully'
    ]);

} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendError('Unexpected error: ' . $e->getMessage(), 500);
}
?>
