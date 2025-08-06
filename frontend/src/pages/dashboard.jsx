import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { faker } from '@faker-js/faker';
import profileImg from '../assets/img.jpg';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

// Generate 50 fake contacts with timestamps including milliseconds
const generateContacts = () => {
  const now = Date.now();
  return Array.from({ length: 50 }, (_, i) => {
    const time = new Date(now - i * 1234);
    const timestamp = time.toISOString();

    return {
      timestamp,
      ip: faker.internet.ip(),
      flags: [
        faker.hacker.verb(),
        faker.hacker.adjective(),
        faker.hacker.noun()
      ],
      classification: Math.random() < 0.2 ? 'anomaly' : 'safe'
    };
  });
};

const contacts = generateContacts();

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [paused, setPaused] = useState(false);

  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleButtonClick = () => {
    connected ? setShowDisconnectConfirm(true) : setShowForm(true);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    setConnected(true);
    setShowForm(false);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setShowDisconnectConfirm(false);
  };

  

  // Generate 100 timestamps for labels with milliseconds increment
  const startTime = Date.now();
  const labels = Array.from({ length: 100 }, (_, i) => {
    const time = new Date(startTime + i * 50); // 50ms interval
    return time.toISOString().slice(11, 23); // HH:mm:ss.SSS format
  });

  // Data between -1 and 1
  const dData = labels.map(() => Math.round(Math.random()));

  const segmentColor = {
    borderColor: (ctx) => {
      const avgY = (ctx.p0.parsed.y + ctx.p1.parsed.y) / 2;
      return avgY > 0.5 ? '#f43f5d' /* rosy red */ : '#14b8a5' /* teal */;
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'D',
        data: dData, // only 0 or 1
        segment: segmentColor,
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        yAxisID: 'yD',
      },
      {
        label: 'Reference Line (0.5)',
        data: Array(labels.length).fill(0.5), // <== purely visual reference line
        borderColor: 'white',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
        yAxisID: 'yD',
        tension: 0,
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false, labels: { font: { family: "'Courier New', monospace" } } },
      tooltip: { 
        enabled: true,
        bodyFont: { family: "'Courier New', monospace" },
        titleFont: { family: "'Courier New', monospace" }
      },
    },
    scales: {
      x: {
        display: true,
        ticks: { color: 'white', maxTicksLimit: 10, font: { family: "'Courier New', monospace" } },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      yD: {
        display: false,
        position: 'left',
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.5,
          color: 'white',
          font: { family: "'Courier New', monospace" }
        },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    },
    font: {
      family: "'Courier New', monospace"
    }
  };

  // Data for Top 5 IPs Traffic horizontal bar chart
  const ipTrafficData = {
    labels: ['192.168.0.12', '10.0.0.8', '172.16.3.2', '192.168.1.22', '10.1.1.15'],
    datasets: [
      {
        label: 'Anomaly Traffic',
        data: [450, 370, 300, 260, 240], // MB example values
        backgroundColor: '#f43f5dc7', // Rose Red
      },
      {
        label: 'Safe Traffic',
        data: [380, 330, 290, 210, 180], // MB example values
        backgroundColor: '#14b8a5c0', // Teal
      },
    ],
  };

  const ipTrafficOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top', 
        labels: { color: 'white', font: { family: "'Courier New', monospace" } } 
      },
      tooltip: { 
        enabled: true,
        bodyFont: { family: "'Courier New', monospace" },
        titleFont: { family: "'Courier New', monospace" }
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Traffic (MB)', color: 'white', font: { family: "'Courier New', monospace" } },
        ticks: { color: 'white', maxTicksLimit: 6, font: { family: "'Courier New', monospace" } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        title: { display: true, text: 'Top Five (5) IP Address', color: 'white', font: { family: "'Courier New', monospace" } },
        ticks: { color: 'white', font: { family: "'Courier New', monospace" } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    font: {
      family: "'Courier New', monospace"
    }

    
  };

  const totalSafeTraffic = ipTrafficData.datasets[1].data.reduce((a, b) => a + b, 0);
  const totalAnomalyTraffic = ipTrafficData.datasets[0].data.reduce((a, b) => a + b, 0);
  const totalUniqueIPs = ipTrafficData.labels.length;
  const totalTrafficMB = totalSafeTraffic + totalAnomalyTraffic;

  // Calculate percentage for progress bars (assuming max value for safe/anomaly is 1000 MB for example)
  const safeTrafficPercent = Math.min(100, Math.round((totalSafeTraffic / 1000) * 100));
  const anomalyTrafficPercent = Math.min(100, Math.round((totalAnomalyTraffic / 1000) * 100));
  const uniqueIPsPercent = Math.min(100, Math.round((totalUniqueIPs / 10) * 100)); // max 10 IPs for progress bar
  const totalTrafficPercent = Math.min(100, Math.round((totalTrafficMB / 2000) * 100)); // max 2GB

  return (
    <div className="relative z-10 bg-[#0a0f1c] min-h-screen text-white">
      {/* Header */}
      <div className="h-[6rem] w-full flex items-center justify-between px-6 font-mono relative z-20 fixed mt-[-2rem]">
        {/* Left: Logo */}
        <div className="flex items-end text-base tracking-wide text-teal-500">
          <span className="text-5xl font-extrabold leading-none">A</span>
          <span className="self-center ml-1">nomaly</span>
          <span className="ml-4 text-5xl font-extrabold leading-none">D</span>
          <span className="self-center ml-1">etection</span>
        </div>

        {/* Center: Pause/Continue Button */}
        

        {/* Right: Connect + Profile */}
        <div className="flex items-center space-x-4">
          <button
  onClick={() => setPaused(!paused)}
  title={paused ? 'Continue' : 'Pause'}
  className={`w-[6rem] p-2 rounded transition text-white/80 flex items-center justify-center space-x-2 
    ${paused ? 'bg-rose-500/30 hover:bg-rose-500/30' : 'bg-teal-600/50 hover:bg-teal-500/30'}`}
>
  {paused ? (
    <>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke-width="1" stroke="currentColor" className="h-4 w-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
</svg>


      <span className="text-xs tracking-wide">Continue</span>
    </>
  ) : (
    <>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-4 w-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
</svg>

      <span className="text-xs tracking-wide">Pause</span>
    </>
  )}
</button>

          <button
            onClick={handleButtonClick}
            className={`h-[2rem] w-[6rem] text-xs tracking-wide transition-all rounded-[2px] ${
              connected
                ? 'bg-teal-500 hover:bg-teal-400 text-white'
                : 'bg-teal-600/50 hover:bg-teal-500 text-white/80'
            }`}
          >
            {connected ? 'Connected' : 'Connect'}
          </button>

          <div className="relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-[3.5rem] w-[3.5rem] rounded-full border-[2px] border-teal-500 cursor-pointer overflow-hidden"
            >
              <img className="h-full w-full object-cover" src={profileImg} alt="Profile" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#0f1115] border border-white/10 shadow-md text-white text-xs rounded">
                <ul className="flex flex-col">
                  <li className="px-4 py-2 hover:bg-white/10 cursor-pointer">Profile</li>
                  
                  {/* Disabled Dashboard */}
                  <li
                    className="px-4 py-2 text-gray-500 cursor-not-allowed select-none"
                    onClick={(e) => e.preventDefault()} // prevent click
                  >
                    Dashboard
                  </li>
                  
                  <li 
                    className="px-4 py-2 text-gray-500 cursor-not-allowed select-none"
                    onClick={(e) => e.preventDefault()}
                  >
                    Report
                  </li>
                  <Link to="/">
                  <li className="px-4 py-2 hover:bg-white/10 cursor-pointer">Logout</li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connect Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
          <form
            onSubmit={handleFormSubmit}
            className="bg-[#0f1115] border border-white/20 shadow-[0_0_80px_#14b8a640] rounded-sm p-6 space-y-4 w-[20rem] text-xs font-mono"
          >
            <h3 className="text-center tracking-wide mb-2">Server Credentials</h3>
            <input
              type="text"
              placeholder="IP Address"
              className="w-full px-3 py-2 bg-transparent border border-white/20 placeholder-white/30 focus:border-teal-400"
              required
            />
            <input
              type="text"
              placeholder="User"
              className="w-full px-3 py-2 bg-transparent border border-white/20 placeholder-white/30 focus:border-teal-400"
              required
            />
            <input
              type="text"
              placeholder="Password"
              className="w-full px-3 py-2 bg-transparent border border-white/20 placeholder-white/30 focus:border-teal-400"
              required
            />
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-1 bg-gray-600 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-teal-500 hover:bg-teal-400 text-black"
              >
                Connect
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-[#0f1115] border border-white/20 shadow-[0_0_80px_#14b8a640] rounded-sm p-6 w-[22rem] text-xs text-white font-mono space-y-4">
            <h3 className="text-center tracking-wide">Are you sure you want to disconnect?</h3>
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                className="px-4 py-1 bg-gray-600 hover:bg-gray-500 text-white"
              >
                No
              </button>
              <button
                onClick={handleDisconnect}
                className="px-4 py-1 bg-rose-500 hover:bg-rose-400 text-white"
              >
                Yes, Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards - placed BEFORE the bar chart as requested */}
      <div className="flex px-6 gap-4 mt-6">
        {/* Total Safe Traffic */}
        <div className="w-1/4 bg-[#0a0f1c] border border-white/10 rounded-sm p-4 text-white font-mono">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-teal-600 rounded p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
</svg>

            </div>
            <h4 className="text-sm font-semibold">Safe Traffic</h4>
          </div>
          <div className="text-2xl font-bold">{totalSafeTraffic.toLocaleString()} MB</div>
          <div className="text-xs text-white/50 mb-1">Total safe traffic this month</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${safeTrafficPercent}%` }}
            />
          </div>
        </div>

        {/* Total Anomaly Traffic */}
        <div className="w-1/4 bg-[#0a0f1c] border border-white/10 rounded-sm p-4 text-white font-mono">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-rose-600 rounded p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
</svg>

            </div>
            <h4 className="text-sm font-semibold">Anomaly Traffic</h4>
          </div>
          <div className="text-2xl font-bold">{totalAnomalyTraffic.toLocaleString()} MB</div>
          <div className="text-xs text-white/50 mb-1">Total anomaly traffic this month</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-rose-500 h-2 rounded-full transition-all"
              style={{ width: `${anomalyTrafficPercent}%` }}
            />
          </div>
        </div>

        {/* Total Unique IP Addresses */}
        <div className="w-1/4 bg-[#0a0f1c] border border-white/10 rounded-sm p-4 text-white font-mono">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-teal-700 rounded p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
</svg>

            </div>
            <h4 className="text-sm font-semibold">Unique IPs</h4>
          </div>
          <div className="text-2xl font-bold">{totalUniqueIPs}</div>
          <div className="text-xs text-white/50 mb-1">Active unique IP addresses</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-teal-400 h-2 rounded-full transition-all"
              style={{ width: `${uniqueIPsPercent}%` }}
            />
          </div>
        </div>

        {/* Total MB Used */}
        <div className="w-1/4 bg-[#0a0f1c] border border-white/10 rounded-sm p-4 text-white font-mono">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-teal-900 rounded p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>

            </div>
            <h4 className="text-sm font-semibold">Total Traffic</h4>
          </div>
          <div className="text-2xl font-bold">{totalTrafficMB.toLocaleString()} MB</div>
          <div className="text-xs text-white/50 mb-1">Total MB used this month</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-teal-700 h-2 rounded-full transition-all"
              style={{ width: `${totalTrafficPercent}%` }}
            />
          </div>
        </div>
      </div>


      {/* Horizontal Bar Chart for Top 5 IPs Traffic */}
      <div className="flex px-6 mb-4">
        {/*HERE*/}
        {/*Top 5 IP address*/}
        <div className="w-full h-[15rem] bg-[#0a0f1c] border border-white/10 rounded-sm p-4 text-white/70 font-mono mt-5">
  {connected ? (
    <Bar data={ipTrafficData} options={ipTrafficOptions} />
  ) : (
    <div className="h-full w-full flex items-center justify-center text-center text-white/50 text-xs py-8">No data yet, maybe the server is not connected</div>
  )}
</div>

      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-[10rem] bg-[#0a0f1c] border border-white/10 rounded-sm p-2 flex items-center justify-center text-white text-sm font-mono">
          {connected ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="text-center text-white/50 text-xs px-4">
              No data yet, maybe the server is not connected
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="px-6 pb-10">
        <div className="text-white font-mono text-sm mb-2">{''}</div>
        <div className="overflow-y-auto max-h-[400px] border border-white/10 rounded-sm">
          <table className="min-w-full text-xs text-left text-white font-mono">
            <thead className="bg-[#1a1c23] text-white/80 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 border-b border-white/10">TIMESTAMP</th>
                <th className="px-4 py-3 border-b border-white/10">IP ADDRESS</th>
                <th className="px-4 py-3 border-b border-white/10">FLAGS</th>
                <th className="px-4 py-3 border-b border-white/10">CLASSIFICATION</th>
              </tr>
            </thead>
            <tbody className="text-white/70">

            {connected ? (
                            contacts.map(({ timestamp, ip, flags, classification}, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/10 hover:bg-white/5 ${
                    classification === 'safe' 
                      ? 'bg-teal-800/30 hover:bg-teal-700/50' 
                      : 'bg-rose-800/30 hover:bg-rose-700/50'
                  }`}
                >
                  <td className="px-4 py-1">{timestamp}</td>
                  <td className="px-4 py-1">{ip}</td>
                  <td className="px-4 py-1">{flags.join(', ')}</td>
                  <td className="px-4 py-1">{classification}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-white/50 py-6">No data yet, maybe the server is not connected</td>
              </tr>
            )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
