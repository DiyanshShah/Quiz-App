import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [useFallbackData, setUseFallbackData] = useState(false);

  // Listen for quiz completion events
  useEffect(() => {
    const handleQuizComplete = () => {
      console.log("Dashboard detected quiz completion, refreshing stats...");
      fetchUserStats();
    };
    
    // Add event listener
    window.addEventListener('quiz-completed', handleQuizComplete);
    
    // Clean up
    return () => {
      window.removeEventListener('quiz-completed', handleQuizComplete);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  // Fallback data in case the API fails
  const generateFallbackData = () => {
    const now = Date.now();
    return {
      username: user.username,
      quiz_results: [
        {
          topic: 'Web Development',
          score: 8,
          total: 10,
          timestamp: now - 3600000
        },
        {
          topic: 'Data Structures',
          score: 7,
          total: 10,
          timestamp: now - 7200000
        }
      ],
      total_quizzes: 2,
      topics_taken: ['Web Development', 'Data Structures'],
      total_questions: 20,
      total_correct: 15
    };
  };

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log(`Fetching stats for user: ${user.username}`);
      
      // Get the authentication token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      // Try to use the authenticated endpoint first
      if (authToken) {
        try {
          const authResponse = await fetch('http://localhost:5000/api/user/stats', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (authResponse.ok) {
            const data = await authResponse.json();
            console.log('Stats received (authenticated):', data);
            setStats(data);
            setError('');
            setLoading(false);
            return;
          } else {
            console.error('Auth request failed with status:', authResponse.status);
            const errorText = await authResponse.text();
            console.error('Auth error response:', errorText);
          }
          // If auth fails, we'll fall through to the non-authenticated endpoint
        } catch (err) {
          console.error('Error with authenticated request:', err);
          // Continue to try the non-authenticated endpoint
        }
      } else {
        console.log('No auth token found in localStorage');
      }
      
      // Fallback to the non-authenticated endpoint
      const response = await fetch(`http://localhost:5000/api/user_stats/${user.username}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Stats received (non-authenticated):', data);
        setStats(data);
        setError('');
      } else {
        console.error('Failed to load statistics, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError('Failed to load your statistics. Using fallback data.');
        setStats(generateFallbackData());
        setUseFallbackData(true);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error connecting to the server. Using fallback data.');
      setStats(generateFallbackData());
      setUseFallbackData(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall average score percentage
  const calculateOverallAverage = () => {
    if (!stats || !stats.quiz_results || stats.quiz_results.length === 0) {
      return 0;
    }
    
    // Calculate total correct answers and total questions
    const totalCorrect = stats.quiz_results.reduce((sum, result) => sum + result.score, 0);
    const totalQuestions = stats.quiz_results.reduce((sum, result) => sum + result.total, 0);
    
    // Calculate overall percentage based on total correct / total questions
    return ((totalCorrect / totalQuestions) * 100).toFixed(1);
  };

  // Calculate topic-specific stats
  const calculateTopicStats = () => {
    if (!stats || !stats.quiz_results || stats.quiz_results.length === 0) {
      return {};
    }
    
    const topicStats = {};
    
    stats.quiz_results.forEach(result => {
      if (!topicStats[result.topic]) {
        topicStats[result.topic] = {
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0,
          highestScore: 0,
          recentScore: 0
        };
      }
      
      const topic = topicStats[result.topic];
      topic.attempts += 1;
      topic.totalScore += result.score;
      topic.totalQuestions += result.total;
      topic.highestScore = Math.max(topic.highestScore, result.score);
      topic.recentScore = result.score; // Assuming results are in chronological order
    });
    
    // Calculate averages
    Object.keys(topicStats).forEach(topic => {
      const stats = topicStats[topic];
      // Calculate percentage as (total correct / total questions) * 100
      stats.averagePercentage = ((stats.totalScore / stats.totalQuestions) * 100).toFixed(1);
    });
    
    return topicStats;
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading your statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
        <button className="retry-button" onClick={fetchUserStats}>Try Again</button>
      </div>
    );
  }

  // If no stats yet
  if (!stats || !stats.quiz_results || stats.quiz_results.length === 0) {
    return (
      <div className="dashboard-container">
        <h2>Your Dashboard</h2>
        <div className="no-stats-message">
          <p>You haven't taken any quizzes yet.</p>
          <p>Complete some quizzes to see your performance statistics!</p>
        </div>
      </div>
    );
  }

  const overallAverage = calculateOverallAverage();
  const topicStats = calculateTopicStats();
  
  return (
    <div className="dashboard-container">
      <h2>Your Performance Dashboard</h2>
      
      {useFallbackData && (
        <div className="fallback-data-notice">
          Using sample data for demonstration. Your real quiz results will appear here after completing quizzes.
        </div>
      )}
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Quiz History
        </button>
        <button 
          className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          Topic Analysis
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div className="dashboard-overview">
          <div className="stats-card overall-stats">
            <h3>Overall Performance</h3>
            <div className="stat-circle">
              <div className="stat-value">{overallAverage}%</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stats-summary">
              <div className="stat-item">
                <div className="stat-number">{stats.quiz_results.length}</div>
                <div className="stat-label">Quizzes Taken</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {stats.quiz_results.reduce((sum, result) => sum + result.score, 0)}
                </div>
                <div className="stat-label">Total Correct Answers</div>
              </div>
            </div>
          </div>
          
          <div className="stats-row">
            {Object.keys(topicStats).map(topic => (
              <div className="stats-card topic-card" key={topic}>
                <h3>{topic}</h3>
                <div className="topic-stats">
                  <div className="stat-item">
                    <div className="stat-number">{topicStats[topic].attempts}</div>
                    <div className="stat-label">Attempts</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{topicStats[topic].averagePercentage}%</div>
                    <div className="stat-label">Average Score</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{topicStats[topic].highestScore}</div>
                    <div className="stat-label">Highest Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="stats-card recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {stats.quiz_results.slice(-3).reverse().map((result, index) => (
                <div className="activity-item" key={index}>
                  <div className="activity-topic">{result.topic}</div>
                  <div className="activity-score">
                    Score: {result.score}/{result.total} 
                    ({((result.score / result.total) * 100).toFixed(0)}%)
                  </div>
                  <div className="activity-date">{formatDate(result.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'history' && (
        <div className="quiz-history">
          <h3>Your Quiz History</h3>
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.quiz_results.slice().reverse().map((result, index) => (
                  <tr key={index}>
                    <td>{formatDate(result.timestamp)}</td>
                    <td>{result.topic}</td>
                    <td>{result.score}/{result.total}</td>
                    <td>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill" 
                          style={{width: `${(result.score / result.total) * 100}%`}}
                        ></div>
                        <span className="percentage-text">
                          {((result.score / result.total) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'topics' && (
        <div className="topic-analysis">
          <h3>Performance by Topic</h3>
          <div className="topics-grid">
            {Object.keys(topicStats).map(topic => (
              <div className="topic-analysis-card" key={topic}>
                <div className="topic-header">
                  <h4>{topic}</h4>
                  <div className="topic-attempts">{topicStats[topic].attempts} quizzes</div>
                </div>
                
                <div className="topic-progress">
                  <div className="progress-label">Average: {topicStats[topic].averagePercentage}%</div>
                  <div className="topic-progress-bar">
                    <div 
                      className="topic-progress-fill" 
                      style={{width: `${topicStats[topic].averagePercentage}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="topic-stats-detail">
                  <div className="detail-item">
                    <div className="detail-label">Highest Score</div>
                    <div className="detail-value">{topicStats[topic].highestScore}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Total Correct</div>
                    <div className="detail-value">{topicStats[topic].totalScore}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Questions Answered</div>
                    <div className="detail-value">{topicStats[topic].totalQuestions}</div>
                  </div>
                </div>
                
                <div className="topic-recommendation">
                  {topicStats[topic].averagePercentage >= 80 ? (
                    <div className="recommendation excellent">
                      Excellent work! You've mastered this topic.
                    </div>
                  ) : topicStats[topic].averagePercentage >= 60 ? (
                    <div className="recommendation good">
                      Good progress! Keep practicing to improve further.
                    </div>
                  ) : (
                    <div className="recommendation needs-work">
                      This topic needs more attention. Keep practicing!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
