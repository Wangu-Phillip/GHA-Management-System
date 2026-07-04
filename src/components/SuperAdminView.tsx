import React from 'react';

interface SuperAdminProps {
  onRefreshGlobalStats?: () => void;
  onSwitchTenant?: (tenantId: string) => void;
}

export default function SuperAdminView({}: SuperAdminProps) {
  return (
    <div className="p-8 text-center text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
      <h2 className="text-xl font-bold text-gray-200 mb-2">Super Admin Dashboard</h2>
      <p>This portal is disabled in Single-Tenant (Multi-Instance) production mode.</p>
    </div>
  );
}
