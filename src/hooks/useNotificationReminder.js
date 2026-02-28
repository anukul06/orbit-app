import { useEffect, useRef } from 'react';
import { api } from '../api';

/**
 * Browser push notification reminder for incomplete tasks.
 * - Requests permission once on mount
 * - Checks every 60s if it's reminder time (7 PM)
 * - Fires notification once per day (localStorage flag)
 * - Respects user's reminder toggle in Settings
 */
export default function useNotificationReminder() {
    const intervalRef = useRef(null);

    useEffect(() => {
        // Check if reminders enabled
        const enabled = localStorage.getItem('orbit-reminders') !== 'false';
        if (!enabled) return;

        // Request permission once
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Check every 60 seconds
        intervalRef.current = setInterval(async () => {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            if (localStorage.getItem('orbit-reminders') === 'false') return;

            const now = new Date();

            // Reset flag at midnight
            const lastSent = localStorage.getItem('orbit-reminder-date');
            const today = now.toDateString();
            if (lastSent && lastSent !== today) {
                localStorage.removeItem('orbit-reminder-sent');
            }

            // Already sent today
            if (localStorage.getItem('orbit-reminder-sent') === 'true') return;

            // Fire at 7 PM (19:00)
            if (now.getHours() === 19 && now.getMinutes() === 0) {
                try {
                    const data = await api.getPendingTasks();
                    if (data.count > 0) {
                        new Notification('🎯 ORBIT Reminder', {
                            body: `You have ${data.count} pending task${data.count > 1 ? 's' : ''}. Complete them to maintain your streak! 🔥`,
                            icon: '/orbit-icon.png',
                            tag: 'orbit-daily-reminder',
                        });
                        localStorage.setItem('orbit-reminder-sent', 'true');
                        localStorage.setItem('orbit-reminder-date', today);
                    }
                } catch { }
            }
        }, 60000);

        return () => clearInterval(intervalRef.current);
    }, []);
}
