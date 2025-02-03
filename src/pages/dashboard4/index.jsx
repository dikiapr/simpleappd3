import BarChart3 from "../../components/charts/BarChart3";
import PieChart3 from "../../components/charts/PieChart3";

const Dashboard4 = () => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <PieChart3 />
      </div>
      <div className="flex justify-center items-center">
        <BarChart3 />
      </div>
    </div>
  );
};

export default Dashboard4;
