# LLM Output

=== FILE: src/App.jsx ===
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
=== END ===

=== FILE: src/main.jsx ===
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
=== END ===

=== FILE: src/index.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;

.app {
  @apply min-h-screen flex flex-col;
}

.header {
  @apply bg-gray-900 text-white p-4;
}

.nav {
  @apply flex justify-between;
}

.nav-list {
  @apply flex items-center;
}

.nav-item {
  @apply mr-4;
}

.nav-link {
  @apply text-white hover:text-gray-300;
}

.main {
  @apply flex-1 flex flex-col;
}

.hero {
  @apply bg-gray-100 p-4;
}

.hero-title {
  @apply text-3xl font-bold;
}

.metric-cards {
  @apply flex flex-wrap justify-center;
}

.metric-card {
  @apply bg-white p-4 m-4 w-1/3;
}

.metric-card-title {
  @apply text-lg font-bold;
}

.metric-card-value {
  @apply text-2xl font-bold;
}

.startups {
  @apply p-4;
}

.startups-title {
  @apply text-2xl font-bold;
}

.startups-table {
  @apply w-full;
}

.startups-table-head {
  @apply bg-gray-100;
}

.startups-table-row {
  @apply border-b border-gray-200;
}

.startups-table-header {
  @apply text-lg font-bold;
}

.startups-table-cell {
  @apply p-4;
}

.status-badge {
  @apply px-2 py-1 rounded;
}

.status-badge-seed {
  @apply bg-yellow-200 text-yellow-600;
}

.status-badge-series-a {
  @apply bg-green-200 text-green-600;
}

.status-badge-exited {
  @apply bg-gray-200 text-gray-600;
}

.add-investment {
  @apply p-4;
}

.add-investment-title {
  @apply text-2xl font-bold;
}

.add-investment-form {
  @apply flex flex-col;
}

.add-investment-form-group {
  @apply mb-4;
}

.add-investment-form-label {
  @apply text-lg font-bold;
}

.add-investment-form-input {
  @apply p-2 border border-gray-200;
}

.add-investment-form-button {
  @apply bg-blue-500 text-white p-2 rounded;
}

.dark-mode {
  @apply bg-gray-900 text-white;
}

.dark-mode .header {
  @apply bg-gray-900;
}

.dark-mode .main {
  @apply bg-gray-900;
}

.dark-mode .hero {
  @apply bg-gray-800;
}

.dark-mode .metric-cards {
  @apply bg-gray-800;
}

.dark-mode .metric-card {
  @apply bg-gray-700;
}

.dark-mode .startups {
  @apply bg-gray-800;
}

.dark-mode .startups-table {
  @apply bg-gray-700;
}

.dark-mode .startups-table-head {
  @apply bg-gray-700;
}

.dark-mode .startups-table-row {
  @apply border-b border-gray-600;
}

.dark-mode .startups-table-header {
  @apply text-lg font-bold;
}

.dark-mode .startups-table-cell {
  @apply p-4;
}

.dark-mode .add-investment {
  @apply bg-gray-800;
}

.dark-mode .add-investment-title {
  @apply text-2xl font-bold;
}

.dark-mode .add-investment-form {
  @apply flex flex-col;
}

.dark-mode .add-investment-form-group {
  @apply mb-4;
}

.dark-mode .add-investment-form-label {
  @apply text-lg font-bold;
}

.dark-mode .add-investment-form-input {
  @apply p-2 border border-gray-600;
}

.dark-mode .add-investment-form-button {
  @apply bg-blue-500 text-white p-2 rounded;
}
=== END ===

=== FILE: src/api.js ===
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchStartups = async () => {
  try {
    const response = await api.get('/startups');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addInvestment = async (data) => {
  try {
    const response = await api.post('/startups', data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
=== END ===