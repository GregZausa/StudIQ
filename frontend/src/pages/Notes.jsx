import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import AdSenseAd from "../utils/AdSenseAd";
import SelectBox from "../components/ui/SelectBox";
import { StickyNote, Plus, X, Inbox } from "lucide-react";
import { COLOR_FILTER } from "../utils/constants/notes.config";
import NoteCard from "../components/cards/NoteCard";
import AddNoteModal from "../components/modal/AddNoteModal";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "../components/ui/SearchBar";
import Header from "../components/layout/Header";
import {
  encryptNote,
  decryptNotes,
  encryptText,
  decryptText,
} from "../utils/crypto";
import { useStreakContext } from "../context/StreakContext";
import { useSubscription } from "../context/SubscriptionContext";
import { isAtLimit } from "../utils/constants/premium.config";
import { LimitBar } from "../components/PremiumGate";
import UpgradeModal from "../components/modal/UpgradeModal";

const Notes = () => {
  const { userId, session } = useUser();
  const { isDark } = useTheme();
  const { logActivity } = useStreakContext();
  const { isPremium } = useSubscription() || { isPremium: false };

  const [notes, setNotes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const authId = session?.user?.id;

  const fetchNotes = useCallback(async () => {
    if (!userId || !authId) return;
    setFetching(true);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      const decrypted = await decryptNotes(data, authId);
      setNotes(decrypted);
    }
    setFetching(false);
  }, [userId, authId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAdd = async (fields) => {
    if (!userId || !authId) return;

    // ── Premium gate: check free limit before adding ──
    if (isAtLimit("notes", notes.length, isPremium)) {
      setShowUpgrade(true);
      return;
    }

    setAdding(true);

    const encrypted = await encryptNote(fields, authId);
    const { data, error } = await supabase
      .from("notes")
      .insert({ ...encrypted, user_id: userId })
      .select()
      .single();

    if (!error && data) {
      const decrypted = await decryptNotes([data], authId);
      setNotes((prev) => [decrypted[0], ...prev]);
      await logActivity("add_note");
    }

    setAdding(false);
  };

  const handleUpdate = async (id, fields) => {
    if (!authId) return;

    // Encrypt only text fields, pass others (color, subject) as-is
    const encFields = { ...fields };
    if (fields.title) encFields.title = await encryptText(fields.title, authId);
    if (fields.content)
      encFields.content = await encryptText(fields.content, authId);

    const { data, error } = await supabase
      .from("notes")
      .update(encFields)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      // Decrypt for local state
      const decrypted = await decryptNotes([data], authId);
      setNotes((prev) => prev.map((n) => (n.id === id ? decrypted[0] : n)));
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const subjects = [...new Set(notes.map((n) => n.subject).filter(Boolean))];
  const subjectOptions = [
    { value: "", label: "All subjects" },
    ...subjects.map((s) => ({ value: s, label: s })),
  ];

  const filtered = notes
    .filter((n) => !filterColor || n.color === filterColor)
    .filter((n) => !filterSubject || n.subject === filterSubject)
    .filter((n) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
      );
    });

  const activeFilters = [filterColor, filterSubject].filter(Boolean).length;

  // ── Open the "add note" modal — gated by limit ──
  const handleOpenAdd = () => {
    if (isAtLimit("notes", notes.length, isPremium)) {
      setShowUpgrade(true);
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        header="Notes"
        icon={<StickyNote size={20} className="text-amber-500" />}
        subHeader={`${notes.length} note${notes.length !== 1 ? "s" : ""} saved`}
        buttoNlabel="New note"
        buttonIcon={<Plus size={15} />}
        buttonStyle="default"
        onClick={handleOpenAdd}
      />

      <AdSenseAd />

      {/* ── Free plan usage bar ── */}
      <div className="mb-4">
        <LimitBar feature="notes" count={notes.length} isDark={isDark} />
      </div>

      {/* ── Search + filters ── */}
      <div className="space-y-2 mb-5">
        <SearchBar
          placeholder="Search notes..."
          isDark={isDark}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
          buttonIcon={<X size={13} />}
        />
        <div className="flex gap-2 flex-wrap">
          <div className="w-40">
            <SelectBox
              isDark={isDark}
              options={COLOR_FILTER}
              value={filterColor}
              onChange={setFilterColor}
              placeholder="All colors"
            />
          </div>
          {subjects.length > 0 && (
            <div className="w-44">
              <SelectBox
                isDark={isDark}
                options={subjectOptions}
                value={filterSubject}
                onChange={setFilterSubject}
              />
            </div>
          )}
          {activeFilters > 0 && (
            <button
              onClick={() => {
                setFilterColor("");
                setFilterSubject("");
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs transition-colors cursor-pointer hover:text-red-400 ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-200"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Notes grid ── */}
      {fetching ? (
        <div className="flex items-center justify-center py-16 text-slate-300">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
            <div className="text-sm">Loading notes...</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={`rounded-2xl border p-12 text-center ${isDark ? "border-slate-700 text-slate-400 bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-300"}`}
        >
          <Inbox size={32} className="mx-auto mb-2 opacity-50" />
          <div className="text-sm font-medium">
            {search || activeFilters > 0
              ? "No notes match your search."
              : "No notes yet. Create your first one!"}
          </div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
          {filtered.map((note) => (
            <div key={note.id} className="break-inside-avoid">
              <NoteCard
                isDark={isDark}
                note={note}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </div>
          ))}
        </div>
      )}

      <AdSenseAd />

      {showModal && (
        <AddNoteModal
          isDark={isDark}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
          loading={adding}
        />
      )}

      {/* ── Upgrade modal — shown when free limit reached ── */}
      {showUpgrade && (
        <UpgradeModal
          feature="notes"
          onClose={() => setShowUpgrade(false)}
          isDark={isDark}
        />
      )}

      <p className="text-center text-[11px] text-slate-300 mt-8">
        Notes · StudIQ PH 🇵🇭
      </p>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

export default Notes;
