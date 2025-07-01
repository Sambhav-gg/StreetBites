import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from 'recharts';
import { Eye, Star, FileText, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" className="text-sm font-semibold">
        {`${payload.name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [stallData, setStallData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [smartInsights, setSmartInsights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/stalls/vendor/analytics');
        setSummary(res.data.summary);
        setStallData(res.data.stalls);

        // Process Gemini insights
        const insightsArray = res.data.insights
          .split('\n')
          .filter(line => line.trim() !== '');
        setSmartInsights(insightsArray);
      } catch (err) {
        console.error('Error loading analytics', err);
      }
    };

    fetchAnalytics();
  }, []);

  const handleDrillDown = (stall) => {
    navigate(`/stall/${stall.id}`);
  };

  const categoryData = stallData.reduce((acc, stall) => {
    acc[stall.category] = (acc[stall.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([key, value]) => ({ name: key, value }));

  return (
    <div className="p-6 space-y-6">
      {/* 🧾 Section 1: Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm">Total Stalls</p>
              <h3 className="text-2xl font-bold">{summary?.totalStalls ?? '-'}</h3>
            </div>
            <Store size={32} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm">Total Impressions</p>
              <h3 className="text-2xl font-bold">{summary?.totalImpressions ?? '-'}</h3>
            </div>
            <Eye size={32} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm">Total Reviews</p>
              <h3 className="text-2xl font-bold">{summary?.totalReviews ?? '-'}</h3>
            </div>
            <FileText size={32} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm">Avg Rating</p>
              <h3 className="text-2xl font-bold">{summary?.averageRating ?? '-'}</h3>
            </div>
            <Star size={32} />
          </CardContent>
        </Card>
      </div>

      {/* 📊 Section 2: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4">🧩 Category Distribution</h4>
            <PieChart width={400} height={250}>
              <Pie
                data={categoryChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4">🎯 Impressions by Stall</h4>
            <div className="flex justify-center">
              <PieChart width={400} height={250}>
                <Pie
                  data={stallData.map(stall => ({ name: stall.name, value: stall.impressions }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  onClick={(data, idx) => handleDrillDown(stallData[idx])}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {stallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🏪 Section 3: Per-Stall Table */}
      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <h4 className="font-semibold mb-4">📊 Stall Performance</h4>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Stall Name</th>
                <th className="p-2">Impressions</th>
                <th className="p-2">Avg Rating</th>
                <th className="p-2">Reviews</th>
                <th className="p-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {stallData.map(stall => (
                <tr key={stall.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleDrillDown(stall)}>
                  <td className="p-2 font-medium">{stall.name}</td>
                  <td className="p-2">{stall.impressions}</td>
                  <td className="p-2">{stall.avgRating ?? '-'}</td>
                  <td className="p-2">{stall.reviews}</td>
                  <td className="p-2">{stall.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 🧠 Section 4: Gemini Smart Insights */}
      <Card className="shadow-lg rounded-2xl border border-gray-200">
      <CardContent className="p-6">
        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
          🧠 Gemini Smart Insights
        </h4>
        {smartInsights.length > 0 ? (
          <ul className="text-sm text-gray-700 list-disc ml-6 space-y-3">
            {smartInsights.map((insight, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="leading-relaxed"
              >
                {insight}
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-24 text-sm text-gray-500">
            <span className="animate-pulse">Loading smart insights...</span>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};

export default AnalyticsDashboard;
