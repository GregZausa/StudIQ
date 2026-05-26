import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  MODES,
  AMBIENT_SOUNDS,
  SUBJECT_OPTIONS,
} from "../utils/constants/pomodoro-config";
import { createAmbientEngine, fmt } from "../utils/functions/pomodoro";
import { useStreakContext } from "./StreakContext";

const PomodoroContext = createContext(null);

function playAlarm(audioCtx, type = "focus") {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.value = 0.5;
  master.connect(audioCtx.destination);

  const configs = {
    focus: [
      { freq: 523.25, start: 0, dur: 0.15 },
      { freq: 659.25, start: 0.18, dur: 0.15 },
      { freq: 783.99, start: 0.36, dur: 0.25 },
      { freq: 1046.5, start: 0.64, dur: 0.4 },
    ],
    shortBreak: [
      { freq: 880, start: 0, dur: 0.2 },
      { freq: 1108, start: 0.3, dur: 0.3 },
    ],
    longBreak: [
      { freq: 698.46, start: 0, dur: 0.2 },
      { freq: 783.99, start: 0.25, dur: 0.2 },
      { freq: 880, start: 0.5, dur: 0.35 },
    ],
  };

  (configs[type] || configs.focus).forEach(({ freq, start, dur }) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.6, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });
}

export const PomodoroProvider = ({ children }) => {
  const { logActivity } = useStreakContext() || {};

  const [mode, setMode] = useState("focus");
  const [durations, setDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [sessions, setSessions] = useState([]);

  const [ambientSound, setAmbientSound] = useState("none");
  const [volume, setVolume] = useState(0.3);

  const audioCtxRef = useRef(null);
  const ambientRef = useRef(null);
  const intervalRef = useRef(null);
  const completingRef = useRef(false);

  const modeRef = useRef(mode);
  const durationsRef = useRef(durations);
  const subjectRef = useRef(subject);
  const customSubjRef = useRef(customSubject);
  const cycleCountRef = useRef(cycleCount);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    durationsRef.current = durations;
  }, [durations]);
  useEffect(() => {
    subjectRef.current = subject;
  }, [subject]);
  useEffect(() => {
    customSubjRef.current = customSubject;
  }, [customSubject]);
  useEffect(() => {
    cycleCountRef.current = cycleCount;
  }, [cycleCount]);

  const totalFocusToday = sessions
    .filter((s) => s.mode === "focus" && s.completed)
    .reduce((acc, s) => acc + s.duration, 0);
  const totalSessions = sessions.filter(
    (s) => s.mode === "focus" && s.completed,
  ).length;

  // ── Audio helpers ──
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
      ambientRef.current = createAmbientEngine(audioCtxRef.current);
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
  }, []);

  useEffect(() => {
    if (!ambientRef.current) return;
    ambientRef.current.play(ambientSound, volume);
  }, [ambientSound, volume]);

  // ── Session complete handler ──
  const handleSessionComplete = useCallback(
    (completedMode, logSession = true) => {
      const durs = durationsRef.current;
      const subj =
        subjectRef.current === "Other"
          ? customSubjRef.current
          : subjectRef.current;
      const cycle = cycleCountRef.current;

      if (logSession) {
        setSessions((prev) => [
          {
            id: crypto.randomUUID(),
            mode: completedMode,
            subject: subj,
            duration: durs[completedMode] * 60,
            completedAt: Date.now(),
            completed: true,
          },
          ...prev,
        ]);

        if (completedMode === "focus" && logActivity) {
          logActivity("finish_pomodoro");
        }
      }

      playAlarm(audioCtxRef.current, completedMode);

      if (Notification.permission === "granted") {
        new Notification(
          completedMode === "focus"
            ? "Focus session done! 🎉"
            : "Break over! 💪",
        );
      }

      if (completedMode === "focus") {
        const newCycle = cycle + 1;
        setPomodoroCount((c) => c + 1);

        if (newCycle >= 4) {
          setCycleCount(0);
          setMode("longBreak");
          setTimeLeft(durs.longBreak * 60);
          setIsRunning(true);
        } else {
          setCycleCount(newCycle);
          setMode("shortBreak");
          setTimeLeft(durs.shortBreak * 60);
          setIsRunning(true);
        }
      } else if (completedMode === "shortBreak") {
        setMode("focus");
        setTimeLeft(durs.focus * 60);
        setIsRunning(true);
      } else {
        // Long break done — stop and reset
        setCycleCount(0);
        setMode("focus");
        setTimeLeft(durs.focus * 60);
        setIsRunning(false);
      }
    },
    [logActivity],
  );

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    completingRef.current = false;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        if (completingRef.current) return 0;
        completingRef.current = true;
        clearInterval(intervalRef.current);
        setTimeout(() => handleSessionComplete(modeRef.current, true), 0);
        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, handleSessionComplete]);

  useEffect(() => {
    document.title = isRunning
      ? `${fmt(timeLeft)} — ${MODES[mode].label} | Pomodoro`
      : "StudIQ — PH Study Tools";
  }, [timeLeft, isRunning, mode]);

  // ── Public handlers ──
  const handleStart = () => {
    initAudio();
    setIsRunning((v) => !v);
    if (Notification.permission === "default") Notification.requestPermission();
  };

  const handleReset = () => {
    setIsRunning(false);
    completingRef.current = false;
    setTimeLeft(durations[mode] * 60);
  };

  const handleModeSwitch = (newMode) => {
    setIsRunning(false);
    completingRef.current = false;
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
  };

  const handleSkip = () => {
    clearInterval(intervalRef.current);
    completingRef.current = true;

    if (isRunning) {
      const subj = subject === "Other" ? customSubject : subject;
      setSessions((prev) => [
        {
          id: crypto.randomUUID(),
          mode,
          subject: subj,
          duration: durations[mode] * 60 - timeLeft,
          completedAt: Date.now(),
          completed: false,
        },
        ...prev,
      ]);
    }

    setIsRunning(false);
    setTimeout(() => handleSessionComplete(mode, false), 0);
  };

  const applySettings = (newDurations) => {
    setDurations(newDurations);
    setTimeLeft(newDurations[mode] * 60);
    setIsRunning(false);
  };

  const progress = 1 - timeLeft / (durations[mode] * 60);

  return (
    <PomodoroContext.Provider
      value={{
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
        // Derived
        progress,
        totalFocusToday,
        totalSessions,
        activeSubject: subject === "Other" ? customSubject : subject,
        // Handlers
        handleStart,
        handleReset,
        handleModeSwitch,
        handleSkip,
        applySettings,
        initAudio,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoroContext = () => useContext(PomodoroContext);
