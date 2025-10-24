#!/bin/sh

# Start MySQL in background
echo "Starting MySQL..."
mkdir -p /var/lib/mysql
mysqld --datadir=/var/lib/mysql --initialize-insecure
mysqld_safe &

# Wait for MySQL to start
sleep 15

# Start Eureka server
echo "Starting Eureka..."
java -jar eureka-server.jar &
sleep 10

# Start UserService
echo "Starting UserService..."
java -jar user-service.jar &
sleep 5

# Start TaskService
echo "Starting ContentService..."
java -jar content-service.jar &
sleep 5

# Keep container alive
tail -f /dev/null
