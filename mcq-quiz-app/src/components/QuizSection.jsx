import { useState, useEffect } from 'react';
import '../styles/QuizSection.css';

const QuizSection = ({ user }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // The original topics as specified
  const topics = [
    'Web Development', 
    'Game Development', 
    'Data Structures'
  ];
  
  // Question banks for each topic - larger sets to allow for randomization
  const questionBanks = {
    'Web Development': [
      {
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Multi Language',
          'Hyper Transfer Markup Language',
          'Hybrid Text Management Language'
        ],
        correctAnswer: 'Hyper Text Markup Language'
      },
      {
        question: 'Which CSS property is used to control the text size?',
        options: [
          'text-size',
          'font-size',
          'text-style',
          'font-style'
        ],
        correctAnswer: 'font-size'
      },
      {
        question: 'Which JavaScript method is used to access an HTML element by its ID?',
        options: [
          'getElementById()',
          'getElement()',
          'findElementById()',
          'querySelector()'
        ],
        correctAnswer: 'getElementById()'
      },
      {
        question: 'What is the purpose of the <meta> tag in HTML?',
        options: [
          'To display metadata visually on the page',
          'To define the main content of the page',
          'To provide metadata about the HTML document',
          'To link to external resources'
        ],
        correctAnswer: 'To provide metadata about the HTML document'
      },
      {
        question: 'Which of the following is a CSS preprocessor?',
        options: [
          'jQuery',
          'SASS',
          'React',
          'TypeScript'
        ],
        correctAnswer: 'SASS'
      },
      {
        question: 'What is the purpose of the "viewport" meta tag?',
        options: [
          'To enhance website security',
          'To improve search engine ranking',
          'To control layout on mobile browsers',
          'To define the website\'s language'
        ],
        correctAnswer: 'To control layout on mobile browsers'
      },
      {
        question: 'What is the main purpose of React.js?',
        options: [
          'Server-side scripting',
          'Database management',
          'Building user interfaces',
          'Network security'
        ],
        correctAnswer: 'Building user interfaces'
      },
      {
        question: 'Which HTTP method is typically used to submit form data?',
        options: [
          'GET',
          'POST',
          'DELETE',
          'PUT'
        ],
        correctAnswer: 'POST'
      },
      {
        question: 'What is a REST API?',
        options: [
          'A type of JavaScript framework',
          'A standardized approach to building web APIs',
          'A database system',
          'A CSS extension'
        ],
        correctAnswer: 'A standardized approach to building web APIs'
      },
      {
        question: 'Which technology is primarily used for web page styling?',
        options: [
          'HTML',
          'JavaScript',
          'CSS',
          'XML'
        ],
        correctAnswer: 'CSS'
      },
      {
        question: 'What is the purpose of localStorage in web development?',
        options: [
          'To store styles locally',
          'To store data in user\'s browser',
          'To improve rendering performance',
          'To create local server connections'
        ],
        correctAnswer: 'To store data in user\'s browser'
      },
      {
        question: 'Which JavaScript function is used to delay execution of code?',
        options: [
          'wait()',
          'setTimeout()',
          'delay()',
          'pause()'
        ],
        correctAnswer: 'setTimeout()'
      },
      {
        question: 'What is the correct way to include an external JavaScript file?',
        options: [
          '<script href="script.js"></script>',
          '<script link="script.js"></script>',
          '<script src="script.js"></script>',
          '<javascript src="script.js"></javascript>'
        ],
        correctAnswer: '<script src="script.js"></script>'
      },
      {
        question: 'What is responsive web design?',
        options: [
          'Websites that load quickly',
          'Websites that respond to user inputs',
          'Websites that adapt to different screen sizes',
          'Websites with animations'
        ],
        correctAnswer: 'Websites that adapt to different screen sizes'
      },
      {
        question: 'Which of the following is NOT a JavaScript framework?',
        options: [
          'Angular',
          'Vue',
          'React',
          'SASS'
        ],
        correctAnswer: 'SASS'
      }
    ],
    'Game Development': [
      {
        question: 'Which of the following is a popular game engine?',
        options: [
          'jQuery',
          'Unity',
          'Angular',
          'Django'
        ],
        correctAnswer: 'Unity'
      },
      {
        question: 'What programming language is commonly used in Unity game development?',
        options: [
          'Java',
          'Python',
          'C#',
          'Ruby'
        ],
        correctAnswer: 'C#'
      },
      {
        question: 'What is a "sprite" in game development?',
        options: [
          'A type of bug',
          'A 2D graphic object',
          'A game character',
          'A sound effect'
        ],
        correctAnswer: 'A 2D graphic object'
      },
      {
        question: 'What is "physics engine" in game development?',
        options: [
          'Software that simulates physics',
          'A hardware component',
          'A teaching tool for physics',
          'A type of game genre'
        ],
        correctAnswer: 'Software that simulates physics'
      },
      {
        question: 'What does "FPS" commonly stand for in gaming?',
        options: [
          'First Person Shooter',
          'Frames Per Second',
          'Final Player Score',
          'Both A and B'
        ],
        correctAnswer: 'Frames Per Second'
      },
      {
        question: 'What is "procedural generation" in game development?',
        options: [
          'A bug testing technique',
          'A method for creating content algorithmically',
          'A type of game storyline',
          'A programming language'
        ],
        correctAnswer: 'A method for creating content algorithmically'
      },
      {
        question: 'Which of these is a 3D modeling software used in game development?',
        options: [
          'Photoshop',
          'Blender',
          'Excel',
          'Notepad'
        ],
        correctAnswer: 'Blender'
      },
      {
        question: 'What is ray tracing in game development?',
        options: [
          'A rendering technique that simulates light rays',
          'A method for tracking player movements',
          'A way to detect bugs in code',
          'A technique for creating NPC paths'
        ],
        correctAnswer: 'A rendering technique that simulates light rays'
      },
      {
        question: 'What is a "game loop"?',
        options: [
          'A repetitive game story',
          'A circular level design',
          'The main execution loop that runs continuously while a game is playing',
          'A technique to make players addicted'
        ],
        correctAnswer: 'The main execution loop that runs continuously while a game is playing'
      },
      {
        question: 'What does "AI" refer to in game development?',
        options: [
          'Audio Interface',
          'Artificial Intelligence',
          'Animation Integration',
          'Asset Installation'
        ],
        correctAnswer: 'Artificial Intelligence'
      },
      {
        question: 'What are "shaders" used for in game development?',
        options: [
          'Creating shadows only',
          'Determining how surfaces appear when rendered',
          'Protecting game code from hackers',
          'Preventing screen glare'
        ],
        correctAnswer: 'Determining how surfaces appear when rendered'
      },
      {
        question: 'What is a "hitbox" in game development?',
        options: [
          'A loot box containing weapons',
          'An invisible shape used for collision detection',
          'A box that shows damage points',
          'A type of user interface element'
        ],
        correctAnswer: 'An invisible shape used for collision detection'
      },
      {
        question: 'Which of these is NOT typically considered a game genre?',
        options: [
          'RPG (Role-Playing Game)',
          'FPS (First-Person Shooter)',
          'IDE (Integrated Development Environment)',
          'RTS (Real-Time Strategy)'
        ],
        correctAnswer: 'IDE (Integrated Development Environment)'
      },
      {
        question: 'What is "level design" in game development?',
        options: [
          'The process of creating content difficulty tiers',
          'Designing the game\'s programming architecture',
          'Creating environments and challenges for players',
          'Designing the structure of game levels'
        ],
        correctAnswer: 'Designing the structure of game levels'
      },
      {
        question: 'What is a "game asset"?',
        options: [
          'A component used to create a game',
          'A financial investment in game companies',
          'A special ability of a game character',
          'A game\'s monetary value'
        ],
        correctAnswer: 'A component used to create a game'
      }
    ],
    'Data Structures': [
      {
        question: 'Which of the following is a linear data structure?',
        options: [
          'Tree',
          'Graph',
          'Array',
          'Heap'
        ],
        correctAnswer: 'Array'
      },
      {
        question: 'What is the time complexity of binary search?',
        options: [
          'O(n)',
          'O(log n)',
          'O(n²)',
          'O(n log n)'
        ],
        correctAnswer: 'O(log n)'
      },
      {
        question: 'Which data structure operates on a LIFO principle?',
        options: [
          'Queue',
          'Stack',
          'Linked List',
          'Tree'
        ],
        correctAnswer: 'Stack'
      },
      {
        question: 'What is a hash table used for?',
        options: [
          'Sorting data',
          'Fast data retrieval',
          'Hierarchical data storage',
          'Sequential data access'
        ],
        correctAnswer: 'Fast data retrieval'
      },
      {
        question: 'Which data structure is best for representing hierarchical relationships?',
        options: [
          'Array',
          'Queue',
          'Stack',
          'Tree'
        ],
        correctAnswer: 'Tree'
      },
      {
        question: 'What is the time complexity of inserting an element at the end of an array?',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n²)'
        ],
        correctAnswer: 'O(1)'
      },
      {
        question: 'Which of the following is NOT a type of queue?',
        options: [
          'Priority Queue',
          'Circular Queue',
          'Double Ended Queue (Deque)',
          'Sorted Queue'
        ],
        correctAnswer: 'Sorted Queue'
      },
      {
        question: 'What is the primary advantage of a linked list over an array?',
        options: [
          'Faster access to elements',
          'Less memory usage',
          'Dynamic size',
          'Simpler implementation'
        ],
        correctAnswer: 'Dynamic size'
      },
      {
        question: 'What is a balanced tree?',
        options: [
          'A tree with equal number of left and right nodes',
          'A tree where the difference in height between subtrees is limited',
          'A tree with all leaf nodes at the same level',
          'A tree with equal number of nodes in all levels'
        ],
        correctAnswer: 'A tree where the difference in height between subtrees is limited'
      },
      {
        question: 'Which sorting algorithm has the best average time complexity?',
        options: [
          'Bubble Sort',
          'Selection Sort',
          'Quick Sort',
          'Insertion Sort'
        ],
        correctAnswer: 'Quick Sort'
      },
      {
        question: 'What is a graph used to represent?',
        options: [
          'Hierarchical data',
          'Sequential data',
          'Relationships between objects',
          'Sorted data'
        ],
        correctAnswer: 'Relationships between objects'
      },
      {
        question: 'What is the primary purpose of a binary search tree?',
        options: [
          'Fast insertion and deletion',
          'Efficient searching',
          'Memory optimization',
          'Data compression'
        ],
        correctAnswer: 'Efficient searching'
      },
      {
        question: 'Which of these is NOT an advantage of using a heap?',
        options: [
          'Quick access to the maximum or minimum element',
          'Efficient insertion',
          'Fast random access to any element',
          'Memory efficiency'
        ],
        correctAnswer: 'Fast random access to any element'
      },
      {
        question: 'What is the space complexity of an adjacency matrix for a graph with n vertices?',
        options: [
          'O(n)',
          'O(n²)',
          'O(e) where e is the number of edges',
          'O(n+e)'
        ],
        correctAnswer: 'O(n²)'
      },
      {
        question: 'Which data structure would be most efficient for implementing a dictionary?',
        options: [
          'Array',
          'Linked List',
          'Hash Table',
          'Stack'
        ],
        correctAnswer: 'Hash Table'
      }
    ]
  };
  
  // Function to get random questions
  const getRandomQuestions = (topic, count = 10) => {
    const allQuestions = questionBanks[topic];
    
    // Shuffle the questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    
    // Return the first 'count' questions
    return shuffled.slice(0, count);
  };
  
  // Handle topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setQuestions(getRandomQuestions(topic));
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setLoading(false);
  };
  
  // Handle answer selection
  const handleAnswerClick = (selectedOption) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    // Update score if correct
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    // Move to the next question or show final score
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        // Quiz finished, save results with the updated score
        saveQuizResult(newScore);
        setShowScore(true);
      }
    }, 500);
  };
  
  // Save quiz results to backend
  const saveQuizResult = async (finalScore) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Get authentication token if available
      const authToken = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      // Use the passed-in finalScore which has the correct total
      // If no finalScore is passed, use the state score
      const scoreToSave = finalScore !== undefined ? finalScore : score;
      
      // Prepare data to save
      const resultData = {
        username: user.username,
        topic: selectedTopic,
        score: scoreToSave,
        total: questions.length
      };
      
      console.log('Saving quiz result:', resultData);
      
      // Try authenticated endpoint first
      if (authToken) {
        try {
          const response = await fetch('http://localhost:5000/api/save-result', {
            method: 'POST',
            headers,
            body: JSON.stringify(resultData)
          });
          
          if (response.ok) {
            console.log('Quiz result saved successfully (authenticated)');
            // Dispatch event to notify dashboard to refresh
            window.dispatchEvent(new Event('quiz-completed'));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error saving result (authenticated):', err);
          // Fall through to non-authenticated endpoint
        }
      }
      
      // Fall back to non-authenticated endpoint
      const response = await fetch('http://localhost:5000/api/save_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultData)
      });
      
      if (response.ok) {
        console.log('Quiz result saved successfully');
        // Dispatch event to notify dashboard to refresh
        window.dispatchEvent(new Event('quiz-completed'));
      } else {
        console.error('Failed to save quiz result:', await response.text());
      }
    } catch (err) {
      console.error('Error saving quiz result:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset quiz and go back to topic selection
  const resetQuiz = () => {
    setSelectedTopic('');
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };
  
  return (
    <div className="quiz-section">
      <h2>Interactive Quiz</h2>
      
      {!selectedTopic ? (
        <div className="topic-selection">
          <h2>Select a topic</h2>
          <div className="topic-grid">
            {topics.map((topic) => (
              <button 
                key={topic} 
                className="topic-button"
                onClick={() => handleTopicSelect(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz-container">
          {showScore ? (
            <div className="score-section">
              <h2>Quiz Completed!</h2>
              <p className="score-text">
                You scored {score} out of {questions.length}
              </p>
              <div className="feedback">
                {score === questions.length ? (
                  <p className="perfect-score">Perfect score! You're a {selectedTopic} expert!</p>
                ) : score >= questions.length * 0.7 ? (
                  <p className="good-score">Great job! You know {selectedTopic} well!</p>
                ) : score >= questions.length * 0.4 ? (
                  <p className="average-score">Not bad, but there's room for improvement.</p>
                ) : (
                  <p className="low-score">Keep studying {selectedTopic} to improve your knowledge.</p>
                )}
              </div>
              <button 
                className="retry-button"
                onClick={() => handleTopicSelect(selectedTopic)}
              >
                Retry This Topic
              </button>
              <button 
                className="new-topic-button"
                onClick={resetQuiz}
              >
                Choose New Topic
              </button>
            </div>
          ) : (
            <>
              <div className="question-header">
                <h3>{selectedTopic} Quiz</h3>
                <div className="question-counter">
                  Question {currentQuestion + 1}/{questions.length}
                </div>
              </div>
              
              <div className="question-card">
                <p className="question-text">
                  {questions[currentQuestion]?.question}
                </p>
                <div className="options-container">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <button
                      key={index}
                      className="option-button"
                      onClick={() => handleAnswerClick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${(currentQuestion / questions.length) * 100}%`}}
                ></div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizSection;
