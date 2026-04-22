import { useEffect, useRef, useState } from "react";
import axios from "axios";

function NotificationService() {
  const [medications, setMedications] = useState([]);
  const triggeredRef = useRef(new Set());
  const medRef = useRef([]);
  const [permissionStatus, setPermissionStatus] = useState(Notification.permission);

  // Sync state to ref to avoid closure issues in intervals
  useEffect(() => {
    medRef.current = medications;
  }, [medications]);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchMedications();
      }
    };

    // Check token every few seconds in case of login/logout
    const tokenInterval = setInterval(checkToken, 5000);
    checkToken();

    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(status => {
            setPermissionStatus(status);
        });
      }
    }

    const checkInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const now = new Date();
      const currentKeyTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      medRef.current.forEach((med) => {
        if (!med.reminderTime) return;

        const startDate = new Date(med.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = med.endDate ? new Date(med.endDate) : null;
        if (endDate) endDate.setHours(0, 0, 0, 0);
        
        if (today < startDate) return;
        if (endDate && today > endDate) return;

        const uniqueKey = med._id + "_" + currentKeyTime;

        if (triggeredRef.current.has(uniqueKey)) return;

        if (med.reminderTime.includes(currentKeyTime)) {
          triggerNotification(med);
          triggeredRef.current.add(uniqueKey);
        }
      });
    }, 10000); // Check every 10 seconds for better responsiveness

    return () => {
      clearInterval(tokenInterval);
      clearInterval(checkInterval);
    };
  }, []);

  const triggerNotification = (med) => {
    console.log(`🔔 Triggering notification for ${med.medicineName}`);
    
    // 1. Audio
    try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(e => console.log("Audio play blocked by browser policy"));
    } catch (e) {
        console.error("Audio error", e);
    }

    // 2. Browser Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("💊 SmartMed Reminder", {
        body: `It's time to take ${med.medicineName} (${med.dosage})`,
        icon: "/favicon.ico",
        requireInteraction: true,
      });
    } else {
      // 3. Fallback: Alert
      alert(`💊 MEDICATION REMINDER:\n\nMedicine: ${med.medicineName}\nDosage: ${med.dosage}\nTime: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
    }
  };

  const fetchMedications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:3000/medication/get", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.data.success) {
        setMedications(res.data.data);
      }
    } catch (err) {
      console.error("NotificationService: Failed to fetch", err);
    }
  };

  return null;
}

export default NotificationService;
