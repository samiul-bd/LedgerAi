import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import axios from "axios";

interface JournalLine {
  id: number;
  accountName: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: number;
  date: string;
  narration: string;
  lines: JournalLine[];
}

const JournalList: React.FC = () => {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await api.get("/JournalEntries");
        setJournals(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Failed to fetch journal entries.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchJournals();
  }, [navigate]);

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-journals text-primary me-2"></i>Journal Entries
        </h2>
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate("/accounts")}
          >
            <i className="bi bi-arrow-left-circle me-1"></i> Back to Accounts
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/add-journal")}
          >
            <i className="bi bi-plus-circle me-1"></i> New Entry
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {journals.length === 0 && !error ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i> No journal entries found.
        </div>
      ) : (
        journals.map((journal) => (
          <div key={journal.id} className="card shadow-sm mb-4 border-0">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <strong>
                Date: {new Date(journal.date).toLocaleDateString()}
              </strong>
              <span className="text-muted">ID: #{journal.id}</span>
            </div>
            <div className="card-body p-0">
              <div className="p-3 bg-white border-bottom">
                <strong>Narration:</strong> {journal.narration}
              </div>
              <table className="table table-borderless table-hover mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="px-4">Account</th>
                    <th className="text-end" style={{ width: "20%" }}>
                      Debit
                    </th>
                    <th className="text-end px-4" style={{ width: "20%" }}>
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {journal.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="px-4">{line.accountName}</td>
                      <td className="text-end text-success fw-bold">
                        {line.debit > 0 ? line.debit.toFixed(2) : "-"}
                      </td>
                      <td className="text-end text-danger fw-bold px-4">
                        {line.credit > 0 ? line.credit.toFixed(2) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-top bg-light">
                  <tr>
                    <td className="px-4 text-end fw-bold">Total:</td>
                    <td className="text-end fw-bold text-success">
                      {journal.lines
                        .reduce((sum, line) => sum + line.debit, 0)
                        .toFixed(2)}
                    </td>
                    <td className="text-end fw-bold text-danger px-4">
                      {journal.lines
                        .reduce((sum, line) => sum + line.credit, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JournalList;
