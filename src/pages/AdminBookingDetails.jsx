import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getAdminBookingDetails, 
  updateBookingStatus, 
  updateBooking, 
  deleteBooking,
  cancelBooking 
} from '../services/apiBookings';
import { toast } from 'react-hot-toast';

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
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    whatsapp: 'bg-green-500 text-white hover:bg-green-600',
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
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
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

// Input Component
const Input = ({
  className,
  ...props
}) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

// Textarea Component
const Textarea = ({
  className,
  ...props
}) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

// Dialog Components
const Dialog = ({
  open,
  onOpenChange,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

const DialogContent = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

const DialogTitle = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

const DialogDescription = ({ children }) => {
  return <p className="text-sm text-gray-600 mt-1">{children}</p>;
};

// Tabs Components
const Tabs = ({
  value,
  onValueChange,
  children,
}) => {
  return <div>{children}</div>;
};

const TabsList = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600',
        className
      )}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({
  value,
  children,
  active,
  onClick,
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        active && 'bg-white text-gray-900 shadow-sm'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Icon Components using remixicon
const CalendarIcon = ({ className }) => (
  <i className={cn('ri-calendar-line', className)} />
);

const MapPinIcon = ({ className }) => (
  <i className={cn('ri-map-pin-line', className)} />
);

const MoneyIcon = ({ className }) => (
  <i className={cn('ri-money-dollar-circle-line', className)} />
);

const TimeIcon = ({ className }) => (
  <i className={cn('ri-time-line', className)} />
);

const UserIcon = ({ className }) => (
  <i className={cn('ri-user-line', className)} />
);

const BuildingIcon = ({ className }) => (
  <i className={cn('ri-building-line', className)} />
);

const EditIcon = ({ className }) => (
  <i className={cn('ri-edit-line', className)} />
);

const SaveIcon = ({ className }) => (
  <i className={cn('ri-save-line', className)} />
);

const TrashIcon = ({ className }) => (
  <i className={cn('ri-delete-bin-line', className)} />
);

const ArrowLeftIcon = ({ className }) => (
  <i className={cn('ri-arrow-left-line', className)} />
);

const CheckIcon = ({ className }) => (
  <i className={cn('ri-check-line', className)} />
);

const CloseIcon = ({ className }) => (
  <i className={cn('ri-close-line', className)} />
);

const HistoryIcon = ({ className }) => (
  <i className={cn('ri-history-line', className)} />
);

const FileTextIcon = ({ className }) => (
  <i className={cn('ri-file-text-line', className)} />
);

const ImageIcon = ({ className }) => (
  <i className={cn('ri-image-line', className)} />
);

const DownloadIcon = ({ className }) => (
  <i className={cn('ri-download-line', className)} />
);

const EyeIcon = ({ className }) => (
  <i className={cn('ri-eye-line', className)} />
);

const WhatsAppIcon = ({ className }) => (
  <i className={cn('ri-whatsapp-line', className)} />
);

// Payment Proof Dialog Component
const PaymentProofDialog = ({ open, onOpenChange, imageUrl, paymentMethod }) => {
  if (!open) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `payment-proof-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Payment Proof</DialogTitle>
          <DialogDescription>
            Payment method: {paymentMethod}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Payment proof"
              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-gray-200"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// WhatsApp Message Dialog Component
const WhatsAppDialog = ({ 
  open, 
  onOpenChange, 
  phoneNumber, 
  message, 
  recipientName,
  type 
}) => {
  if (!open) return null;

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Send WhatsApp Message to {recipientName}
          </DialogTitle>
          <DialogDescription>
            {type === 'payment' 
              ? 'Confirm payment success to doctor' 
              : 'Notify clinic owner about booking'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Message Preview:</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => onOpenChange(false)} 
              variant="outline" 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendWhatsApp}
              variant="whatsapp"
              className="flex-1"
            >
              <WhatsAppIcon className="h-4 w-4 mr-2" />
              Send via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
const BookingProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [paymentProofOpen, setPaymentProofOpen] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState({
    phoneNumber: '',
    message: '',
    recipientName: '',
    type: '' // 'payment' or 'booking'
  });
  const [editForm, setEditForm] = useState({
    price: '',
    selected_pricing: '',
    status: '',
    payment_status: '',
    selected_date: '',
    selected_hours: ''
  });
  const [cancelReason, setCancelReason] = useState('');

  const queryClient = useQueryClient();

  // جلب بيانات الحجز
  const { 
    data: booking, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getAdminBookingDetails(id),
    enabled: !!id
  });

  // Mutation لتحديث بيانات الحجز
  const { mutate: updateBookingMutation, isLoading: isUpdatingBooking } = useMutation({
    mutationFn: ({ id, updateData }) => updateBooking({ id, updateData }),
    onSuccess: () => {
      toast.success('Booking updated successfully');
      queryClient.invalidateQueries(['booking', id]);
      setEditOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update booking');
      console.error('Error updating booking:', error);
    },
  });

  // Mutation لتحديث حالة الحجز
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useMutation({
    mutationFn: ({ id, status, reason }) => updateBookingStatus(id, status, reason),
    onSuccess: () => {
      toast.success('Booking status updated successfully');
      queryClient.invalidateQueries(['booking', id]);
      setCancelOpen(false);
      setCancelReason('');
    },
    onError: (error) => {
      toast.error('Failed to update booking status');
      console.error('Error updating booking status:', error);
    },
  });

  // Mutation لحذف الحجز
  const { mutate: deleteBookingMutation, isLoading: isDeletingBooking } = useMutation({
    mutationFn: (id) => deleteBooking(id),
    onSuccess: () => {
      toast.success('Booking deleted successfully');
      navigate('/admin/bookings');
    },
    onError: (error) => {
      toast.error('Failed to delete booking');
      console.error('Error deleting booking:', error);
    },
  });

  // تهيئة نموذج التعديل عند فتح Dialog
  useEffect(() => {
    if (booking && editOpen) {
      setEditForm({
        price: booking.price || '',
        selected_pricing: booking.selected_pricing || '',
        status: booking.status || '',
        payment_status: booking.payment_status || '',
        selected_date: booking.selected_date ? JSON.stringify(booking.selected_date) : '',
        selected_hours: booking.selected_hours ? JSON.stringify(booking.selected_hours) : '',
        platform_fee_percentage: booking.platform_fee_percentage || 20
      });
    }
  }, [booking, editOpen]);

  const handleUpdateBooking = () => {
    if (!booking) return;

    const updateData = {
      ...editForm,
      price: Number(editForm.price),
      selected_date: editForm.selected_date ? JSON.parse(editForm.selected_date) : null,
      selected_hours: editForm.selected_hours ? JSON.parse(editForm.selected_hours) : null
    };

    updateBookingMutation({ 
      id: booking.id, 
      updateData 
    });
  };

  const handleConfirmDelete = () => {
    if (!booking) return;
    deleteBookingMutation(booking.id);
  };

  const handleConfirmCancel = () => {
    if (!booking) return;
    updateStatus({ id: booking.id, status: 'cancelled', reason: cancelReason });
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'cancelled') {
      setCancelOpen(true);
    } else {
      updateStatus({ id: booking.id, status: newStatus, reason: '' });
    }
  };

  const handlePaymentStatusChange = (newPaymentStatus) => {
    updateBookingMutation({ 
      id: booking.id, 
      updateData: { payment_status: newPaymentStatus } 
    });
  };

  const handleWhatsAppPaymentConfirmation = () => {
    if (!booking?.docId?.phone) {
      toast.error('Doctor phone number not available');
      return;
    }

    const message = `مرحباً دكتور ${booking.docId.fullName || ''},

تم تأكيد عملية الدفع بنجاح لحجزك في العيادة.

تفاصيل الحجز:
- رقم الحجز: #${booking.id}
- العيادة: ${booking.clinicId?.name || ''}
- المبلغ: ${formatCurrency(booking.price)}
- حالة الدفع: تم التأكيد

شكراً لاستخدامك منصتنا!

مع تحيات،
فريق المنصة`;

    setWhatsAppData({
      phoneNumber: booking.docId.phone,
      message: message,
      recipientName: `Dr. ${booking.docId.fullName || ''}`,
      type: 'payment'
    });
    setWhatsAppOpen(true);
  };

  const handleWhatsAppBookingNotification = () => {
    if (!booking?.provId?.phone) {
      toast.error('Clinic owner phone number not available');
      return;
    }

    const selectedDate = parseJsonDate(booking.selected_date);
    const selectedHours = parseJsonDate(booking.selected_hours);

    const message = `مرحباً ${booking.provId.fullName || 'مالك العيادة'},

تم حجز العيادة الخاصة بك بنجاح.

تفاصيل الحجز:
- رقم الحجز: #${booking.id}
- الدكتور: ${booking.docId?.fullName || ''}
- الأيام: ${selectedDate}
- الوقت: ${selectedHours}
- نوع الحجز: ${booking.selected_pricing || ''}
- المبلغ: ${formatCurrency(booking.price)}

يرجى التحضير لاستقبال الدكتور في الموعد المحدد.

مع تحيات،
فريق المنصة`;

    setWhatsAppData({
      phoneNumber: booking.provId.phone,
      message: message,
      recipientName: booking.provId.fullName || 'Clinic Owner',
      type: 'booking'
    });
    setWhatsAppOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'destructive',
      completed: 'default',
      unconfirmed: 'secondary',
    };
    
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {statusText}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      paid: 'success',
      unpaid: 'destructive',
      refunded: 'warning',
      pending: 'warning',
    };
    
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {statusText}
      </Badge>
    );
  };

  const getAvatarUrl = (user) => {
    if (!user) return '';
    const seed = user.fullName || user.email || 'user';
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const parseJsonDate = (jsonDate) => {
    if (!jsonDate) return 'N/A';
    try {
      const dateObj = typeof jsonDate === 'string' ? JSON.parse(jsonDate) : jsonDate;
      if (dateObj && dateObj.days && Array.isArray(dateObj.days)) {
        return dateObj.days.join(', ');
      }
      if (dateObj && dateObj.start) {
        return formatDate(dateObj.start);
      }
      return formatDate(jsonDate);
    } catch (error) {
      return formatDate(jsonDate);
    }
  };

  const parseJsonHours = (jsonHours) => {
    if (!jsonHours) return 'N/A';
    try {
      const hoursObj = typeof jsonHours === 'string' ? JSON.parse(jsonHours) : jsonHours;
      if (hoursObj && hoursObj.startTime && hoursObj.endTime) {
        return `${hoursObj.startTime} - ${hoursObj.endTime}`;
      }
      return JSON.stringify(hoursObj);
    } catch (error) {
      return 'N/A';
    }
  };

  const calculateFinancials = () => {
    const total = booking?.price || 0;
    const platformFeePercentage = booking?.platform_fee_percentage || 20;
    const commission = total * (platformFeePercentage / 100);
    const hostPayout = total - commission;
    
    return { total, commission, hostPayout, platformFeePercentage };
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      bank: 'Bank Transfer',
      instapay: 'InstaPay',
      ewallet: 'E-Wallet'
    };
    return methods[method] || method || 'N/A';
  };

  const financialData = calculateFinancials();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-600">
            <p>Error loading booking: {error?.message || 'Booking not found'}</p>
            <Button 
              onClick={() => navigate('/admin/bookings')} 
              className="mt-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/bookings')}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Bookings
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Booking #{booking.id}</h1>
                <p className="text-gray-600">Manage and view booking details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2"
              >
                <EditIcon className="h-4 w-4" />
                Edit Booking
              </Button>
              <Button
                variant="warning"
                onClick={() => handleStatusChange('cancelled')}
                disabled={booking.status === 'cancelled'}
                className="flex items-center gap-2"
              >
                <CloseIcon className="h-4 w-4" />
                Cancel Booking
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Booking
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  #{booking.id}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{booking.clinicId?.name}</h2>
                <p className="text-gray-600 mb-2">{formatDate(booking.created_at)}</p>
                <div className="mb-4">
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <MoneyIcon className="h-4 w-4" />
                    <span>{formatCurrency(booking.price)}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <TimeIcon className="h-4 w-4" />
                    <span>{parseJsonHours(booking.selected_hours)}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{parseJsonDate(booking.selected_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={booking.status === 'confirmed'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Confirm Booking
                </Button>
                
                <Button
                  onClick={() => handleStatusChange('completed')}
                  disabled={booking.status === 'completed'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Mark Completed
                </Button>

                <Button
                  onClick={() => handlePaymentStatusChange('paid')}
                  disabled={booking.payment_status === 'paid'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <MoneyIcon className="h-4 w-4" />
                  Mark as Paid
                </Button>

                <Button
                  onClick={() => handlePaymentStatusChange('refunded')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                >
                  <MoneyIcon className="h-4 w-4" />
                  Process Refund
                </Button>

                {/* WhatsApp Actions */}
                <div className="border-t pt-4 mt-4 space-y-2">
                  <Button
                    onClick={handleWhatsAppPaymentConfirmation}
                    variant="whatsapp"
                    className="w-full flex items-center gap-2"
                    disabled={!booking?.docId?.phone}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Notify Doctor (Payment)
                  </Button>

                  <Button
                    onClick={handleWhatsAppBookingNotification}
                    variant="whatsapp"
                    className="w-full flex items-center gap-2"
                    disabled={!booking?.provId?.phone}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Notify Owner (Booking)
                  </Button>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Financial Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="font-semibold">{formatCurrency(financialData.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Platform Fee ({financialData.platformFeePercentage}%)</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(financialData.commission)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Host Payout</span>
                  <span className="font-semibold text-green-600">{formatCurrency(financialData.hostPayout)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Net Profit</span>
                  <span className="font-bold text-purple-600">{formatCurrency(financialData.commission)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <TabsList className="w-full">
                <TabsTrigger
                  value="overview"
                  active={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="participants"
                  active={activeTab === 'participants'}
                  onClick={() => setActiveTab('participants')}
                >
                  Participants
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  active={activeTab === 'financial'}
                  onClick={() => setActiveTab('financial')}
                >
                  Financial
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  active={activeTab === 'timeline'}
                  onClick={() => setActiveTab('timeline')}
                >
                  Timeline
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Booking Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Clinic Name</p>
                          <p className="font-semibold text-gray-900">
                            {booking.clinicId?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Booking Date</p>
                          <p className="text-gray-900">
                            {formatDate(booking.created_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Selected Date</p>
                          <p className="text-gray-900">
                            {parseJsonDate(booking.selected_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Selected Hours</p>
                          <p className="text-gray-900">
                            {parseJsonHours(booking.selected_hours)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Clinic Address</p>
                          <p className="text-gray-900">
                            {booking.clinicId?.address || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rental Type</p>
                          <p className="text-gray-900">
                            {booking.selected_pricing || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Booking Status</p>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment Status</p>
                          {getPaymentStatusBadge(booking.payment_status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof Section */}
                  {booking.image && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Payment Proof</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Payment Method</p>
                          <p className="font-semibold text-gray-900">
                            {getPaymentMethodText(booking.payment_method)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Payment Proof Image</p>
                          <div className="flex items-center gap-3">
                            <div 
                              className="relative group cursor-pointer"
                              onClick={() => setPaymentProofOpen(true)}
                            >
                              <img
                                src={booking.image}
                                alt="Payment proof"
                                className="h-20 w-20 object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                <EyeIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPaymentProofOpen(true)}
                              className="flex items-center gap-2"
                            >
                              <EyeIcon className="h-4 w-4" />
                              View Full Size
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Clinic Details */}
                  {booking.clinicId && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Clinic Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500">District</p>
                          <p className="text-gray-900">{booking.clinicId.district || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Specialty</p>
                          <p className="text-gray-900">{booking.clinicId.specialty || "N/A"}</p>
                        </div>
                        {booking.clinicId.features && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500 mb-2">Features</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(booking.clinicId.features).map(([key, value]) => (
                                value && (
                                  <Badge key={key} variant="secondary" className="text-xs">
                                    {key}
                                  </Badge>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Participants Tab */}
              {activeTab === 'participants' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Participants</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Doctor</h4>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={getAvatarUrl(booking.docId)}
                          alt={booking.docId?.fullName}
                          className="h-12 w-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.docId?.fullName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.docId?.email || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.docId?.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                      {booking.docId?.specialties && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Specialties</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(booking.docId.specialties) ? (
                              booking.docId.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                {booking.docId.specialties}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Provider Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Host (Provider)</h4>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={getAvatarUrl(booking.provId)}
                          alt={booking.provId?.fullName}
                          className="h-12 w-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.provId?.fullName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.provId?.email || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.provId?.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Financial Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MoneyIcon className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700">Total Amount</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(financialData.total)}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MoneyIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-700">Platform Commission</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(financialData.commission)}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MoneyIcon className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700">Host Payout</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(financialData.hostPayout)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Payment Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <div className="mt-1">{getPaymentStatusBadge(booking.payment_status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rental Type</p>
                        <p className="font-semibold">{booking.selected_pricing || "N/A"}</p>
                      </div>
                      {booking.payment_method && (
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="font-semibold">{getPaymentMethodText(booking.payment_method)}</p>
                        </div>
                      )}
                    </div>

                    {/* Payment Proof in Financial Tab */}
                    {booking.image && (
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-900">Payment Proof</h5>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPaymentProofOpen(true)}
                            className="flex items-center gap-2"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View Full Size
                          </Button>
                        </div>
                        <div className="flex justify-center">
                          <div 
                            className="relative group cursor-pointer"
                            onClick={() => setPaymentProofOpen(true)}
                          >
                            <img
                              src={booking.image}
                              alt="Payment proof"
                              className="h-40 w-auto object-contain rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <EyeIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Actions */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Financial Actions</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => handlePaymentStatusChange('paid')}
                        disabled={booking.payment_status === 'paid'}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark as Paid
                      </Button>
                      <Button
                        onClick={() => handlePaymentStatusChange('unpaid')}
                        disabled={booking.payment_status === 'unpaid'}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Mark as Unpaid
                      </Button>
                      <Button
                        onClick={() => handlePaymentStatusChange('refunded')}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Process Refund
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Booking Timeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                        <FileTextIcon className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-gray-900">
                          Booking created by {booking.docId?.fullName || "Doctor"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center">
                        <TimeIcon className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-gray-900">
                          Status set to {booking.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.created_at)}
                        </p>
                      </div>
                    </div>

                    {booking.status === 'confirmed' && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
                          <CheckIcon className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-gray-900">
                            Booking confirmed by {booking.provId?.fullName || "Host"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.updated_at)}
                          </p>
                        </div>
                      </div>
                    )}

                    {booking.status === 'completed' && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center">
                          <CheckIcon className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-gray-900">
                            Booking marked as completed
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.updated_at)}
                          </p>
                        </div>
                      </div>
                    )}

                    {booking.status === 'cancelled' && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center">
                          <CloseIcon className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-gray-900">
                            Booking was cancelled
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.updated_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Booking Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update information for Booking #{booking?.id}
            </DialogDescription>
          </DialogHeader>
          {booking && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rental Type
                  </label>
                  <select
                    value={editForm.selected_pricing}
                    onChange={(e) => setEditForm({...editForm, selected_pricing: e.target.value})}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="commission">Commission</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editForm.payment_status}
                    onChange={(e) => setEditForm({...editForm, payment_status: e.target.value})}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Fee Percentage
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={editForm.platform_fee_percentage}
                      onChange={(e) => setEditForm({...editForm, platform_fee_percentage: e.target.value})}
                      placeholder="Platform fee percentage"
                      min="0"
                      max="100"
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Date (JSON)
                  </label>
                  <Textarea
                    value={editForm.selected_date}
                    onChange={(e) => setEditForm({...editForm, selected_date: e.target.value})}
                    placeholder='{"start": "2024-01-01", "end": "2024-01-01"}'
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Hours (JSON)
                  </label>
                  <Textarea
                    value={editForm.selected_hours}
                    onChange={(e) => setEditForm({...editForm, selected_hours: e.target.value})}
                    placeholder='{"start": "09:00", "end": "17:00"}'
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setEditOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                  disabled={isUpdatingBooking}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateBooking}
                  className="flex-1"
                  disabled={isUpdatingBooking || !editForm.price}
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {isUpdatingBooking ? 'Updating...' : 'Update Booking'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Booking #{booking?.id}? This action cannot be undone and will permanently remove all booking data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => setDeleteOpen(false)} 
              variant="outline" 
              className="flex-1"
              disabled={isDeletingBooking}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              variant="destructive"
              className="flex-1"
              disabled={isDeletingBooking}
            >
              {isDeletingBooking ? 'Deleting...' : 'Delete Booking'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Cancel Booking #{booking?.id}? This will mark the booking as cancelled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for cancellation (optional)
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setCancelOpen(false)} 
                variant="outline" 
                className="flex-1"
                disabled={isUpdatingStatus}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmCancel}
                variant="destructive"
                className="flex-1"
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Proof Dialog */}
      {booking?.image && (
        <PaymentProofDialog
          open={paymentProofOpen}
          onOpenChange={setPaymentProofOpen}
          imageUrl={booking.image}
          paymentMethod={getPaymentMethodText(booking.payment_method)}
        />
      )}

      {/* WhatsApp Dialog */}
      <WhatsAppDialog
        open={whatsAppOpen}
        onOpenChange={setWhatsAppOpen}
        phoneNumber={whatsAppData.phoneNumber}
        message={whatsAppData.message}
        recipientName={whatsAppData.recipientName}
        type={whatsAppData.type}
      />
    </div>
  );
};

export default BookingProfile;