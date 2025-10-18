import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUserStatus, updateUser, deleteUser } from '../services/apiUsers';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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

// Dropdown Menu Components
const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

const DropdownMenuTrigger = ({ children, ...props }) => {
  return <>{children}</>;
};

const DropdownMenuContent = ({
  children,
  className,
  open,
}) => {
  if (!open) return null;
  return (
    <div
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
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100',
        className
      )}
      onClick={onClick}
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
        'bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-2xl',
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
const SearchIcon = ({ className }) => (
  <i className={cn('ri-search-line', className)} />
);

const UserPlusIcon = ({ className }) => (
  <i className={cn('ri-user-add-line', className)} />
);

const MoreVerticalIcon = ({ className }) => (
  <i className={cn('ri-more-2-fill', className)} />
);

const Trash2Icon = ({ className }) => (
  <i className={cn('ri-delete-bin-line', className)} />
);

const EditIcon = ({ className }) => (
  <i className={cn('ri-edit-line', className)} />
);

const EyeIcon = ({ className }) => (
  <i className={cn('ri-eye-line', className)} />
);

const MailIcon = ({ className }) => (
  <i className={cn('ri-mail-line', className)} />
);

const MapPinIcon = ({ className }) => (
  <i className={cn('ri-map-pin-line', className)} />
);

const CalendarIcon = ({ className }) => (
  <i className={cn('ri-calendar-line', className)} />
);

const ShieldIcon = ({ className }) => (
  <i className={cn('ri-shield-check-line', className)} />
);

const StethoscopeIcon = ({ className }) => (
  <i className={cn('ri-stethoscope-line', className)} />
);

const BanIcon = ({ className }) => (
  <i className={cn('ri-forbid-line', className)} />
);

const SaveIcon = ({ className }) => (
  <i className={cn('ri-save-line', className)} />
);

// Main Component
const UserManagement = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: '',
    status: 'active',
    medicalLicenseNumber: '',
    syndicate_card: '',
    specialties: '',
    location: ''
  });
  const [suspendReason, setSuspendReason] = useState('');

  const queryClient = useQueryClient();

  // استخدام React Query لجلب البيانات
  const { 
    data: usersData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['users', { page, userType: selectedType === 'all' ? '' : selectedType }],
    queryFn: () => getUsers({ 
      page, 
      userType: selectedType === 'all' ? '' : selectedType 
    }),
  });

  // Mutation لتحديث حالة المستخدم
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useMutation({
    mutationFn: ({ userId, status }) => updateUserStatus(userId, status),
    onSuccess: () => {
      toast.success('User status updated successfully');
      queryClient.invalidateQueries(['users']);
      setSuspendOpen(false);
      setSuspendReason('');
    },
    onError: (error) => {
      toast.error('Failed to update user status');
      console.error('Error updating status:', error);
    },
  });

  // Mutation لتحديث بيانات المستخدم
  const { mutate: updateUserMutation, isLoading: isUpdatingUser } = useMutation({
    mutationFn: ({ userId, updateData }) => updateUser(userId, updateData),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries(['users']);
      setEditOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    },
  });

  // Mutation لحذف المستخدم
  const { mutate: deleteUserMutation, isLoading: isDeletingUser } = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['users']);
      setDeleteOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    },
  });

  const users = usersData?.data || [];
  const totalCount = usersData?.count || 0;

  // تصفية البيانات محلياً بناءً على البحث
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter((user) => {
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchQuery]);

  // إحصائيات المستخدمين
  const stats = useMemo(() => {
    if (!users) return { doctors: 0, providers: 0, active: 0, suspended: 0, total: 0 };
    
    const doctors = users.filter((u) => u.userType === 'doctor').length;
    const providers = users.filter((u) => u.userType === 'provider').length;
    const active = users.filter((u) => u.status === 'active').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;
    return { doctors, providers, active, suspended, total: totalCount };
  }, [users, totalCount]);

  const handleViewDetails = (user) => {
    // التنقل لصفحة البروفايل بدلاً من فتح الدايلوج
    navigate(`/admin/users/${user.userId}`);
    setDropdownOpen(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      userType: user.userType || '',
      status: user.status || 'active',
      medicalLicenseNumber: user.medicalLicenseNumber || '',
      syndicate_card: user.syndicate_card || '',
      specialties: user.specialties ? JSON.stringify(user.specialties) : '[]',
      location: user.location || ''
    });
    setEditOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
    setDropdownOpen(null);
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setSuspendOpen(true);
    setDropdownOpen(null);
  };

  const handleStatusChange = (userId, newStatus) => {
    if (newStatus === 'suspended') {
      const user = users.find(u => u.userId === userId);
      handleSuspendUser(user);
    } else {
      updateStatus({ userId, status: newStatus });
    }
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    const updateData = {
      ...editForm,
      specialties: editForm.specialties ? JSON.parse(editForm.specialties) : []
    };

    updateUserMutation({ 
      userId: selectedUser.userId, 
      updateData 
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    deleteUserMutation(selectedUser.userId);
  };

  const handleConfirmSuspend = () => {
    if (!selectedUser) return;
    updateStatus({ userId: selectedUser.userId, status: 'suspended' });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive',
    };
    
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    
    return (
      <Badge variant={variants[status] || 'secondary'} className={status === 'suspended' ? 'text-white' : ''}>
        {statusText}
      </Badge>
    );
  };

  // دالة لإنشاء avatar URL بناءً على اسم المستخدم
  const getAvatarUrl = (user) => {
    if (user.avatarUrl) return user.avatarUrl;
    
    const seed = user.fullName || user.email || 'user';
    if (user.userType === 'doctor') {
      return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
    } else {
      return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
    }
  };

  // دالة لتحويل التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className={cn('w-full min-h-screen bg-gray-50 p-6', className)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('w-full min-h-screen bg-gray-50 p-6', className)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-600">
            <p>Error loading users: {error.message}</p>
            <Button 
              onClick={() => queryClient.refetchQueries(['users'])} 
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
    <div className={cn('w-full min-h-screen bg-gray-50 p-6', className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage doctors and providers in your system</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5  gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <StethoscopeIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">Doctors</span>
            </div>
            <p className="text-2xl font-bold">{stats.doctors}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Providers</span>
            </div>
            <p className="text-2xl font-bold">{stats.providers}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserPlusIcon className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BanIcon className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-600">Suspended</span>
            </div>
            <p className="text-2xl font-bold">{stats.suspended}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MailIcon className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-600">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <TabsList>
              <TabsTrigger
                value="all"
                active={selectedType === 'all'}
                onClick={() => setSelectedType('all')}
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                value="doctor"
                active={selectedType === 'doctor'}
                onClick={() => setSelectedType('doctor')}
              >
                Doctors
              </TabsTrigger>
              <TabsTrigger
                value="provider"
                active={selectedType === 'provider'}
                onClick={() => setSelectedType('provider')}
              >
                Providers
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                <tr className='border-gray-800'>
                  <th className="text-left p-4 font-medium text-sm">User</th>
                  <th className="text-left p-4 font-medium text-sm">Type</th>
                  <th className="text-left p-4 font-medium text-sm">Phone</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Joined</th>
                  <th className="text-center p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={getAvatarUrl(user)}
                            alt={user.fullName}
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{user.fullName || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{user.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {user.userType === 'doctor' ? (
                          <>
                            <StethoscopeIcon className="h-4 w-4 text-blue-500" />
                            <span className="capitalize">Doctor</span>
                          </>
                        ) : (
                          <>
                            <ShieldIcon className="h-4 w-4 text-green-500" />
                            <span className="capitalize">Provider</span>
                          </>
                        )}
                      </div>
                      {user.specialties && (
                        <p className="text-xs text-gray-600 mt-1">
                          {Array.isArray(user.specialties) ? user.specialties.join(', ') : user.specialties}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">
                        {user.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(user.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDropdownOpen(dropdownOpen === user.userId ? null : user.userId)
                              }
                            >
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent open={dropdownOpen === user.userId}>
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <EditIcon className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.userId, 'active')}>
                              <UserPlusIcon className="h-4 w-4 mr-2" />
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.userId, 'inactive')}>
                              <BanIcon className="h-4 w-4 mr-2" />
                              Set Inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.userId, 'suspended')}>
                              <BanIcon className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600"
                            >
                              <Trash2Icon className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              {searchQuery ? 'No users found matching your search.' : 'No users found.'}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {totalCount} users
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
                disabled={page * 10 >= totalCount}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update information for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
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
                        Syndicate Card
                      </label>
                      <Input
                        value={editForm.syndicate_card}
                        onChange={(e) => setEditForm({...editForm, syndicate_card: e.target.value})}
                        placeholder="Syndicate Card"
                      />
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
                  {isUpdatingUser ? 'Updating...' : 'Update User'}
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
              Are you sure you want to delete {selectedUser?.fullName}? This action cannot be undone and will permanently remove all user data.
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

      {/* Suspend User Dialog */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Suspend {selectedUser?.fullName}? This will prevent them from accessing the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for suspension (optional)
              </label>
              <Textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Enter reason for suspension..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setSuspendOpen(false)} 
                variant="outline" 
                className="flex-1"
                disabled={isUpdatingStatus}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmSuspend}
                variant="destructive"
                className="flex-1"
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Suspending...' : 'Suspend User'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;