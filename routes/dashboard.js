const express = require('express');
const analytics = require('../utils/analytics');
const Trade = require('../models/Trade');
const User = require('../models/User');

const router = express.Router();

// GET /dashboard
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user.id || req.session.user._id; 

    // Get performance metrics for different periods
    const [allTime, yearData, monthData, weekData, todayData] = await Promise.all([
      analytics.calculatePerformanceMetrics(userId, 'all'),
      analytics.calculatePerformanceMetrics(userId, 'year'),
      analytics.calculatePerformanceMetrics(userId, 'month'),
      analytics.calculatePerformanceMetrics(userId, 'week'),
      analytics.calculatePerformanceMetrics(userId, 'today')
    ]);

    // Get recent trades (last 10)
    const recentTrades = await Trade.find({ userId })
      .sort({ tradeDate: -1 })
      .limit(10)
      .lean();

    // Get user's watchlist
    const user = await User.findById(userId).select('watchlist');
    const watchlistRaw = user.watchlist || [];

    const axios = require('axios');
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
    const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

    const popularStocksList = [
      'SHALBY', 'JPM', 'JNJ', 'GD', 'PEP', 
      'BA', 'KO', 'BTC', 'UNH', 'LMT'
    ];

    const popularStocks = await Promise.all(popularStocksList.map(async (symbol) => {
      try {
        const response = await axios.get(
          `${FINNHUB_BASE_URL}/quote`,
          { params: { symbol, token: FINNHUB_API_KEY } }
        );
        return {
          symbol,
          price: response.data.c || 0,
          change: response.data.d || 0,
          changePercent: response.data.dp || 0
        };
      } catch (error) {
        return {
          symbol,
          price: 0,
          change: 0,
          changePercent: 0
        };
      }
    }));

    const watchlist = await Promise.all(
      watchlistRaw.map(async (item) => {
        let currentPrice = null, change = null, changePercent = null;
        try {
          const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
            params: { symbol: item.symbol, token: FINNHUB_API_KEY }
          });
          currentPrice = response.data.c;
          change = response.data.d;
          changePercent = response.data.dp;
        } catch (err) {
          // leave as null if error
        }
        return {
          symbol: item.symbol,
          name: item.name,
          currentPrice,
          change,
          changePercent,
          addedAt: item.addedAt
        };
      })
    );

    // Get monthly performance for chart
    const monthlyPerformance = await analytics.getMonthlyPerformance(userId, 6);

    // Get top and worst performers
    const [topPerformers, worstPerformers] = await Promise.all([
      analytics.getTopPerformers(userId, 3),
      analytics.getWorstPerformers(userId, 3)
    ]);
const analyticsData = await analytics.calculatePerformanceMetrics(userId, 'all');
    res.render('dashboard', {
    title: 'Dashboard - Fincraft',
    analytics: allTime,      // allTime stats object
    year: yearData,          // 1 year stats object
    month: monthData,        // 1 month stats object
    week: weekData,          // 1 week stats object
    today: todayData,        // today stats object
    recentTrades,
    popularStocks,
    watchlist,
    monthlyPerformance,
    topPerformers,
    worstPerformers,
    formatCurrency: analytics.formatCurrency,
    formatPercentage: analytics.formatPercentage
      // recentTrades,
      // watchlist,
      // monthlyPerformance,
      // topPerformers,
      // worstPerformers,
      // formatCurrency: analytics.formatCurrency,
      // formatPercentage: analytics.formatPercentage
    });


  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('error', {
      title: 'Error - Fincraft',
      message: 'Unable to load dashboard data'
    });
  }
});

// GET /dashboard/api/performance/:period
router.get('/api/performance/:period', async (req, res) => {
  try {
    const userId = req.session.user.id|| req.session.user._id; // Ensure user ID is correctly retrieved
    const period = req.params.period;

    const metrics = await analytics.calculatePerformanceMetrics(userId, period);
    
    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Performance API error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch performance data'
    });
  }
});

// POST /dashboard/watchlist/add
router.post('/watchlist/add', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { symbol, name } = req.body;

    if (!symbol || !name) {
      return res.status(400).json({
        success: false,
        error: 'Symbol and name are required'
      });
    }

    const user = await User.findById(userId);
    
    // Check if already in watchlist
    const exists = user.watchlist.some(item => item.symbol === symbol.toUpperCase());
    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'Stock is already in your watchlist'
      });
    }

    // Add to watchlist
    user.watchlist.push({
      symbol: symbol.toUpperCase(),
      name: name,
      addedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Stock added to watchlist'
    });

  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to add stock to watchlist'
    });
  }
});

// DELETE /dashboard/watchlist/remove/:symbol
router.delete('/watchlist/remove/:symbol', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const symbol = req.params.symbol.toUpperCase();

    const user = await User.findById(userId);
    user.watchlist = user.watchlist.filter(item => item.symbol !== symbol);
    await user.save();

    res.json({
      success: true,
      message: 'Stock removed from watchlist'
    });

  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to remove stock from watchlist'
    });
  }
});

module.exports = router;