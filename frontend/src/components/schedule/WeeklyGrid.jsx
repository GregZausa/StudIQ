import {
  DAYS,
  TIME_SLOTS,
  SLOT_HEIGHT_PX,
  GRID_START_MINUTES,
  getColor,
  formatTime,
  timeToMinutes,
} from "../../utils/constants/schedule.config";
import { Trash2 } from "lucide-react";

const SubjectBlock = ({ subject, slot, onDeleteSlot }) => {
  const color = getColor(subject.color);
  const startMins = timeToMinutes(slot.time_start);
  const endMins = timeToMinutes(slot.time_end);
  const duration = endMins - startMins;
  const topPx = ((startMins - GRID_START_MINUTES) / 30) * SLOT_HEIGHT_PX;
  const heightPx = (duration / 30) * SLOT_HEIGHT_PX - 2;

  return (
    <div
      className={`absolute left-0.5 right-0.5 rounded-lg px-1.5 py-1 overflow-hidden group cursor-default ${color.light} border ${color.border}`}
      style={{ top: topPx, height: heightPx }}
    >
      <div
        className={`text-[10px] font-bold truncate leading-tight ${color.text}`}
      >
        {subject.name}
      </div>
      {heightPx > 36 && (
        <div className={`text-[9px] truncate ${color.text} opacity-70`}>
          {formatTime(slot.time_start)}–{formatTime(slot.time_end)}
        </div>
      )}
      {heightPx > 52 && slot.room && (
        <div className={`text-[9px] truncate ${color.text} opacity-60`}>
          📍 {slot.room}
        </div>
      )}
      <button
        onClick={() => onDeleteSlot(slot.id)}
        className="absolute top-0.5 right-0.5 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-white/60 hover:bg-red-100"
      >
        <Trash2 size={10} className="text-red-500" />
      </button>
    </div>
  );
};

const WeeklyGrid = ({ subjects, onDeleteSlot, isDark }) => {
  const totalHeight = TIME_SLOTS.length * SLOT_HEIGHT_PX;
  const todayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date().getDay()
  ];

  const byDay = {};
  DAYS.forEach((d) => {
    byDay[d] = [];
  });

  subjects.forEach((subject) => {
    (subject.schedule_slots || []).forEach((slot) => {
      (slot.days || []).forEach((day) => {
        if (byDay[day]) byDay[day].push({ subject, slot });
      });
    });
  });

  const borderColor = isDark ? "border-slate-700" : "border-slate-200";
  const bgBase = isDark ? "bg-slate-800" : "bg-white";
  const textMuted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${isDark ? "border-slate-700" : "border-slate-200"}`}
    >
      <div
        className={`grid border-b ${borderColor}`}
        style={{ gridTemplateColumns: "52px repeat(6, 1fr)" }}
      >
        <div className={`p-2 border-r ${borderColor} ${bgBase}`} />
        {DAYS.map((day) => {
          const isToday = day === todayName;
          return (
            <div
              key={day}
              className={`p-2 text-center border-r last:border-r-0 ${borderColor} ${bgBase}`}
            >
              <div
                className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-indigo-500" : textMuted}`}
              >
                {day}
              </div>
              {isToday && (
                <div className="w-1 h-1 rounded-full bg-indigo-500 mx-auto mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      <div className="overflow-y-auto scrollbar-none" style={{ maxHeight: 580 }}>
        <div
          className="grid"
          style={{ gridTemplateColumns: "52px repeat(6, 1fr)" }}
        >
          <div
            className={`border-r ${borderColor} ${bgBase}`}
            style={{ height: totalHeight }}
          >
            {TIME_SLOTS.map((slot, i) => (
              <div
                key={slot.value}
                className={`flex items-start justify-end pr-2 border-b ${borderColor}`}
                style={{ height: SLOT_HEIGHT_PX }}
              >
                {slot.value.endsWith(":00") && (
                  <span className={`text-[9px] font-medium -mt-2 ${textMuted}`}>
                    {slot.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {DAYS.map((day) => {
            const isToday = day === todayName;
            return (
              <div
                key={day}
                className={`relative border-r last:border-r-0 ${borderColor} ${
                  isToday
                    ? isDark
                      ? "bg-indigo-900/10"
                      : "bg-indigo-50/40"
                    : bgBase
                }`}
                style={{ height: totalHeight }}
              >
                {TIME_SLOTS.map((slot, i) => (
                  <div
                    key={slot.value}
                    className={`absolute w-full border-b ${
                      slot.value.endsWith(":00")
                        ? isDark
                          ? "border-slate-700"
                          : "border-slate-200"
                        : isDark
                          ? "border-slate-700/40"
                          : "border-slate-100"
                    }`}
                    style={{ top: i * SLOT_HEIGHT_PX, height: SLOT_HEIGHT_PX }}
                  />
                ))}

                {byDay[day].map(({ subject, slot }, i) => (
                  <SubjectBlock
                    key={`${slot.id}-${day}`}
                    subject={subject}
                    slot={slot}
                    onDeleteSlot={onDeleteSlot}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyGrid;
