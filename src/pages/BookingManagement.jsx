import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAdminBookings, updateBooking } from '../services/apiBookings';
import { toast } from 'react-hot-toast';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

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
        'h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
};

const TableCell = ({ className, ...props }) => {
  return (
    <td
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
};

const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

const DropdownMenuTrigger = ({ children, onClick, ...props }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
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

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

const DropdownMenuItem = ({
  children,
  onClick,
  className,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

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
                     value === 'confirmed' ? 'Confirmed' :
                     value === 'pending' ? 'Pending' :
                     value === 'completed' ? 'Completed' : 
                     value === 'cancelled' ? 'Cancelled' : 'Filter by status';

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
        <i className={cn('ri-filter-line h-4 w-4 text-gray-500')} />
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

const SearchIcon = ({ className }) => (
  <i className={cn('ri-search-line', className)} />
);

const CalendarIcon = ({ className }) => (
  <i className={cn('ri-calendar-line', className)} />
);

const ClockIcon = ({ className }) => (
  <i className={cn('ri-time-line', className)} />
);

const MapPinIcon = ({ className }) => (
  <i className={cn('ri-map-pin-line', className)} />
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

const BookingManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [page, setPage] = useState(1);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const PAGE_SIZE = 10;

  const { 
    data: bookingsData, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['adminBookings', { page, status: statusFilter === 'all' ? '' : statusFilter }],
    queryFn: () => getAdminBookings({ 
      page, 
      pageSize: PAGE_SIZE,
      filters: { 
        status: statusFilter === 'all' ? '' : statusFilter 
      } 
    }),
  });

  const { mutate: updateBookingMutation, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, updateData }) => updateBooking({ id, updateData }),
    onSuccess: () => {
      toast.success('Booking updated successfully');
      queryClient.invalidateQueries(['adminBookings']);
    },
    onError: (error) => {
      toast.error('Failed to update booking');
      console.error('Error updating booking:', error);
    },
  });

  const bookings = bookingsData?.data || [];
  const totalCount = bookingsData?.count || 0;

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    
    return bookings.filter(booking => {
      const doctorName = booking.docId?.fullName || 'Unknown Doctor';
      const providerName = booking.provId?.fullName || 'Unknown Provider';
      const clinicName = booking.clinicId?.name || 'Unknown Clinic';
      
      const matchesSearch = 
        doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toString().includes(searchQuery);

      const matchesTab = activeTab === 'all' || booking.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [bookings, searchQuery, activeTab]);

  const stats = useMemo(() => {
    if (!bookings) return { 
      total: 0, 
      confirmed: 0, 
      pending: 0, 
      completed: 0, 
      cancelled: 0, 
      revenue: 0 
    };
    
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    const revenue = bookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.price || 0), 0);

    return { 
      total: totalCount, 
      confirmed, 
      pending, 
      completed, 
      cancelled, 
      revenue 
    };
  }, [bookings, totalCount]);

  const statusConfig = {
    confirmed: { label: 'Confirmed', variant: 'default', icon: CheckCircleIcon },
    pending: { label: 'Pending', variant: 'secondary', icon: AlertCircleIcon },
    cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircleIcon },
    completed: { label: 'Completed', variant: 'success', icon: CheckCircleIcon },
    unpaid: { label: 'Unpaid', variant: 'outline', icon: AlertCircleIcon }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const parseSelectedDate = (selectedDate) => {
    if (!selectedDate) return 'N/A';
    
    try {
      if (typeof selectedDate === 'string') {
        try {
          const parsed = JSON.parse(selectedDate);
          return parseSelectedDate(parsed);
        } catch {
          return formatDate(selectedDate);
        }
      }
      
      if (selectedDate.days && Array.isArray(selectedDate.days)) {
        return selectedDate.days
          .map(day => formatDate(day))
          .join(', ');
      }
      
      if (selectedDate.date) {
        return formatDate(selectedDate.date);
      }
      
      if (Array.isArray(selectedDate)) {
        return selectedDate
          .map(day => formatDate(day))
          .join(', ');
      }
      
      if (typeof selectedDate === 'string') {
        return formatDate(selectedDate);
      }
      
      return 'No date selected';
    } catch (error) {
      console.error('Error parsing selected date:', error, selectedDate);
      return 'Invalid Date';
    }
  };

  const parseSelectedHours = (selectedHours) => {
    if (!selectedHours) return 'N/A';
    
    try {
      if (typeof selectedHours === 'string') {
        try {
          const parsed = JSON.parse(selectedHours);
          return parseSelectedHours(parsed);
        } catch {
          return selectedHours;
        }
      }
      
      if (selectedHours.startTime && selectedHours.endTime) {
        return `${selectedHours.startTime} - ${selectedHours.endTime}`;
      }
      
      if (selectedHours.start && selectedHours.end) {
        return `${selectedHours.start} - ${selectedHours.end}`;
      }
      
      if (Array.isArray(selectedHours)) {
        return selectedHours.join(' - ');
      }
      
      return 'No hours selected';
    } catch (error) {
      console.error('Error parsing selected hours:', error, selectedHours);
      return 'Invalid Hours';
    }
  };

  const handleViewDetails = (booking) => {
    navigate(`/admin/bookings/${booking.id}`);
    setOpenDropdownId(null);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingMutation({ 
      id: bookingId, 
      updateData: { status: newStatus } 
    });
    setOpenDropdownId(null);
  };

  const handleDropdownToggle = (bookingId) => {
    setOpenDropdownId(openDropdownId === bookingId ? null : bookingId);
  };

  const handleCloseDropdown = () => {
    setOpenDropdownId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
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
            <p>Error loading bookings: {error.message}</p>
            <Button 
              onClick={() => refetch()} 
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
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all clinic rental bookings between doctors and providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bookings</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Confirmed</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.confirmed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl">${stats.revenue.toLocaleString()}</CardTitle>
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
                  placeholder="Search by doctor, provider, clinic, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]" />
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="confirmed" active={activeTab === 'confirmed'} onClick={() => setActiveTab('confirmed')}>
                Confirmed ({stats.confirmed})
              </TabsTrigger>
              <TabsTrigger value="pending" active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="completed" active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                Completed ({stats.completed})
              </TabsTrigger>
              <TabsTrigger value="cancelled" active={activeTab === 'cancelled'} onClick={() => setActiveTab('cancelled')}>
                Cancelled ({stats.cancelled})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => {
                        const StatusIcon = statusConfig[booking.status]?.icon || AlertCircleIcon;
                        const statusVariant = statusConfig[booking.status]?.variant || 'secondary';
                        const statusLabel = statusConfig[booking.status]?.label || booking.status;

                        const doctorName = booking.docId?.fullName || 'Unknown Doctor';
                        const providerName = booking.provId?.fullName || 'Unknown Provider';
                        const clinicName = booking.clinicId?.name || 'Unknown Clinic';
                        const clinicAddress = booking.clinicId?.address || 'No address';

                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">BK-{booking.id.toString().padStart(3, '0')}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <UserIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{doctorName}</div>
                                  <div className="text-xs text-gray-500">Doctor</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <BuildingIcon className="h-4 w-4 text-gray-500" />
                                <span>{providerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{clinicName}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPinIcon className="h-3 w-3" />
                                  {clinicAddress}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-sm">
                                  <CalendarIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">{parseSelectedDate(booking.selected_date)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <ClockIcon className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{parseSelectedHours(booking.selected_hours)}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusVariant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {statusLabel}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {booking.price ? `$${booking.price}` : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger onClick={() => handleDropdownToggle(booking.id)}>
                                  <Button variant="ghost" size="icon">
                                    <MoreVerticalIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                  open={openDropdownId === booking.id}
                                  onClose={handleCloseDropdown}
                                >
                                  <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Confirm Booking
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Mark Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                    className="text-red-600"
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-2" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalCount > PAGE_SIZE && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {filteredBookings.length} of {totalCount} bookings
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={page * PAGE_SIZE >= totalCount}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;