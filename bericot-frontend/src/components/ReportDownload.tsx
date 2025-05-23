import React from 'react';
import { downloadReport } from '../services/api';

const ReportDownload: React.FC = () => {
  const [month, setMonth] = React.useState(1);
  const [year, setYear] = React.useState(2025);
  const token = localStorage.getItem('token') || '';

  const handleDownload = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' as const,
      };
      const response = await downloadReport(month, year, config);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock-report-${month}-${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading report: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div>
      <h3>Download Report</h3>
      <input
        type="number"
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(parseInt(e.target.value) || 1)}
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value) || 2025)}
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default ReportDownload;