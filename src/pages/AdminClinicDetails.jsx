import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getClinicDetails, 
  updateClinic, 
  updateClinicStatus,
  deleteClinic,
  getClinicBookings 
} from '../services/apiClinics';
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

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
};

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
const BuildingIcon = ({ className }) => (
  <i className={cn('ri-building-line', className)} />
);

const MapPinIcon = ({ className }) => (
  <i className={cn('ri-map-pin-line', className)} />
);

const UserIcon = ({ className }) => (
  <i className={cn('ri-user-line', className)} />
);

const CalendarIcon = ({ className }) => (
  <i className={cn('ri-calendar-line', className)} />
);

const MoneyIcon = ({ className }) => (
  <i className={cn('ri-money-dollar-circle-line', className)} />
);

const TimeIcon = ({ className }) => (
  <i className={cn('ri-time-line', className)} />
);

const StarIcon = ({ className }) => (
  <i className={cn('ri-star-line', className)} />
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

const ImageIcon = ({ className }) => (
  <i className={cn('ri-image-line', className)} />
);

const SettingsIcon = ({ className }) => (
  <i className={cn('ri-settings-3-line', className)} />
);

const ClinicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    district: '',
    specialty: '',
    status: '',
    pricingModel: '',
    mapLink: '',
    features: '',
    pricing: '',
    availableHours: '',
    availableDate: ''
  });

  const queryClient = useQueryClient();

  // جلب بيانات العيادة
  const { 
    data: clinic, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['clinic', id],
    queryFn: () => getClinicDetails(id),
    enabled: !!id
  });

  // جلب حجوزات العيادة
  const { data: clinicBookings } = useQuery({
    queryKey: ['clinic-bookings', id],
    queryFn: () => getClinicBookings(id),
    enabled: !!id && !!clinic
  });

  // Mutation لتحديث بيانات العيادة
  const { mutate: updateClinicMutation, isLoading: isUpdatingClinic } = useMutation({
    mutationFn: ({ id, updateData }) => updateClinic({ id, updateData }),
    onSuccess: () => {
      toast.success('Clinic updated successfully');
      queryClient.invalidateQueries(['clinic', id]);
      setEditOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update clinic');
      console.error('Error updating clinic:', error);
    },
  });

  // Mutation لتحديث حالة العيادة
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useMutation({
    mutationFn: ({ id, status }) => updateClinicStatus(id, status),
    onSuccess: () => {
      toast.success('Clinic status updated successfully');
      queryClient.invalidateQueries(['clinic', id]);
    },
    onError: (error) => {
      toast.error('Failed to update clinic status');
      console.error('Error updating clinic status:', error);
    },
  });

  // Mutation لحذف العيادة
  const { mutate: deleteClinicMutation, isLoading: isDeletingClinic } = useMutation({
    mutationFn: (id) => deleteClinic(id),
    onSuccess: () => {
      toast.success('Clinic deleted successfully');
      navigate('/admin/clinics');
    },
    onError: (error) => {
      toast.error('Failed to delete clinic');
      console.error('Error deleting clinic:', error);
    },
  });

  // تهيئة نموذج التعديل عند فتح Dialog
  useEffect(() => {
    if (clinic && editOpen) {
      setEditForm({
        name: clinic.name || '',
        address: clinic.address || '',
        district: clinic.district || '',
        specialty: clinic.specialty || '',
        status: clinic.status || '',
        pricingModel: clinic.pricingModel || '',
        mapLink: clinic.mapLink || '',
        features: clinic.features ? JSON.stringify(clinic.features, null, 2) : '',
        pricing: clinic.pricing ? JSON.stringify(clinic.pricing, null, 2) : '',
        availableHours: clinic.availableHours ? JSON.stringify(clinic.availableHours, null, 2) : '',
        availableDate: clinic.availableDate ? JSON.stringify(clinic.availableDate, null, 2) : ''
      });
    }
  }, [clinic, editOpen]);

  const handleUpdateClinic = () => {
    if (!clinic) return;

    const updateData = {
      ...editForm,
      features: editForm.features ? JSON.parse(editForm.features) : null,
      pricing: editForm.pricing ? JSON.parse(editForm.pricing) : null,
      availableHours: editForm.availableHours ? JSON.parse(editForm.availableHours) : null,
      availableDate: editForm.availableDate ? JSON.parse(editForm.availableDate) : null
    };

    updateClinicMutation({ 
      id: clinic.id, 
      updateData 
    });
  };

  const handleConfirmDelete = () => {
    if (!clinic) return;
    deleteClinicMutation(clinic.id);
  };

  const handleStatusChange = (newStatus) => {
    updateStatus({ id: clinic.id, status: newStatus });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      unconfirmed: 'warning',
      suspended: 'destructive',
    };
    
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {statusText}
      </Badge>
    );
  };

  const getClinicImages = (clinic) => {
    if (!clinic.images) return [];
    
    if (typeof clinic.images === 'string') {
      try {
        return JSON.parse(clinic.images);
      } catch (error) {
        return [clinic.images];
      }
    }
    
    if (Array.isArray(clinic.images)) {
      return clinic.images;
    }
    
    return [];
  };

  const getClinicFeatures = (clinic) => {
    if (!clinic.features) return [];
    
    if (typeof clinic.features === 'string') {
      try {
        const parsed = JSON.parse(clinic.features);
        return Object.entries(parsed).map(([key, value]) => ({ key, value }));
      } catch (error) {
        return [];
      }
    }
    
    if (typeof clinic.features === 'object') {
      return Object.entries(clinic.features).map(([key, value]) => ({ key, value }));
    }
    
    return [];
  };

  const getClinicPricing = (clinic) => {
    if (!clinic.pricing) return {};
    
    if (typeof clinic.pricing === 'string') {
      try {
        return JSON.parse(clinic.pricing);
      } catch (error) {
        return {};
      }
    }
    
    return clinic.pricing || {};
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

  const calculateClinicStats = () => {
    const bookings = clinicBookings || [];
    
    return {
      totalBookings: bookings.length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.price || 0), 0),
      successRate: bookings.length > 0 ? 
        Math.round((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100) : 0
    };
  };

  const clinicStats = calculateClinicStats();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clinic details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-600">
            <p>Error loading clinic: {error?.message || 'Clinic not found'}</p>
            <Button 
              onClick={() => navigate('/admin/clinics')} 
              className="mt-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Clinics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const clinicImages = getClinicImages(clinic);
  const clinicFeatures = getClinicFeatures(clinic);
  const clinicPricing = getClinicPricing(clinic);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/clinics')}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Clinics
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{clinic.name}</h1>
                <p className="text-gray-600">Manage and view clinic details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2"
              >
                <EditIcon className="h-4 w-4" />
                Edit Clinic
              </Button>
              <Button
                variant={clinic.status === 'suspended' ? 'success' : 'warning'}
                onClick={() => handleStatusChange(clinic.status === 'suspended' ? 'active' : 'suspended')}
                className="flex items-center gap-2"
              >
                {clinic.status === 'suspended' ? <CheckIcon className="h-4 w-4" /> : <CloseIcon className="h-4 w-4" />}
                {clinic.status === 'suspended' ? 'Activate Clinic' : 'Suspend Clinic'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Clinic
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clinic Info Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="text-center">
                  {clinicImages.length > 0 ? (
                    <img
                      src={clinicImages[0]}
                      alt={clinic.name}
                      className="h-24 w-24 rounded-lg object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      <BuildingIcon className="h-8 w-8" />
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-gray-900">{clinic.name}</h2>
                  <p className="text-gray-600 mb-2">{clinic.district}</p>
                  <div className="mb-4">
                    {getStatusBadge(clinic.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{clinic.users?.fullName || 'Unknown Owner'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-center">{clinic.address}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Joined {formatDate(clinic.created_at)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{clinicStats.totalBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{clinicStats.completedBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{clinicStats.pendingBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cancelled</span>
                  <span className="font-semibold text-red-600">{clinicStats.cancelledBookings}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Total Revenue</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(clinicStats.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Success Rate</span>
                  <span className="font-bold text-blue-600">
                    {clinicStats.successRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleStatusChange('active')}
                  disabled={clinic.status === 'active'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Activate Clinic
                </Button>
                
                <Button
                  onClick={() => handleStatusChange('suspended')}
                  disabled={clinic.status === 'suspended'}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
                >
                  <CloseIcon className="h-4 w-4" />
                  Suspend Clinic
                </Button>

                <Button
                  onClick={() => setEditOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <EditIcon className="h-4 w-4" />
                  Edit Clinic
                </Button>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            {clinic.pricingModel && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Model</span>
                      <span className="font-semibold">{clinic.pricingModel}</span>
                    </div>
                    {Object.entries(clinicPricing).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">{key}</span>
                        <span className="font-semibold">
                          {typeof value === 'number' ? formatCurrency(value) : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
                  value="bookings"
                  active={activeTab === 'bookings'}
                  onClick={() => setActiveTab('bookings')}
                >
                  Bookings
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  active={activeTab === 'features'}
                  onClick={() => setActiveTab('features')}
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  active={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Clinic Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Clinic Name</p>
                          <p className="font-semibold text-gray-900">
                            {clinic.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Owner</p>
                          <p className="text-gray-900">
                            {clinic.users?.fullName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Specialty</p>
                          <p className="text-gray-900">
                            {clinic.specialty || "General"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pricing Model</p>
                          <p className="text-gray-900">
                            {clinic.pricingModel || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-900">
                            {clinic.address || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">District</p>
                          <p className="text-gray-900">
                            {clinic.district || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          {getStatusBadge(clinic.status)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="text-gray-900">
                            {formatDate(clinic.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinic Images */}
                  {clinicImages.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Clinic Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {clinicImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${clinic.name} - Image ${index + 1}`}
                            className="h-32 w-full rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Map Link */}
                  {clinic.mapLink && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Location</h4>
                      <a
                        href={clinic.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                      >
                        <MapPinIcon className="h-4 w-4" />
                        View on Map
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Clinic Bookings</h3>
                  
                  {clinicBookings && clinicBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="text-left p-3 font-medium text-sm">Booking ID</th>
                            <th className="text-left p-3 font-medium text-sm">Doctor</th>
                            <th className="text-left p-3 font-medium text-sm">Date</th>
                            <th className="text-left p-3 font-medium text-sm">Status</th>
                            <th className="text-left p-3 font-medium text-sm">Price</th>
                            <th className="text-left p-3 font-medium text-sm">Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clinicBookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-3">
                                <p className="font-medium">#{booking.id}</p>
                              </td>
                              <td className="p-3">
                                <p className="text-sm">{booking.docId?.fullName || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{booking.docId?.email || ''}</p>
                              </td>
                              <td className="p-3">
                                <p className="text-sm">{formatDate(booking.created_at)}</p>
                              </td>
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
                      <p>No bookings found for this clinic.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Clinic Features & Amenities</h3>
                  
                  {clinicFeatures.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clinicFeatures.map((feature, index) => (
                        feature.value && (
                          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <CheckIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{feature.key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-sm text-gray-600">
                                {typeof feature.value === 'boolean' ? 'Available' : feature.value.toString()}
                              </p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No features configured for this clinic.</p>
                    </div>
                  )}

                  {/* Available Hours */}
                  {clinic.availableHours && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Available Hours</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(clinic.availableHours, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Available Dates */}
                  {clinic.availableDate && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Available Dates</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(clinic.availableDate, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Clinic Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Clinic ID</p>
                        <p className="font-mono text-sm">{clinic.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Owner ID</p>
                        <p className="font-mono text-sm">{clinic.userId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Created At</p>
                        <p className="text-gray-900">{formatDate(clinic.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Last Updated</p>
                        <p className="text-gray-900">{formatDate(clinic.updated_at) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Pricing Model</p>
                        <p className="text-gray-900">{clinic.pricingModel || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Specialty</p>
                        <p className="text-gray-900">{clinic.specialty || 'General'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t border-red-200 pt-6 mt-6">
                    <h4 className="font-semibold text-red-600 mb-4">Danger Zone</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-800">Delete Clinic</p>
                          <p className="text-sm text-red-600 mt-1">
                            Once you delete a clinic, there is no going back. Please be certain.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete Clinic
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Clinic Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Clinic</DialogTitle>
            <DialogDescription>
              Update information for {clinic?.name}
            </DialogDescription>
          </DialogHeader>
          {clinic && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Name *
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Clinic Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <Input
                    value={editForm.district}
                    onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                    placeholder="District"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <Input
                    value={editForm.specialty}
                    onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                    placeholder="Specialty"
                  />
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
                    <option value="unconfirmed">Unconfirmed</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing Model
                  </label>
                  <Input
                    value={editForm.pricingModel}
                    onChange={(e) => setEditForm({...editForm, pricingModel: e.target.value})}
                    placeholder="Pricing Model"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Map Link
                  </label>
                  <Input
                    value={editForm.mapLink}
                    onChange={(e) => setEditForm({...editForm, mapLink: e.target.value})}
                    placeholder="Google Maps Link"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (JSON)
                  </label>
                  <Textarea
                    value={editForm.features}
                    onChange={(e) => setEditForm({...editForm, features: e.target.value})}
                    placeholder='{"parking": true, "wifi": true, "waitingArea": true}'
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing (JSON)
                  </label>
                  <Textarea
                    value={editForm.pricing}
                    onChange={(e) => setEditForm({...editForm, pricing: e.target.value})}
                    placeholder='{"hourly": 50, "daily": 300, "weekly": 1500}'
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Hours (JSON)
                  </label>
                  <Textarea
                    value={editForm.availableHours}
                    onChange={(e) => setEditForm({...editForm, availableHours: e.target.value})}
                    placeholder='{"monday": "09:00-17:00", "tuesday": "09:00-17:00"}'
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Dates (JSON)
                  </label>
                  <Textarea
                    value={editForm.availableDate}
                    onChange={(e) => setEditForm({...editForm, availableDate: e.target.value})}
                    placeholder='{"2024": {"january": ["01", "02", "03"]}}'
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setEditOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                  disabled={isUpdatingClinic}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateClinic}
                  className="flex-1"
                  disabled={isUpdatingClinic || !editForm.name || !editForm.address}
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {isUpdatingClinic ? 'Updating...' : 'Update Clinic'}
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
            <DialogTitle>Delete Clinic</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{clinic?.name}"? This action cannot be undone and will permanently remove all clinic data, bookings, and related information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => setDeleteOpen(false)} 
              variant="outline" 
              className="flex-1"
              disabled={isDeletingClinic}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              variant="destructive"
              className="flex-1"
              disabled={isDeletingClinic}
            >
              {isDeletingClinic ? 'Deleting...' : 'Delete Clinic'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicProfile;