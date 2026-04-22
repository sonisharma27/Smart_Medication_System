

import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLanguage } from "../context/LanguageContext";

function Medication() {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");

  const [medications, setMedications] = useState([]);
  const [editId, setEditId] = useState(null);
const triggeredRef = useRef(new Set());
  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
    reminderTime: [],
    startDate: "",
    endDate: "",
    notes: ""
  });
  //  const formatTime = (time) => {
  //   if (!time) return "";

  //   const [hour, minute] = time.split(":");
  //   let h = parseInt(hour);
  //   const ampm = h >= 12 ? "PM" : "AM";

  //   h = h % 12;
  //   h = h ? h : 12;

  //   return `${h}:${minute} ${ampm}`;
  // };
  const formatTime = (time) => {
  if (!time) return "";

  let [hour, minute] = time.split(":");
  hour = parseInt(hour, 10);   // convert to number

  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
};
  // ================= FETCH MEDICATIONS =================
  const fetchMedications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/medication/get",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );
      setMedications(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch medications");
    }
  };


  useEffect(() => {
    fetchMedications();
  }, []);
  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalReminderTime = [...form.reminderTime];
    if (form.frequency === "once" && !finalReminderTime[0]) finalReminderTime[0] = "08:00";
    if (form.frequency === "twice") {
      if (!finalReminderTime[0]) finalReminderTime[0] = "08:00";
      if (!finalReminderTime[1]) finalReminderTime[1] = "20:00";
    }
    if (form.frequency === "thrice") {
      if (!finalReminderTime[0]) finalReminderTime[0] = "08:00";
      if (!finalReminderTime[1]) finalReminderTime[1] = "14:00";
      if (!finalReminderTime[2]) finalReminderTime[2] = "20:00";
    }

    const payload = { ...form, reminderTime: finalReminderTime };

    try {
      if (editId) {
        // UPDATE
        await axios.put(
          `http://localhost:3000/medication/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );
        setEditId(null);
      } else {
        // CREATE
        await axios.post(
          "http://localhost:3000/medication/create",
          payload,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );
      }

      setForm({
        medicineName: "",
        dosage: "",
        frequency: "",
        reminderTime: "",
        startDate: "",
        endDate: "",
        notes: ""
      });

      fetchMedications();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (med) => {
    setEditId(med._id);
    setForm({
      medicineName: med.medicineName,
      dosage: med.dosage,
      frequency: med.frequency,
      reminderTime: med.reminderTime,
      startDate: med.startDate?.slice(0, 10),
      endDate: med.endDate?.slice(0, 10),
      notes: med.notes || ""
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medication?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/medication/delete/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );
      fetchMedications();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">{t("medication.title")}</h3>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <input
          className="form-control mb-2"
          name="medicineName"
          placeholder={t("medication.name")}
          value={form.medicineName}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="dosage"
          placeholder={t("medication.dosage")}
          value={form.dosage}
          onChange={handleChange}
          required
        />

        {/* <input
          className="form-control mb-2"
          name="frequency"
          placeholder="Frequency (e.g. 2 times/day)"
          value={form.frequency}
          onChange={handleChange}
          required
        /> */}
<select
  className="form-control mb-2"
  name="frequency"
  value={form.frequency}
  onChange={(e) => {
    const freq = e.target.value;
    let defaultTimes = [];
    if (freq === "once") defaultTimes = ["08:00"];
    else if (freq === "twice") defaultTimes = ["08:00", "20:00"];
    else if (freq === "thrice") defaultTimes = ["08:00", "14:00", "20:00"];
    setForm({ ...form, frequency: freq, reminderTime: defaultTimes });
  }}
  required
>
  <option value="">{t("medication.frequency")}</option>
  <option value="once">Once a day</option>
  <option value="twice">Twice a day</option>
  <option value="thrice">Thrice a day</option>
</select>

        {/* <input
          type="time"
          className="form-control mb-2"
          name="reminderTime"
          value={form.reminderTime}
          onChange={handleChange}
          required
        /> */}
       
{form.frequency === "once" && (
  <input
    type="time"
    className="form-control mb-2"
    value={form.reminderTime[0] || ""}
    onChange={(e) =>
      setForm({ ...form, reminderTime: [e.target.value] })
    }
  />
)}

{form.frequency === "twice" && (
  <>
    <input
      type="time"
      className="form-control mb-2"
      placeholder="Morning Time"
      value={form.reminderTime[0] || ""}
      onChange={(e) =>
        setForm({
          ...form,
          reminderTime: [e.target.value, form.reminderTime[1]]
        })
      }
    />

    <input
      type="time"
      className="form-control mb-2"
      placeholder="Evening Time"
      value={form.reminderTime[1] || ""}
      onChange={(e) =>
        setForm({
          ...form,
          reminderTime: [form.reminderTime[0], e.target.value]
        })
      }
    />
  </>
)}
{form.frequency === "thrice" && (
  <>
    <input
      type="time"
      className="form-control mb-2"
      placeholder="Morning Time"
      value={form.reminderTime[0] || ""}
      onChange={(e) =>
        setForm({
          ...form,
          reminderTime: [e.target.value, form.reminderTime[1], form.reminderTime[2]]
        })
      }
    />

    <input
      type="time"
      className="form-control mb-2"
      placeholder="Afternoon Time"
      value={form.reminderTime[1] || ""}
      onChange={(e) =>
        setForm({
          ...form,
          reminderTime: [form.reminderTime[0], e.target.value, form.reminderTime[2]]
        })
      }
    />

    <input
      type="time"
      className="form-control mb-2"
      placeholder="Night Time"
      value={form.reminderTime[2] || ""}
      onChange={(e) =>
        setForm({
          ...form,
          reminderTime: [form.reminderTime[0], form.reminderTime[1], e.target.value]
        })
      }
    />
  </>
)}
        <input
          type="date"
          className="form-control mb-2"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          className="form-control mb-2"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-2"
          name="notes"
          placeholder={t("medication.notes")}
          value={form.notes}
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100">
          {editId ? t("medication.save") : t("medication.addBtn")}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>{t("medication.name")}</th>
            <th>{t("medication.dosage")}</th>
            <th>{t("medication.frequency")}</th>
            <th>{t("medication.time")}</th>
            <th>{t("medication.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {medications.length === 0 ? (
            <tr>
              <td colSpan="5">No medications found</td>
            </tr>
          ) : (
            medications.map((med) => (
              <tr key={med._id}>
                <td>{med.medicineName}</td>
                <td>{med.dosage}</td>
                <td>{med.frequency}</td>
                <td>
  {med.reminderTime?.map((t) => formatTime(t)).join(" , ")}
</td>
                
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(med)}
                  >
                    {t("medication.edit")}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(med._id)}
                  >
                    {t("medication.delete")}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Medication;



