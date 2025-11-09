import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminBookings, updateBookingStatus } from '../../services/apiBookings';
import { toast } from 'react-hot-toast';

const PAGE_SIZE = 10;

function formatCurrency(value) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value || 0);
  } catch {
    return `$${Number(value || 0).toFixed(2)}`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString();
  } catch {
    return String(dateStr);
  }
}

function statusVariant(status) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'paid':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'unpaid':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export default function BookingsTab() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data: bookingsData, isLoading, error } = useQuery({
    queryKey: ['adminBookings', { page, status: statusFilter === 'all' ? '' : statusFilter }],
    queryFn: () => getAdminBookings({ page, pageSize: PAGE_SIZE, status: statusFilter === 'all' ? '' : statusFilter }),
    keepPreviousData: true,
  });

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation({
    mutationFn: ({ bookingId, status, reason }) => updateBookingStatus(bookingId, status, reason),
    onSuccess: () => {
      toast.success('Booking status updated');
      queryClient.invalidateQueries(['adminBookings']);
    },
    onError: (err) => toast.error(err?.message || 'Failed to update'),
  });

  const bookings = bookingsData?.data || [];
  const totalCount = bookingsData?.count || 0;

  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      const providerName = b.provId?.fullName || 'Unknown Provider';
      const clinicName = b.clinicId?.name || 'Unknown Clinic';
      const doctorName = b.docId?.fullName || 'Unknown Doctor';
      return (
        providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(b.id).includes(searchQuery)
      );
    });
  }, [bookings, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالحجز، المزود، العيادة، الطبيب أو الرقم"
            className="w-64 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="confirmed">مؤكد</option>
            <option value="pending">معلق</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
            <option value="paid">مدفوع</option>
            <option value="unpaid">غير مدفوع</option>
          </select>
        </div>
        {isUpdating && <span className="text-sm text-gray-500">جاري التحديث...</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">العيادة</th>
              <th className="p-3 font-medium">الطبيب</th>
              <th className="p-3 font-medium">المزود</th>
              <th className="p-3 font-medium">الحالة</th>
              <th className="p-3 font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-600">جاري التحميل...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-red-600">فشل التحميل: {error.message}</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-600">لا توجد حجوزات</td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="p-3">#{b.id}</td>
                  <td className="p-3">{b.clinicId?.name || '—'}</td>
                  <td className="p-3">{b.docId?.fullName || '—'}</td>
                  <td className="p-3">{b.provId?.fullName || '—'}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 ${statusVariant(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(b.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalCount > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">عرض {filtered.length} من {totalCount} حجوزات</p>
          <div className="flex items-center gap-2">
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >السابق</button>
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              disabled={page * PAGE_SIZE >= totalCount}
              onClick={() => setPage((p) => p + 1)}
            >التالي</button>
          </div>
        </div>
      )}
    </div>
  );
}