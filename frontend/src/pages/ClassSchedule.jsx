import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import AdSenseAd from "../utils/AdSenseAd";
import WeeklyGrid from "../components/schedule/WeeklyGrid";
import ScheduleList from "../components/schedule/ScheduleList";
import SelectBox from "../components/ui/SelectBox";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import {
  DAYS,
  SUBJECT_COLORS,
  TIME_OPTIONS,
  SEMESTER_LABELS,
  getColor,
  formatTime,
} from "../utils/constants/schedule.config";
import {
  CalendarDays,
  Plus,
  LayoutGrid,
  List,
  Copy,
  Trash2,
  X,
  BookOpen,
  Inbox,
} from "lucide-react";

const AddSubjectModal = ({ onAdd, onClose, loading, isDark }) => {
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [professor, setProfessor] = useState("");
  const [color, setColor] = useState("indigo");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Subject name is required.");
      return;
    }
    onAdd({
      name: name.trim(),
      section: section.trim() || null,
      professor: professor.trim() || null,
      color,
    });
  };

  const base = isDark
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className={`rounded-3xl border shadow-2xl w-full max-w-sm p-6 ${base}`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold">Add subject</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3">
          <FloatingLabelInput
            label="Subject name *"
            type="text"
            value={name}
            onChange={(v) => {
              setName(v);
              setError("");
            }}
            isDark={isDark}
          />
          <FloatingLabelInput
            label="Section / Block"
            type="text"
            value={section}
            onChange={setSection}
            isDark={isDark}
          />
          <FloatingLabelInput
            label="Professor (optional)"
            type="text"
            value={professor}
            onChange={setProfessor}
            isDark={isDark}
          />

          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Color
            </div>
            <div className="flex gap-2 flex-wrap">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full transition-all cursor-pointer ${c.bg} ${
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {name && (
            <div
              className={`px-3 py-2 rounded-xl border ${getColor(color).light} ${getColor(color).border}`}
            >
              <div className={`text-xs font-bold ${getColor(color).text}`}>
                {name}
              </div>
              {section && (
                <div
                  className={`text-[10px] ${getColor(color).text} opacity-70`}
                >
                  {section}
                </div>
              )}
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <p className="text-[10px] text-slate-400 mt-3">
          💡 After adding, you can attach multiple time slots to this subject.
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-slate-500 text-sm cursor-pointer dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add subject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddSlotModal = ({ subject, onAdd, onClose, loading, isDark }) => {
  const [days, setDays] = useState([]);
  const [timeStart, setTimeStart] = useState("07:00");
  const [timeEnd, setTimeEnd] = useState("08:30");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");

  const color = getColor(subject.color);

  const toggleDay = (day) =>
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const handleSubmit = () => {
    if (days.length === 0) {
      setError("Select at least one day.");
      return;
    }
    if (timeStart >= timeEnd) {
      setError("End time must be after start time.");
      return;
    }
    onAdd({
      days,
      time_start: timeStart,
      time_end: timeEnd,
      room: room.trim() || null,
    });
  };

  const base = isDark
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className={`rounded-3xl border shadow-2xl w-full max-w-sm p-6 ${base}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Add time slot</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
              <span className="text-xs text-slate-400">{subject.name}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Days *
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {DAYS.map((day) => {
                const active = days.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => {
                      toggleDay(day);
                      setError("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      active
                        ? `${color.bg} border-transparent text-white`
                        : isDark
                          ? "border-slate-700 text-slate-400 hover:border-indigo-400"
                          : "border-slate-200 text-slate-500 hover:border-indigo-300"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Start time
              </div>
              <SelectBox
                options={TIME_OPTIONS}
                value={timeStart}
                onChange={setTimeStart}
                isDark={isDark}
              />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                End time
              </div>
              <SelectBox
                options={TIME_OPTIONS}
                value={timeEnd}
                onChange={setTimeEnd}
                isDark={isDark}
              />
            </div>
          </div>

          <FloatingLabelInput
            label="Room (optional)"
            type="text"
            value={room}
            onChange={setRoom}
            isDark={isDark}
          />
          {days.length > 0 && (
            <div
              className={`px-3 py-2 rounded-xl border text-xs ${color.light} ${color.border} ${color.text}`}
            >
              {days.join(", ")} · {formatTime(timeStart)}–{formatTime(timeEnd)}
              {room && ` · ${room}`}
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-slate-500 text-sm cursor-pointer dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || days.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add slot"}
          </button>
        </div>
      </div>
    </div>
  );
};

const NewSemesterModal = ({ onClose, onCreate, existingLabels, isDark }) => {
  const [label, setLabel] = useState("");
  const [custom, setCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const available = SEMESTER_LABELS.filter(
    (s) => !existingLabels.includes(s.value),
  );
  const base = isDark
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-800";

  const handleCreate = async () => {
    if (!label.trim()) {
      setError("Enter a semester label.");
      return;
    }
    setLoading(true);
    await onCreate(label.trim());
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className={`rounded-3xl border shadow-2xl w-full max-w-sm p-6 ${base}`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold">New semester</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3">
          {!custom ? (
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Select semester
              </div>
              <SelectBox
                options={[{ value: "", label: "Choose..." }, ...available]}
                value={label}
                onChange={setLabel}
                isDark={isDark}
              />
            </div>
          ) : (
            <FloatingLabelInput
              label="Custom label"
              type="text"
              value={label}
              onChange={(v) => {
                setLabel(v);
                setError("");
              }}
              isDark={isDark}
            />
          )}

          <button
            onClick={() => {
              setCustom((v) => !v);
              setLabel("");
            }}
            className="text-xs text-indigo-500 hover:text-indigo-600 cursor-pointer"
          >
            {custom ? "← Choose from presets" : "Enter custom label →"}
          </button>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-slate-500 text-sm cursor-pointer dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !label.trim()}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ClassSchedule = () => {
  const { userId } = useUser();
  const { isDark } = useTheme();

  const [semesters, setSemesters] = useState([]);
  const [activeSem, setActiveSem] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [addingSubj, setAddingSubj] = useState(false);
  const [addingSlot, setAddingSlot] = useState(false);
  const [view, setView] = useState("grid");
  const [showAddSubj, setShowAddSubj] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [slotTarget, setSlotTarget] = useState(null);
  const [showNewSem, setShowNewSem] = useState(false);

  const fetchSemesters = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("semesters")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const list = data || [];
    setSemesters(list);
    if (list.length > 0 && !activeSem) {
      setActiveSem(list.find((s) => s.is_active) || list[0]);
    }
  }, [userId, activeSem]);

  const fetchSubjects = useCallback(async () => {
    if (!userId || !activeSem) {
      setFetching(false);
      return;
    }
    setFetching(true);

    const { data: subjectsData } = await supabase
      .from("subjects")
      .select("*, schedule_slots(*)")
      .eq("user_id", userId)
      .eq("semester_id", activeSem.id)
      .order("created_at", { ascending: true });

    setSubjects(subjectsData || []);
    setFetching(false);
  }, [userId, activeSem]);

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleCreateSemester = async (label) => {
    const { data, error } = await supabase
      .from("semesters")
      .insert({ user_id: userId, label, is_active: true })
      .select()
      .single();
    if (!error && data) {
      setSemesters((prev) => [data, ...prev]);
      setActiveSem(data);
    }
  };

  const handleCopySemester = async () => {
    if (!activeSem || subjects.length === 0) return;
    const { data: newSem, error } = await supabase
      .from("semesters")
      .insert({
        user_id: userId,
        label: `${activeSem.label} (copy)`,
        is_active: false,
      })
      .select()
      .single();
    if (error || !newSem) return;

    for (const subj of subjects) {
      const { data: newSubj } = await supabase
        .from("subjects")
        .insert({
          user_id: userId,
          semester_id: newSem.id,
          name: subj.name,
          section: subj.section,
          professor: subj.professor,
          color: subj.color,
        })
        .select()
        .single();

      if (newSubj && subj.schedule_slots?.length > 0) {
        const slots = subj.schedule_slots.map(
          ({ id, created_at, subject_id, ...rest }) => ({
            ...rest,
            subject_id: newSubj.id,
          }),
        );
        await supabase.from("schedule_slots").insert(slots);
      }
    }

    setSemesters((prev) => [newSem, ...prev]);
    setActiveSem(newSem);
  };

  const handleDeleteSemester = async () => {
    if (
      !activeSem ||
      !confirm(`Delete "${activeSem.label}" and all its subjects?`)
    )
      return;
    await supabase.from("semesters").delete().eq("id", activeSem.id);
    const remaining = semesters.filter((s) => s.id !== activeSem.id);
    setSemesters(remaining);
    setActiveSem(remaining[0] || null);
    setSubjects([]);
  };

  const handleAddSubject = async (fields) => {
    if (!userId || !activeSem) return;
    setAddingSubj(true);
    const { data, error } = await supabase
      .from("subjects")
      .insert({ ...fields, user_id: userId, semester_id: activeSem.id })
      .select()
      .single();

    if (!error && data) {
      setSubjects((prev) => [...prev, { ...data, schedule_slots: [] }]);
      setShowAddSubj(false);
    }
    setAddingSubj(false);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!confirm("Delete this subject and all its time slots?")) return;
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", subjectId);
    if (!error) setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const handleAddSlot = async (fields) => {
    if (!slotTarget) return;
    setAddingSlot(true);
    const { data, error } = await supabase
      .from("schedule_slots")
      .insert({ ...fields, subject_id: slotTarget.id })
      .select()
      .single();

    if (!error && data) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === slotTarget.id
            ? { ...s, schedule_slots: [...(s.schedule_slots || []), data] }
            : s,
        ),
      );
      setShowAddSlot(false);
      setSlotTarget(null);
    }
    setAddingSlot(false);
  };

  const handleDeleteSlot = async (slotId) => {
    const { error } = await supabase
      .from("schedule_slots")
      .delete()
      .eq("id", slotId);
    if (!error) {
      setSubjects((prev) =>
        prev.map((s) => ({
          ...s,
          schedule_slots: (s.schedule_slots || []).filter(
            (sl) => sl.id !== slotId,
          ),
        })),
      );
    }
  };

  const openAddSlot = (subject) => {
    setSlotTarget(subject);
    setShowAddSlot(true);
  };

  const totalSlots = subjects.reduce(
    (acc, s) => acc + (s.schedule_slots?.length || 0),
    0,
  );
  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-800";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const semOptions = semesters.map((s) => ({ value: s.id, label: s.label }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1
            className={`text-xl font-bold flex items-center gap-2 ${textBase}`}
          >
            <CalendarDays size={20} className="text-indigo-500" /> Class
            Schedule
          </h1>
          <p className={`text-xs mt-0.5 ${textMuted}`}>
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""} ·{" "}
            {totalSlots} time slot{totalSlots !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex gap-1 p-1 rounded-xl border ${cardBase}`}>
            <button
              onClick={() => setView("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${view === "grid" ? "bg-indigo-500 text-white" : textMuted}`}
            >
              <LayoutGrid size={12} /> Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${view === "list" ? "bg-indigo-500 text-white" : textMuted}`}
            >
              <List size={12} /> List
            </button>
          </div>

          <button
            onClick={() => setShowAddSubj(true)}
            disabled={!activeSem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40"
          >
            <Plus size={15} /> Add subject
          </button>
        </div>
      </div>

      <AdSenseAd />

      <div
        className={`rounded-2xl border p-4 mb-5 flex items-center gap-3 flex-wrap ${cardBase}`}
      >
        <BookOpen size={15} className="text-indigo-500 shrink-0" />
        {semesters.length === 0 ? (
          <p className={`text-sm flex-1 ${textMuted}`}>No semesters yet.</p>
        ) : (
          <div className="flex-1 min-w-45">
            <SelectBox
              isDark={isDark}
              options={semOptions}
              value={activeSem?.id || ""}
              onChange={(val) => {
                const found = semesters.find((s) => s.id === val);
                if (found) {
                  setActiveSem(found);
                  setSubjects([]);
                }
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowNewSem(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <Plus size={12} /> New sem
          </button>
          {activeSem && subjects.length > 0 && (
            <button
              onClick={handleCopySemester}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <Copy size={12} /> Copy sem
            </button>
          )}
          {activeSem && (
            <button
              onClick={handleDeleteSemester}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 cursor-pointer"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            {
              label: "Subjects",
              value: subjects.length,
              color: "text-indigo-500",
            },
            {
              label: "Time slots",
              value: totalSlots,
              color: "text-purple-500",
            },
            {
              label: "Active days",
              value: [
                ...new Set(
                  subjects.flatMap((s) =>
                    (s.schedule_slots || []).flatMap((sl) => sl.days || []),
                  ),
                ),
              ].length,
              color: "text-emerald-500",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`rounded-2xl border p-3.5 text-center ${cardBase}`}
            >
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">
                {label}
              </div>
              <div className={`text-2xl font-bold font-mono ${color}`}>
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      {!activeSem ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBase}`}>
          <CalendarDays
            size={32}
            className="mx-auto mb-3 opacity-30 text-slate-400"
          />
          <div className={`text-sm font-medium mb-3 ${textMuted}`}>
            No semester yet.
          </div>
          <button
            onClick={() => setShowNewSem(true)}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer"
          >
            Create your first semester →
          </button>
        </div>
      ) : fetching ? (
        <div className={`rounded-2xl border p-10 text-center ${cardBase}`}>
          <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
          <div className="text-sm text-slate-400">Loading schedule...</div>
        </div>
      ) : subjects.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBase}`}>
          <Inbox size={32} className="mx-auto mb-2 opacity-30 text-slate-400" />
          <div className={`text-sm font-medium mb-3 ${textMuted}`}>
            No subjects yet.
          </div>
          <button
            onClick={() => setShowAddSubj(true)}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer"
          >
            Add your first subject →
          </button>
        </div>
      ) : view === "grid" ? (
        <WeeklyGrid
          subjects={subjects}
          onDeleteSlot={handleDeleteSlot}
          isDark={isDark}
        />
      ) : (
        <ScheduleList
          subjects={subjects}
          onDeleteSubject={handleDeleteSubject}
          onDeleteSlot={handleDeleteSlot}
          onAddSlot={openAddSlot}
          isDark={isDark}
        />
      )}

      <AdSenseAd />

      <p className="text-center text-[11px] text-slate-300 mt-6">
        Class Schedule · StudIQ PH 🇵🇭
      </p>

      {showAddSubj && (
        <AddSubjectModal
          isDark={isDark}
          onClose={() => setShowAddSubj(false)}
          onAdd={handleAddSubject}
          loading={addingSubj}
        />
      )}
      {showAddSlot && slotTarget && (
        <AddSlotModal
          isDark={isDark}
          subject={slotTarget}
          onClose={() => {
            setShowAddSlot(false);
            setSlotTarget(null);
          }}
          onAdd={handleAddSlot}
          loading={addingSlot}
        />
      )}
      {showNewSem && (
        <NewSemesterModal
          isDark={isDark}
          onClose={() => setShowNewSem(false)}
          onCreate={handleCreateSemester}
          existingLabels={semesters.map((s) => s.label)}
        />
      )}
    </div>
  );
};

export default ClassSchedule;
