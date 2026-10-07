import React, { useState } from 'react';
import { RestaurantTable } from '../../types';
import { Crown, Sparkles, Check, Users, Sun, Layers, CheckCircle2, Armchair } from 'lucide-react';

interface FloorPlanMapProps {
  tables: RestaurantTable[];
  selectedTableId: string;
  numberOfGuests: number;
  onSelectTable: (tableId: string) => void;
}

// Vector Furniture SVG Renderer (Drawn Sofa, Chairs, and Tables)
const TableFurnitureSVG: React.FC<{ capacity: number; location: string; isSelected: boolean }> = ({
  capacity,
  location,
  isSelected
}) => {
  const locLower = (location || '').toLowerCase();
  const isVip = locLower.includes('vip') || locLower.includes('chef');

  const strokeColor = isSelected ? '#000000' : '#FACC15';
  const fillColor = isSelected ? 'rgba(0, 0, 0, 0.25)' : 'rgba(250, 204, 21, 0.15)';
  const chairFill = isSelected ? '#000000' : 'rgba(234, 179, 8, 0.35)';

  // 1. VIP Velvet Lounge & Chef Table: Plush Curved Sofa Surround + Table
  if (isVip || capacity >= 8) {
    return (
      <svg className="w-full h-14" viewBox="0 0 100 45">
        {/* Plush Curved U-Sofa */}
        <path
          d="M 12 10 Q 8 36 50 38 Q 92 36 88 10 L 78 10 Q 82 30 50 30 Q 18 30 22 10 Z"
          fill={chairFill}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Sofa Cushion Seam */}
        <path d="M 20 26 Q 50 28 80 26" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
        {/* Central VIP Table */}
        <rect x="32" y="8" width="36" height="18" rx="5" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <text x="50" y="20" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill={strokeColor}>
          VIP SOFA
        </text>
      </svg>
    );
  }

  // 2. 2-Seat Window Table: Central Round Table + 2 Facing Chairs
  if (capacity === 2) {
    return (
      <svg className="w-full h-14" viewBox="0 0 100 45">
        {/* Left Chair */}
        <rect x="22" y="15" width="7" height="14" rx="2" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
        <path d="M 20 13 Q 20 22 20 31" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Chair */}
        <rect x="71" y="15" width="7" height="14" rx="2" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
        <path d="M 80 13 Q 80 22 80 31" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Central Round Glass/Wood Table */}
        <circle cx="50" cy="22" r="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <text x="50" y="24.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill={strokeColor}>
          2 CHAIRS
        </text>
      </svg>
    );
  }

  // 3. 6-Seat Terrace / Deck Table: Rectangular Table + 6 Chairs (3 Top, 3 Bottom)
  if (capacity === 6) {
    return (
      <svg className="w-full h-14" viewBox="0 0 100 45">
        {/* Top 3 Chairs */}
        <rect x="22" y="3" width="13" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
        <rect x="43.5" y="3" width="13" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
        <rect x="65" y="3" width="13" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />

        {/* Bottom 3 Chairs */}
        <rect x="22" y="37" width="13" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
        <rect x="43.5" y="37" width="13" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
        <rect x="65" y="37" width="13" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />

        {/* Central Rectangular Table */}
        <rect x="18" y="10" width="64" height="25" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <text x="50" y="25" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill={strokeColor}>
          6 CHAIRS
        </text>
      </svg>
    );
  }

  // 4. Standard 4-Seat Dining Table: Square Table + 4 Chairs (Top, Bottom, Left, Right)
  return (
    <svg className="w-full h-14" viewBox="0 0 100 45">
      {/* Top Chair */}
      <rect x="42" y="3" width="16" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
      {/* Bottom Chair */}
      <rect x="42" y="37" width="16" height="5" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
      {/* Left Chair */}
      <rect x="16" y="15" width="5" height="15" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />
      {/* Right Chair */}
      <rect x="79" y="15" width="5" height="15" rx="1.5" fill={chairFill} stroke={strokeColor} strokeWidth="1.2" />

      {/* Central Dining Table */}
      <rect x="24" y="10" width="52" height="25" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
      <text x="50" y="25" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill={strokeColor}>
        4 CHAIRS
      </text>
    </svg>
  );
};

export const FloorPlanMap: React.FC<FloorPlanMapProps> = ({
  tables,
  selectedTableId,
  numberOfGuests,
  onSelectTable
}) => {
  const [activeZone, setActiveZone] = useState<string>('all');

  const getZoneCount = (id: string) => {
    if (id === 'all') return tables.length;
    if (id === 'vip') return tables.filter((t) => (t.location || '').toLowerCase().includes('vip') || (t.location || '').toLowerCase().includes('chef')).length;
    if (id === 'main') return tables.filter((t) => (t.location || '').toLowerCase().includes('main') || (!t.location)).length;
    if (id === 'terrace') return tables.filter((t) => (t.location || '').toLowerCase().includes('window') || (t.location || '').toLowerCase().includes('patio')).length;
    return 0;
  };

  const vipTables = tables.filter((t) => (t.location || '').toLowerCase().includes('vip') || (t.location || '').toLowerCase().includes('chef'));
  const mainTables = tables.filter((t) => (t.location || '').toLowerCase().includes('main') || (!t.location));
  const terraceTables = tables.filter((t) => (t.location || '').toLowerCase().includes('window') || (t.location || '').toLowerCase().includes('patio'));

  const selectedTable = tables.find((t) => t._id === selectedTableId);

  const renderTableTile = (tbl: RestaurantTable) => {
    const isSelected = selectedTableId === tbl._id;
    const isRecommended = tbl.capacity >= numberOfGuests && tbl.capacity <= numberOfGuests + 2;
    const isUnderCapacity = tbl.capacity < numberOfGuests;

    return (
      <button
        key={tbl._id}
        type="button"
        onClick={() => onSelectTable(tbl._id)}
        className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 relative group ${
          isSelected
            ? 'bg-gradient-to-br from-gold-400 via-amber-500 to-gold-600 text-black border-gold-300 ring-2 ring-gold-400/50 shadow-xl shadow-gold-500/20 scale-[1.02]'
            : isRecommended
            ? 'bg-dark-850 hover:bg-dark-800 border-emerald-500/60 hover:border-emerald-400 text-gray-100 shadow-md shadow-emerald-500/10'
            : isUnderCapacity
            ? 'bg-dark-950/60 border-gray-800/80 text-gray-500 opacity-60'
            : 'bg-dark-900 hover:bg-dark-850 border-gray-800 hover:border-gold-500/50 text-gray-200'
        }`}
      >
        {/* Table Number & Recommendation Badge */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-bold text-base ${isSelected ? 'text-black' : 'text-gray-100 group-hover:text-gold-400'}`}>
              {tbl.tableNumber}
            </span>
            {isRecommended && !isSelected && (
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                Ideal
              </span>
            )}
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            isSelected ? 'bg-black/30 text-black' : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
          }`}>
            {tbl.capacity} Seats
          </span>
        </div>

        {/* Furniture SVG Vector Drawing (Sofa / Table / Chairs) */}
        <div className="my-1">
          <TableFurnitureSVG capacity={tbl.capacity} location={tbl.location} isSelected={isSelected} />
        </div>

        {/* Location Footer */}
        <div className="flex items-center justify-between w-full pt-1 border-t border-white/10 text-[10px]">
          <span className={`truncate ${isSelected ? 'text-black/90 font-semibold' : 'text-gray-400'}`}>
            {tbl.location}
          </span>
          <span className={`font-medium ${isSelected ? 'text-black' : 'text-gold-500 group-hover:underline'}`}>
            {isSelected ? 'Selected' : 'Select'}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-gold-500/30 space-y-5 shadow-2xl bg-dark-950/95">
      
      {/* Header & Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Armchair className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif font-bold text-gray-100 text-lg">
              Gotham Floor Plan Map
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Drawn furniture blueprint — Choose your table for {numberOfGuests} guests
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400 shadow-sm shadow-emerald-500/60" />
            Ideal Fit ({numberOfGuests} Guests)
          </span>
          <span className="flex items-center gap-1.5 text-gold-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 border border-gold-400 shadow-sm shadow-gold-500/60" />
            Selected
          </span>
        </div>
      </div>

      {/* Zone Filter Tabs Grid (No Scrollbar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
        {[
          { id: 'all', label: 'All Floor Plan', icon: Layers },
          { id: 'vip', label: "VIP & Chef Reserve", icon: Crown },
          { id: 'main', label: 'Main Dining Hall', icon: Users },
          { id: 'terrace', label: 'Window & Terrace', icon: Sun }
        ].map((z) => {
          const Icon = z.icon;
          const isActive = activeZone === z.id;
          const count = getZoneCount(z.id);

          return (
            <button
              key={z.id}
              type="button"
              onClick={() => setActiveZone(z.id)}
              className={`w-full px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition border ${
                isActive
                  ? 'bg-gold-500/20 text-gold-400 border-gold-500/50 shadow-lg shadow-gold-500/10'
                  : 'bg-dark-900 text-gray-400 border-gray-800 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="truncate">{z.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition shrink-0 ${
                isActive ? 'bg-gold-500 text-black' : 'bg-gray-800 text-gray-300 border border-gray-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Floor Plan Canvas */}
      <div className="p-5 rounded-2xl bg-dark-900/90 border border-gray-800 space-y-6">
        
        {/* Top Feature: Glass Windows */}
        <div className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-950 via-sky-900/60 to-sky-950 border border-sky-500/30 text-center text-xs font-bold text-sky-300 tracking-wider flex items-center justify-center gap-2 shadow-inner">
          <span>🌆</span> PANORAMIC CITY SKYLINE GLASS WINDOW WALL <span>🌆</span>
        </div>

        {/* Spatial Floor Layout Sections */}
        {activeZone === 'all' ? (
          <div className="space-y-6">
            
            {/* Section 1: Window Side & Patio Terrace */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5" /> Window Side & Patio Terrace (4 Tables)
                </span>
                <span className="text-[10px] text-gray-500">Skyline Views</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {terraceTables.map((tbl) => renderTableTile(tbl))}
              </div>
            </div>

            {/* Section 2: Main Dining Hall */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gold-500/20 pb-2">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Main Dining Hall (3 Tables)
                </span>
                <span className="text-[10px] text-gray-500">Atmospheric Center Room</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mainTables.map((tbl) => renderTableTile(tbl))}
              </div>
            </div>

            {/* Section 3: VIP & Chef Reserve */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" /> VIP Lounge & Chef's Reserve (3 Tables)
                </span>
                <span className="text-[10px] text-gray-500">Private Dining Booths</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vipTables.map((tbl) => renderTableTile(tbl))}
              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(activeZone === 'vip' ? vipTables : activeZone === 'main' ? mainTables : terraceTables).map((tbl) =>
              renderTableTile(tbl)
            )}
          </div>
        )}

        {/* Bottom Feature: Entrance */}
        <div className="w-full py-2 px-4 rounded-xl bg-dark-950 border border-gray-800 text-center text-xs font-semibold text-gray-400 tracking-widest uppercase flex items-center justify-center gap-2">
          🚪 MAIN ENTRANCE & RECEPTION HOST STAND
        </div>

      </div>

      {/* Selected Table Summary Bar */}
      {selectedTable ? (
        <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/20 via-amber-500/20 to-gold-500/20 border border-gold-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-gold-500 text-black flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h5 className="font-serif font-bold text-gray-100 text-base">
                  {selectedTable.tableNumber} Reserved
                </h5>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30">
                  {selectedTable.capacity} Guests Max
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Location: <strong className="text-gold-300">{selectedTable.location}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectTable('')}
            className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 text-xs font-semibold border border-gray-700 hover:border-gold-500 transition"
          >
            Clear Choice (Auto Assign)
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-gray-800 text-center text-xs text-gray-400">
          💡 Select any table from the map or leave blank for <strong className="text-gold-400">Auto Assign</strong> upon arrival.
        </div>
      )}

    </div>
  );
};
