import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Gunakan icon library seperti lucide-react

const Sidebar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "w-64" : "w-16"} h-screen bg-gray-800 text-white flex flex-col transition-all duration-300`}>
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full m-2 self-end">
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Menu Items */}
        <ul className="space-y-4 mt-4">
          <li className={location.pathname === "/dashboard" ? "bg-gray-700 p-3 rounded" : "p-3"}>
            <Link to="/dashboard" className="block hover:text-gray-300">
              {isSidebarOpen && "Dashboard"}
              {!isSidebarOpen && <span className="text-center">1📈</span>}
            </Link>
          </li>
          <li className={location.pathname === "/dashboard2" ? "bg-gray-700 p-3 rounded" : "p-3"}>
            <Link to="/dashboard2" className="block hover:text-gray-300">
              {isSidebarOpen && "Dashboard 2"}
              {!isSidebarOpen && <span className="text-center">2📈</span>}
            </Link>
          </li>
          <li className={location.pathname === "/dashboard3" ? "bg-gray-700 p-3 rounded" : "p-3"}>
            <Link to="/dashboard3" className="block hover:text-gray-300">
              {isSidebarOpen && "Dashboard 3"}
              {!isSidebarOpen && <span className="text-center">3📈</span>}
            </Link>
          </li>
          <li className={location.pathname === "/dashboard4" ? "bg-gray-700 p-3 rounded" : "p-3"}>
            <Link to="/dashboard4" className="block hover:text-gray-300">
              {isSidebarOpen && "Dashboard 4"}
              {!isSidebarOpen && <span className="text-center">4📈</span>}
            </Link>
          </li>
          <li className={location.pathname === "/settings" ? "bg-gray-700 p-3 rounded" : "p-3"}>
            <Link to="/settings" className="block hover:text-gray-300">
              {isSidebarOpen && "Settings"}
              {!isSidebarOpen && <span className="text-center">⚙️</span>}
            </Link>
          </li>
        </ul>
      </div>
      {/* Main Content */}
      {/* <div className="flex justify-center items-start bg-gray-100 p-10">
        <BarChart2 />
      </div> */}
    </div>
  );
};

export default Sidebar;
