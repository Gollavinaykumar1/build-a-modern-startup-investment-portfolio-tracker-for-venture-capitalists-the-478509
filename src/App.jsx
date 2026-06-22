import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const App = () => {
  const [startups, setStartups] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [activeStartups, setActiveStartups] = useState(0);
  const [estimatedROI, setEstimatedROI] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const fetchStartups = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/startups`);
      const safeList = Array.isArray(response.data) ? response.data : (response.data?.items || []);
      setStartups(safeList);
      const totalInvested = safeList.reduce((acc, startup) => acc + startup.investedAmount, 0);
      setTotalInvested(totalInvested);
      const activeStartups = safeList.filter(startup => startup.status !== 'Exited').length;
      setActiveStartups(activeStartups);
      const estimatedROI = safeList.reduce((acc, startup) => acc + startup.estimatedROI, 0);
      setEstimatedROI(estimatedROI);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  const { register, handleSubmit, reset } = useForm();

  const addInvestment = async (data) => {
    try {
      await axios.post(`${BASE_URL}/startups`, data);
      fetchStartups();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <HashRouter>
      <div className={clsx('app', { 'dark-mode': darkMode })}>
        <header className="header">
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#" className="nav-link" onClick={handleDarkMode}>
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <main className="main">
          <section className="hero">
            <h1 className="hero-title">Startup Investment Portfolio Tracker</h1>
            <div className="metric-cards">
              <div className="metric-card">
                <h2 className="metric-card-title">Total Invested</h2>
                <p className="metric-card-value">${totalInvested.toLocaleString()}</p>
              </div>
              <div className="metric-card">
                <h2 className="metric-card-title">Active Startups</h2>
                <p className="metric-card-value">{activeStartups}</p>
              </div>
              <div className="metric-card">
                <h2 className="metric-card-title">Estimated ROI</h2>
                <p className="metric-card-value">{estimatedROI}%</p>
              </div>
            </div>
          </section>
          <section className="startups">
            <h2 className="startups-title">Startups</h2>
            <table className="startups-table">
              <thead className="startups-table-head">
                <tr className="startups-table-row">
                  <th className="startups-table-header">Company Name</th>
                  <th className="startups-table-header">Sector</th>
                  <th className="startups-table-header">Invested Amount</th>
                  <th className="startups-table-header">Status</th>
                </tr>
              </thead>
              <tbody className="startups-table-body">
                {startups.map((startup) => (
                  <tr key={startup.id} className="startups-table-row">
                    <td className="startups-table-cell">{startup.companyName}</td>
                    <td className="startups-table-cell">{startup.sector}</td>
                    <td className="startups-table-cell">${startup.investedAmount.toLocaleString()}</td>
                    <td className="startups-table-cell">
                      <span
                        className={clsx('status-badge', {
                          'status-badge-seed': startup.status === 'Seed',
                          'status-badge-series-a': startup.status === 'Series A',
                          'status-badge-exited': startup.status === 'Exited',
                        })}
                      >
                        {startup.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="add-investment">
            <h2 className="add-investment-title">Add Investment</h2>
            <form onSubmit={handleSubmit(addInvestment)} className="add-investment-form">
              <div className="add-investment-form-group">
                <label className="add-investment-form-label" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="add-investment-form-input"
                  {...register('companyName')}
                />
              </div>
              <div className="add-investment-form-group">
                <label className="add-investment-form-label" htmlFor="sector">
                  Sector
                </label>
                <input
                  type="text"
                  id="sector"
                  className="add-investment-form-input"
                  {...register('sector')}
                />
              </div>
              <div className="add-investment-form-group">
                <label className="add-investment-form-label" htmlFor="investedAmount">
                  Invested Amount
                </label>
                <input
                  type="number"
                  id="investedAmount"
                  className="add-investment-form-input"
                  {...register('investedAmount')}
                />
              </div>
              <button type="submit" className="add-investment-form-button">
                Add Investment
              </button>
            </form>
          </section>
        </main>
        <ToastContainer />
      </div>
    </HashRouter>
  );
};

export default App;