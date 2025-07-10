import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, Sector, ResponsiveContainer } from 'recharts';
import { 
  Eye, 
  Star, 
  FileText, 
  Store, 
  TrendingUp, 
  Users, 
  Heart,
  ArrowUp,
  ArrowDown,
  Target,
  Brain,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#fb923c', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8'];

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-300 border-t-orange-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 text-6xl opacity-8 animate-bounce">📊</div>
        <div className="absolute top-1/3 right-32 text-5xl opacity-10 animate-bounce delay-300">📈</div>
        <div className="absolute bottom-1/4 left-40 text-7xl opacity-6 animate-bounce delay-600">🎯</div>
        <div className="absolute bottom-32 right-20 text-4xl opacity-12 animate-bounce delay-900">⭐</div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-white/80 to-orange-50/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/vendor/dashboard")}
                className="flex items-center gap-3 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </motion.button>
              
              <div className="text-center">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 flex items-center gap-3">
                  📊 Analytics Dashboard
                </h1>
              </div>
              
              <div className="w-40"></div> {/* Spacer for centering */}
            </div>
            <p className="text-gray-600 font-medium text-lg text-center">
              Track your business performance and growth insights
            </p>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl border-0 overflow-hidden">
                <CardContent className="relative p-6">
                  <div className="absolute top-2 right-2 opacity-20">
                    <Store size={60} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <Store size={24} />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <h3 className="text-3xl font-black mb-1">{summary?.totalStalls ?? '-'}</h3>
                    <p className="text-blue-100 font-medium">Active Stalls</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-2xl border-0 overflow-hidden">
                <CardContent className="relative p-6">
                  <div className="absolute top-2 right-2 opacity-20">
                    <Eye size={60} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <Eye size={24} />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Views</span>
                    </div>
                    <h3 className="text-3xl font-black mb-1">{summary?.totalImpressions ?? '-'}</h3>
                    <p className="text-pink-100 font-medium">Total Impressions</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-2xl border-0 overflow-hidden">
                <CardContent className="relative p-6">
                  <div className="absolute top-2 right-2 opacity-20">
                    <FileText size={60} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <FileText size={24} />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Reviews</span>
                    </div>
                    <h3 className="text-3xl font-black mb-1">{summary?.totalReviews ?? '-'}</h3>
                    <p className="text-yellow-100 font-medium">Customer Reviews</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl border-0 overflow-hidden">
                <CardContent className="relative p-6">
                  <div className="absolute top-2 right-2 opacity-20">
                    <Star size={60} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <Star size={24} />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Rating</span>
                    </div>
                    <h3 className="text-3xl font-black mb-1">{summary?.averageRating ?? '-'}</h3>
                    <p className="text-green-100 font-medium">Average Rating</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution */}
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg shadow-2xl border-2 border-white/50">
                <CardContent className="p-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    🧩 Category Distribution
                  </h4>
                  {categoryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
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
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-5xl mb-4">📊</div>
                      <p>No data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Impressions by Stall */}
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-lg shadow-2xl border-2 border-white/50">
                <CardContent className="p-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    🎯 Performance by Stall
                  </h4>
                  {stallData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stallData.map(stall => ({ name: stall.name, value: stall.impressions }))}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
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
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-5xl mb-4">🎯</div>
                      <p>Add stalls to see performance data</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Performance Table */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-lg shadow-2xl border-2 border-white/50">
            <CardContent className="p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📊 Detailed Performance
              </h4>
              {stallData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-bold text-gray-800">Stall Name</th>
                        <th className="text-left p-4 font-bold text-gray-800">
                          <div className="flex items-center gap-2">
                            <Eye size={16} />
                            Impressions
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-800">
                          <div className="flex items-center gap-2">
                            <Star size={16} />
                            Rating
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-800">
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            Reviews
                          </div>
                        </th>
                        <th className="text-left p-4 font-bold text-gray-800">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {stallData.map((stall, index) => (
                          <motion.tr 
                            key={stall.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-white/60 cursor-pointer transition-colors"
                            onClick={() => handleDrillDown(stall)}
                          >
                            <td className="p-4">
                              <div className="font-semibold text-gray-900">{stall.name}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-blue-600">{stall.impressions}</span>
                                {stall.impressions > 100 && <TrendingUp size={16} className="text-green-500" />}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-yellow-600">{stall.avgRating ?? '-'}</span>
                                {stall.avgRating >= 4 && <Star size={16} className="text-yellow-500 fill-current" />}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-purple-600">{stall.reviews}</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {stall.category}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏪</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Stalls Yet</h3>
                  <p className="text-gray-600 mb-6">Add your first stall to start tracking performance!</p>
                  <button
                    onClick={() => navigate('/vendor/stalls/add')}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200"
                  >
                    🏪 Add Your First Stall
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-lg shadow-2xl border-2 border-white/50">
            <CardContent className="p-8">
              <h4 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Brain className="text-purple-600" size={32} />
                🧠 AI-Powered Business Insights
              </h4>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl mb-6 border border-purple-200">
                <p className="text-purple-800 font-semibold text-center">
                  🙏 Namaste! AI-powered personalized recommendations for your business growth
                </p>
              </div>
              {smartInsights.length > 0 ? (
                <div className="space-y-6">
                  {smartInsights.map((insight, idx) => {
                    // Check if this is a header/section title
                    const isHeader = insight.includes('**') || insight.includes('For ') || insight.includes('Namaste');
                    const isSubPoint = insight.trim().startsWith('***') || insight.trim().startsWith('*');
                    const isNumbered = /^\d+$/.test(insight.trim());
                    
                    // Skip pure numbers or empty lines
                    if (isNumbered || !insight.trim()) return null;
                    
                    // Clean up the text
                    let cleanedInsight = insight
                      .replace(/\*\*\*/g, '')
                      .replace(/\*\*/g, '')
                      .replace(/\*/g, '')
                      .trim();
                    
                    if (!cleanedInsight) return null;
                    
                    if (isHeader && !isSubPoint) {
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl shadow-lg"
                        >
                          <h5 className="text-xl font-bold flex items-center gap-2">
                            {cleanedInsight.includes('Raja Dhaba') ? '🥢' : '🍳'}
                            {cleanedInsight}
                          </h5>
                        </motion.div>
                      );
                    }
                    
                    if (isSubPoint) {
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                              💡
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium leading-relaxed text-lg">
                                {cleanedInsight}
                              </p>
                              {/* Add visual emphasis for Hindi/English mix */}
                              {cleanedInsight.includes('_') && (
                                <div className="mt-2 text-sm text-green-700 italic">
                                  💬 Local advice in Hindi-English mix for better understanding
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-l-4 border-blue-500"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            ℹ️
                          </div>
                          <p className="text-gray-800 font-medium leading-relaxed">{cleanedInsight}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-6xl mb-4"
                  >
                    🧠
                  </motion.div>
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    <span className="font-semibold">Generating smart insights...</span>
                  </div>
                  <p className="text-gray-600 mt-2">Our AI is analyzing your business data</p>
                </div>
              )}
              
              {/* AI Insights Footer */}
              {smartInsights.length > 0 && (
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                  <div className="text-center">
                    <h5 className="text-lg font-bold text-purple-800 mb-2">🚀 Ready to Implement?</h5>
                    <p className="text-purple-700 mb-4">
                      These AI-powered suggestions are tailored specifically for your stalls. 
                      Start with one tip at a time for best results!
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✅ Proven Strategies
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        🎯 Personalized
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                        📈 Growth-Focused
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;