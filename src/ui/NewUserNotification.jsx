// src/components/RealTimeUserNotifications.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import supabase from '../services/supabase';

// دالة لدمج classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Badge Component
const Badge = ({ 
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-300 bg-white text-gray-700',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Button Component
const Button = ({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// أيقونات
const UserPlusIcon = ({ className }) => (
  <i className={cn('ri-user-add-line', className)} />
);

const CloseIcon = ({ className }) => (
  <i className={cn('ri-close-line', className)} />
);

const ExternalLinkIcon = ({ className }) => (
  <i className={cn('ri-external-link-line', className)} />
);

// مكون الإشعار الفردي
const NewUserNotification = ({ notification, onClose, onViewUser, style }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleViewUser = () => {
    onViewUser(notification.userId);
    onClose();
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
  };

  const getUserTypeBadge = (userType) => {
    const types = {
      doctor: { label: 'طبيب', variant: 'success' },
      provider: { label: 'مزود', variant: 'default' },
      patient: { label: 'مريض', variant: 'secondary' },
      admin: { label: 'مدير', variant: 'destructive' }
    };
    
    return types[userType] || { label: userType, variant: 'outline' };
  };

  const userTypeInfo = getUserTypeBadge(notification.userType);

  return (
    <div
      className={cn(
        'fixed z-50 w-80 transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      style={style}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlusIcon className="h-5 w-5 text-white" />
              <span className="text-white font-semibold text-sm">
                مستخدم جديد
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-start gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <UserPlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {notification.fullName || 'مستخدم بدون اسم'}
              </h4>
              <p className="text-gray-600 text-xs truncate">
                {notification.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={userTypeInfo.variant} className="text-xs">
                  {userTypeInfo.label}
                </Badge>
                <span className="text-gray-500 text-xs">
                  {getTimeAgo(notification.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {notification.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <span className="font-medium">الهاتف:</span>
              <span>{notification.phone}</span>
            </div>
          )}

          {notification.medicalLicenseNumber && (
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <span className="font-medium">رقم الترخيص:</span>
              <span>{notification.medicalLicenseNumber}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 text-xs"
              onClick={handleViewUser}
            >
              <ExternalLinkIcon className="h-3 w-3 ml-1" />
              عرض المستخدم
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              تجاهل
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-blue-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-10000 ease-linear"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

// المكون الرئيسي للإشعارات
const RealTimeUserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // الاشتراك في التغييرات في جدول المستخدمين
    const subscription = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          console.log('New user detected:', payload.new);
          
          // إضافة الإشعار الجديد
          const newNotification = {
            id: Date.now(), // استخدام timestamp كمعرف مؤقت
            ...payload.new,
            createdAt: new Date().toISOString()
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // عرض toast إضافي
          toast.success(`مستخدم جديد: ${payload.new.fullName || 'مستخدم بدون اسم'}`);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCloseNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const handleViewUser = (userId) => {
    // الانتقال إلى صفحة إدارة المستخدمين مع فتح تفاصيل المستخدم
    navigate('/admin/users?userId=' + userId);
  };

  // إغلاق الإشعار تلقائياً بعد 10 ثوانٍ
  useEffect(() => {
    const autoCloseTimer = setInterval(() => {
      if (notifications.length > 0) {
        const now = new Date();
        const expiredNotifications = notifications.filter(notif => {
          const notificationTime = new Date(notif.createdAt || notif.created_at);
          const diffInSeconds = (now - notificationTime) / 1000;
          return diffInSeconds > 10; // 10 ثواني
        });
        
        if (expiredNotifications.length > 0) {
          setNotifications(prev => 
            prev.filter(notif => 
              !expiredNotifications.some(expired => expired.id === notif.id)
            )
          );
        }
      }
    }, 1000);

    return () => clearInterval(autoCloseTimer);
  }, [notifications]);

  // عرض 3 إشعارات فقط في نفس الوقت
  const visibleNotifications = notifications.slice(0, 3);

  return (
    <>
      {visibleNotifications.map((notification, index) => (
        <NewUserNotification
          key={notification.id}
          notification={notification}
          onClose={() => handleCloseNotification(notification.id)}
          onViewUser={handleViewUser}
          style={{
            bottom: 20 + (index * 120), // ترتيب الإشعارات عمودياً
            right: 20
          }}
        />
      ))}
    </>
  );
};

export default RealTimeUserNotifications;