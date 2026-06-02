import { useState } from "react";
import AdSenseAd from "../utils/AdSenseAd";
import SelectBox from "../components/ui/SelectBox";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import Header from "../components/layout/Header";
import { Lightbulb, RotateCcw, SkipForward, Timer } from "lucide-react";
import {
  AMBIENT_SOUNDS,
  MODES,
  SUBJECT_OPTIONS,
} from "../utils/constants/pomodoro-config";
import CircularTimer from "../components/CircularTimer";
import { formatDuration } from "../utils/functions/pomodoro";
import SessionItem from "../components/SessionItem";
import Button from "../components/ui/Button";
import TipBox from "../components/TipBox";
import { useTheme } from "../context/ThemeContext";
import { usePomodoroContext } from "../context/PomodoroContext";

const PomodoroTimer = () => {
  const { isDark } = useTheme();

  const {
    mode,
    durations,
    timeLeft,
    isRunning,
    pomodoroCount,
    cycleCount,
    subject,
    setSubject,
    customSubject,
    setCustomSubject,
    sessions,
    setSessions,
    ambientSound,
    setAmbientSound,
    volume,
    setVolume,
    progress,
    totalFocusToday,
    totalSessions,
    activeSubject,
    handleStart,
    handleReset,
    handleModeSwitch,
    handleSkip,
    applySettings,
    initAudio,
  } = usePomodoroContext();

  const [showSettings, setShowSettings] = useState(false);
  const [tempDurations, setTempDurations] = useState(durations);

  const handleApply = () => {
    applySettings(tempDurations);
    setShowSettings(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        header="Pomodoro Timer"
        subHeader="Focus. Break. Repeat. — Para sa mga estudyante 🇵🇭"
        icon={<Timer size={20} className="text-purple-500" />}
      />

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AdSenseAd />

        <div
          className={`flex gap-1 ${isDark ? "bg-slate-700" : "bg-slate-100"} rounded-xl p-1 mt-5 mb-5`}
        >
          {Object.entries(MODES).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => handleModeSwitch(key)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                mode === key
                  ? isDark
                    ? "bg-slate-50 text-slate-700 shadow-sm"
                    : "bg-slate-800 text-slate-100 shadow-sm"
                  : "bg-transparent text-slate-400 hover:text-slate-700 hover:bg-white"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* ── Timer card ── */}
        <div
          className={`${isDark ? "bg-slate-800" : "bg-slate-50"} rounded-2xl border ${MODES[mode].border} p-6 mb-4 flex flex-col items-center gap-5`}
        >
          {/* Cycle dots */}
          <div className="flex gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < cycleCount ? "bg-indigo-500 scale-110" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <CircularTimer
            progress={progress}
            mode={mode}
            timeLeft={timeLeft}
            isRunning={isRunning}
          />

          {activeSubject && (
            <div
              className={`flex items-center gap-2 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-xl px-3 py-1.5`}
            >
              <span className="text-xs text-slate-500">Studying:</span>
              <span
                className={`text-xs font-semibold ${isDark ? "text-slate-100" : "text-slate-700"}`}
              >
                {activeSubject}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button icon={RotateCcw} onClick={handleReset} label="Reset" />
            <Button
              variant="excel"
              onClick={handleStart}
              label={
                isRunning
                  ? "Pause"
                  : timeLeft === durations[mode] * 60
                    ? "Start"
                    : "Resume"
              }
            />
            <Button
              label="Skip"
              icon={SkipForward}
              onClick={handleSkip}
              variant="secondary"
            />
          </div>
        </div>

        {/* ── Session setup ── */}
        <div
          className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl p-4 mb-4`}
        >
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Session setup
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Subject
              </div>
              <SelectBox
                options={SUBJECT_OPTIONS}
                value={subject}
                onChange={setSubject}
                placeholder="Pick a subject"
                searchable={false}
              />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Ambient sound
              </div>
              <SelectBox
                options={AMBIENT_SOUNDS}
                value={ambientSound}
                onChange={(val) => {
                  initAudio();
                  setAmbientSound(val);
                }}
                placeholder="No sound"
                searchable={false}
              />
            </div>
          </div>

          {subject === "Other" && (
            <div className="mb-3">
              <FloatingLabelInput
                type="text"
                label="Custom subject name"
                value={customSubject}
                onChange={setCustomSubject}
              />
            </div>
          )}

          {ambientSound !== "none" && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider w-14">
                Volume
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  initAudio();
                }}
                className="flex-1 h-1.5 accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            {
              label: "Focus sessions",
              value: totalSessions,
              color: "text-indigo-500",
            },
            {
              label: "Focus time",
              value:
                totalFocusToday > 0 ? formatDuration(totalFocusToday) : "0m",
              color: "text-emerald-500",
            },
            {
              label: "Pomodoros",
              value: `${pomodoroCount} 🍅`,
              color: "text-orange-500",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl p-3.5 text-center`}
            >
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">
                {label}
              </div>
              <div className={`text-xl font-bold font-mono ${color}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Custom durations ── */}
        <div
          className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-2xl mb-4 overflow-hidden`}
        >
          <button
            onClick={() => {
              setTempDurations(durations);
              setShowSettings((v) => !v);
            }}
            className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold ${isDark ? "text-slate-100 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"} transition-colors cursor-pointer`}
          >
            <span className="flex items-center gap-2">
              ⚙️ Custom timer durations
            </span>
            <span
              className={`text-slate-400 transition-transform ${showSettings ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>
          {showSettings && (
            <div className="px-4 pb-4 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  { key: "focus", label: "Focus (min)" },
                  { key: "shortBreak", label: "Short break (min)" },
                  { key: "longBreak", label: "Long break (min)" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <FloatingLabelInput
                      label={label}
                      type="number"
                      min={1}
                      max={120}
                      value={tempDurations[key]}
                      onChange={(val) =>
                        setTempDurations((d) => ({
                          ...d,
                          [key]:
                            val === ""
                              ? ""
                              : Math.max(1, Math.min(120, Number(val))),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleApply}
                className="mt-3 w-full py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors cursor-pointer"
              >
                Apply settings
              </button>
            </div>
          )}
        </div>

        <AdSenseAd />

        {/* ── Session log ── */}
        <div
          className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl p-4 mb-4`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-800"}`}
            >
              📋 Session log
            </h3>
            {sessions.length > 0 && (
              <button
                onClick={() => setSessions([])}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-6 text-slate-300">
              <div className="text-3xl mb-2">🍅</div>
              <div className="text-sm">
                No sessions yet. Start your first pomodoro!
              </div>
            </div>
          ) : (
            <div>
              {sessions.slice(0, 8).map((s) => (
                <SessionItem key={s.id} session={s} />
              ))}
              {sessions.length > 8 && (
                <div className="text-center text-xs text-slate-400 pt-2">
                  +{sessions.length - 8} more sessions
                </div>
              )}
            </div>
          )}
        </div>

        <TipBox
          icon={Lightbulb}
          isDark={isDark}
          title="Pomodoro tips para sa mga Pinoy students"
          tips={[
            <>
              {" "}
              Subukan ang <strong>25 min focus + 5 min break</strong>—simple
              pero proven na effective para sa concentration.{" "}
            </>,
            <>
              {" "}
              Pagkatapos ng <strong>4 na sessions</strong>, mag-long break ng
              15–30 minuto para hindi ka ma-burnout.{" "}
            </>,
            <>
              {" "}
              <strong>Isang task lang bawat session</strong>—multitasking kills
              focus.{" "}
            </>,
            <>
              {" "}
              I-silent ang phone mo (or ilayo mo muna) habang naka-focus
              mode—biggest distraction yan.{" "}
            </>,
            <>
              {" "}
              Gamitin ang break para{" "}
              <strong>mag-stretch, uminom ng tubig, o lumabas</strong>—huwag
              mag-scroll agad.{" "}
            </>,
            <>
              {" "}
              <strong>Pro tip:</strong> Kahit 1–2 sessions lang matapos mo
              today, progress pa rin yan.{" "}
            </>,
          ]}
        />

        <AdSenseAd />

        <p className="text-center text-[11px] text-slate-500 mt-5">
          Pomodoro Timer · PH Study Tools 🇵🇭
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
