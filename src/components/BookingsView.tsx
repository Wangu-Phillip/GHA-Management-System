import React, { useState, useRef } from 'react';
import { Calendar, PlusCircle, Search, Upload, CheckCircle2, Trash2, ArrowUpRight, HelpCircle } from 'lucide-react';
import { Booking } from '../types';

interface BookingsViewProps {
  bookings: Booking[];
  guesthouseId: string;
  onRefresh: () => Promise<void>;
}

export default function BookingsView({ bookings, guesthouseId, onRefresh }: BookingsViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // New Booking form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    roomName: 'Suite 101 - Oak Haven',
    checkIn: '',
    checkOut: '',
    totalAmount: '',
    status: 'CONFIRMED' as const
  });

  // Import states
  const [dragActive, setDragActive] = useState(false);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'ready' | 'uploading' | 'completed'>('idle');
  const [importSummary, setImportSummary] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          b.customerPhone.includes(search) || 
                          b.roomName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Manual Add Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.checkIn || !formData.checkOut || !formData.totalAmount) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          ...formData,
          totalAmount: Number(formData.totalAmount)
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        // Reset
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          roomName: 'Suite 101 - Oak Haven',
          checkIn: '',
          checkOut: '',
          totalAmount: '',
          status: 'CONFIRMED'
        });
        await onRefresh();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to schedule booking');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to Express server');
    }
  };

  // Status Change trigger
  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete booking
  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and delete this booking?')) return;
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Parse CSV string client-side
  const parseCSVContent = (text: string) => {
    setImportStatus('parsing');
    const lines = text.split(/\r?\n/);
    const results: any[] = [];
    
    // Simple header matching or fallback column counts
    // Expected header: customerName,customerPhone,roomName,checkIn,checkOut,totalAmount,customerEmail
    let headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      // Map columns
      const row: any = {
        customerName: values[0] || '',
        customerPhone: values[1] || '',
        roomName: values[2] || 'Standard Room',
        checkIn: values[3] || '',
        checkOut: values[4] || '',
        totalAmount: Number(values[5] || 150),
        customerEmail: values[6] || '',
        status: 'CONFIRMED'
      };

      if (row.customerName && row.customerPhone) {
        results.push(row);
      }
    }

    setParsedRows(results);
    setImportStatus('ready');
    setImportSummary(`Identified ${results.length} valid bookings from CSV.`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          parseCSVContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          parseCSVContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  // Submit Bulk Ingestion to backend Prisma ORM
  const triggerBulkImport = async () => {
    if (parsedRows.length === 0) return;
    setImportStatus('uploading');

    try {
      const response = await fetch('/api/bookings/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          bookings: parsedRows
        })
      });

      if (response.ok) {
        setImportStatus('completed');
        await onRefresh();
        setTimeout(() => {
          setShowImportModal(false);
          setParsedRows([]);
          setImportStatus('idle');
        }, 1500);
      } else {
        alert('Failed uploading parsed CSV records to database.');
        setImportStatus('ready');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading to server');
      setImportStatus('ready');
    }
  };

  return (
    <div className="space-y-6" id="bookings-view">
      {/* Search and Action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="bookings-header">
        <div className="relative flex-1 max-w-md" id="search-container">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" id="search-icon" />
          <input
            type="text"
            placeholder="Search guest, room or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-sm"
            id="bookings-search-input"
          />
        </div>

        <div className="flex items-center gap-3" id="bookings-actions">
          {/* Status filter selection */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 shadow-sm focus:outline-none"
            id="bookings-filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="import-csv-btn"
          >
            <Upload className="h-4 w-4" />
            Import CSV/Excel
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="add-booking-btn"
          >
            <PlusCircle className="h-4 w-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Bookings log table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="bookings-table-panel">
        <div className="overflow-x-auto" id="bookings-table-wrapper">
          <table className="w-full text-left border-collapse" id="bookings-table">
            <thead>
              <tr className="bg-gray-50/75 text-xs font-bold text-gray-500 border-b border-gray-100" id="table-head-row">
                <th className="p-4">Guest Info</th>
                <th className="p-4">Room Name</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Review Message</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs" id="table-body">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors" id={`booking-row-${b.id}`}>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{b.customerName}</div>
                      <div className="text-gray-400 font-mono text-[10px] mt-0.5">{b.customerPhone}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{b.roomName}</td>
                    <td className="p-4 text-gray-500">{new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="p-4 text-gray-500">{new Date(b.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="p-4 font-semibold text-gray-900">${Number(b.totalAmount).toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold border-0 focus:ring-1 focus:ring-gray-900 ${
                          b.status === 'CONFIRMED' ? 'bg-amber-50 text-amber-700' :
                          b.status === 'CHECKED_IN' ? 'bg-blue-50 text-blue-700' :
                          b.status === 'CHECKED_OUT' ? 'bg-green-50 text-green-700' :
                          'bg-gray-50 text-gray-500'
                        }`}
                        id={`status-dropdown-${b.id}`}
                      >
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CHECKED_IN">Checked In</option>
                        <option value="CHECKED_OUT">Checked Out</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${
                        b.reviewMessageStatus === 'SENT' ? 'text-teal-600' :
                        b.reviewMessageStatus === 'FAILED' ? 'text-red-500' :
                        'text-gray-400'
                      }`} id={`review-status-${b.id}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          b.reviewMessageStatus === 'SENT' ? 'bg-teal-500' :
                          b.reviewMessageStatus === 'FAILED' ? 'bg-red-500' :
                          'bg-gray-300'
                        }`} />
                        {b.reviewMessageStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        id={`delete-booking-btn-${b.id}`}
                        title="Cancel Booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr id="empty-row">
                  <td colSpan={8} className="p-12 text-center text-gray-400">
                    <Calendar className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No bookings logged</p>
                    <p className="text-xs text-gray-400 mt-1">Try scheduling a booking or importing a CSV spreadsheet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="add-modal">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-md w-full p-6 shadow-2xl space-y-6" id="add-modal-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3" id="add-modal-header">
              <h3 className="font-bold text-gray-900 text-base" id="add-modal-title">Schedule New Booking</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600" id="close-add-modal">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4" id="add-booking-form">
              <div className="space-y-1" id="field-name">
                <label className="text-xs font-bold text-gray-500">GUEST NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Neeson"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3" id="form-grid-contact">
                <div className="space-y-1" id="field-phone">
                  <label className="text-xs font-bold text-gray-500">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +13105550192"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1" id="field-email">
                  <label className="text-xs font-bold text-gray-500">GUEST EMAIL</label>
                  <input
                    type="email"
                    placeholder="e.g. liam@taken.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3" id="form-grid-room">
                <div className="space-y-1" id="field-room">
                  <label className="text-xs font-bold text-gray-500">ROOM / CABIN *</label>
                  <select
                    value={formData.roomName}
                    onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white"
                  >
                    <option value="Suite 101 - Oak Haven">Suite 101 - Oak Haven</option>
                    <option value="Room 202 - Pine view">Room 202 - Pine view</option>
                    <option value="Room 203 - Cozy Studio">Room 203 - Cozy Studio</option>
                    <option value="Beachfront Cabin A">Beachfront Cabin A</option>
                    <option value="Horizon Suite">Horizon Suite</option>
                  </select>
                </div>
                <div className="space-y-1" id="field-price">
                  <label className="text-xs font-bold text-gray-500">TOTAL COST ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3" id="form-grid-dates">
                <div className="space-y-1" id="field-checkin">
                  <label className="text-xs font-bold text-gray-500">CHECK-IN *</label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1" id="field-checkout">
                  <label className="text-xs font-bold text-gray-500">CHECK-OUT *</label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100" id="add-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold"
                >
                  Schedule Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV / Excel Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="import-modal">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-2xl w-full p-6 shadow-2xl space-y-6" id="import-modal-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3" id="import-modal-header">
              <div id="import-modal-header-desc">
                <h3 className="font-bold text-gray-900 text-base" id="import-modal-title">Bulk Import Excel / CSV</h3>
                <p className="text-xs text-gray-400 mt-1" id="import-modal-subtitle">Load history or bulk upcoming bookings effortlessly into guesthouse records</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600" id="close-import-modal">✕</button>
            </div>

            {importStatus === 'idle' && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50/55'
                }`}
                id="drop-zone"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.txt"
                  className="hidden"
                  id="csv-file-input"
                />
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" id="drop-upload-icon" />
                <p className="text-xs font-bold text-gray-700" id="drop-primary-prompt">Drag & Drop Booking Spreadsheets (.csv) or click to browse</p>
                <p className="text-[10px] text-gray-400 mt-1" id="drop-secondary-prompt">Supports columns: GuestName, Phone, RoomName, CheckIn, CheckOut, Cost, Email</p>

                <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-2 max-w-xs mx-auto" id="sample-guide">
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                  <span>Columns should be comma-separated in plain text format.</span>
                </div>
              </div>
            )}

            {importStatus === 'parsing' && (
              <div className="p-12 text-center space-y-4" id="parsing-state">
                <div className="h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-gray-600">Reading spreadsheets and parsing table grids...</p>
              </div>
            )}

            {(importStatus === 'ready' || importStatus === 'uploading' || importStatus === 'completed') && (
              <div className="space-y-4" id="preview-section">
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs" id="preview-summary">
                  <div className="flex items-center gap-2 font-medium text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{importSummary}</span>
                  </div>
                  <button
                    onClick={() => {
                      setParsedRows([]);
                      setImportStatus('idle');
                    }}
                    className="text-gray-400 hover:text-gray-600 font-semibold"
                    id="reset-import-btn"
                  >
                    Clear File
                  </button>
                </div>

                <div className="border border-gray-100 rounded-xl max-h-52 overflow-y-auto" id="preview-table-wrapper">
                  <table className="w-full text-left text-[10px] border-collapse" id="preview-table">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 sticky top-0">
                        <th className="p-2">Guest Name</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Room Assigned</th>
                        <th className="p-2">Check In</th>
                        <th className="p-2">Check Out</th>
                        <th className="p-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50" id="preview-table-body">
                      {parsedRows.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/25">
                          <td className="p-2 font-semibold text-gray-800">{row.customerName}</td>
                          <td className="p-2 font-mono">{row.customerPhone}</td>
                          <td className="p-2 text-gray-600">{row.roomName}</td>
                          <td className="p-2 text-gray-500">{row.checkIn}</td>
                          <td className="p-2 text-gray-500">{row.checkOut}</td>
                          <td className="p-2 text-right font-semibold text-gray-900">${row.totalAmount}</td>
                        </tr>
                      ))}
                      {parsedRows.length > 5 && (
                        <tr>
                          <td colSpan={6} className="p-2 text-center text-gray-400 bg-gray-50/20 font-medium">
                            + {parsedRows.length - 5} more lines parsed.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100" id="preview-actions">
                  <button
                    onClick={() => {
                      setParsedRows([]);
                      setImportStatus('idle');
                    }}
                    disabled={importStatus === 'uploading' || importStatus === 'completed'}
                    className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={triggerBulkImport}
                    disabled={importStatus === 'uploading' || importStatus === 'completed'}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                    id="submit-bulk-btn"
                  >
                    {importStatus === 'uploading' ? (
                      <>
                        <div className="h-3.5 w-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                        Ingesting Database...
                      </>
                    ) : importStatus === 'completed' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Import Successful!
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4" />
                        Approve and Ingest Records
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
