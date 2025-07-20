import { useEffect, useState } from "react";
import type { FC } from "react";
// import { StatCard } from "../components/Dashboard/StatCard";
// import { AudioList } from "../components/Dashboard/AudioList";
import AdminSettings from "../components/Dashboard/AdminSettings";

const Dashboard: FC = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log(token);
        if (!token) return;

        const res = await fetch("http://localhost:8000/api/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }

        const data = await res.json();
        setUserName(data.firstName);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="py-10 px-10 space-y-8 w-full">
        <h1 className="text-2xl font-semibold">
          {userName ? `Welcome, ${userName} 👋` : "Welcome"}
        </h1>

        <AdminSettings />
      </div>
    </div>
  );
};

export default Dashboard;
