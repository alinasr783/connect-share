import {Outlet} from "react-router-dom";
import Sidebar from "../../ui/Sidebar";
import { useEffect, useState } from "react";
import supabase from "../../services/supabase";
import { useRealTimeNotifications } from "../../services/useRealTimeNotifications";

function AdminAppLayout() {
  const [isConnected, setIsConnected] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  console.log('🏠 AdminAppLayout component rendering...');

  // استخدام الـ hook للإشعارات في الوقت الحقيقي
  useRealTimeNotifications();

  const links = [
    {to: "clinics", label: "Clinics", icon: "ri-hospital-line"},
    {to: "users", label: "Users", icon: "ri-user-line"},
    {to: "bookings", label: "Bookings", icon: "ri-calendar-line"},
    {to: "financial-management", label: "Financials", icon: "ri-money-dollar-circle-line"},
    {to: "notifications", label: "Notifications", icon: "ri-notification-2-line"},
    {to: "articles", label: "Articles", icon: "ri-file-text-line"},
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
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar links={links} />
      </div>

      {/* Mobile header with toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center justify-between px-4 h-12">
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
        >
          <i className={mobileOpen ? "ri-close-line" : "ri-menu-line"}></i>
        </button>
        <div className="text-sm text-gray-700">Admin Panel</div>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-12 left-0 bottom-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
            <Sidebar links={links} />
          </div>
        </div>
      )}

      

      <main className="flex-1 p-6 overflow-y-auto bg-gray-100/80 md:pt-0 pt-14">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminAppLayout;