import { useState, useEffect } from "react";
import GeoChart from "../../components/charts/GeoChart";
import data from "../../utils/Indonesia-map.json";
import { motion } from "framer-motion";
import PieChart2 from "../../components/charts/PieChart2";
import BubbleChart from "../../components/charts/BubbleChart";

function Dashboard2() {
  // Set default value to "married"
  const [property, setProperty] = useState("single");

  return (
    <div>
      <div className=" flex flex-col min-h-screen text-center bg-gray-50">
        <h2 className="lg:text-3xl text-md font-bold text-slate-600 mb-6">Persentase Penduduk laki-laki Berumur 10 Tahun ke Atas menurut Provinsi, Jenis Kelamin, dan Status Perkawinan 2009</h2>
        <select value={property} onChange={(event) => setProperty(event.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="single">Belum Kawin</option>
          <option value="married">Kawin</option>
          <option value="divorced">Cerai Hidup</option>a
          <option value="widowed">Cerai Mati</option>
        </select>
        <div className="flex justify-around items-center gap-1 py-10">
          <BubbleChart property={property}/>
          <PieChart2 property={property}/>
        </div>
        <motion.div className=" w-full lg:h-[calc(100vh-180px)] h-[400px] bg-white shadow-md rounded-lg overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <GeoChart className="w-full h-full" data={data} property={property} />
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard2;
