/**
 * ADMIN CUSTOMER QUERIES & HOME MEASUREMENT INBOX (`/admin/queries`)
 * Phase 4 Locked File — Displays all Home Measurement (🏡), Callback (🤙),
 * Shop Visit (🏪), Custom Size Quote, and Ready Rug Order requests.
 * Lets the Admin filter by status/type, update status, save remarks, and
 * reply directly to the customer via Phone or WhatsApp.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  MapPin,
  MessageCircle,
  PhoneCall,
  RefreshCw,
  Ruler,
} from 'lucide-react';
import {
  CustomerQueryRecord,
  QueryStatus,
  QueryType,
} from '../../types/database.types';
import {
  fetchCustomerQueries,
  updateCustomerQueryStatus,
} from '../../services/queryService';
import { getQueryTypeMeta } from '../../utils/whatsappHelper';
import { formatCurrencyINR } from '../../utils/pricingEngine';

const STATUS_OPTIONS: QueryStatus[] = [
  'NEW',
  'CONTACTED',
  'VISIT_SCHEDULED',
  'COMPLETED',
  'CANCELLED',
];

export const AdminQueriesInbox: React.FC = () => {
  const [queries, setQueries] = useState<CustomerQueryRecord[]>([]);
  const [filterType, setFilterType] = useState<QueryType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<QueryStatus | 'ALL'>('ALL');
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);

  const loadQueries = async () => {
    const data = await fetchCustomerQueries();
    setQueries(data);
    const initialRemarks: Record<string, string> = {};
    data.forEach((q) => {
      initialRemarks[q.id] = q.admin_remarks || '';
    });
    setRemarksMap(initialRemarks);
  };

  useEffect(() => {
    void loadQueries();
  }, []);

  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      if (filterType !== 'ALL' && q.query_type !== filterType) return false;
      if (filterStatus !== 'ALL' && q.status !== filterStatus) return false;
      return true;
    });
  }, [queries, filterType, filterStatus]);

  const handleStatusChange = async (
    queryId: string,
    nextStatus: QueryStatus
  ) => {
    await updateCustomerQueryStatus(
      queryId,
      nextStatus,
      remarksMap[queryId] || ''
    );
    await loadQueries();
    setSavedNoticeId(queryId);
    setTimeout(() => setSavedNoticeId(null), 2500);
  };

  const handleSaveRemarks = async (query: CustomerQueryRecord) => {
    await updateCustomerQueryStatus(
      query.id,
      query.status,
      remarksMap[query.id] || ''
    );
    await loadQueries();
    setSavedNoticeId(query.id);
    setTimeout(() => setSavedNoticeId(null), 2500);
  };

  const getStatusBadgeStyle = (status: QueryStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'CONTACTED':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'VISIT_SCHEDULED':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'CANCELLED':
        return 'bg-neutral-200 text-neutral-700 border-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD3] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E1E1C]">
            Customer Leads, Home Measurement Visits (🏡) & Callbacks (🤙)
          </h2>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Track and respond to every customer size inquiry, technician visit booking, and callback request.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadQueries()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F0ECE1] border border-[#E5DFD3] text-xs font-bold text-[#1E1E1C] self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox ({queries.length})</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-2xl border border-[#E5DFD3] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: 'ALL', label: 'All Leads' },
              { key: 'HOME_MEASUREMENT', label: 'Home Visits 🏡' },
              { key: 'CALLBACK_REQUEST', label: 'Callbacks 🤙' },
              { key: 'SHOP_VISIT', label: 'Shop Visits 🏪' },
              { key: 'CUSTOM_SIZE_QUOTE', label: 'Custom Sq.Ft Quotes' },
              { key: 'RUG_ORDER_INQUIRY', label: 'Ready Rug Orders' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === tab.key
                  ? 'bg-[#1E1E1C] text-white'
                  : 'bg-[#FAF8F5] text-[#6E6A63] hover:text-[#1E1E1C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Filter by Lead Status"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as QueryStatus | 'ALL')
          }
          className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs font-bold text-[#1E1E1C]"
        >
          <option value="ALL">All Statuses</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              Status: {st}
            </option>
          ))}
        </select>
      </div>

      {/* Queries List */}
      {filteredQueries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DFD3] p-12 text-center">
          <p className="text-sm font-bold text-[#1E1E1C]">
            No customer queries match the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueries.map((q) => {
            const meta = getQueryTypeMeta(q.query_type);
            const cleanCustomerPhone = q.customer_phone.replace(/[^0-9]/g, '');
            const customerWhatsappUrl = `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(
              `Hello ${q.customer_name}, we received your ${meta.shortLabel} inquiry regarding ${
                q.product_title_snapshot || 'our interior collection'
              }. How can we assist you today?`
            )}`;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-[#E5DFD3] p-5 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#FAF8F5]">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F0ECE1] text-[#9C5A3C]">
                        {meta.label}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                      <span className="text-[11px] text-[#6E6A63]">
                        {new Date(q.created_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1E1E1C]">
                      {q.customer_name} — {q.customer_phone}
                    </h3>
                  </div>

                  {/* Direct Call & WhatsApp Customer Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cleanCustomerPhone}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Customer</span>
                    </a>

                    <a
                      href={customerWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F7A4C] text-white text-xs font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Reply</span>
                    </a>
                  </div>
                </div>

                {/* Inquiry Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-1.5">
                    <div className="font-bold text-[#1E1E1C] flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#9C5A3C]" />
                      <span>Product & Sizing Specification</span>
                    </div>
                    <p>
                      <span className="text-[#6E6A63]">Product:</span>{' '}
                      <strong>{q.product_title_snapshot || 'General Inquiry'}</strong>
                    </p>
                    {q.selected_size_or_dimensions && (
                      <p>
                        <span className="text-[#6E6A63]">Size / Area:</span>{' '}
                        <strong>{q.selected_size_or_dimensions}</strong>
                      </p>
                    )}
                    {q.selected_quality_name && (
                      <p>
                        <span className="text-[#6E6A63]">Selected Quality:</span>{' '}
                        <strong className="text-[#9C5A3C]">
                          {q.selected_quality_name}
                        </strong>
                      </p>
                    )}
                    {typeof q.estimated_price === 'number' &&
                      q.estimated_price > 0 && (
                        <p>
                          <span className="text-[#6E6A63]">Estimated Quote:</span>{' '}
                          <strong className="text-[#1F7A4C]">
                            {formatCurrencyINR(q.estimated_price)}
                          </strong>
                        </p>
                      )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-1.5">
                    <div className="font-bold text-[#1E1E1C] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#9C5A3C]" />
                      <span>Address, Visit Slot & Customer Notes</span>
                    </div>
                    <p>
                      <span className="text-[#6E6A63]">Address:</span>{' '}
                      <strong>
                        {q.customer_address || 'Not provided (Phone consultation)'}
                      </strong>
                    </p>
                    {q.preferred_visit_date && (
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#6E6A63]" />
                        <span>Preferred Slot:</span>{' '}
                        <strong>{q.preferred_visit_date}</strong>
                      </p>
                    )}
                    {q.custom_design_notes && (
                      <p>
                        <span className="text-[#6E6A63]">Customer Notes:</span>{' '}
                        <span>{q.custom_design_notes}</span>
                      </p>
                    )}
                    {q.reference_image_url && (
                      <div className="pt-1">
                        <a
                          href={q.reference_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#9C5A3C] font-bold underline"
                        >
                          View Uploaded Reference Image ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Changer & Admin Remarks */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#1E1E1C]">
                      Update Status:
                    </label>
                    <select
                      value={q.status}
                      onChange={(e) =>
                        void handleStatusChange(
                          q.id,
                          e.target.value as QueryStatus
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs font-bold text-[#1E1E1C]"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={remarksMap[q.id] ?? ''}
                      onChange={(e) =>
                        setRemarksMap({ ...remarksMap, [q.id]: e.target.value })
                      }
                      placeholder="Add internal shop remark (e.g., Technician assigned, sample book sent)..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
                    />
                    <button
                      type="button"
                      onClick={() => void handleSaveRemarks(q)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold shrink-0"
                    >
                      Save Note
                    </button>
                    {savedNoticeId === q.id && (
                      <span className="text-xs font-bold text-[#1F7A4C]">
                        Saved!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
