import { useEffect, useState } from "react";
import CurrencyDropdown from "./dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );

  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(Object.keys(data).sort());
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError(null);
    setConverting(true);

    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
    } catch (error) {
      console.error("Error Fetching", error);
      setError("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Currency Converter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <CurrencyDropdown
            favorites={favorites}
            currencies={currencies}
            title="From:"
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            handleFavorite={handleFavorite}
          />
          <div className="flex justify-center sm:justify-center -mb-3 sm:mb-0">
            <button
              onClick={swapCurrencies}
              className="p-2 bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-200"
            >
              <HiArrowsRightLeft className="text-xl text-white" />
            </button>
          </div>
          <CurrencyDropdown
            favorites={favorites}
            currencies={currencies}
            currency={toCurrency}
            setCurrency={setToCurrency}
            title="To:"
            handleFavorite={handleFavorite}
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount:
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 1)}
            type="number"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-200"
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={convertCurrency}
            className={`px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-200 ${
              converting ? "animate-pulse" : ""
            }`}
          >
            Convert
          </button>
        </div>

        {error && (
          <div className="mt-4 text-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {convertedAmount && !error && (
          <div className="mt-4 text-lg text-green-600 text-center">
            Converted Amount: {convertedAmount}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
