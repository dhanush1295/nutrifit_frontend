import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data && res.data.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markRead = async (notif) => {
    if (notif.is_read) return;
    try {
      await api.put(`/notifications/${notif.id}/read`);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const clearAll = async () => {
    try {
      await api.post('/notifications/clear');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, is_new: false })));
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  const newNotifications = notifications.filter(n => n.is_new);
  const pastNotifications = notifications.filter(n => !n.is_new);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const renderNotifRow = (notif, isPast = false) => {
    return (
      <div 
        key={notif.id}
        onClick={() => markRead(notif)}
        style={{
          display: 'flex', gap: '14px', alignItems: 'flex-start',
          padding: '14px', borderRadius: '16px',
          background: isPast ? '#0F0F18' : '#12121A',
          border: `1px solid ${isPast ? 'rgba(124, 58, 237, 0.08)' : 'rgba(124, 58, 237, 0.2)'}`,
          cursor: 'pointer', marginBottom: '12px'
        }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: notif.icon_bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: notif.icon_color, fontSize: '18px', flexShrink: 0
        }}>
          {notif.icon === 'drop.fill' ? '💧' : notif.icon === 'flame.fill' ? '🔥' : notif.icon === 'moon.fill' ? '🌙' : '🔔'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: isPast ? '#8B7AB8' : '#F0E6FF' }}>{notif.title}</span>
            <span style={{ fontSize: '11px', color: '#4B4566' }}>{notif.time}</span>
          </div>
          <div style={{ fontSize: '13px', color: isPast ? '#4B4566' : '#C4B5FD', lineHeight: '1.4' }}>
            {notif.body}
          </div>
        </div>
        {!notif.is_read && (
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C3AED', marginTop: '4px', flexShrink: 0 }} />
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '56px 20px 20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#F0E6FF', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0 }}
        >
          <ChevronLeft size={20} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Notifications</span>
        </button>
        <button 
          onClick={clearAll}
          style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
        >
          Clear All
        </button>
      </div>

      <div style={{ padding: '0 20px' }}>
        {newNotifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0E6FF' }}>New</span>
              {unreadCount > 0 && (
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'white', background: '#7C3AED', padding: '4px 8px', borderRadius: '10px' }}>
                  {unreadCount} UNREAD
                </span>
              )}
            </div>
            {newNotifications.map(n => renderNotifRow(n))}
          </div>
        )}

        {pastNotifications.length > 0 && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0E6FF', marginBottom: '12px' }}>Past</div>
            {pastNotifications.map(n => renderNotifRow(n, true))}
          </div>
        )}

        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', color: '#4B4566', marginTop: '60px', fontSize: '14px' }}>
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
}
