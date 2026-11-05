import React, { useState, useMemo } from 'react';
import { LeaderboardEntry, UserProfile, UserTier } from '../types';
import { TIER_THRESHOLDS, calculateTierFromXp } from '../services/codeRunner';

interface GlobalLeaderboardProps {
  currentUser: UserProfile;
  entries: LeaderboardEntry[];
  onAwardBonusXp?: (deltaXp: number) => void;
}

const ALL_TIERS: ('All' | UserTier)[] = [
  'All',
  'Architect',
  'Master',
  'Specialist',
  'Practitioner',
  'Novice',
];

const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentUser,
  entries,
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | UserTier>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const userTierMeta = useMemo(
    () => calculateTierFromXp(currentUser.xp || 0),
    [currentUser.xp]
  );

  const currentUserRankEntry = useMemo(
    () => entries.find((e) => e.isCurrentUser || e.id === currentUser.id),
    [entries, currentUser.id]
  );

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (selectedTierFilter !== 'All' && entry.tier !== selectedTierFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          entry.name.toLowerCase().includes(q) ||
          entry.primaryTrack.toLowerCase().includes(q) ||
          entry.tier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, selectedTierFilter, searchQuery]);

  return (
    <section
      data-testid="global-leaderboard"
      className="bg-[#121a2b] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6"
    >
      {/* Header & Live Student Tier Status Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-emerald-400">
            Global Engineering Leaderboard · Supabase DENSE_RANK() &amp; Gamified XP Tiers
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Global Scholar Standings &amp; Tier Progression
          </h2>
          <p className="text-xs text-slate-400">
            Earn +50 XP per completed chapter and +100–250 XP per Practice Judge problem to advance from Novice to Architect.
          </p>
        </div>

        {/* Active Student Rank & Tier Card */}
        <div
          data-testid="user-tier-card"
          className="bg-[#0b101b] border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center gap-4"
        >
          <div>
            <div className="text-[11px] text-slate-400">Your Global Rank</div>
            <div className="text-base font-bold font-mono text-white tabular-nums">
              #{currentUserRankEntry?.rank || 1} of {entries.length}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" aria-hidden="true" />
          <div>
            <div className="text-[11px] text-slate-400">Current Tier Status</div>
            <div
              data-testid="current-user-tier-label"
              className="text-base font-bold font-mono text-emerald-400"
            >
              {userTierMeta.tier}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" aria-hidden="true" />
          <div>
            <div className="text-[11px] text-slate-400">Accumulated XP</div>
            <div className="text-base font-bold font-mono text-amber-400 tabular-nums">
              {currentUser.xp} XP · Lvl {currentUser.level}
            </div>
          </div>
        </div>
      </div>

      {/* Gamified 5-Tier Progression Roadmap Bar */}
      <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-semibold text-slate-200">
            Tier Progression:{' '}
            <span className="text-emerald-400 font-bold">{userTierMeta.tier}</span>
            <span className="text-slate-500 mx-1.5">·</span>
            <span className="text-slate-400">{userTierMeta.tagline}</span>
          </div>
          <div className="font-mono text-slate-300 tabular-nums">
            {userTierMeta.nextTier ? (
              <>
                <span className="text-emerald-400 font-bold">{userTierMeta.xpToNextTier} XP</span> to
                unlock <span className="text-white font-bold">{userTierMeta.nextTier}</span> Tier (
                {userTierMeta.tierProgressPercent}%)
              </>
            ) : (
              <span className="text-rose-400 font-bold">
                ★ Maximum Tier Reached: Distinguished Architect
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${userTierMeta.tierProgressPercent}%` }}
          />
        </div>

        {/* 5 Tier Threshold Reference Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {TIER_THRESHOLDS.map((t) => {
            const isCurrent = t.tier === userTierMeta.tier;
            const isUnlocked = (currentUser.xp || 0) >= t.minXp;
            return (
              <div
                key={t.tier}
                className={`p-2.5 rounded-lg border text-xs transition-colors ${
                  isCurrent
                    ? 'bg-emerald-950/30 border-emerald-500/60 text-white'
                    : isUnlocked
                    ? 'bg-[#11192a] border-slate-700 text-slate-200'
                    : 'bg-[#090d16] border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-bold">
                  <span className={isCurrent ? 'text-emerald-400' : ''}>{t.tier}</span>
                  <span>{isUnlocked ? '✓' : '🔒'}</span>
                </div>
                <div className="text-[11px] font-mono tabular-nums mt-0.5 opacity-80">
                  {t.maxXp ? `${t.minXp.toLocaleString()}–${t.maxXp.toLocaleString()} XP` : '5,000+ XP'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: Segmented Tier Controls + Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div
          role="group"
          aria-label="Filter leaderboard by Tier"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#0b101b] border border-slate-800 rounded-xl"
        >
          {ALL_TIERS.map((tierOption) => (
            <button
              key={tierOption}
              type="button"
              onClick={() => setSelectedTierFilter(tierOption)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedTierFilter === tierOption
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tierOption === 'All' ? `All Tiers (${entries.length})` : tierOption}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <label htmlFor="leaderboard-search" className="sr-only">
            Search engineers on leaderboard
          </label>
          <input
            id="leaderboard-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by engineer or track..."
            className="w-full min-h-[38px] bg-[#0b101b] border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* High-Density Tabular Leaderboard Table (50+ Global Engineers) */}
      <div className="overflow-x-auto max-h-[580px] overflow-y-auto rounded-xl border border-slate-800 bg-[#0b101b]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-[#0f172a] shadow-sm">
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-3 px-4 font-mono">Rank</th>
              <th className="py-3 px-4">Engineer</th>
              <th className="py-3 px-4">Tier Status</th>
              <th className="py-3 px-4">Primary Track</th>
              <th className="py-3 px-4 text-right font-mono">Modules</th>
              <th className="py-3 px-4 text-right font-mono">Streak</th>
              <th className="py-3 px-4 text-right font-mono">Level &amp; XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No engineers match the selected tier filter or search query.
                </td>
              </tr>
            ) : (
              filteredEntries.map((row) => (
                <tr
                  key={row.id}
                  data-testid={row.isCurrentUser ? 'leaderboard-current-user-row' : undefined}
                  className={`transition-colors ${
                    row.isCurrentUser
                      ? 'bg-emerald-950/30 hover:bg-emerald-950/40'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold tabular-nums text-slate-200">
                    #{row.rank}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{row.name}</span>
                      {row.isCurrentUser && (
                        <span className="text-[11px] font-mono text-emerald-400">(You)</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold ${
                        row.tier === 'Architect'
                          ? 'text-rose-400'
                          : row.tier === 'Master'
                          ? 'text-amber-400'
                          : row.tier === 'Specialist'
                          ? 'text-blue-400'
                          : row.tier === 'Practitioner'
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {row.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{row.primaryTrack}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                    {row.completedModules} / 477
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-400 font-semibold">
                    {row.streak}d
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-400">
                    Lvl {row.level} · {row.xp.toLocaleString()} XP
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default GlobalLeaderboard;
