import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getUsers, 
  updateUser, 
  updateUserStatus,
  deleteUser 
} from '../services/apiUsers';
import { 
  getAdminBookings,
  getBookingStats 
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
const UserIcon = ({ className }) => (
  <i className={cn('ri-user-line', className)} />
);

const MailIcon = ({ className }) => (
  <i className={cn('ri-mail-line', className)} />
);

const PhoneIcon = ({ className }) => (
  <i className={cn('ri-phone-line', className)} />
);

const CalendarIcon = ({ className }) => (
  <i className={cn('ri-calendar-line', className)} />
);

const MapPinIcon = ({ className }) => (
  <i className={cn('ri-map-pin-line', className)} />
);

const ShieldIcon = ({ className }) => (
  <i className={cn('ri-shield-check-line', className)} />
);

const StethoscopeIcon = ({ className }) => (
  <i className={cn('ri-stethoscope-line', className)} />
);

const BuildingIcon = ({ className }) => (
  <i className={cn('ri-building-line', className)} />
);

const MoneyIcon = ({ className }) => (
  <i className={cn('ri-money-dollar-circle-line', className)} />
);

const HistoryIcon = ({ className }) => (
  <i className={cn('ri-history-line', className)} />
);

const EditIcon = ({ className }) => (
  <i className={cn('ri-edit-line', className)} />
);

const SaveIcon = ({ className }) => (
  <i className={cn('ri-save-line', className)} />
);

const BanIcon = ({ className }) => (
  <i className={cn('ri-forbid-line', className)} />
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

// Image Display Component for Syndicate Card
const ImageDisplay = ({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-lg border', className)}>
        <div className="text-center text-gray-500">
          <i className="ri-image-line text-2xl mb-2"></i>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-lg border object-cover', className)}
      onError={() => setImageError(true)}
    />
  );
};

// Main Component
const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: '',
    status: 'active',
    medicalLicenseNumber: '',
    syndicate_card: '',
    specialties: '',
    location: '',
    avatarUrl: ''
  });
  const [statusReason, setStatusReason] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const queryClient = useQueryClient();

  // جلب بيانات المستخدم
  const { 
    data: userData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUsers({ userId }),
  });

  // جلب إحصائيات الحجوزات الخاصة بالمستخدم
  const { data: bookingStats } = useQuery({
    queryKey: ['user-bookings-stats', userId],
    queryFn: () => getBookingStats(userId),
    enabled: !!userId
  });

  // جلب الحجوزات الخاصة بالمستخدم
  const { data: userBookings } = useQuery({
    queryKey: ['user-bookings', userId],
    queryFn: () => getAdminBookings({ 
      filters: { 
        userId: userId,
        userType: userData?.userType 
      } 
    }),
    enabled: !!userId && !!userData
  });

  // Mutation لتحديث بيانات المستخدم
  const { mutate: updateUserMutation, isLoading: isUpdatingUser } = useMutation({
    mutationFn: ({ userId, updateData }) => updateUser(userId, updateData),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries(['user', userId]);
      setEditOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    },
  });

  // Mutation لتحديث حالة المستخدم
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useMutation({
    mutationFn: ({ userId, status }) => updateUserStatus(userId, status),
    onSuccess: () => {
      toast.success('User status updated successfully');
      queryClient.invalidateQueries(['user', userId]);
      setStatusOpen(false);
      setStatusReason('');
    },
    onError: (error) => {
      toast.error('Failed to update user status');
      console.error('Error updating status:', error);
    },
  });

  // Mutation لحذف المستخدم
  const { mutate: deleteUserMutation, isLoading: isDeletingUser } = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      toast.success('User deleted successfully');
      navigate('/admin/users');
    },
    onError: (error) => {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    },
  });

  const user = userData?.data?.[0] || userData;

  // تهيئة نموذج التعديل عند فتح Dialog
  useEffect(() => {
    if (user && editOpen) {
      setEditForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        userType: user.userType || '',
        status: user.status || 'active',
        medicalLicenseNumber: user.medicalLicenseNumber || '',
        syndicate_card: user.syndicate_card || '',
        specialties: user.specialties ? JSON.stringify(user.specialties) : '[]',
        location: user.location || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user, editOpen]);

  const handleUpdateUser = () => {
    if (!user) return;

    const updateData = {
      ...editForm,
      specialties: editForm.specialties ? JSON.parse(editForm.specialties) : []
    };

    updateUserMutation({ 
      userId: user.userId, 
      updateData 
    });
  };

  const handleConfirmDelete = () => {
    if (!user) return;
    deleteUserMutation(user.userId);
  };

  const handleConfirmStatusChange = () => {
    if (!user) return;
    updateStatus({ userId: user.userId, status: newStatus });
  };

  const handleStatusChange = (status) => {
    setNewStatus(status);
    if (status === 'suspended') {
      setStatusOpen(true);
    } else {
      updateStatus({ userId: user.userId, status });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      suspended: 'destructive',
    };
    
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {statusText}
      </Badge>
    );
  };

  const getAvatarUrl = (user) => {
    if (user.avatarUrl) return user.avatarUrl;
    
    const seed = user.fullName || user.email || 'user';
    if (user.userType === 'doctor') {
      return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
    } else {
      return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
    }
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

  // تحسين عرض الـ bookings
  const displayBookings = useMemo(() => {
    if (!userBookings?.data) return [];
    
    return userBookings.data.map(booking => ({
      id: booking.id,
      date: formatDate(booking.created_at),
      clinic: booking.clinicId?.name || 'N/A',
      status: booking.status,
      price: booking.price,
      payment_status: booking.payment_status,
      doctor: booking.docId?.fullName || 'N/A',
      provider: booking.provId?.fullName || 'N/A'
    }));
  }, [userBookings]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-600">
            <p>Error loading user profile: {error?.message || 'User not found'}</p>
            <Button 
              onClick={() => navigate('/admin/users')} 
              className="mt-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Users
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
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Users
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                <p className="text-gray-600">Manage and view user details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2"
              >
                <EditIcon className="h-4 w-4" />
                Edit Profile
              </Button>
              
              {/* Status Change Buttons */}
              {user.status === 'active' && (
                <>
                  <Button
                    variant="warning"
                    onClick={() => handleStatusChange('inactive')}
                    className="flex items-center gap-2"
                  >
                    <CloseIcon className="h-4 w-4" />
                    Deactivate
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange('suspended')}
                    className="flex items-center gap-2"
                  >
                    <BanIcon className="h-4 w-4" />
                    Suspend
                  </Button>
                </>
              )}
              
              {user.status === 'inactive' && (
                <Button
                  variant="success"
                  onClick={() => handleStatusChange('active')}
                  className="flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Activate
                </Button>
              )}
              
              {user.status === 'suspended' && (
                <Button
                  variant="success"
                  onClick={() => handleStatusChange('active')}
                  className="flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Activate
                </Button>
              )}

              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Delete User
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <img
                  src={getAvatarUrl(user)}
                  alt={user.fullName}
                  className="h-24 w-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="mb-4">
                  {getStatusBadge(user.status)}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="capitalize">{user.userType}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center justify-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{bookingStats?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{bookingStats?.completed || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{bookingStats?.pending || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cancelled</span>
                  <span className="font-semibold text-red-600">{bookingStats?.cancelled || 0}</span>
                </div>
                {user.userType === 'provider' && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(bookingStats?.revenue || 0)}
                    </span>
                  </div>
                )}
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
                  value="personal"
                  active={activeTab === 'personal'}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  value="bookings"
                  active={activeTab === 'bookings'}
                  onClick={() => setActiveTab('bookings')}
                >
                  Bookings
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  active={activeTab === 'financial'}
                  onClick={() => setActiveTab('financial')}
                >
                  Financial
                </TabsTrigger>
                {user.userType === 'provider' && (
                  <TabsTrigger
                    value="clinics"
                    active={activeTab === 'clinics'}
                    onClick={() => setActiveTab('clinics')}
                  >
                    Clinics
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-semibold">{user.fullName || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-semibold">{user.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">User Type</p>
                          <p className="font-semibold capitalize">{user.userType}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          {getStatusBadge(user.status)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">User ID</p>
                          <p className="font-mono text-sm">{user.userId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Joined Date</p>
                          <p className="font-semibold">{formatDate(user.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-semibold">{formatDate(user.updated_at) || 'N/A'}</p>
                        </div>
                        {user.medicalLicenseNumber && (
                          <div>
                            <p className="text-sm text-gray-500">Medical License</p>
                            <p className="font-semibold">{user.medicalLicenseNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.specialties && (
                    <div>
                      <h4 className="font-semibold mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(user.specialties) ? (
                          user.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">
                            {user.specialties}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Syndicate Card Display */}
                  {user.userType === 'doctor' && user.syndicate_card && (
                    <div>
                      <h4 className="font-semibold mb-2">Syndicate Card</h4>
                      <ImageDisplay 
                        src={user.syndicate_card} 
                        alt="Syndicate Card"
                        className="h-48 w-full max-w-md"
                      />
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-semibold mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Profile Created</p>
                          <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                        </div>
                      </div>
                      {userBookings?.data?.[0] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CalendarIcon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Latest Booking</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(userBookings.data[0].created_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Full Name</p>
                        <p className="text-gray-900">{user.fullName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email Address</p>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                        <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">User Type</p>
                        <p className="text-gray-900 capitalize">{user.userType}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Account Status</p>
                        {getStatusBadge(user.status)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">User ID</p>
                        <p className="font-mono text-sm text-gray-900">{user.userId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Registration Date</p>
                        <p className="text-gray-900">{formatDate(user.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Last Updated</p>
                        <p className="text-gray-900">{formatDate(user.updated_at) || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information for Doctors */}
                  {user.userType === 'doctor' && (
                    <div className="border-t pt-6 mt-6">
                      <h4 className="font-semibold mb-4">Professional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Medical License Number</p>
                          <p className="text-gray-900">{user.medicalLicenseNumber || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Syndicate Card</p>
                          <div className="mt-2">
                            <ImageDisplay 
                              src={user.syndicate_card} 
                              alt="Syndicate Card"
                              className="h-48 w-full max-w-md"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {user.specialties && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 font-medium mb-2">Specialties</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(user.specialties) ? (
                              user.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary">
                                  {specialty}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary">
                                {user.specialties}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">
                    {user.userType === 'doctor' ? 'Bookings as Doctor' : 'Bookings as Provider'}
                  </h3>
                  
                  {displayBookings && displayBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="text-left p-3 font-medium text-sm">Booking ID</th>
                            <th className="text-left p-3 font-medium text-sm">Date</th>
                            <th className="text-left p-3 font-medium text-sm">Clinic</th>
                            {user.userType === 'doctor' && (
                              <th className="text-left p-3 font-medium text-sm">Provider</th>
                            )}
                            {user.userType === 'provider' && (
                              <th className="text-left p-3 font-medium text-sm">Doctor</th>
                            )}
                            <th className="text-left p-3 font-medium text-sm">Status</th>
                            <th className="text-left p-3 font-medium text-sm">Price</th>
                            <th className="text-left p-3 font-medium text-sm">Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayBookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-3">
                                <p className="font-medium">#{booking.id}</p>
                              </td>
                              <td className="p-3">
                                <p className="text-sm">{booking.date}</p>
                              </td>
                              <td className="p-3">
                                <p className="text-sm">{booking.clinic}</p>
                              </td>
                              {user.userType === 'doctor' && (
                                <td className="p-3">
                                  <p className="text-sm">{booking.provider}</p>
                                </td>
                              )}
                              {user.userType === 'provider' && (
                                <td className="p-3">
                                  <p className="text-sm">{booking.doctor}</p>
                                </td>
                              )}
                              <td className="p-3">
                                <Badge variant={
                                  booking.status === 'confirmed' ? 'success' :
                                  booking.status === 'pending' ? 'warning' :
                                  booking.status === 'cancelled' ? 'destructive' : 'secondary'
                                }>
                                  {booking.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <p className="font-medium">{formatCurrency(booking.price)}</p>
                              </td>
                              <td className="p-3">
                                <Badge variant={
                                  booking.payment_status === 'paid' ? 'success' :
                                  booking.payment_status === 'unpaid' ? 'destructive' : 'warning'
                                }>
                                  {booking.payment_status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No bookings found for this user.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Financial Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Financial Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MoneyIcon className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700">Total Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(bookingStats?.revenue || 0)}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <HistoryIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-700">Completed Bookings</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {bookingStats?.completed || 0}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldIcon className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700">Success Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {bookingStats?.total ? 
                          Math.round((bookingStats.completed / bookingStats.total) * 100) : 0
                        }%
                      </p>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div>
                    <h4 className="font-semibold mb-4">Recent Transactions</h4>
                    <div className="space-y-3">
                      {displayBookings?.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium">Booking #{booking.id}</p>
                            <p className="text-sm text-gray-500">{booking.date}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              booking.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(booking.price)}
                            </p>
                            <Badge variant={
                              booking.payment_status === 'paid' ? 'success' : 'destructive'
                            }>
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Clinics Tab (for Providers) */}
              {activeTab === 'clinics' && user.userType === 'provider' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Managed Clinics</h3>
                  
                  <div className="text-center py-8 text-gray-500">
                    <BuildingIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Clinic management feature coming soon.</p>
                    <p className="text-sm">This will show all clinics managed by this provider.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update information for {user?.fullName}
            </DialogDescription>
          </DialogHeader>
          {user && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="Phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Type
                  </label>
                  <select
                    value={editForm.userType}
                    onChange={(e) => setEditForm({...editForm, userType: e.target.value})}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="provider">Provider</option>
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL
                  </label>
                  <Input
                    value={editForm.avatarUrl}
                    onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})}
                    placeholder="Avatar URL"
                  />
                </div>
                {editForm.userType === 'doctor' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medical License Number
                      </label>
                      <Input
                        value={editForm.medicalLicenseNumber}
                        onChange={(e) => setEditForm({...editForm, medicalLicenseNumber: e.target.value})}
                        placeholder="Medical License Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Syndicate Card URL
                      </label>
                      <Input
                        value={editForm.syndicate_card}
                        onChange={(e) => setEditForm({...editForm, syndicate_card: e.target.value})}
                        placeholder="Syndicate Card URL"
                      />
                      {editForm.syndicate_card && (
                        <div className="mt-2">
                          <ImageDisplay 
                            src={editForm.syndicate_card} 
                            alt="Syndicate Card Preview"
                            className="h-32 w-full"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialties (JSON array)
                  </label>
                  <Textarea
                    value={editForm.specialties}
                    onChange={(e) => setEditForm({...editForm, specialties: e.target.value})}
                    placeholder='["Cardiology", "Neurology"]'
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter specialties as a JSON array, e.g., ["Cardiology", "Neurology"]
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setEditOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                  disabled={isUpdatingUser}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateUser}
                  className="flex-1"
                  disabled={isUpdatingUser || !editForm.fullName || !editForm.email}
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {isUpdatingUser ? 'Updating...' : 'Update Profile'}
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user?.fullName}? This action cannot be undone and will permanently remove all user data, bookings, and related information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => setDeleteOpen(false)} 
              variant="outline" 
              className="flex-1"
              disabled={isDeletingUser}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              variant="destructive"
              className="flex-1"
              disabled={isDeletingUser}
            >
              {isDeletingUser ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'suspended' ? 'Suspend User' : 'Change User Status'}
            </DialogTitle>
            <DialogDescription>
              {newStatus === 'suspended' 
                ? `Suspend ${user?.fullName}? This will prevent them from accessing the system and making new bookings.`
                : `Change status for ${user?.fullName} to ${newStatus}?`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for status change (optional)
              </label>
              <Textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Enter reason for status change..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setStatusOpen(false)} 
                variant="outline" 
                className="flex-1"
                disabled={isUpdatingStatus}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmStatusChange}
                variant={newStatus === 'suspended' ? 'destructive' : 'warning'}
                className="flex-1"
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Updating...' : `Set to ${newStatus}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;