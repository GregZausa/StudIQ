import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import {
  todayStr,
  yesterdayStr,
  XP_VALUES,
  getLevelInfo,
} from "../utils/constants/streak.utils";

export const useStreak = () => {
  const { userId } = useUser();
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalXp: 0,
    todayXp: 0,
    todayActivities: [],
    recentDates: [],
  });

  const loggingRef = useRef(false);

  const fetchStreak = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const today = todayStr();
    const yesterday = yesterdayStr();
    const todayRow = data.find((r) => r.date === today);
    const totalXp = data.reduce((acc, r) => acc + (r.xp || 0), 0);

    let currentStreak = 0;
    const sortedDates = data
      .map((r) => r.date)
      .sort()
      .reverse();

    if (sortedDates.length > 0) {
      const mostRecent = sortedDates[0];
      if (mostRecent === today || mostRecent === yesterday) {
        currentStreak = 1;
        let checkDate = new Date(
          mostRecent === today
            ? yesterday
            : new Date(mostRecent).setDate(new Date(mostRecent).getDate() - 1),
        );

        for (let i = 1; i < sortedDates.length; i++) {
          const expectedDate = checkDate.toISOString().split("T")[0];
          if (sortedDates[i] === expectedDate) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    let longestStreak = 0;
    let tempStreak = 0;
    const allDates = [...sortedDates].reverse();

    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(allDates[i - 1]);
        const current = new Date(allDates[i]);
        const diffMs = current - prev;
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const dateMap = {};
    data.forEach((r) => {
      dateMap[r.date] = r.xp || 0;
    });

    const recentDates = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      recentDates.push({ date: dateKey, xp: dateMap[dateKey] || 0 });
    }

    setStreakData({
      currentStreak,
      longestStreak,
      totalXp,
      todayXp: todayRow?.xp || 0,
      todayActivities: todayRow?.activities || [],
      recentDates,
    });

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const logActivity = useCallback(
    async (activityKey) => {
      if (!userId || loggingRef.current) return;
      loggingRef.current = true;

      const xpEarned = XP_VALUES[activityKey] || 0;
      const today = todayStr();

      try {
        const { data: existing } = await supabase
          .from("streaks")
          .select("*")
          .eq("user_id", userId)
          .eq("date", today)
          .single();

        if (existing) {
          const newActivities = [
            ...(existing.activities || []),
            { key: activityKey, ts: Date.now() },
          ];
          const newXp = (existing.xp || 0) + xpEarned;

          await supabase
            .from("streaks")
            .update({ xp: newXp, activities: newActivities })
            .eq("id", existing.id);
        } else {
          const streakBonus = XP_VALUES.streak_bonus;
          const totalDayXp = xpEarned + streakBonus;
          const activities = [
            { key: "streak_bonus", ts: Date.now() },
            { key: activityKey, ts: Date.now() },
          ];

          await supabase.from("streaks").insert({
            user_id: userId,
            date: today,
            xp: totalDayXp,
            activities,
          });
        }

        await fetchStreak();
      } catch (err) {
        console.error("logActivity error:", err);
      } finally {
        loggingRef.current = false;
      }
    },
    [userId, fetchStreak],
  );

  return { streakData, logActivity, loading, refresh: fetchStreak };
};

import { createContext, useContext } from "react";

const StreakContext = createContext(null);

export const StreakProvider = ({ children }) => {
  const streak = useStreak();
  return (
    <StreakContext.Provider value={streak}>{children}</StreakContext.Provider>
  );
};

export const useStreakContext = () => useContext(StreakContext);
