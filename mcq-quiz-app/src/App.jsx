import React, { useState, useEffect } from 'react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AccountSettings from './components/AccountSettings';
import QuizSection from './components/QuizSection';
import './App.css';

// Add this question pool outside your App component
const questionPool = {
  "Web Development": [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyperlink Text Management Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: "Hyper Text Markup Language"
    },
    {
      question: "Which CSS property is used to change the text color?",
      options: ["color", "text-color", "font-color", "text-style"],
      correctAnswer: "color"
    },
    {
      question: "What is the purpose of JavaScript's 'querySelector'?",
      options: [
        "To select and modify HTML elements",
        "To create new HTML elements",
        "To delete HTML elements",
        "To style HTML elements"
      ],
      correctAnswer: "To select and modify HTML elements"
    },
    {
      question: "What is the box model in CSS?",
      options: [
        "A layout model that defines how elements are structured",
        "A JavaScript framework",
        "A type of HTML container",
        "A web browser feature"
      ],
      correctAnswer: "A layout model that defines how elements are structured"
    },
    {
      question: "What is React.js?",
      options: [
        "A JavaScript library for building user interfaces",
        "A database management system",
        "A web server",
        "A programming language"
      ],
      correctAnswer: "A JavaScript library for building user interfaces"
    },
    {
      question: "What is the purpose of npm?",
      options: [
        "Package manager for Node.js",
        "Web browser",
        "Programming language",
        "Database system"
      ],
      correctAnswer: "Package manager for Node.js"
    },
    {
      question: "What is responsive design?",
      options: [
        "Design that adapts to different screen sizes",
        "Fast-loading websites",
        "Interactive websites",
        "Colorful websites"
      ],
      correctAnswer: "Design that adapts to different screen sizes"
    },
    {
      question: "What is the purpose of API?",
      options: [
        "To allow different software to communicate",
        "To style web pages",
        "To create databases",
        "To write HTML"
      ],
      correctAnswer: "To allow different software to communicate"
    }
  ],
  "Game Development": [
    {
      question: "What is Unity primarily used for?",
      options: [
        "Game development",
        "Web development",
        "Mobile app development",
        "Database management"
      ],
      correctAnswer: "Game development"
    },
    {
      question: "What is a game loop?",
      options: [
        "The main execution cycle of a game",
        "A type of game level",
        "A programming error",
        "A game controller"
      ],
      correctAnswer: "The main execution cycle of a game"
    },
    {
      question: "What is collision detection?",
      options: [
        "Detecting when game objects intersect",
        "Finding bugs in game code",
        "Detecting game crashes",
        "Testing game performance"
      ],
      correctAnswer: "Detecting when game objects intersect"
    },
    {
      question: "What is a sprite in game development?",
      options: [
        "A 2D graphic object",
        "A game character",
        "A sound effect",
        "A game level"
      ],
      correctAnswer: "A 2D graphic object"
    },
    {
      question: "What is ray casting used for in games?",
      options: [
        "Calculating object intersections and visibility",
        "Creating 3D models",
        "Playing sound effects",
        "Saving game progress"
      ],
      correctAnswer: "Calculating object intersections and visibility"
    },
    {
      question: "What is a game engine?",
      options: [
        "Software framework for game development",
        "A type of gaming console",
        "A game controller",
        "A graphics card"
      ],
      correctAnswer: "Software framework for game development"
    }
  ],
  "Data Structures": [
    {
      question: "What is a stack data structure?",
      options: [
        "LIFO data structure",
        "FIFO data structure",
        "Random access structure",
        "Hierarchical structure"
      ],
      correctAnswer: "LIFO data structure"
    },
    {
      question: "What is a queue data structure?",
      options: [
        "FIFO data structure",
        "LIFO data structure",
        "Random access structure",
        "Tree structure"
      ],
      correctAnswer: "FIFO data structure"
    },
    {
      question: "What is a binary tree?",
      options: [
        "A tree with at most 2 children per node",
        "A tree with exactly 2 nodes",
        "A tree with only binary numbers",
        "A type of sorting algorithm"
      ],
      correctAnswer: "A tree with at most 2 children per node"
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)"
    },
    {
      question: "What is a hash table?",
      options: [
        "Data structure that maps keys to values",
        "Sorting algorithm",
        "Type of tree",
        "Linear data structure"
      ],
      correctAnswer: "Data structure that maps keys to values"
    },
    {
      question: "What is a linked list?",
      options: [
        "Sequential collection of elements",
        "Array of integers",
        "Type of sorting algorithm",
        "Binary tree variant"
      ],
      correctAnswer: "Sequential collection of elements"
    },
    {
      question: "What is the advantage of a balanced tree?",
      options: [
        "Guaranteed O(log n) operations",
        "Uses less memory",
        "Faster insertion",
        "Simpler implementation"
      ],
      correctAnswer: "Guaranteed O(log n) operations"
    }
  ]
};

function App() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentView, setCurrentView] = useState('login');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [scoreHistory, setScoreHistory] = useState(() => {
    // Load score history from localStorage if it exists
    const saved = localStorage.getItem('quizScoreHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('quiz');
  
  // Sample topics
  const topics = ["Web Development", "Game Development", "Data Structures"];
  
  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  // Modified generateQuestions function
  const generateQuestions = (topic) => {
    const topicQuestions = questionPool[topic];
    if (!topicQuestions) return [];

    // Create a copy of the questions array and shuffle it
    const shuffledQuestions = shuffleArray([...topicQuestions]);
    
    // Take first 5 questions (or however many you want)
    return shuffledQuestions.slice(0, 5).map((q, index) => ({
      ...q,
      id: index + 1,
      options: shuffleArray([...q.options]) // Shuffle options too
    }));
  };
  
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    const newQuestions = generateQuestions(topic);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setCurrentView('quiz');
  };
  
  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: option
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleLoginSuccess = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setActiveTab('quiz');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleSignupSuccess = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setActiveTab('quiz');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogout = () => {
    try {
      setUser(null);
      setCurrentView('login');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const calculateScore = async () => {
    let newScore = 0;
    questions.forEach(question => {
      if (selectedOptions[question.id] === question.correctAnswer) {
        newScore += 1;
      }
    });
    
    setScore(newScore);

    // Save result to backend with auth token
    try {
      const token = localStorage.getItem('quizToken');
      await fetch('http://localhost:5000/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: selectedTopic,
          score: newScore,
          questions: questions
        }),
      });
    } catch (error) {
      console.error('Failed to save result:', error);
    }

    setCurrentView('results');
  };
  
  const handleReturnHome = () => {
    setCurrentView('topics');
    setSelectedTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setScore(0);
  };
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Safely handle local storage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      localStorage.removeItem('user');
    }
  }, []);
  
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Function to handle tab switching
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="app-layout">
      {!user ? (
        <div className="auth-page">
          <h1>Interactive Quiz App</h1>
          {currentView === 'login' ? (
            <LoginForm 
              onSwitch={() => setCurrentView('signup')}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <SignupForm 
              onSwitch={() => setCurrentView('login')}
              onSignupSuccess={handleSignupSuccess}
            />
          )}
        </div>
      ) : (
        <>
          <Header 
            user={user} 
            onLogout={handleLogout}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="main-content">
            {activeTab === 'quiz' && (
              <QuizSection user={user} />
            )}
            {activeTab === 'dashboard' && (
              <Dashboard user={user} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Add Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#666' 
        }}>
          <h2>Something went wrong.</h2>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '10px 20px',
              margin: '10px',
              border: 'none',
              borderRadius: '5px',
              background: '#ff7043',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Reset App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the App component with ErrorBoundary
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;