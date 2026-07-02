import React, { useState, useRef } from 'react';
import { Calendar, PlusCircle, Search, Upload, CheckCircle2, Trash2, ArrowUpRight, HelpCircle, Settings, X, ChevronLeft, ChevronRight, LayoutList } from 'lucide-react';
import { Booking, Guesthouse } from '../types';

interface BookingsViewProps {
  bookings: Booking[];
  guesthouseId: string;
  guesthouse: Guesthouse;
  onRefresh: () => Promise<void>;
  onUpdateGuesthouse: (gh: Guesthouse) => void;
}

// ── Calendar Helpers ──────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED:   'bg-indigo-100 text-indigo-800 border-indigo-200',
  CHECKED_IN:  'bg-emerald-100 text-emerald-800 border-emerald-200',
  CHECKED_OUT: 'bg-gray-100 text-gray-600 border-gray-200',
  CANCELLED:   'bg-red-100 text-red-700 border-red-200',
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookingsView({ bookings, guesthouseId, guesthouse, onRefresh, onUpdateGuesthouse }: BookingsViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  // Calendar nav state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [newRoomInput, setNewRoomInput] = useState('');
  const [updatingRooms, setUpdatingRooms] = useState(false);

  // D1/SQLite stores JSON as a string — parse it safely before use
  const parseRooms = (raw: any): string[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
  };
  const roomsList = parseRooms(guesthouse?.rooms).length > 0
    ? parseRooms(guesthouse?.rooms)
    : ['Suite 101 - Oak Haven', 'Room 202 - Pine view', 'Room 203 - Cozy Studio', 'Beachfront Cabin A', 'Horizon Suite'];

  const handleRoomAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomInput.trim()) return;
    setUpdatingRooms(true);
    try {
      const updatedRooms = [...roomsList, newRoomInput.trim()];
      const response = await fetch('/api/marketing/whatsapp-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesthouseId, rooms: updatedRooms }),
      });
      if (response.ok) {
        const data = (await response.json()) as any;
        onUpdateGuesthouse(data.guesthouse);
        setNewRoomInput('');
      } else {
        alert('Failed to add custom room');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingRooms(false);
    }
  };

  const handleRoomDelete = async (roomToDelete: string) => {
    setUpdatingRooms(true);
    try {
      const updatedRooms = roomsList.filter(r => r !== roomToDelete);
      const response = await fetch('/api/marketing/whatsapp-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesthouseId, rooms: updatedRooms }),
      });
      if (response.ok) {
        const data = (await response.json()) as any;
        onUpdateGuesthouse(data.guesthouse);
      } else {
        alert('Failed to delete room');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingRooms(false);
    }
  };

  // New Booking form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCountry: 'Botswana (local)',
    roomName: roomsList[0],
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
    
    let matchesDate = true;
    if (dateFilter !== 'ALL' && b.createdAt) {
      const created = new Date(b.createdAt);
      const now = new Date();
      const diffTime = now.getTime() - created.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (dateFilter === 'TODAY') {
        matchesDate = created.getFullYear() === now.getFullYear() &&
                      created.getMonth() === now.getMonth() &&
                      created.getDate() === now.getDate();
      } else if (dateFilter === 'WEEK') {
        matchesDate = diffDays >= 0 && diffDays <= 7;
      } else if (dateFilter === 'MONTH') {
        matchesDate = diffDays >= 0 && diffDays <= 30;
      } else if (dateFilter === '90DAYS') {
        matchesDate = diffDays >= 0 && diffDays <= 90;
      } else if (dateFilter === 'YEAR') {
        matchesDate = diffDays >= 0 && diffDays <= 365;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
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
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerCountry: 'Botswana (local)',
          roomName: 'Suite 101 - Oak Haven',
          checkIn: '',
          checkOut: '',
          totalAmount: '',
          status: 'CONFIRMED'
        });
        await onRefresh();
      } else {
        const err = (await response.json()) as any;
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
    
    let headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
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

  // Submit Bulk Ingestion to backend
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

  // ── Calendar helpers ─────────────────────────────────────────────────────────

  const calPrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const calNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  // Get bookings that overlap a given calendar day
  const getBookingsForDay = (day: number) => {
    const dayDate = new Date(calYear, calMonth, day);
    dayDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(dayDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return bookings.filter(b => {
      const ci = new Date(b.checkIn);
      const co = new Date(b.checkOut);
      ci.setHours(0, 0, 0, 0);
      co.setHours(0, 0, 0, 0);
      return ci < nextDay && co >= dayDate;
    });
  };

  const openAddForDay = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, checkIn: dateStr, checkOut: '', customerName: '', customerPhone: '', totalAmount: '', roomName: roomsList[0] || '' }));
    setShowAddModal(true);
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const calCells = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  // Pad to full weeks
  while (calCells.length % 7 !== 0) calCells.push(null);

  const isToday = (day: number | null) =>
    day !== null &&
    day === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear();

  // ── Render ───────────────────────────────────────────────────────────────────

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

        <div className="flex items-center gap-3 flex-wrap" id="bookings-actions">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 shadow-sm" id="view-toggle">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
              id="toggle-list-view"
            >
              <LayoutList className="h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'calendar' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
              id="toggle-calendar-view"
            >
              <Calendar className="h-3.5 w-3.5" />
              Calendar
            </button>
          </div>

          {/* Status filter - only show in list mode */}
          {viewMode === 'list' && (
            <>
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

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 shadow-sm focus:outline-none bg-white"
                id="bookings-date-filter-select"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Current Day</option>
                <option value="WEEK">Current Week (7d)</option>
                <option value="MONTH">Current Month (30d)</option>
                <option value="90DAYS">Last 90 Days</option>
                <option value="YEAR">Current Year (365d)</option>
              </select>
            </>
          )}

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="import-csv-btn"
          >
            <Upload className="h-4 w-4" />
            Import CSV/Excel
          </button>

          <button
            onClick={() => setShowRoomsModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="manage-rooms-btn"
          >
            <Settings className="h-4 w-4" />
            Manage Rooms
          </button>

          <button
            onClick={() => {
              setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                customerCountry: 'Botswana (local)',
                roomName: roomsList[0] || '',
                checkIn: '',
                checkOut: '',
                totalAmount: '',
                status: 'CONFIRMED'
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="add-booking-btn"
          >
            <PlusCircle className="h-4 w-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* ── CALENDAR VIEW ── */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="calendar-panel">
          {/* Calendar Nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50" id="cal-nav">
            <button onClick={calPrevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors" id="cal-prev">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-sm">{MONTH_NAMES[calMonth]} {calYear}</h3>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Tap any day to create a booking · Color = status</p>
            </div>
            <button onClick={calNextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors" id="cal-next">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="px-6 py-2 border-b border-gray-50 flex items-center gap-4 flex-wrap bg-white" id="cal-legend">
            {Object.entries(STATUS_COLORS).map(([status, cls]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full border ${cls}`} />
                <span className="text-[10px] font-semibold text-gray-500">{status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 border-b border-gray-100" id="cal-dow-headers">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center py-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                {d}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-7 divide-x divide-gray-50" id="cal-grid">
            {calCells.map((day, idx) => {
              const dayBookings = day !== null ? getBookingsForDay(day) : [];
              const isTodayCell = isToday(day);
              return (
                <div
                  key={idx}
                  onClick={() => day !== null && openAddForDay(day)}
                  className={`min-h-[90px] sm:min-h-[110px] p-2 border-b border-gray-50 flex flex-col gap-1 transition-colors ${
                    day === null
                      ? 'bg-gray-50/30 cursor-default'
                      : 'cursor-pointer hover:bg-indigo-50/30 active:bg-indigo-100/30'
                  }`}
                  id={day !== null ? `cal-day-${day}` : `cal-empty-${idx}`}
                >
                  {day !== null && (
                    <>
                      <span className={`text-xs font-bold self-start leading-none rounded-full w-6 h-6 flex items-center justify-center ${
                        isTodayCell
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                          : 'text-gray-600'
                      }`}>
                        {day}
                      </span>

                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        {dayBookings.slice(0, 3).map((b) => (
                          <div
                            key={b.id}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border truncate leading-tight ${STATUS_COLORS[b.status] || STATUS_COLORS.CANCELLED}`}
                            title={`${b.customerName} · ${b.roomName}`}
                          >
                            {b.customerName.split(' ')[0]} · {b.roomName.split(' ').slice(0, 2).join(' ')}
                          </div>
                        ))}
                        {dayBookings.length > 3 && (
                          <span className="text-[9px] text-gray-400 font-semibold pl-1">
                            +{dayBookings.length - 3} more
                          </span>
                        )}
                        {dayBookings.length === 0 && (
                          <span className="text-[9px] text-gray-300 pl-1 mt-auto">+ Add</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Calendar footer summary */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between" id="cal-footer">
            <span className="text-[11px] text-gray-400">
              {bookings.filter(b => {
                const ci = new Date(b.checkIn);
                return ci.getMonth() === calMonth && ci.getFullYear() === calYear;
              }).length} check-ins this month
            </span>
            <span className="text-[11px] text-indigo-600 font-semibold">
              {bookings.filter(b => b.status === 'CHECKED_IN').length} guests in-house now
            </span>
          </div>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
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
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{b.customerName}</span>
                          {b.customerCountry && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                              {b.customerCountry}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 font-mono text-[10px] mt-0.5">{b.customerPhone}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{b.roomName}</td>
                      <td className="p-4 text-gray-500">{new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="p-4 text-gray-500">{new Date(b.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="p-4 font-semibold text-gray-900">P{Number(b.totalAmount).toFixed(2)}</td>
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
      )}

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

              <div className="space-y-1" id="field-country">
                <label className="text-xs font-bold text-gray-500">COUNTRY OF ORIGIN *</label>
                <select
                  value={formData.customerCountry}
                  onChange={(e) => setFormData({ ...formData, customerCountry: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white text-gray-700"
                >
                  <option value="Botswana (local)">Botswana (local)</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Zambia">Zambia</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States of America">United States of America</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3" id="form-grid-contact">
                <div className="space-y-1" id="field-phone">
                  <label className="text-xs font-bold text-gray-500">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +267 71234567"
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
                    {roomsList.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1" id="field-price">
                  <label className="text-xs font-bold text-gray-500">TOTAL COST (BWP) *</label>
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
                    onClick={() => { setParsedRows([]); setImportStatus('idle'); }}
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
                          <td className="p-2 text-right font-semibold text-gray-900">P{row.totalAmount}</td>
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
                    onClick={() => { setParsedRows([]); setImportStatus('idle'); }}
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

      {/* Custom Room Inventory Management Modal */}
      {showRoomsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="rooms-modal">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-sm w-full p-6 shadow-2xl space-y-6" id="rooms-modal-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3" id="rooms-modal-header">
              <h3 className="font-bold text-gray-900 text-base" id="rooms-modal-title">Guesthouse Room Inventory</h3>
              <button onClick={() => setShowRoomsModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              <form onSubmit={handleRoomAdd} className="flex gap-2" id="add-room-form">
                <input
                  type="text"
                  required
                  placeholder="e.g. Suite 204 - Rose Garden"
                  value={newRoomInput}
                  onChange={(e) => setNewRoomInput(e.target.value)}
                  disabled={updatingRooms}
                  className="flex-1 px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={updatingRooms || !newRoomInput.trim()}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  Add Room
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto" id="rooms-list-container">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Active Room / Cabin Inventory</span>
                {roomsList.length > 0 ? (
                  roomsList.map((room) => (
                    <div key={room} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-medium text-gray-700">
                      <span>{room}</span>
                      <button
                        onClick={() => handleRoomDelete(room)}
                        disabled={updatingRooms}
                        className="text-red-500 hover:text-red-700 disabled:text-red-300 font-semibold p-1"
                        title="Delete Room"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-gray-400 py-4">No rooms defined yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100" id="rooms-modal-footer">
              <button
                type="button"
                onClick={() => setShowRoomsModal(false)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
