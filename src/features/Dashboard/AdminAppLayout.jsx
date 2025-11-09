import {Outlet} from "react-router-dom";
import Sidebar from "../../ui/Sidebar";
import { useEffect, useState } from "react";
import supabase from "../../services/supabase";
import { useRealTimeNotifications } from "../../services/useRealTimeNotifications";

function AdminAppLayout() {
  const [isConnected, setIsConnected] = useState(false);

  console.log('🏠 AdminAppLayout component rendering...');

  // استخدام الـ hook للإشعارات في الوقت الحقيقي
  useRealTimeNotifications();

  const links = [
    {to: "clinics", label: "Clinics", icon: "ri-hospital-line"},
    {to: "users", label: "Users", icon: "ri-user-line"},
    {to: "bookings", label: "Bookings", icon: "ri-calendar-line"},
    {to: "financial-management", label: "Financials", icon: "ri-money-dollar-circle-line"},
  ];

  // دالة للتحقق من اتصال Realtime
  const checkRealtimeConnection = () => {
    console.log('🔌 Checking realtime connection...');
    
    const connectionTest = supabase.channel('connection-test');
    
    connectionTest
      .on('system', { event: 'connected' }, () => {
        console.log('✅ Realtime connection established');
        setIsConnected(true);
        // إغلاق قناة الاختبار بعد التأكد من الاتصال
        setTimeout(() => {
          console.log('🔌 Closing test connection channel');
          connectionTest.unsubscribe();
        }, 2000);
      })
      .on('system', { event: 'disconnected' }, () => {
        console.log('❌ Realtime connection lost');
        setIsConnected(false);
      })
      .on('system', { event: 'reconnected' }, () => {
        console.log('🔄 Realtime connection reestablished');
        setIsConnected(true);
      })
      .subscribe((status) => {
        console.log('🔌 Connection test channel status:', status);
      });
  };

  useEffect(() => {
    console.log('📦 AdminAppLayout mounted - setting up connection check');
    
    // التحقق من الاتصال أولاً
    checkRealtimeConnection();

    // لا حاجة للاشتراكات الإضافية هنا لأنها موجودة في useRealTimeNotifications
    // هذا يمنع الازدواجية والإشعارات المكررة

    return () => {
      console.log('🗑️ AdminAppLayout unmounted');
    };
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar links={links} />
      
      {/* مؤشر حالة الاتصال */}
      {!isConnected && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-md text-sm flex items-center gap-2 shadow-sm">
            <i className="ri-wifi-off-line"></i>
            <span>Realtime connection offline</span>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 rounded-md text-sm flex items-center gap-2 shadow-sm">
            <i className="ri-wifi-line"></i>
            <span>Realtime connected</span>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 overflow-y-auto bg-gray-100/80">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminAppLayout;