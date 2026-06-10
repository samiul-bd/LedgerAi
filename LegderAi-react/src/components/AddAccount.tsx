import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import axios from "axios";

const AddAccount: React.FC = () => {
  const [accountName, setAccountName] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [type, setType] = useState<number>(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Accounts", {
        accountName,
        accountCode,
        type: Number(type),
      });
      navigate("/accounts");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create account.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <i className="bi bi-plus-square-fill me-2 fs-4"></i>
              <h4 className="mb-0">Create New Account</h4>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Account Code</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-123"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={accountCode}
                      onChange={(e) => setAccountCode(e.target.value)}
                      required
                      placeholder="e.g., 1001"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Account Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-fonts"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      required
                      placeholder="e.g., Cash in Hand"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Account Type</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-tags-fill"></i>
                    </span>
                    <select
                      className="form-select"
                      value={type}
                      onChange={(e) => setType(Number(e.target.value))}
                    >
                      <option value={1}>Asset</option>
                      <option value={2}>Liability</option>
                      <option value={3}>Equity</option>
                      <option value={4}>Revenue</option>
                      <option value={5}>Expense</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-success w-50 fw-bold"
                  >
                    <i className="bi bi-save-fill me-2"></i> Save Account
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary w-50 fw-bold"
                    onClick={() => navigate("/accounts")}
                  >
                    <i className="bi bi-x-circle-fill me-2"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
