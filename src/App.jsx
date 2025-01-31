import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/index";
import Charts from "./pages/Charts/Charts";
import Dashboard2 from "./pages/dashboard2";
import Dashboard3 from "./pages/dashboard3";
import Dashboard4 from "./pages/dashboard4";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/charts" element={<Charts />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/dashboard3" element={<Dashboard3 />} />
          <Route path="/dashboard4" element={<Dashboard4 />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
