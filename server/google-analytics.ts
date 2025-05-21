import axios from 'axios';

// Types for Google Analytics response
interface AnalyticsResponse {
  reports: Array<{
    data: {
      rows: Array<{
        dimensions: string[];
        metrics: Array<{ values: string[] }>;
      }>;
      totals: Array<{ values: string[] }>;
    };
  }>;
}

interface ProcessedAnalyticsData {
  dates: string[];
  pageViews: number[];
  visitors: number[];
  sessions: number[];
  totals: {
    pageViews: number;
    visitors: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
}

// For now, we're using demo data until we set up complete Google Analytics credentials
export async function fetchGoogleAnalyticsData(
  timeframe: string = 'last30days',
  userId?: string
): Promise<ProcessedAnalyticsData> {
  // In a real implementation, this would call the Google Analytics API
  // using the Google Analytics Data API (Analytics Data API v1)
  
  try {
    // For now, return demo data with randomized values for each client
    // In a production app, you would use proper GA authentication and API
    const daysCount = timeframe === 'last7days' ? 7 : timeframe === 'last30days' ? 30 : 90;
    
    // Generate dates for the selected timeframe
    const dates: string[] = [];
    const now = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(formatDate(date));
    }
    
    // Generate random but realistic-looking data
    // If userId is provided, use it as a seed for randomization to keep consistent data per client
    const seed = userId ? hashString(userId) : Math.floor(Math.random() * 1000);
    const baseVisitors = 10 + (seed % 40);  // Between 10 and 50 base visitors
    
    const pageViews: number[] = [];
    const visitors: number[] = [];
    const sessions: number[] = [];
    
    let totalPageViews = 0;
    let totalVisitors = 0;
    let totalSessions = 0;
    
    for (let i = 0; i < daysCount; i++) {
      // Create somewhat realistic patterns with weekend dips
      const dayOfWeek = new Date(dates[i]).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayFactor = isWeekend ? 0.7 : 1.0;
      
      // Add some randomness but keep a general trend
      const dailyVisitors = Math.floor((baseVisitors * dayFactor) * (0.8 + (Math.random() * 0.4)));
      const sessionsPerVisitor = 1.2 + (Math.random() * 0.6); // 1.2 to 1.8 sessions per visitor
      const pagesPerSession = 2.0 + (Math.random() * 2.0);    // 2 to 4 pages per session
      
      const dailySessions = Math.floor(dailyVisitors * sessionsPerVisitor);
      const dailyPageViews = Math.floor(dailySessions * pagesPerSession);
      
      visitors.push(dailyVisitors);
      sessions.push(dailySessions);
      pageViews.push(dailyPageViews);
      
      totalVisitors += dailyVisitors;
      totalSessions += dailySessions;
      totalPageViews += dailyPageViews;
    }
    
    // Create realistic bounce rate and session duration
    const bounceRate = 55 + (Math.random() * 20); // Between 55% and 75%
    const avgSessionDuration = 60 + (Math.random() * 120); // Between 60 and 180 seconds
    
    return {
      dates,
      pageViews,
      visitors,
      sessions,
      totals: {
        pageViews: totalPageViews,
        visitors: totalVisitors,
        sessions: totalSessions,
        bounceRate,
        avgSessionDuration
      }
    };
    
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    throw error;
  }
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Simple hash function to generate a number from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}