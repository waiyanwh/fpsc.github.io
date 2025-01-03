import './App.css';
import React from 'react';

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [riskInputType, setRiskInputType] = React.useState('dollar');
  const [riskAmount, setRiskAmount] = React.useState('');
  const [stopLossValue, setStopLossValue] = React.useState('');
  const [stopLossUnit, setStopLossUnit] = React.useState('ticks');
  const [contractSize, setContractSize] = React.useState('1');
  const [contractType, setContractType] = React.useState('micro');
  const [riskReward, setRiskReward] = React.useState('1');
  const [results, setResults] = React.useState(null);

  // Background images (replace these URLs with your preferred images)
  const lightBg = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop";
  const darkBg = "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=2002&auto=format&fit=crop";

  const getContractValues = (type) => {
    return type === 'micro' 
      ? { tickValue: 0.5, pointValue: 2 } 
      : { tickValue: 5, pointValue: 20 };
  };

  const calculatePositions = () => {
    const { tickValue, pointValue } = getContractValues(contractType);
    const ticksPerPoint = 4;
    const contracts = parseFloat(contractSize) || 1;

    let stopLossTicks, stopLossPoints, riskDollars;

    if (riskInputType === 'dollar') {
      riskDollars = parseFloat(riskAmount);
      stopLossTicks = (riskDollars / contracts) / tickValue;
      stopLossPoints = stopLossTicks / ticksPerPoint;
    } else {
      if (stopLossUnit === 'ticks') {
        stopLossTicks = parseFloat(stopLossValue);
        stopLossPoints = stopLossTicks / ticksPerPoint;
      } else {
        stopLossPoints = parseFloat(stopLossValue);
        stopLossTicks = stopLossPoints * ticksPerPoint;
      }
      riskDollars = stopLossTicks * tickValue * contracts;
    }

    const takeProfitAmount = riskDollars * parseFloat(riskReward);
    const takeProfitTicks = (takeProfitAmount / contracts) / tickValue;
    const takeProfitPoints = takeProfitTicks / ticksPerPoint;

    setResults({
      stopLossTicks,
      stopLossPoints,
      stopLossAmount: riskDollars,
      takeProfitAmount,
      takeProfitTicks,
      takeProfitPoints
    });
  };

  const ResultsCard = ({ title, points, ticks, amount, isProfit }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-md backdrop-blur-sm bg-opacity-90`}>
      <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h4>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Points:</p>
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{points.toFixed(2)}</p>
        </div>
        <div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ticks:</p>
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{ticks.toFixed(2)}</p>
        </div>
        <div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount:</p>
          <p className={`font-medium ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            ${amount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );

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
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className={`relative px-4 py-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sm:rounded-3xl sm:p-20 backdrop-blur-sm bg-opacity-90`}>
          <div className="max-w-md mx-auto">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Future Position Size Calculator
                </h2>

                <div className="mb-4">
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Contract Type
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="micro"
                        checked={contractType === 'micro'}
                        onChange={(e) => setContractType(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Micro ($2/point)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="mini"
                        checked={contractType === 'mini'}
                        onChange={(e) => setContractType(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mini ($20/point)</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Contract Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={contractSize}
                    onChange={(e) => setContractSize(e.target.value)}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                      darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                    placeholder="Enter number of contracts"
                  />
                </div>

                <div className="mb-4">
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Risk Input Type
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="usd"
                        checked={riskInputType === 'usd'}
                        onChange={(e) => setRiskInputType(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>USD</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="movement"
                        checked={riskInputType === 'movement'}
                        onChange={(e) => setRiskInputType(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Movement</span>
                    </label>
                  </div>
                </div>

                {riskInputType === 'dollar' ? (
                  <div className="mb-4">
                    <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Risk Amount ($)
                    </label>
                    <input
                      type="number"
                      value={riskAmount}
                      onChange={(e) => setRiskAmount(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                        darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'
                      }`}
                      placeholder="Enter amount to risk"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex gap-4 mb-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="ticks"
                          checked={stopLossUnit === 'ticks'}
                          onChange={(e) => setStopLossUnit(e.target.value)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ticks</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="points"
                          checked={stopLossUnit === 'points'}
                          onChange={(e) => setStopLossUnit(e.target.value)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Points</span>
                      </label>
                    </div>
                    <input
                      type="number"
                      value={stopLossValue}
                      onChange={(e) => setStopLossValue(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                        darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'
                      }`}
                      placeholder={`Enter stop loss in ${stopLossUnit}`}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Risk:Reward Ratio
                  </label>
                  <select
                    value={riskReward}
                    onChange={(e) => setRiskReward(e.target.value)}
                    className={`shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                      darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    <option value="1">1:1</option>
                    <option value="1.5">1:1.5</option>
                    <option value="2">1:2</option>
                    <option value="2.5">1:2.5</option>
                    <option value="3">1:3</option>
                    <option value="4">1:4</option>
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

                {results && (
                  <div className="mt-8">
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Position Details ({contractSize} {contractType} contract{contractSize > 1 ? 's' : ''})
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
