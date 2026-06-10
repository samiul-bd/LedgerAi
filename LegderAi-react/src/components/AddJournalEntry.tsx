import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import axios from "axios";

interface Account {
  id: number;
  accountName: string;
  accountCode: string;
}

interface JournalLine {
  accountId: number | "";
  debit: number;
  credit: number;
}

const AddJournalEntry: React.FC = () => {
  const [date, setDate] = useState("");
  const [narration, setNarration] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  
  const [lines, setLines] = useState<JournalLine[]>([
    { accountId: "", debit: 0, credit: 0 },
    { accountId: "", debit: 0, credit: 0 },
  ]);
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/Accounts");
        setAccounts(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            navigate("/");
          }
        }
      }
    };
    fetchAccounts();
  }, [navigate]);

  const handleAddLine = () => {
    setLines([...lines, { accountId: "", debit: 0, credit: 0 }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) {
      alert("A journal entry must have at least two lines.");
      return;
    }
    const newLines = lines.filter((_, i) => i !== index);
    setLines(newLines);
  };

  const handleLineChange = (index: number, field: keyof JournalLine, value: string | number) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value } as JournalLine;
    setLines(newLines);
  };

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isBalanced) {
      setError("Total Debit and Total Credit must be equal and greater than 0.");
      return;
    }

    const hasEmptyAccounts = lines.some((line) => line.accountId === "");
    if (hasEmptyAccounts) {
      setError("Please select an account for all lines.");
      return;
    }

    try {
      await api.post("/JournalEntries", {
        date,
        narration,
        lines: lines.map((l) => ({
          accountId: Number(l.accountId),
          debit: Number(l.debit),
          credit: Number(l.credit),
        })),
      });
      navigate("/accounts");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to save journal entry.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow border-0">
        <div className="card-header bg-dark text-white d-flex align-items-center">
          <i className="bi bi-journal-text me-2 fs-4"></i>
          <h4 className="mb-0">Create Journal Entry</h4>
        </div>
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-4">
                <label className="form-label fw-bold">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-bold">Narration / Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Enter transaction details..."
                  required
                />
              </div>
            </div>

            <h5 className="border-bottom pb-2 mb-3">Entry Lines</h5>
            
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "45%" }}>Account</th>
                    <th style={{ width: "20%" }}>Debit ($)</th>
                    <th style={{ width: "20%" }}>Credit ($)</th>
                    <th style={{ width: "15%" }} className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          className="form-select"
                          value={line.accountId}
                          onChange={(e) => handleLineChange(index, "accountId", e.target.value)}
                          required
                        >
                          <option value="">-- Select Account --</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.accountCode} - {acc.accountName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={line.debit === 0 ? "" : line.debit}
                          onChange={(e) => handleLineChange(index, "debit", e.target.value)}
                          disabled={line.credit > 0} 
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={line.credit === 0 ? "" : line.credit}
                          onChange={(e) => handleLineChange(index, "credit", e.target.value)}
                          disabled={line.debit > 0} 
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveLine(index)}
                          disabled={lines.length <= 2}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold fs-5">
                    <td className="text-end">Total:</td>
                    <td className={totalDebit !== totalCredit ? "text-danger" : "text-success"}>
                      {totalDebit.toFixed(2)}
                    </td>
                    <td className={totalDebit !== totalCredit ? "text-danger" : "text-success"}>
                      {totalCredit.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary mb-4 fw-bold"
              onClick={handleAddLine}
            >
              <i className="bi bi-plus-lg me-1"></i> Add Line
            </button>

            <div className="d-flex gap-3 justify-content-end border-top pt-3">
              <button
                type="button"
                className="btn btn-secondary px-4 fw-bold"
                onClick={() => navigate("/accounts")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success px-5 fw-bold"
                disabled={!isBalanced} 
              >
                <i className="bi bi-check-circle-fill me-2"></i> Post Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJournalEntry;