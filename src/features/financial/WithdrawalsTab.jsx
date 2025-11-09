import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProviderTransactions, updateTransactionStatus } from '../../services/apiFinancials';
import { toast } from 'react-hot-toast';

const PAGE_SIZE = 10;

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
    case 'approved':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function parseDetails(details) {
  if (!details) return null;
  if (typeof details === 'string') {
    try {
      return JSON.parse(details);
    } catch {
      return null;
    }
  }
  return details;
}

function PaymentMethodDetails({ method }) {
  const d = parseDetails(method?.method_details);
  if (!d) return null;
  const type = (method?.type || '').toLowerCase();
  if (type === 'bank') {
    return (
      <div className="mt-1 space-y-0.5 text-xs text-gray-600">
        <div>اسم البنك: <span className="font-medium">{d.bank_name || '—'}</span></div>
        <div>صاحب الحساب: <span className="font-medium">{d.account_holder || '—'}</span></div>
        <div>رقم الحساب: <span className="font-medium">{d.account_number || '—'}</span></div>
        <div>SWIFT: <span className="font-medium">{d.swift || '—'}</span></div>
      </div>
    );
  }
  return (
    <div className="mt-1 space-y-0.5 text-xs text-gray-600">
      {Object.entries(d).map(([k, v]) => (
        <div key={k}>{k}: <span className="font-medium">{String(v ?? '—')}</span></div>
      ))}
    </div>
  );
}

export default function WithdrawalsTab() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['providerWithdrawals', { page, status: statusFilter }],
    queryFn: () => getProviderTransactions('all', { page, pageSize: PAGE_SIZE, type: 'withdrawal', status: statusFilter === 'all' ? 'all' : statusFilter }),
    keepPreviousData: true,
  });

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation({
    mutationFn: ({ payoutId, status }) => updateTransactionStatus(payoutId, status, 'provider'),
    onSuccess: () => {
      toast.success('Withdrawal status updated');
      queryClient.invalidateQueries(['providerWithdrawals']);
    },
    onError: (err) => toast.error(err?.message || 'Failed to update'),
  });

  const withdrawals = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const display = useMemo(() => withdrawals, [withdrawals]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <select
          className="rounded border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">الكل</option>
          <option value="pending">معلق</option>
          <option value="approved">موافق عليه</option>
          <option value="rejected">مرفوض</option>
          <option value="completed">مكتمل</option>
        </select>
        {isUpdating && <span className="text-sm text-gray-500">جاري التحديث...</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-medium">Request ID</th>
              <th className="p-3 font-medium">Provider</th>
              <th className="p-3 font-medium">Payment Method</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-600">جاري التحميل...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-red-600">فشل التحميل: {error.message}</td>
              </tr>
            ) : display.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-600">لا توجد طلبات سحب</td>
              </tr>
            ) : (
              display.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-3">#{r.id}</td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{r.user?.fullName || r.userId}</span>
                      {r.user?.email && (
                        <a href={`mailto:${r.user.email}`} className="text-xs text-blue-600">{r.user.email}</a>
                      )}
                      {r.user?.phone && (
                        <a href={`tel:${r.user.phone}`} className="text-xs text-gray-600">{r.user.phone}</a>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{r.method?.type || r.method_type || r.payment_method?.type || '—'}</span>
                        {(r.method?.end_numbers || r.end_numbers) && (
                          <span className="text-xs text-gray-500">•••• {String(r.method?.end_numbers || r.end_numbers).slice(-4)}</span>
                        )}
                      </div>
                      <PaymentMethodDetails method={r.method} />
                    </div>
                  </td>
                  <td className="p-3">{r.amount ?? r.total_amount ?? '—'}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 ${statusVariant(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(r.created_at)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() => updateStatus({ payoutId: r.id, status: 'approved' })}
                      >Approve</button>
                      <button
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() => updateStatus({ payoutId: r.id, status: 'rejected' })}
                      >Reject</button>
                      <button
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() => updateStatus({ payoutId: r.id, status: 'completed' })}
                      >Complete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">عرض {withdrawals.length} من {totalCount} طلبات</p>
          <div className="flex items-center gap-2">
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >السابق</button>
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >التالي</button>
          </div>
        </div>
      )}
    </div>
  );
}