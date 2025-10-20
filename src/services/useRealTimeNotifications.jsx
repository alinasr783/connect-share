import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import supabase from './supabase';

console.log('🔄 useRealTimeNotifications.jsx is loading...');

// مكون الإشعار المخصص
const CustomNotification = ({ type, title, message, time, onClose }) => {
  console.log('🎨 CustomNotification component rendered', { type, title });
  
  const getIcon = () => {
    switch (type) {
      case 'clinic':
        return 'ri-hospital-line text-blue-500';
      case 'booking':
        return 'ri-calendar-line text-green-500';
      case 'user':
        return 'ri-user-line text-purple-500';
      default:
        return 'ri-notification-line text-gray-500';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'clinic':
        return 'bg-blue-50 border-blue-200';
      case 'booking':
        return 'bg-green-50 border-green-200';
      case 'user':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${getBgColor()} shadow-sm max-w-sm animate-in slide-in-from-right-5 duration-300`}>
      <div className="flex-shrink-0">
        <i className={`${getIcon()} text-lg`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
        <p className="text-xs text-gray-400 mt-2">{time}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i className="ri-close-line"></i>
      </button>
    </div>
  );
};

export const useRealTimeNotifications = () => {
  console.log('🚀 useRealTimeNotifications hook called');

  // دالة لعرض الإشعارات المخصصة
  const showCustomNotification = (type, title, message) => {
    console.log('📢 Showing notification:', { type, title, message });
    
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    toast.custom(
      (t) => (
        <CustomNotification 
          type={type}
          title={title}
          message={message}
          time={time}
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 6000,
        position: 'bottom-right',
      }
    );
  };

  useEffect(() => {
    console.log('🎯 useEffect in useRealTimeNotifications started');
    console.log('🔗 Supabase instance:', supabase ? 'Connected' : 'Not connected');

    // التحقق من اتصال Supabase أولاً
    const testConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection...');
        const { data, error } = await supabase.from('clinics').select('count').limit(1);
        if (error) {
          console.error('❌ Supabase connection test failed:', error);
        } else {
          console.log('✅ Supabase connection test passed');
        }
      } catch (error) {
        console.error('❌ Supabase connection test error:', error);
      }
    };

    testConnection();

    // الاشتراك في جدول العيادات
    console.log('📡 Subscribing to clinics table...');
    const clinicsSubscription = supabase
      .channel('admin-clinics-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clinics'
        },
        async (payload) => {
          console.log('🏥 New clinic added:', payload.new);
          const clinic = payload.new;
          
          try {
            console.log('🔍 Fetching clinic owner data...');
            const { data: ownerData, error: ownerError } = await supabase
              .from('users')
              .select('fullName')
              .eq('userId', clinic.userId)
              .single();

            if (ownerError) {
              console.error('❌ Error fetching owner data:', ownerError);
            }

            showCustomNotification(
              'clinic',
              'New Clinic Added 🏥',
              `${clinic.name} by ${ownerData?.fullName || 'Provider'}`
            );
          } catch (error) {
            console.error('❌ Error in clinic notification:', error);
            showCustomNotification(
              'clinic',
              'New Clinic Added 🏥',
              `${clinic.name} has been added`
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('🏥 Clinics subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to clinics table');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Failed to subscribe to clinics table');
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Clinics subscription timed out');
        }
      });

    // الاشتراك في جدول الحجوزات
    console.log('📡 Subscribing to bookings table...');
    const bookingsSubscription = supabase
      .channel('admin-bookings-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rentals'
        },
        async (payload) => {
          console.log('📅 New booking added:', payload.new);
          const booking = payload.new;
          
          try {
            console.log('🔍 Fetching booking details...');
            const [clinicPromise, doctorPromise, providerPromise] = await Promise.allSettled([
              supabase.from('clinics').select('name').eq('id', booking.clinicId).single(),
              supabase.from('users').select('fullName').eq('userId', booking.docId).single(),
              supabase.from('users').select('fullName').eq('userId', booking.provId).single()
            ]);

            console.log('📊 Booking details results:', {
              clinic: clinicPromise.status,
              doctor: doctorPromise.status,
              provider: providerPromise.status
            });

            const clinicName = clinicPromise.status === 'fulfilled' ? clinicPromise.value.data?.name : 'Clinic';
            const doctorName = doctorPromise.status === 'fulfilled' ? doctorPromise.value.data?.fullName : 'Doctor';
            const providerName = providerPromise.status === 'fulfilled' ? providerPromise.value.data?.fullName : 'Provider';

            showCustomNotification(
              'booking',
              'New Booking Created 📅',
              `At ${clinicName} by Dr. ${doctorName}`
            );
          } catch (error) {
            console.error('❌ Error in booking notification:', error);
            showCustomNotification(
              'booking',
              'New Booking Created 📅',
              'A new booking has been created'
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('📅 Bookings subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to bookings table');
        }
      });

    // الاشتراك في جدول المستخدمين
    console.log('📡 Subscribing to users table...');
    const usersSubscription = supabase
      .channel('admin-users-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          console.log('👤 New user added:', payload.new);
          const user = payload.new;
          
          showCustomNotification(
            'user',
            'New User Registered 👤',
            `${user.fullName || 'User'} joined as ${user.userType}`
          );
        }
      )
      .subscribe((status) => {
        console.log('👤 Users subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to users table');
        }
      });

    // الاشتراك في تحديثات حالة الحجوزات
    console.log('📡 Subscribing to booking updates...');
    const bookingsUpdateSubscription = supabase
      .channel('admin-bookings-updates-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rentals'
        },
        async (payload) => {
          console.log('🔄 Booking updated:', { old: payload.old, new: payload.new });
          const booking = payload.new;
          const oldBooking = payload.old;

          // عرض إشعار فقط عند تغيير الحالة
          if (booking.status !== oldBooking.status) {
            console.log('📊 Booking status changed:', { from: oldBooking.status, to: booking.status });
            
            try {
              const { data: clinicData, error: clinicError } = await supabase
                .from('clinics')
                .select('name')
                .eq('id', booking.clinicId)
                .single();

              if (clinicError) {
                console.error('❌ Error fetching clinic for update:', clinicError);
              }

              showCustomNotification(
                'booking',
                'Booking Status Updated 🔄',
                `Booking at ${clinicData?.name || 'clinic'} is now ${booking.status}`
              );
            } catch (error) {
              console.error('❌ Error in booking update notification:', error);
              showCustomNotification(
                'booking',
                'Booking Status Updated 🔄',
                `Booking status changed to ${booking.status}`
              );
            }
          } else {
            console.log('📝 Booking updated but status unchanged, skipping notification');
          }
        }
      )
      .subscribe((status) => {
        console.log('🔄 Bookings updates subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to booking updates');
        }
      });

    console.log('🎉 All subscriptions set up successfully');

    // تنظيف الاشتراكات عند إلغاء التثبيت
    return () => {
      console.log('🧹 Cleaning up realtime subscriptions from useRealTimeNotifications hook');
      console.log('📊 Unsubscribing from:', {
        clinics: !!clinicsSubscription,
        bookings: !!bookingsSubscription,
        users: !!usersSubscription,
        bookingUpdates: !!bookingsUpdateSubscription
      });
      
      clinicsSubscription.unsubscribe();
      bookingsSubscription.unsubscribe();
      usersSubscription.unsubscribe();
      bookingsUpdateSubscription.unsubscribe();
      
      console.log('✅ All subscriptions cleaned up');
    };
  }, []);

  console.log('🏁 useRealTimeNotifications hook setup completed');
};