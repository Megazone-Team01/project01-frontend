// context/SSEContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SSEContext = createContext();

export function SSEProvider({ children }) {
    // Redux에서 사용자 정보 가져오기
    const user = useSelector((state) => state.auth.user); // 또는 state.user

    console.log('SSE Provider - user:', user);

    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [eventSource, setEventSource] = useState(null);

    useEffect(() => {
        // 로그인하지 않았으면 연결하지 않음
        if (!user?.id) {
            if (eventSource) {
                eventSource.close();
                setEventSource(null);
                setIsConnected(false);
            }
            return;
        }

        // 이미 연결되어 있으면 새로 연결하지 않음
        if (eventSource) return;

        console.log(`http://localhost:8080/api/v1/sse/connect?userId=${user.id}`)
        // SSE 연결 생성
        const es = new EventSource(
            `http://localhost:8080/api/v1/sse/connect?userId=${user.id}`,
            { withCredentials: true } // 쿠키/인증 정보 포함
        );

        es.addEventListener('connect', (event) => {
            console.log('SSE 연결 성공:', event.data);
            setIsConnected(true);
        });

        es.addEventListener('notification', (event) => {
            const data = JSON.parse(event.data);
            console.log('새 알림:', data);
            setNotifications(prev => [...prev, data]);

            // 브라우저 알림 (선택사항)
            if (Notification.permission === 'granted') {
                new Notification('새 알림', {
                    body: data.message,
                    icon: '/notification-icon.png'
                });
            }
        });

        es.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log('메시지 수신:', data);
        });

        es.onerror = (error) => {
            console.error('SSE 에러:', error);
            setIsConnected(false);
            es.close();
            setEventSource(null);
        };

        setEventSource(es);

        // cleanup: 컴포넌트 언마운트 또는 user.id 변경 시
        return () => {
            console.log('SSE 연결 종료');
            es.close();
            setEventSource(null);
            setIsConnected(false);
        };
    }, [user?.id]); // user.id나 token이 변경될 때만 재연결

    const clearNotifications = () => {
        setNotifications([]);
    };

    const removeNotification = (index) => {
        setNotifications(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <SSEContext.Provider
            value={{
                notifications,
                isConnected,
                clearNotifications,
                removeNotification
            }}
        >
            {children}
        </SSEContext.Provider>
    );
}

export function useSSE() {
    const context = useContext(SSEContext);
    if (!context) {
        throw new Error('useSSE must be used within SSEProvider');
    }
    return context;
}