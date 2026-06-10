import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Account {
  id: number;
  accountName: string;
  accountCode: string;
  type: string;
}

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
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
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setError("Failed to fetch accounts.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchAccounts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-journal-bookmark-fill text-primary me-2"></i>Chart
          of Accounts
        </h2>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/add-account")}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Account
          </button>
          <button
            className="btn btn-info text-white me-2"
            onClick={() => navigate("/journals")}
          >
            <i className="bi bi-card-list me-1"></i> View Journals
          </button>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/add-journal")}
          >
            <i className="bi bi-journal-plus me-1"></i> New Journal Entry
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th className="px-4">Account Code</th>
                <th>Account Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length > 0 ? (
                accounts.map((acc) => (
                  <tr key={acc.id}>
                    <td className="px-4 fw-bold">{acc.accountCode}</td>
                    <td>{acc.accountName}</td>
                    <td>
                      <span className="badge bg-secondary">{acc.type}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    <i className="bi bi-info-circle me-2"></i> No accounts
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountList;
