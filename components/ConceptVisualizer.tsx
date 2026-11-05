import React, { useState, useEffect } from 'react';

type SimMode = 'binary-search' | 'sorting' | 'sql-joins' | 'cpu-scheduler';

const INITIAL_BS_ARRAY = [4, 9, 14, 21, 28, 35, 42, 56, 68, 79];

const ConceptVisualizer: React.FC = () => {
  const [activeSim, setActiveSim] = useState<SimMode>('binary-search');

  // --- Simulation 1: Binary Search State ---
  const [bsTarget, setBsTarget] = useState<number>(42);
  const [bsStep, setBsStep] = useState<number>(0);
  const [bsPlaying, setBsPlaying] = useState<boolean>(false);

  const bsTrace = React.useMemo(() => {
    const steps: { low: number; high: number; mid: number; status: string; found: boolean }[] = [];
    let low = 0;
    let high = INITIAL_BS_ARRAY.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const val = INITIAL_BS_ARRAY[mid];
      if (val === bsTarget) {
        steps.push({
          low,
          high,
          mid,
          status: `Match found! arr[${mid}] == ${bsTarget}. Search complete in ${steps.length + 1} comparisons.`,
          found: true,
        });
        break;
      } else if (val < bsTarget) {
        steps.push({
          low,
          high,
          mid,
          status: `arr[${mid}] (${val}) < target (${bsTarget}) → Discard left half, set low = ${mid + 1}.`,
          found: false,
        });
        low = mid + 1;
      } else {
        steps.push({
          low,
          high,
          mid,
          status: `arr[${mid}] (${val}) > target (${bsTarget}) → Discard right half, set high = ${mid - 1}.`,
          found: false,
        });
        high = mid - 1;
      }
    }
    if (steps.length === 0 || (!steps[steps.length - 1].found && low > high)) {
      steps.push({
        low,
        high,
        mid: -1,
        status: `low (${low}) > high (${high}) → Target ${bsTarget} is not present in array (return -1).`,
        found: false,
      });
    }
    return steps;
  }, [bsTarget]);

  useEffect(() => {
    if (!bsPlaying) return;
    const timer = setInterval(() => {
      setBsStep((prev) => {
        if (prev < bsTrace.length - 1) return prev + 1;
        setBsPlaying(false);
        return prev;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [bsPlaying, bsTrace.length]);

  // --- Simulation 2: Sorting Visualizer State ---
  const [sortBars, setSortBars] = useState<number[]>([58, 32, 84, 19, 71, 45, 92, 27]);
  const [sortStepIdx, setSortStepIdx] = useState<number>(0);
  const [sortPlaying, setSortPlaying] = useState<boolean>(false);

  const sortSnapshots = React.useMemo(() => {
    const arr = [...sortBars];
    const snaps: { array: number[]; comparing: [number, number] | null; swapped: boolean; note: string }[] = [
      { array: [...arr], comparing: null, swapped: false, note: 'Initial unsorted array state.' },
    ];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          const tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          snaps.push({
            array: [...arr],
            comparing: [j, j + 1],
            swapped: true,
            note: `Compared ${arr[j + 1]} > ${arr[j]} → Swapped indices [${j}] and [${j + 1}].`,
          });
        } else {
          snaps.push({
            array: [...arr],
            comparing: [j, j + 1],
            swapped: false,
            note: `Compared ${arr[j]} <= ${arr[j + 1]} → Already in order.`,
          });
        }
      }
    }
    snaps.push({ array: [...arr], comparing: null, swapped: false, note: 'Array completely sorted in ascending order!' });
    return snaps;
  }, [sortBars]);

  useEffect(() => {
    if (!sortPlaying) return;
    const timer = setInterval(() => {
      setSortStepIdx((prev) => {
        if (prev < sortSnapshots.length - 1) return prev + 1;
        setSortPlaying(false);
        return prev;
      });
    }, 450);
    return () => clearInterval(timer);
  }, [sortPlaying, sortSnapshots.length]);

  // --- Simulation 3: SQL JOIN Visualizer State ---
  const [joinType, setJoinType] = useState<'INNER' | 'LEFT' | 'RIGHT' | 'FULL'>('INNER');

  const sqlUsers = [
    { user_id: 1, name: 'Aarav', dept_id: 10 },
    { user_id: 2, name: 'Priya', dept_id: 20 },
    { user_id: 3, name: 'Kabir', dept_id: 99 },
  ];
  const sqlDepts = [
    { dept_id: 10, dept_name: 'Engineering' },
    { dept_id: 20, dept_name: 'AI Research' },
    { dept_id: 30, dept_name: 'Cloud Ops' },
  ];

  const joinedRows = React.useMemo(() => {
    if (joinType === 'INNER') {
      return [
        { user_id: '1', name: 'Aarav', dept_id: '10', dept_name: 'Engineering', status: 'Matched' },
        { user_id: '2', name: 'Priya', dept_id: '20', dept_name: 'AI Research', status: 'Matched' },
      ];
    }
    if (joinType === 'LEFT') {
      return [
        { user_id: '1', name: 'Aarav', dept_id: '10', dept_name: 'Engineering', status: 'Matched' },
        { user_id: '2', name: 'Priya', dept_id: '20', dept_name: 'AI Research', status: 'Matched' },
        { user_id: '3', name: 'Kabir', dept_id: '99', dept_name: 'NULL', status: 'Left Only (NULL padded)' },
      ];
    }
    if (joinType === 'RIGHT') {
      return [
        { user_id: '1', name: 'Aarav', dept_id: '10', dept_name: 'Engineering', status: 'Matched' },
        { user_id: '2', name: 'Priya', dept_id: '20', dept_name: 'AI Research', status: 'Matched' },
        { user_id: 'NULL', name: 'NULL', dept_id: '30', dept_name: 'Cloud Ops', status: 'Right Only (NULL padded)' },
      ];
    }
    return [
      { user_id: '1', name: 'Aarav', dept_id: '10', dept_name: 'Engineering', status: 'Matched' },
      { user_id: '2', name: 'Priya', dept_id: '20', dept_name: 'AI Research', status: 'Matched' },
      { user_id: '3', name: 'Kabir', dept_id: '99', dept_name: 'NULL', status: 'Left Only' },
      { user_id: 'NULL', name: 'NULL', dept_id: '30', dept_name: 'Cloud Ops', status: 'Right Only' },
    ];
  }, [joinType]);

  // --- Simulation 4: CPU Scheduler State ---
  const [quantum, setQuantum] = useState<number>(2);
  const cpuProcesses = [
    { pid: 'P1', burst: 5, color: 'bg-blue-600' },
    { pid: 'P2', burst: 3, color: 'bg-emerald-600' },
    { pid: 'P3', burst: 4, color: 'bg-amber-600' },
  ];

  const ganttSlices = React.useMemo(() => {
    const rem = cpuProcesses.map((p) => ({ ...p, left: p.burst }));
    const slices: { pid: string; duration: number; start: number; end: number; color: string }[] = [];
    let time = 0;
    let guard = 0;
    while (rem.some((r) => r.left > 0) && guard < 30) {
      guard++;
      for (const proc of rem) {
        if (proc.left > 0) {
          const run = Math.min(quantum, proc.left);
          slices.push({
            pid: proc.pid,
            duration: run,
            start: time,
            end: time + run,
            color: proc.color,
          });
          time += run;
          proc.left -= run;
        }
      }
    }
    return slices;
  }, [quantum]);

  const currentBs = bsTrace[Math.min(bsStep, bsTrace.length - 1)];
  const currentSort = sortSnapshots[Math.min(sortStepIdx, sortSnapshots.length - 1)];

  return (
    <div className="space-y-6 pb-12">
      {/* Mode Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#131c2e] p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="text-xs font-semibold text-blue-400">
            Interactive Dry-Run Visualizers · Step-by-Step Execution
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Visual Algorithm & Systems Sandbox
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#0b101b] p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'binary-search', label: 'Binary Search Dry-Run' },
            { id: 'sorting', label: 'Sorting Animator' },
            { id: 'sql-joins', label: 'SQL JOIN Explorer' },
            { id: 'cpu-scheduler', label: 'OS CPU Scheduler' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSim(tab.id as SimMode)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeSim === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (65% Left Interactive Stage / 35% Right Control & Concept Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Zone: Interactive Visual Stage */}
        <div className="lg:col-span-8 bg-[#121a2b] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[380px]">
          {activeSim === 'binary-search' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Binary Search Pointer Trace — O(log N)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Searching for Target = <span className="text-blue-400 font-mono font-bold">{bsTarget}</span> in sorted array of 10 elements
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  ● Step {bsStep + 1} of {bsTrace.length}
                </span>
              </div>

              {/* Array Boxes */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-4 pb-2">
                {INITIAL_BS_ARRAY.map((val, idx) => {
                  const isMid = idx === currentBs.mid;
                  const inRange = idx >= currentBs.low && idx <= currentBs.high;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isMid && currentBs.found
                          ? 'bg-emerald-600/30 border-emerald-400 text-white scale-105'
                          : isMid
                          ? 'bg-blue-600/30 border-blue-400 text-white scale-105'
                          : inRange
                          ? 'bg-slate-900 border-slate-700 text-slate-200'
                          : 'bg-slate-950/40 border-slate-800/50 text-slate-600 opacity-50'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-400 mb-1">[{idx}]</div>
                      <div className="text-base font-bold font-mono tabular-nums">{val}</div>
                      <div className="text-[10px] font-mono mt-1.5 min-h-[16px]">
                        {idx === currentBs.low && <span className="text-amber-400">L </span>}
                        {idx === currentBs.mid && <span className="text-blue-300 font-bold">M </span>}
                        {idx === currentBs.high && <span className="text-purple-400">H</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Step Callout */}
              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200">
                <div className="text-slate-400 mb-1">
                  Invariant: low = {currentBs.low} · mid = {currentBs.mid} · high = {currentBs.high}
                </div>
                <div className={currentBs.found ? 'text-emerald-400 font-semibold' : 'text-blue-300'}>
                  {currentBs.status}
                </div>
              </div>
            </div>
          )}

          {activeSim === 'sorting' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Sorting Comparison & Swap Visualizer</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Watch adjacent comparisons bubble the largest values to their sorted positions
                  </p>
                </div>
                <span className="text-xs font-mono text-blue-400">
                  Step {sortStepIdx + 1} / {sortSnapshots.length}
                </span>
              </div>

              <div className="flex items-end justify-center gap-3 h-52 pt-6 px-4 bg-[#0b101b] rounded-xl border border-slate-800">
                {currentSort.array.map((val, idx) => {
                  const isComparing =
                    currentSort.comparing &&
                    (currentSort.comparing[0] === idx || currentSort.comparing[1] === idx);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-200 tabular-nums">
                        {val}
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-150 ${
                          isComparing
                            ? currentSort.swapped
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                            : 'bg-emerald-600/80'
                        }`}
                        style={{ height: `${Math.max(24, val * 1.6)}px` }}
                      />
                      <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300">
                {currentSort.note}
              </div>
            </div>
          )}

          {activeSim === 'sql-joins' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Relational SQL {joinType} JOIN Result Set
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    SELECT u.user_id, u.name, d.dept_id, d.dept_name FROM users u {joinType} JOIN departments d ON u.dept_id = d.dept_id;
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto bg-[#0b101b] rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                      <th className="py-2.5 px-4">u.user_id</th>
                      <th className="py-2.5 px-4">u.name</th>
                      <th className="py-2.5 px-4">d.dept_id</th>
                      <th className="py-2.5 px-4">d.dept_name</th>
                      <th className="py-2.5 px-4">Join Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {joinedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 text-slate-200 tabular-nums">{r.user_id}</td>
                        <td className="py-2.5 px-4 text-white font-semibold">{r.name}</td>
                        <td className="py-2.5 px-4 text-slate-300 tabular-nums">{r.dept_id}</td>
                        <td className="py-2.5 px-4 text-blue-300">{r.dept_name}</td>
                        <td className="py-2.5 px-4 text-emerald-400">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSim === 'cpu-scheduler' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Round-Robin CPU Scheduling Gantt Timeline (Quantum = {quantum}ms)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Preemptive time-slicing across processes P1 (5ms), P2 (3ms), and P3 (4ms)
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-[#0b101b] p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-slate-400">CPU Execution Timeline (0ms → 12ms):</div>
                <div className="flex w-full rounded-lg overflow-hidden border border-slate-700">
                  {ganttSlices.map((slice, idx) => (
                    <div
                      key={idx}
                      style={{ flexGrow: slice.duration }}
                      className={`${slice.color} py-3 px-2 text-center border-r border-slate-900/60 text-white font-mono text-xs font-bold`}
                    >
                      <div>{slice.pid}</div>
                      <div className="text-[10px] opacity-85">
                        {slice.start}-{slice.end}ms
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-400 pt-2">
                  Total Context Switches: <span className="text-white font-mono font-bold">{ganttSlices.length - 1}</span> · Smaller quantum improves response time but increases context-switch overhead.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Control & Concept Deck */}
        <div className="lg:col-span-4 bg-[#121a2b] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          {activeSim === 'binary-search' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-white">Playback & Parameters</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select a target value and step through the halving interval.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Target Value: <span className="text-blue-400 font-mono">{bsTarget}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[9, 21, 42, 68, 50].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setBsPlaying(false);
                        setBsTarget(t);
                        setBsStep(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                        bsTarget === t
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t === 50 ? '50 (Miss)' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBsPlaying(!bsPlaying)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  {bsPlaying ? 'Pause' : 'Auto Play'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBsPlaying(false);
                    setBsStep((prev) => Math.min(bsTrace.length - 1, prev + 1));
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Step Forward
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBsPlaying(false);
                    setBsStep(0);
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {activeSim === 'sorting' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-white">Sorting Controls</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Step forward or auto-play adjacent element comparisons.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSortPlaying(!sortPlaying)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  {sortPlaying ? 'Pause' : 'Play Sort'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortPlaying(false);
                    setSortStepIdx((prev) => Math.min(sortSnapshots.length - 1, prev + 1));
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Step
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortPlaying(false);
                    setSortStepIdx(0);
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {activeSim === 'sql-joins' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Select SQL JOIN Mode</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['INNER', 'LEFT', 'RIGHT', 'FULL'] as const).map((jt) => (
                  <button
                    key={jt}
                    type="button"
                    onClick={() => setJoinType(jt)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold border transition-colors ${
                      joinType === jt
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {jt} JOIN
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notice how user <strong className="text-white">Kabir (dept_id 99)</strong> and department <strong className="text-white">Cloud Ops (dept_id 30)</strong> appear or get filtered out depending on the join type.
              </p>
            </div>
          )}

          {activeSim === 'cpu-scheduler' && (
            <div className="space-y-4">
              <label htmlFor="quantum-slider" className="block text-xs font-semibold text-slate-200">
                Time Quantum Slice: <span className="text-blue-400 font-mono">{quantum} ms</span>
              </label>
              <input
                id="quantum-slider"
                type="range"
                min={1}
                max={5}
                value={quantum}
                onChange={(e) => setQuantum(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>1ms (High Switching)</span>
                <span>5ms (FCFS-like)</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-white block mb-1">Exam & Interview Tip</strong>
            Always trace edge cases (empty input, single element, duplicate values) using a dry-run table before coding.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptVisualizer;
