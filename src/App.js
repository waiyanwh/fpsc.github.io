import './App.css';
import React from 'react';
import lightBg from './assets/light-bg.jpg';
import darkBg from './assets/dark-bg.jpg';

function ResultsCard({ title, points, ticks, amount, isProfit }) {
  const [darkMode] = React.useState(false);

  return (
    <div className={`p-4 rounded-lg ${
      isProfit 
        ? darkMode ? 'bg-green-900/30' : 'bg-green-50' 
        : darkMode ? 'bg-red-900/30' : 'bg-red-50'
    }`}>
      <h4 className={`text-lg font-semibold mb-2 ${
        isProfit 
          ? darkMode ? 'text-green-400' : 'text-green-700'
          : darkMode ? 'text-red-400' : 'text-red-700'
      }`}>
        {title}
      </h4>
      <div className={`grid grid-cols-1 gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p>Points: {points}</p>
        <p>Ticks: {ticks}</p>
        <p className="font-semibold">${amount.toFixed(2)}</p>
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [contractType, setContractType] = React.useState('NQ Mini');
  const [contractSize, setContractSize] = React.useState(1);
  const [riskInputType, setRiskInputType] = React.useState('dollar');
  const [riskAmount, setRiskAmount] = React.useState('');
  const [stopLossDistance, setStopLossDistance] = React.useState('');
  const [riskRewardRatio, setRiskRewardRatio] = React.useState('1');
  const [results, setResults] = React.useState(null);

  // // For demo purposes, using placeholder images
  // const lightBg = "https://placehold.co/1920x1080/e2e8f0/e2e8f0";
  // const darkBg = "https://placehold.co/1920x1080/1a202c/1a202c";

  const contractValues = {
    'NQ Mini': { pointValue: 20, tickValue: 5 },
    'NQ Micro': { pointValue: 2, tickValue: 0.5 },
    'ES Mini': { pointValue: 50, tickValue: 12.50 },
    'ES Micro': { pointValue: 5, tickValue: 1.25 }
  };

  const riskRewardOptions = [
    { label: '1:1', value: '1' },
    { label: '1:2', value: '2' },
    { label: '1:3', value: '3' },
    { label: '1:4', value: '4' },
    { label: '1:5', value: '5' }
  ];

  const calculatePositions = () => {
    let stopLossPoints, stopLossTicks, stopLossAmount;

    if (riskInputType === 'dollar') {
      const riskAmountNum = parseFloat(riskAmount);
      stopLossAmount = riskAmountNum;
      stopLossPoints = riskAmountNum / (contractValues[contractType].pointValue * contractSize);
      stopLossTicks = stopLossPoints * 4;
    } else if (riskInputType === 'points') {
      const distanceNum = parseFloat(stopLossDistance);
      stopLossPoints = distanceNum;
      stopLossTicks = distanceNum * 4;
      stopLossAmount = stopLossPoints * contractValues[contractType].pointValue * contractSize;
    } else { // ticks
      const ticksNum = parseFloat(stopLossDistance);
      stopLossTicks = ticksNum;
      stopLossPoints = ticksNum / 4;
      stopLossAmount = stopLossTicks * contractValues[contractType].tickValue * contractSize;
    }

    const takeProfitPoints = stopLossPoints * parseFloat(riskRewardRatio);
    const takeProfitTicks = takeProfitPoints * 4;
    const takeProfitAmount = stopLossAmount * parseFloat(riskRewardRatio);

    setResults({
      stopLossPoints: stopLossPoints.toFixed(2),
      stopLossTicks: stopLossTicks.toFixed(2),
      stopLossAmount,
      takeProfitPoints: takeProfitPoints.toFixed(2),
      takeProfitTicks: takeProfitTicks.toFixed(2),
      takeProfitAmount
    });
  };

  return (
    <div 
      className={`min-h-screen py-6 flex flex-col justify-center sm:py-12 transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      style={{
        backgroundImage: `url(${darkMode ? darkBg : lightBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative py-3 mx-auto w-full max-w-6xl px-4 flex flex-col md:flex-row gap-6">
        {/* Calculator Input Form */}
        <div className={`md:w-1/2 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg rounded-3xl p-8 backdrop-blur-sm`}>
          <div className="relative">
            <div className="absolute top-0 right-0">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Futures Position Size Calculator
            </h2>

            <div className="space-y-4">
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Contract Type
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NQ Mini">NQ Mini</option>
                  <option value="NQ Micro">NQ Micro</option>
                  <option value="ES Mini">ES Mini</option>
                  <option value="ES Micro">ES Micro</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Contract Size
                </label>
                <input
                  type="number"
                  value={contractSize}
                  onChange={(e) => setContractSize(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Risk Input Type
                </label>
                <select
                  value={riskInputType}
                  onChange={(e) => setRiskInputType(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dollar">Dollar Amount ($)</option>
                  <option value="points">Movement (Points)</option>
                  <option value="ticks">Movement (Ticks)</option>
                </select>
              </div>

              {riskInputType === 'dollar' ? (
                <div>
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Risk Amount ($)
                  </label>
                  <input
                    type="number"
                    value={riskAmount}
                    onChange={(e) => setRiskAmount(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stop Loss ({riskInputType === 'points' ? 'Points' : 'Ticks'})
                  </label>
                  <input
                    type="number"
                    value={stopLossDistance}
                    onChange={(e) => setStopLossDistance(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Risk/Reward Ratio
                </label>
                <select
                  value={riskRewardRatio}
                  onChange={(e) => setRiskRewardRatio(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {riskRewardOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={calculatePositions}
                className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-700 text-white'
                }`}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className={`md:w-1/2 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg rounded-3xl p-8 backdrop-blur-sm ${
          results ? 'opacity-100' : 'opacity-50'
        } transition-opacity duration-200`}>
          <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Position Details
          </h2>

          {results ? (
            <>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {contractSize} {contractType} contract{contractSize > 1 ? 's' : ''}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <ResultsCard
                  title="Stop Loss"
                  points={results.stopLossPoints}
                  ticks={results.stopLossTicks}
                  amount={results.stopLossAmount}
                  isProfit={false}
                />

                <ResultsCard
                  title="Take Profit"
                  points={results.takeProfitPoints}
                  ticks={results.takeProfitTicks}
                  amount={results.takeProfitAmount}
                  isProfit={true}
                />
              </div>
            </>
          ) : (
            <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>Enter your position details and click calculate to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
