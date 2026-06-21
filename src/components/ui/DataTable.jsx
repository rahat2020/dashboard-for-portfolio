import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, MoreVertical } from 'react-feather';
import Loader from './Loader';
import EmptyState from './EmptyState';

const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No data found',
  emptyIcon,
  onRowClick,
  actions,
  searchable = true,
  pagination = true,
  pageSize = 10,
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionRow, setOpenActionRow] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  // Filter
  const filtered = data.filter((row) => {
    if (!search) return true;
    return columns.some((col) => {
      const val = col.accessor ? row[col.accessor] : '';
      return String(val).toLowerCase().includes(search.toLowerCase());
    });
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = pagination ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sorted;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 
              placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
              transition-all duration-200"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700/50">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/80">
              {columns.map((col) => (
                <th
                  key={col.accessor || col.header}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider
                    ${col.sortable !== false ? 'cursor-pointer hover:text-gray-200 select-none' : ''}`}
                  onClick={() => col.sortable !== false && col.accessor && handleSort(col.accessor)}
                  style={col.width ? { width: col.width } : {}}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable !== false && sortField === col.accessor && (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-12">
                  <EmptyState message={emptyMessage} icon={emptyIcon} />
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  className={`bg-gray-900/50 hover:bg-gray-800/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.accessor || col.header} className="px-4 py-3.5 text-sm text-gray-300">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3.5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const rowKey = row._id || idx;
                          if (openActionRow === rowKey) {
                            setOpenActionRow(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            setOpenActionRow(rowKey);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openActionRow === (row._id || idx) && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenActionRow(null)} />
                          <div
                            className="fixed z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[140px]"
                            style={{ top: menuPos.top, right: menuPos.right }}
                          >
                            {actions.map((action) => (
                              <button
                                key={action.label}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                  setOpenActionRow(null);
                                }}
                                className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-700 transition-colors cursor-pointer
                                  ${action.variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'}`}
                              >
                                {action.icon && <action.icon size={14} />}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((page, idx, arr) => (
                <span key={page} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-1 text-gray-600">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                      ${page === currentPage
                        ? 'bg-violet-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    {page}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
