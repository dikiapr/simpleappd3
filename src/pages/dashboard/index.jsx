import { useState, useEffect } from "react";
import GeoChart from "../../components/charts/GeoChart";
import data from "../../utils/GeoChart.world.geo.json";
import dataCovid from "../../utils/DataCovid.json";
import { motion } from "framer-motion";
import BarChart from "../../components/charts/BarChart/BarChart";
import PieChart from "../../components/charts/PieChart/PieChart";

const cardVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.8,
    },
  }),
};

function Dashboard() {
  const [property, setProperty] = useState("totalConfirmed");
  const [selectedDate, setSelectedDate] = useState("2020-11-05");

  const [pieChartData, setPieChartData] = useState([]);

  // Merge `cekDummy` into GeoJSON `data`
  const newData = {
    ...data,
    features: data.features.map((feature) => {
      const matchingCountry = dataCovid.find((country) => country.Slug.toLowerCase() === feature.properties.name.toLowerCase());

      if (matchingCountry) {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            newConfirmed: matchingCountry.NewConfirmed,
            totalConfirmed: matchingCountry.TotalConfirmed,
            newDeaths: matchingCountry.NewDeaths,
            totalDeaths: matchingCountry.TotalDeaths,
            newRecovered: matchingCountry.NewRecovered,
            totalRecovered: matchingCountry.TotalRecovered,
          },
        };
      }

      return feature;
    }),
  };

  const processDataForPieChart = (data) => {
    const totals = data.reduce(
      (acc, curr) => {
        acc.TotalConfirmed += curr.TotalConfirmed;
        acc.TotalDeaths += curr.TotalDeaths;
        acc.TotalRecovered += curr.TotalRecovered;
        return acc;
      },
      { TotalConfirmed: 0, TotalDeaths: 0, TotalRecovered: 0 }
    );

    return [
      { label: "Total Confirmed", value: totals.TotalConfirmed },
      { label: "Total Deaths", value: totals.TotalDeaths },
      { label: "Total Recovered", value: totals.TotalRecovered },
    ];
  };

  useEffect(() => {
    const processedData = processDataForPieChart(dataCovid);
    setPieChartData(processedData);
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-center bg-gray-50">
      <h2 className="text-3xl font-bold text-slate-600 mb-6">Data Covid-19 Dashboard</h2>

      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mb-6">
        <motion.div className="w-1/2 pr-4" variants={cardVariants} initial="hidden" animate="visible" custom={0}>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Select Property to Highlight</h3>
          <select value={property} onChange={(event) => setProperty(event.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="totalConfirmed">Total Confirmed Cases</option>
            <option value="totalDeaths">Total Deaths</option>
            <option value="totalRecovered">Total Recovered</option>
          </select>
        </motion.div>

        <motion.div className="w-1/2 pl-4" variants={cardVariants} initial="hidden" animate="visible" custom={1}>
          <label htmlFor="date" className="block text-lg font-semibold mb-2 text-gray-700">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>
      </div>

      <motion.div className="w-full h-[calc(100vh-180px)] bg-white shadow-md rounded-lg overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <GeoChart className="w-full h-full" data={newData} property={property} />
      </motion.div>

      <div className="flex flex-col gap-4 mt-2">
        <motion.div className="flex justify-between gap-2" initial="hidden" animate="visible" variants={cardVariants}>
          <motion.div className="flex-[8.5] bg-white shadow-md p-6 rounded-lg text-left" custom={1} variants={cardVariants}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Bar Chart Data for the Most Countries</h2>
              <div className="flex justify-center items-center w-full">
                <BarChart data={newData} property={property} />
              </div>
            </h3>
          </motion.div>
          <motion.div className="flex-[8.5] bg-white shadow-md p-6 rounded-lg text-left" custom={1} variants={cardVariants}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Pie Chart Data COVID for All Countries</h2>
              <div className="flex justify-center items-center w-full">
                <PieChart data={pieChartData} />
              </div>
              <ul>
                {pieChartData.map((item, index) => (
                  <li key={index}>
                    <span className="font-medium text-[18px]">
                      {item.label}: {item.value.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </h3>
          </motion.div>
        </motion.div>

        <motion.div className="flex justify-between gap-2" initial="hidden" animate="visible" variants={cardVariants}>
          <motion.div className="flex-[8.5] bg-white shadow-md p-6 rounded-lg text-left" custom={1} variants={cardVariants}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Box 1</h3>
          </motion.div>
          <motion.div className="flex-[3.5] bg-white shadow-md p-6 rounded-lg text-left" custom={2} variants={cardVariants}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Box 2</h3>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
