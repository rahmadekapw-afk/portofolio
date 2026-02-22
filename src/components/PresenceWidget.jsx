import { useEffect, useState } from "react";
import { Music2, Code2, Gamepad2, Headphones } from "lucide-react";

export default function PresenceWidget() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Presence fetch is temporarily disabled as the local backend has been migrated to Supabase.
    // In the future, this can be integrated with Discord/Spotify API directly or via Supabase.
    const fetchPresence = async () => {
      /* 
      try {
        const res = await fetch("http://localhost:3001/api/presence");
        // ...
      } catch (error) {
        // console.error("Failed to fetch presence:", error);
      }
      */
    };

    // fetchPresence();
    // const interval = setInterval(fetchPresence, 10000);
    // return () => clearInterval(interval);
  }, []);

  if (!activities.length) return null;

  const getIcon = (iconType, className = "w-5 h-5 ") => {
    const icons = {
      spotify: <Music2 className={className} />,
      vscode: <Code2 className={className} />,
      gaming: <Gamepad2 className={className} />,
      default: <Headphones className={className} />
    };
    return icons[iconType] || icons.default;
  };

  const getColors = (type) => {
    const colors = {
      spotify: {
        bg: "from-green-500/15 to-emerald-500/10",
        border: "border-green-500/30",
        text: "text-green-400",
        badge: "bg-green-500/20 border-green-400/40",
        glow: "shadow-green-500/20"
      },
      coding: {
        bg: "from-blue-500/15 to-indigo-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        badge: "bg-blue-500/20 border-blue-400/40",
        glow: "shadow-blue-500/20"
      },
      gaming: {
        bg: "from-red-500/15 to-pink-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        badge: "bg-red-500/20 border-red-400/40",
        glow: "shadow-red-500/20"
      },
      default: {
        bg: "from-purple-500/15 to-violet-500/10",
        border: "border-purple-500/30",
        text: "text-purple-400",
        badge: "bg-purple-500/20 border-purple-400/40",
        glow: "shadow-purple-500/20"
      }
    };
    return colors[type] || colors.default;
  };

  const getActivityLabel = (type) => {
    const labels = {
      spotify: "NOW PLAYING",
      coding: "CODING",
      gaming: "PLAYING",
      default: "ACTIVE"
    };
    return labels[type] || labels.default;
  };

  return (
    <div className="">
      <div className="w-full space-y-2">
        {activities.map((act) => {
          const colors = getColors(act.type);

          return (
            <div key={act.key} className="group relative ">
              {/* Glass Card */}
              <div className={`relative backdrop-blur-md bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} ${colors.glow} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}>
                <div className="p-3 flex items-center gap-2.5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate mb-0.5">
                      {act.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}