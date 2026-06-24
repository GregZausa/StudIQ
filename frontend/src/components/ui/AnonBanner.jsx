import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Shield } from "lucide-react";
import { useUser } from "../../context/UserContext";

const AnonBanner = ({ isDark }) => {
  const { isAnon } = useUser();
  const navigate   = useNavigate();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem("studiq_anon_banner_dismissed") === "1"
  );

  if (!isAnon || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("studiq_anon_banner_dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border mb-4 ${
      isDark
        ? "bg-amber-900/20 border-amber-700/50"
        : "bg-amber-50 border-amber-200"
    }`}>
      <Shield size={15} className="text-amber-500 shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold mb-0.5 ${isDark ? "text-amber-300" : "text-amber-800"}`}>
          You're studying as a guest.
        </p>
        <p className={`text-[11px] leading-relaxed ${isDark ? "text-amber-400/80" : "text-amber-700"}`}>
          Your progress lives only in this browser — one clear away from gone forever.{" "}
          <button
            onClick={() => navigate("/auth")}
            className="font-bold underline underline-offset-2 hover:no-underline cursor-pointer"
          >
            Create a free account
          </button>{" "}
          to save it permanently across all your devices.
        </p>
      </div>

      <button
        onClick={handleDismiss}
        className="shrink-0 text-amber-400 hover:text-amber-600 cursor-pointer transition-colors mt-0.5"
        title="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
};

export default AnonBanner;