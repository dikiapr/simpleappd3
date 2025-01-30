import BarChart from "../../components/charts/BarChart/BarChart";
import LineChart from "../../components/charts/lineChart";
import PieChart from "../../components/charts/PieChart/PieChart";
import { DataDummy } from "../../utils/DataDummy";

const Charts = () => {
  const data = DataDummy.data;

  return (
    <div className="dashboard-container p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Charts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="box bg-white p-4 shadow-md rounded flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Pie Chart Example</h2>
          <div className="flex justify-center items-center w-full">
            <PieChart data={data} />
          </div>
        </div>
        <div className="boxBar bg-white p-4 shadow-md rounded flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Bar Chart Example</h2>
          <div className="flex justify-center items-center w-full">
            <BarChart />
          </div>
        </div>
        <div className="box bg-white p-4 shadow-md rounded flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Line Chart Example</h2>
          <div className="flex justify-center items-center w-full">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
