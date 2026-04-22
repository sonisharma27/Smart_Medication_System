import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLanguage } from "../context/LanguageContext";

function Dashboard() {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");

  const [medications, setMedications] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  const fetchMedications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/medication/get", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const meds = res.data.data;
      setMedications(meds);

      calculateStats(meds);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStats = (meds) => {
    const today = new Date().toISOString().slice(0, 10);

    let todayMeds = 0;
    let upcoming = 0;

    meds.forEach((med) => {
      if (med.startDate?.slice(0, 10) === today) {
        todayMeds++;
      }

      if (med.reminderTime) {
        upcoming++;
      }
    });

    setTodayCount(todayMeds);
    setUpcomingCount(upcoming);
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📊 {t("dashboard.title")}</h2>

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary p-3">
            <h5>{t("dashboard.medicationCount")}</h5>
            <h2>{medications.length}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success p-3">
            <h5>{t("dashboard.reminders")}</h5>
            <h2>{todayCount}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning p-3">
            <h5>{t("dashboard.quickActions")}</h5>
            <h2>{upcomingCount}</h2>
          </div>
        </div>

      </div>

      <div className="card mt-4 p-3">
        <h5>{t("medication.title")}</h5>
        <ul className="list-group">
          {medications.slice(0, 5).map((med) => (
            <li key={med._id} className="list-group-item">
              💊 {med.medicineName} - {med.dosage}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default Dashboard;