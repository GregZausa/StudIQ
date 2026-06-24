import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <div className="text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
