import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDoctorBookings,
  getAdminBookings,
  getBookingStats,
  getBookingAnalytics,
  updateBookingStatus,
  getRecentBookings
} from '../services/apiBookings';
import { getProviderTransactions, updateTransactionStatus } from '../services/apiFinancials';
import { toast } from 'react-hot-toast';
import supabase from '../services/supabase';
import BookingsTab from '../features/financial/BookingsTab';
import WithdrawalsTab from '../features/financial/WithdrawalsTab';
import FinancialOverview from '../features/financial/FinancialOverview';

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

// Card Components
const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn('text-sm text-gray-600', className)}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
};

// Table Components
const Table = ({ className, ...props }) => {
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
};

const TableHeader = ({ className, ...props }) => {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />;
};

const TableBody = ({ className, ...props }) => {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  );
};

const TableRow = ({ className, ...props }) => {
  return (
    <tr
      className={cn(
        'border-b border-gray-200 transition-colors hover:bg-gray-50/50',
        className
      )}
      {...props}
    />
  );
};

const TableHead = ({ className, ...props }) => {
  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
};

const TableCell = ({ className, ...props }) => {
  return (
    <td
      className={cn('p-4 align-middle [&:has([checkbox])]:pr-0', className)}
      {...props}
    />
  );
};

// Dropdown Menu Components
const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

const DropdownMenuTrigger = ({ children, onClick, ...props }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

const DropdownMenuContent = ({
  children,
  className,
  open,
  onClose,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    let timer;
    if (open) {
      // attach listener on next tick to avoid immediately catching the opening click
      timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg z-50',
        className
      )}
    >
      {children}
    </div>
  );
};

const DropdownMenuLabel = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-sm font-semibold',
        className
      )}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = ({ className }) => {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-gray-200', className)}
    />
  );
};

const DropdownMenuItem = ({
  children,
  onClick,
  className,
  disabled = false,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onClick?.();
  };

  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

// Select Components
const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          isOpen, 
          setIsOpen,
          value,
          onValueChange 
        })
      )}
    </div>
  );
};

const SelectTrigger = ({ className, children, isOpen, setIsOpen, value, ...props }) => {
  const displayValue = value === 'all' ? 'All Status' : 
                     value === 'completed' ? 'Completed' :
                     value === 'pending' ? 'Pending' :
                     value === 'failed' ? 'Failed' : 'Filter by status';

  return (
    <button
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      <span className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700">{displayValue}</span>
      </span>
      <i className={`ri-arrow-down-s-line h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

const SelectContent = ({ children, className, isOpen, setIsOpen, onValueChange }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute top-full left-0 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-700 shadow-md z-50',
        className
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

const SelectItem = ({ value, children, onValueChange, setIsOpen, ...props }) => {
  const handleClick = () => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100',
        props.className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

// Dialog Components
const Dialog = ({
  open,
  onOpenChange,
  children,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

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
        'bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto',
        className
      )}
      onClick={(e) => e.stopPropagation()}
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

const DialogFooter = ({ children, className }) => {
  return (
    <div className={cn('flex gap-2 pt-4', className)}>
      {children}
    </div>
  );
};

// Label Component
const Label = ({ className, children, ...props }) => {
  return (
    <label
      className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    >
      {children}
    </label>
  );
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

const TabsContent = ({
  value,
  children,
  className,
}) => {
  return (
    <div className={cn('mt-2', className)}>
      {children}
    </div>
  );
};

// Icon Components using remixicon
const SearchIcon = ({ className }) => (
  <i className={cn('ri-search-line', className)} />
);

const FilterIcon = ({ className }) => (
  <i className={cn('ri-filter-line', className)} />
);

const CalendarIcon = ({ className }) => (
  <i className={cn('ri-calendar-line', className)} />
);

const ClockIcon = ({ className }) => (
  <i className={cn('ri-time-line', className)} />
);

const UserIcon = ({ className }) => (
  <i className={cn('ri-user-line', className)} />
);

const BuildingIcon = ({ className }) => (
  <i className={cn('ri-building-line', className)} />
);

const CheckCircleIcon = ({ className }) => (
  <i className={cn('ri-checkbox-circle-line', className)} />
);

const XCircleIcon = ({ className }) => (
  <i className={cn('ri-close-circle-line', className)} />
);

const AlertCircleIcon = ({ className }) => (
  <i className={cn('ri-alert-line', className)} />
);

const MoreVerticalIcon = ({ className }) => (
  <i className={cn('ri-more-2-fill', className)} />
);

const DownloadIcon = ({ className }) => (
  <i className={cn('ri-download-line', className)} />
);

const EyeIcon = ({ className }) => (
  <i className={cn('ri-eye-line', className)} />
);

const EditIcon = ({ className }) => (
  <i className={cn('ri-edit-line', className)} />
);

const TrashIcon = ({ className }) => (
  <i className={cn('ri-delete-bin-line', className)} />
);

const SaveIcon = ({ className }) => (
  <i className={cn('ri-save-line', className)} />
);

const MoneyIcon = ({ className }) => (
  <i className={cn('ri-money-dollar-circle-line', className)} />
);

const WalletIcon = ({ className }) => (
  <i className={cn('ri-wallet-line', className)} />
);

const ExchangeIcon = ({ className }) => (
  <i className={cn('ri-exchange-dollar-line', className)} />
);

const TrendingUpIcon = ({ className }) => (
  <i className={cn('ri-trending-up-line', className)} />
);

const ReceiptIcon = ({ className }) => (
  <i className={cn('ri-receipt-line', className)} />
);

const AddIcon = ({ className }) => (
  <i className={cn('ri-add-line', className)} />
);

// Main Enhanced Component
const FinancialManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openWithdrawalDropdownId, setOpenWithdrawalDropdownId] = useState(null);
  const [page, setPage] = useState(1);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [showPlatformFeeDialog, setShowPlatformFeeDialog] = useState(false);
  const [newPlatformFee, setNewPlatformFee] = useState(20);
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState('all');

  const queryClient = useQueryClient();
  const PAGE_SIZE = 10;

  // Mutation for updating platform fee
  const { mutate: updatePlatformFee, isLoading: isUpdatingFee } = useMutation({
    mutationFn: async (newFee) => {
      const { data, error } = await supabase
        .from('settings')
        .upsert({ key: 'platform_fee', value: newFee })
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Platform fee updated successfully');
      setShowPlatformFeeDialog(false);
      queryClient.invalidateQueries(['bookingAnalytics']);
    },
    onError: (error) => {
      toast.error('Failed to update platform fee');
      console.error('Error updating platform fee:', error);
    }
  });

  // استخدام React Query لجلب بيانات الحجوزات
  const { 
    data: bookingsData, 
    isLoading: bookingsLoading, 
    error: bookingsError 
  } = useQuery({
    queryKey: ['adminBookings', { page, status: statusFilter }],
    queryFn: () => getAdminBookings({ 
      page, 
      pageSize: PAGE_SIZE,
      filters: { status: statusFilter === 'all' ? '' : statusFilter }
    }),
  });

  // جلب إحصائيات الحجوزات
  const { 
    data: bookingStats, 
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['bookingStats'],
    queryFn: getBookingStats,
  });

  // جلب التحليلات المالية
  const { 
    data: bookingAnalytics, 
    isLoading: analyticsLoading 
  } = useQuery({
    queryKey: ['bookingAnalytics'],
    queryFn: getBookingAnalytics,
  });

  // جلب الحجوزات الحديثة
  const { 
    data: recentBookings, 
    isLoading: recentLoading 
  } = useQuery({
    queryKey: ['recentBookings'],
    queryFn: () => getRecentBookings(5),
  });

  // جلب طلبات السحب (من prov_transactions type=withdrawal) مع بيانات المستخدم وطريقة الدفع
  const { 
    data: withdrawalRequestsData, 
    isLoading: withdrawalsLoading 
  } = useQuery({
    queryKey: ['providerWithdrawals', { page: withdrawalPage, status: withdrawalStatusFilter }],
    queryFn: () => getProviderTransactions('all', { 
      page: withdrawalPage, 
      pageSize: PAGE_SIZE,
      type: 'withdrawal',
      status: withdrawalStatusFilter === 'all' ? 'all' : withdrawalStatusFilter 
    }),
  });

  // Mutation لتحديث حالة طلب السحب في prov_transactions
  const { mutate: updateWithdrawalStatus } = useMutation({
    mutationFn: async ({ payoutId, status }) => {
      return updateTransactionStatus(payoutId, status, 'provider');
    },
    onSuccess: () => {
      toast.success('تم تحديث حالة طلب السحب بنجاح');
      queryClient.invalidateQueries(['providerWithdrawals']);
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء تحديث حالة طلب السحب');
      console.error('Error updating withdrawal status:', error);
    }
  });

  // Mutation لتحديث حالة الحجز
  const { mutate: updateBookingStatusMutation, isLoading: isUpdatingStatus } = useMutation({
    mutationFn: ({ bookingId, status, reason }) => 
      updateBookingStatus(bookingId, status, reason),
    onSuccess: () => {
      toast.success('Booking status updated successfully');
      queryClient.invalidateQueries(['adminBookings']);
      queryClient.invalidateQueries(['bookingStats']);
      queryClient.invalidateQueries(['bookingAnalytics']);
      setOpenDropdownId(null);
    },
    onError: (error) => {
      toast.error('Failed to update booking status');
      console.error('Error updating booking status:', error);
    },
  });

  const bookings = bookingsData?.data || [];
  const totalBookingsCount = bookingsData?.count || 0;
  const stats = bookingStats || {};
  const analytics = bookingAnalytics || {};
  const recent = recentBookings || [];

  // تصفية البيانات محلياً بناءً على البحث
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    
    return bookings.filter(booking => {
      const doctorName = booking.docId?.fullName || 'Unknown Doctor';
      const clinicName = booking.clinicId?.name || 'Unknown Clinic';
      const providerName = booking.provId?.fullName || 'Unknown Provider';
      
      const matchesSearch = 
        doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toString().includes(searchQuery);

      return matchesSearch;
    });
  }, [bookings, searchQuery]);

  // إحصائيات مالية محسوبة من بيانات الحجوزات
  const financialStats = useMemo(() => {
    // إجمالي الإيرادات من الحجوزات المكتملة والمدفوعة
    const totalRevenue = analytics.totalRevenue || 0;
    
    // الإيرادات الشهرية
    const monthlyRevenue = analytics.monthlyRevenue || 0;
    
    // العمولة (20% من إجمالي الإيرادات)
    const commission = analytics.commission || (totalRevenue * 0.2);
    
    // إجمالي المدفوعات
    const totalPayouts = analytics.pendingPayouts || (totalRevenue * 0.8);
    
    // المدفوعات المعلقة
    const pendingPayouts = analytics.pendingPayouts || 0;

    return {
      totalRevenue,
      monthlyRevenue,
      commission,
      totalPayouts,
      pendingPayouts,
      // إحصائيات الحجوزات
      totalBookings: stats.total || 0,
      completedBookings: stats.completed || 0,
      pendingBookings: stats.pending || 0,
      confirmedBookings: stats.confirmed || 0,
      cancelledBookings: stats.cancelled || 0,
    };
  }, [analytics, stats]);

  const statusConfig = {
    completed: { label: 'Completed', variant: 'success', icon: CheckCircleIcon },
    pending: { label: 'Pending', variant: 'warning', icon: AlertCircleIcon },
    confirmed: { label: 'Confirmed', variant: 'default', icon: CheckCircleIcon },
    cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircleIcon },
    paid: { label: 'Paid', variant: 'success', icon: CheckCircleIcon },
    unpaid: { label: 'Unpaid', variant: 'warning', icon: AlertCircleIcon }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
    setOpenDropdownId(null);
  };

  const handleUpdateStatus = (bookingId, status, reason = '') => {
    updateBookingStatusMutation({ bookingId, status, reason });
  };

  const handleDropdownToggle = (bookingId) => {
    setOpenDropdownId(openDropdownId === bookingId ? null : bookingId);
  };

  const handleWithdrawalDropdownToggle = (requestId) => {
    setOpenWithdrawalDropdownId(openWithdrawalDropdownId === requestId ? null : requestId);
  };

  const handleCloseWithdrawalDropdown = () => {
    setOpenWithdrawalDropdownId(null);
  };

  const handleCloseDropdown = () => {
    setOpenDropdownId(null);
  };

  // دالة لتحويل التاريخ
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
      currency: 'USD'
    }).format(amount || 0);
  };

  // دالة لتصدير التقرير
  const handleExportReport = () => {
    // إنشاء بيانات التقرير
    const reportData = {
      financialStats,
      bookings: filteredBookings,
      generatedAt: new Date().toISOString()
    };

    // تحويل إلى JSON
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    // إنشاء رابط تحميل
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Report exported successfully');
  };

  const isLoading = bookingsLoading || statsLoading || analyticsLoading || recentLoading;
  const error = bookingsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-600">
            <p>Error loading financial data: {error.message}</p>
            <Button 
              onClick={() => queryClient.refetchQueries()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all financial transactions, payouts, and revenue tracking
          </p>
        </div>

        {/* Enhanced Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <MoneyIcon className="h-5 w-5 text-green-500" />
                <CardDescription>Total Revenue</CardDescription>
              </div>
              <CardTitle className="text-3xl">{formatCurrency(financialStats.totalRevenue)}</CardTitle>
              <div className="text-sm text-gray-600 mt-1">
                From {financialStats.totalBookings} bookings
              </div>
            </CardHeader>
          </Card>
          {/* <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUpIcon className="h-5 w-5 text-blue-500" />
                <CardDescription>Monthly Revenue</CardDescription>
              </div>
              <CardTitle className="text-3xl">{formatCurrency(financialStats.monthlyRevenue)}</CardTitle>
              <div className="text-sm text-gray-600 mt-1">
                Current month earnings
              </div>
            </CardHeader>
          </Card> */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <WalletIcon className="h-5 w-5 text-yellow-500" />
                <CardDescription>Commission (20%)</CardDescription>
              </div>
              <CardTitle className="text-3xl">{formatCurrency(financialStats.commission)}</CardTitle>
              <div className="text-sm text-gray-600 mt-1">
                Platform profit
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <ExchangeIcon className="h-5 w-5 text-purple-500" />
                <CardDescription>Total Payouts</CardDescription>
              </div>
              <CardTitle className="text-3xl">{formatCurrency(financialStats.totalPayouts)}</CardTitle>
              <div className="text-sm text-gray-600 mt-1">
                To doctors & providers
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Bookings Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ReceiptIcon className="h-5 w-5 text-blue-500" />
                <CardDescription>Total Bookings</CardDescription>
              </div>
              <CardTitle className="text-2xl">{financialStats.totalBookings}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <CardDescription>Completed</CardDescription>
              </div>
              <CardTitle className="text-2xl">{financialStats.completedBookings}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
                <CardDescription>Pending</CardDescription>
              </div>
              <CardTitle className="text-2xl">{financialStats.pendingBookings}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]" />
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportReport}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
                All Bookings ({totalBookingsCount})
              </TabsTrigger>
              <TabsTrigger value="withdrawals" active={activeTab === 'withdrawals'} onClick={() => setActiveTab('withdrawals')}>
                Withdrawal Requests
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <FinancialOverview stats={financialStats} />
            </TabsContent>

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals" className="mt-0">
              <WithdrawalsTab />
            </TabsContent>

            <TabsContent value="bookings" className="mt-0">
              <BookingsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about booking transaction
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-500">Booking ID</Label>
                  <div className="font-medium">
                    BK-{selectedBooking.id.toString().padStart(3, '0')}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Status</Label>
                  <div>
                    <Badge
                      variant={
                        selectedBooking.status === 'completed' ? 'success' :
                        selectedBooking.status === 'pending' ? 'warning' :
                        selectedBooking.status === 'confirmed' ? 'default' :
                        selectedBooking.status === 'cancelled' ? 'destructive' : 'secondary'
                      }
                    >
                      {selectedBooking.status ? selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1) : 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-500">Doctor Information</Label>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {selectedBooking.docId?.fullName || 'Unknown Doctor'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedBooking.docId?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-500">Clinic & Provider</Label>
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <BuildingIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {selectedBooking.clinicId?.name || 'Unknown Clinic'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {selectedBooking.provId?.fullName || 'Unknown Provider'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm">
                          <strong>Pricing:</strong> {selectedBooking.selected_pricing || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <strong>Address:</strong> {selectedBooking.clinicId?.address || 'N/A'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-500">Amount</Label>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedBooking.price)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Booking Date</Label>
                    <div className="text-sm">{formatDate(selectedBooking.created_at)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-500">Financial Breakdown</Label>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Total Amount</div>
                          <div className="font-semibold">{formatCurrency(selectedBooking.price)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Platform Fee (20%)</div>
                          <div className="font-semibold text-green-600">{formatCurrency(selectedBooking.price * 0.2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Provider Payout (80%)</div>
                          <div className="font-semibold text-blue-600">{formatCurrency(selectedBooking.price * 0.8)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Platform Fee Dialog */}
      <Dialog open={showPlatformFeeDialog} onOpenChange={setShowPlatformFeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Platform Fee</DialogTitle>
            <DialogDescription>
              Adjust the platform fee percentage for future bookings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Platform Fee Percentage</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={newPlatformFee}
                  onChange={(e) => setNewPlatformFee(Math.max(0, Math.min(100, Number(e.target.value))))}
                  min="0"
                  max="100"
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500">
                This percentage will be applied to all new bookings
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlatformFeeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => updatePlatformFee(newPlatformFee)}
              disabled={isUpdatingFee}
            >
              {isUpdatingFee ? (
                <>
                  <span className="animate-spin mr-2">⌛</span>
                  Updating...
                </>
              ) : (
                'Update Fee'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialManagement;
