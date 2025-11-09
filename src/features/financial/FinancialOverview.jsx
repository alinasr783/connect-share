import React from 'react';

export default function FinancialOverview({ stats }) {
  const s = stats || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="rounded border p-4">
        <p className="text-gray-600">إجمالي الحجوزات</p>
        <p className="text-2xl font-bold">{s.totalBookings || 0}</p>
      </div>
      <div className="rounded border p-4">
        <p className="text-gray-600">مكتمل</p>
        <p className="text-2xl font-bold">{s.completedBookings || 0}</p>
      </div>
      <div className="rounded border p-4">
        <p className="text-gray-600">معلق</p>
        <p className="text-2xl font-bold">{s.pendingBookings || 0}</p>
      </div>
      <div className="rounded border p-4">
        <p className="text-gray-600">مؤكد</p>
        <p className="text-2xl font-bold">{s.confirmedBookings || 0}</p>
      </div>
    </div>
  );
}