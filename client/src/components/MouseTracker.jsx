import React, { useEffect, useState } from 'react';

const MouseTracker = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [lastTime, setLastTime] = useState(Date.now());
    const [recentPositions, setRecentPositions] = useState([]);

    const SPEED_THRESHOLD = 20; // Adjust this value based on your needs
    const PATTERN_THRESHOLD = 2; // Number of recent positions to track for patterns
    const PATH_THRESHOLD = 2; // Number of recent positions to check for repeated paths

    useEffect(() => {
        const handleMouseMove = (event) => {
            const currentTime = Date.now();
            const dx = event.clientX - lastPosition.x;
            const dy = event.clientY - lastPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const timeElapsed = currentTime - lastTime;

            // Check for speed
            if (timeElapsed > 0) {
                const speed = distance / timeElapsed; // speed in pixels/ms

                if (speed > SPEED_THRESHOLD) {
                    alert('Mouse moving too fast!');
                }
            }

            // Track recent positions
            const newRecentPositions = [...recentPositions, { x: event.clientX, y: event.clientY }];
            if (newRecentPositions.length > PATH_THRESHOLD) {
                newRecentPositions.shift(); // Remove the oldest position
            }
            setRecentPositions(newRecentPositions);

            // Check for repeated patterns
            const positionCounts = {};
            newRecentPositions.forEach(pos => {
                const key = `${pos.x},${pos.y}`;
                positionCounts[key] = (positionCounts[key] || 0) + 1;
            });

            const isRepeating = Object.values(positionCounts).some(count => count > 1);
            if (isRepeating) {
                alert('Mouse is moving in a repetitive pattern!');
            }

            // Check for repeated paths
            const pathString = newRecentPositions.map(pos => `${pos.x},${pos.y}`).join('->');
            const previousPaths = new Set(recentPositions.map(pos => `${pos.x},${pos.y}`).join('->'));

            if (previousPaths.has(pathString)) {
                alert('Mouse is following the same path again!');
            }

            // Update positions and time
            setLastPosition({ x: event.clientX, y: event.clientY });
            setLastTime(currentTime);
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        // Attach the event listener
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [lastPosition, lastTime, recentPositions]);

    return (
        <div>
            <h1>Mouse Tracker</h1>
            <p>
                X: {mousePosition.x}, Y: {mousePosition.y}
            </p>
        </div>
    );
};

export default MouseTracker;
