import {
  DAYS,
  DAY_FULL,
  getColor,
  formatTime,
} from "../../utils/constants/schedule.config";
import {
  Trash2,
  Clock,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useState } from "react";
const SlotRow = ({ slot, color, onDeleteSlot, isDark }) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 rounded-xl group ${isDark ? "bg-slate-700/40" : "bg-slate-50"}`}
  >
    <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-1 flex-wrap gap-y-0.5">
      <span className="flex items-center gap-1">
        <Clock size={10} />
        {formatTime(slot.time_start)}–{formatTime(slot.time_end)}
      </span>
      <span className="text-slate-300">·</span>
      <span>{slot.days?.join(", ")}</span>
      {slot.room && (
        <>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {slot.room}
          </span>
        </>
      )}
    </div>
    <button
      onClick={() => onDeleteSlot(slot.id)}
      className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
    >
      <Trash2 size={11} />
    </button>
  </div>
);

const SubjectCard = ({
  subject,
  onDeleteSubject,
  onDeleteSlot,
  onAddSlot,
  isDark,
}) => {
  const [expanded, setExpanded] = useState(true);
  const color = getColor(subject.color);
  const slots = subject.schedule_slots || [];

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={`w-3 h-3 rounded-full shrink-0 ${color.bg}`} />

        <div className="flex-1 min-w-0">
          <div
            className={`text-sm font-bold truncate ${isDark ? "text-slate-100" : "text-slate-800"}`}
          >
            {subject.name}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {subject.section && (
              <span className="text-[10px] text-slate-400">
                {subject.section}
              </span>
            )}
            {subject.professor && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <User size={9} /> {subject.professor}
              </span>
            )}
            <span className="text-[10px] text-slate-400">
              {slots.length} slot{slots.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onAddSlot(subject)}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors ${isDark ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-indigo-50"}`}
            title="Add time slot"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={() => onDeleteSubject(subject.id)}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center text-slate-400 hover:text-red-400 cursor-pointer transition-colors ${isDark ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-red-50"}`}
            title="Delete subject"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 cursor-pointer"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className={`px-4 pb-3 space-y-1.5 border-t ${isDark ? "border-slate-700" : "border-slate-100"} pt-2`}
        >
          {slots.length === 0 ? (
            <p className="text-xs text-slate-400 py-1">
              No time slots yet.{" "}
              <button
                onClick={() => onAddSlot(subject)}
                className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
              >
                Add one →
              </button>
            </p>
          ) : (
            slots.map((slot) => (
              <SlotRow
                key={slot.id}
                slot={slot}
                color={color}
                onDeleteSlot={onDeleteSlot}
                isDark={isDark}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const ScheduleList = ({
  subjects,
  onDeleteSubject,
  onDeleteSlot,
  onAddSlot,
  isDark,
}) => {
  const todayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date().getDay()
  ];

  const todaySlots = [];
  subjects.forEach((subject) => {
    (subject.schedule_slots || []).forEach((slot) => {
      if (slot.days?.includes(todayName)) {
        todaySlots.push({ subject, slot });
      }
    });
  });
  todaySlots.sort((a, b) => a.slot.time_start.localeCompare(b.slot.time_start));

  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-5">
      {todaySlots.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              {DAY_FULL[todayName]}
            </div>
            <span className="text-[9px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">
              TODAY
            </span>
            <div
              className={`flex-1 h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
            />
          </div>
          <div className="space-y-2">
            {todaySlots.map(({ subject, slot }) => {
              const color = getColor(subject.color);
              return (
                <div
                  key={`today-${slot.id}`}
                  className={`flex items-stretch gap-0 rounded-xl border overflow-hidden ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
                >
                  <div className={`w-1 shrink-0 ${color.bg}`} />
                  <div className="flex-1 px-3 py-2.5">
                    <div
                      className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}
                    >
                      {subject.name}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={10} />
                        {formatTime(slot.time_start)}–
                        {formatTime(slot.time_end)}
                      </span>
                      {slot.room && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin size={10} />
                          {slot.room}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}
          >
            All subjects
          </div>
          <div
            className={`flex-1 h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
          />
          <span className={`text-[10px] ${textMuted}`}>
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="space-y-2">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onDeleteSubject={onDeleteSubject}
              onDeleteSlot={onDeleteSlot}
              onAddSlot={onAddSlot}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
