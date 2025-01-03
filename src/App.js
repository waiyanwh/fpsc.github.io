import './App.css';
import React from 'react';

function App() {
  const [riskInputType, setRiskInputType] = React.useState('dollar');
  const [riskAmount, setRiskAmount] = React.useState('');
  const [stopLossValue, setStopLossValue] = React.useState('');
  const [stopLossUnit, setStopLossUnit] = React.useState('ticks');
  const [contractSize, setContractSize] = React.useState('1');
  const [contractType, setContractType] = React.useState('micro');
  const [riskReward, setRiskReward] = React.useState('1');
  const [results, setResults] = React.useState(null);

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
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-gray-600">Points:</p>
          <p className="font-medium">{points.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Ticks:</p>
          <p className="font-medium">{ticks.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Amount:</p>
          <p className={`font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            ${amount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Position Size Calculator</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
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
                      <span className="ml-2">micro</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="mini"
                        checked={contractType === 'mini'}
                        onChange={(e) => setContractType(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">mini</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Contract Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={contractSize}
                    onChange={(e) => setContractSize(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter number of contracts"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Risk Input Type
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="dollar"
                        checked={riskInputType === 'dollar'}
                        onChange={(e) => setRiskInputType(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">USD</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="distance"
                        checked={riskInputType === 'distance'}
                        onChange={(e) => setRiskInputType(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Movement</span>
                    </label>
                  </div>
                </div>

                {riskInputType === 'dollar' ? (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Risk Amount ($)
                    </label>
                    <input
                      type="number"
                      value={riskAmount}
                      onChange={(e) => setRiskAmount(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        <span className="ml-2">Ticks</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="points"
                          checked={stopLossUnit === 'points'}
                          onChange={(e) => setStopLossUnit(e.target.value)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Points</span>
                      </label>
                    </div>
                    <input
                      type="number"
                      value={stopLossValue}
                      onChange={(e) => setStopLossValue(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={`Enter stop loss in ${stopLossUnit}`}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Risk:Reward Ratio
                  </label>
                  <select
                    value={riskReward}
                    onChange={(e) => setRiskReward(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Calculate
                </button>

                {results && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">
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
