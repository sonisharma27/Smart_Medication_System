// import { useEffect, useState } from "react";
// import { Button, Container, Table } from "react-bootstrap";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import Papa from "papaparse";
// import { saveAs } from "file-saver";
// import axios from "axios";

// function ReportPage() {
//   const [transactions, setTransactions] = useState([]);

//   // ✅ Fetch data from backend
//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const fetchReportData = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/report/data");
//       setTransactions(res.data);
//     } catch (err) {
//       console.log("Error fetching data");
//     }
//   };

//   // ======================
//   // 📄 GENERATE PDF
//   // ======================
//   const generatePDF = async () => {
//     const doc = new jsPDF();

//     doc.text("Medication Report", 14, 15);

//     const tableData = transactions.map((item) => [
//       item.medicineName,
//       item.dosage,
//       item.time,
//       item.date?.split("T")[0],
//     ]);

//     autoTable(doc, {
//       head: [["Medicine", "Dosage", "Time", "Date"]],
//       body: tableData,
//       startY: 20,
//     });

//     const pdfBlob = doc.output("blob");
//     saveAs(pdfBlob, "Medication_Report.pdf");

//     const formData = new FormData();
//     formData.append("file", pdfBlob, "Medication_Report.pdf");

//     await axios.post("http://localhost:3000/report/upload", formData);
//   };

//   // ======================
//   // 📊 GENERATE CSV
//   // ======================
//   const generateCSV = async () => {
//     const csv = Papa.unparse(transactions);

//     const blob = new Blob([csv], {
//       type: "text/csv;charset=utf-8;",
//     });

//     saveAs(blob, "Medication_Report.csv");

//     const formData = new FormData();
//     formData.append("file", blob, "Medication_Report.csv");

//     await axios.post("http://localhost:3000/report/upload", formData);
//   };

//   return (
//     <Container className="mt-4">
//       <h3>Medication Report</h3>

//       <Table striped bordered>
//         <thead>
//           <tr>
//             <th>Medicine</th>
//             <th>Dosage</th>
//             <th>Time</th>
//             <th>Date</th>
//           </tr>
//         </thead>

//         <tbody>
//           {transactions.map((item, index) => (
//             <tr key={index}>
//               <td>{item.medicineName}</td>
//               <td>{item.dosage}</td>
//               <td>{item.time}</td>
//               <td>{item.date?.split("T")[0]}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Button variant="danger" className="me-3" onClick={generatePDF}>
//         Download PDF
//       </Button>

//       <Button variant="success" onClick={generateCSV}>
//         Download CSV
//       </Button>
//     </Container>
//   );
// }

// export default ReportPage;




// import { useEffect, useState } from "react";
// import { Button, Container, Table } from "react-bootstrap";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import Papa from "papaparse";
// import { saveAs } from "file-saver";
// import axios from "axios";

// function ReportPage() {

//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const fetchReportData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         "http://localhost:3000/report/data",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setTransactions(res.data.data);

//     } catch (error) {
//       console.log("Error fetching report data");
//     }
//   };

//   // ======================
//   // GENERATE PDF
//   // ======================
//   const generatePDF = async () => {

//     const doc = new jsPDF();
//     doc.text("Medication Report", 14, 15);

//     const tableData = transactions.map((item) => [
//       item.medicineName,
//       item.dosage,
//       item.time,
//       item.date?.split("T")[0]
//     ]);

//     autoTable(doc, {
//       head: [["Medicine", "Dosage", "Time", "Date"]],
//       body: tableData,
//       startY: 20
//     });

//     const pdfBlob = doc.output("blob");
//     saveAs(pdfBlob, "Medication_Report.pdf");

//     const token = localStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("file", pdfBlob, "Medication_Report.pdf");

//     await axios.post(
//       "http://localhost:3000/report/upload",
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//   };

//   // ======================
//   // GENERATE CSV
//   // ======================
//   const generateCSV = async () => {

//     const csv = Papa.unparse(transactions);

//     const blob = new Blob([csv], {
//       type: "text/csv;charset=utf-8;"
//     });

//     saveAs(blob, "Medication_Report.csv");

//     const token = localStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("file", blob, "Medication_Report.csv");

//     await axios.post(
//       "http://localhost:3000/report/upload",
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//   };

//   return (
//     <Container className="mt-4">
//       <h3>Medication Report</h3>

//       <Table striped bordered>
//         <thead>
//           <tr>
//             <th>Medicine</th>
//             <th>Dosage</th>
//             <th>Time</th>
//             <th>Date</th>
//           </tr>
//         </thead>

//         <tbody>
//           {transactions.map((item, index) => (
//             <tr key={index}>
//               <td>{item.medicineName}</td>
//               <td>{item.dosage}</td>
//               <td>{item.time}</td>
//               <td>{item.date?.split("T")[0]}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Button variant="danger" className="me-3" onClick={generatePDF}>
//         Download PDF
//       </Button>

//       <Button variant="success" onClick={generateCSV}>
//         Download CSV
//       </Button>
//     </Container>
//   );
// }

// export default ReportPage;






import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import axios from "axios";

function ReportPage() {

  const [medications, setMedications] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/report/data",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMedications(res.data.data);

    } catch (error) {
      console.log("Error fetching medication data");
    }
  };

  // ======================
  // GENERATE PDF
  // ======================
  const generatePDF = async () => {

    const doc = new jsPDF();
    doc.text("Medication Report", 14, 15);

    const tableData = medications.map((item) => [
      item.medicineName,
      item.dosage,
      item.frequency,
      item.reminderTime,
      item.startDate?.split("T")[0],
      item.endDate?.split("T")[0]
    ]);

    autoTable(doc, {
      head: [["Medicine", "Dosage", "Frequency", "Reminder", "Start", "End"]],
      body: tableData,
      startY: 20
    });

    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, "Medication_Report.pdf");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", pdfBlob, "Medication_Report.pdf");

    await axios.post(
      "http://localhost:3000/report/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  };

  // ======================
  // GENERATE CSV
  // ======================
  const generateCSV = async () => {

    const csv = Papa.unparse(medications);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    saveAs(blob, "Medication_Report.csv");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", blob, "Medication_Report.csv");

    await axios.post(
      "http://localhost:3000/report/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  };

  return (
    <Container className="mt-4">
      <h3>Medication Report</h3>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Reminder Time</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>

        <tbody>
          {medications.map((item, index) => (
            <tr key={index}>
              <td>{item.medicineName}</td>
              <td>{item.dosage}</td>
              <td>{item.frequency}</td>
              <td>{item.reminderTime}</td>
              <td>{item.startDate?.split("T")[0]}</td>
              <td>{item.endDate?.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="danger" className="me-3" onClick={generatePDF}>
        Download PDF
      </Button>

      <Button variant="success" onClick={generateCSV}>
        Download CSV
      </Button>
    </Container>
  );
}

export default ReportPage;