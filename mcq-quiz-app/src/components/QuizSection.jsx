import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/QuizSection.css';

const QuizSection = () => {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Enhanced topics with additional metadata
  const topicsData = [
    {
      id: 'web-development',
      name: 'Web Development',
      icon: '🌐',
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
      description: 'Test your knowledge of HTML, CSS, JavaScript, and modern web frameworks.'
    }, 
    {
      id: 'game-development',
      name: 'Game Development',
      icon: '🎮',
      color: '#7E57C2',
      gradient: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
      description: 'Challenge yourself with questions about game engines, design principles, and more.'
    }, 
    {
      id: 'data-structures',
      name: 'Data Structures',
      icon: '📊',
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      description: 'Explore your understanding of fundamental data structures and algorithms.'
    }
  ];
  
  // Get topic data by name
  const getTopicData = (topicName) => {
    return topicsData.find(topic => topic.name === topicName) || topicsData[0];
  };
  
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
      },
      {
        question: 'What is the purpose of the "defer" attribute in a script tag?',
        options: [
          'Prevents the script from loading',
          'Delays script execution until after the page has parsed',
          'Makes the script download faster',
          'Enables asynchronous loading for older browsers'
        ],
        correctAnswer: 'Delays script execution until after the page has parsed'
      },
      {
        question: 'Which CSS property is used to create a flexible box layout?',
        options: [
          'flex',
          'grid',
          'block',
          'float'
        ],
        correctAnswer: 'flex'
      },
      {
        question: 'What is the purpose of a CSS media query?',
        options: [
          'To query a media database',
          'To apply styles based on device characteristics',
          'To embed media files in a webpage',
          'To load external media resources'
        ],
        correctAnswer: 'To apply styles based on device characteristics'
      },
      {
        question: 'What is WebAssembly?',
        options: [
          'A framework for web components',
          'An assembly language for the web',
          'A low-level binary format for the browser',
          'A JavaScript library for DOM manipulation'
        ],
        correctAnswer: 'A low-level binary format for the browser'
      },
      {
        question: 'Which JavaScript method is used to add a new element at the end of an array?',
        options: [
          'push()',
          'append()',
          'add()',
          'insert()'
        ],
        correctAnswer: 'push()'
      },
      {
        question: 'What is the role of Redux in a React application?',
        options: [
          'To handle routing',
          'To manage global state',
          'To optimize rendering',
          'To fetch data from APIs'
        ],
        correctAnswer: 'To manage global state'
      },
      {
        question: 'What is CORS in web development?',
        options: [
          'A CSS framework',
          'A JavaScript runtime',
          'A security feature restricting resource access',
          'A website optimization technique'
        ],
        correctAnswer: 'A security feature restricting resource access'
      },
      {
        question: 'Which of the following is used to store client-side data that persists after page refresh?',
        options: [
          'localStorage',
          'cookies',
          'sessionStorage',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        question: 'What is the purpose of a Progressive Web App (PWA)?',
        options: [
          'To create native mobile experiences on the web',
          'To progressively enhance websites',
          'To load content gradually',
          'To optimize SEO rankings'
        ],
        correctAnswer: 'To create native mobile experiences on the web'
      },
      {
        question: 'Which tool is commonly used for JavaScript unit testing?',
        options: [
          'Jest',
          'Webpack',
          'Babel',
          'ESLint'
        ],
        correctAnswer: 'Jest'
      },
      {
        question: 'What does the "async" keyword do in JavaScript?',
        options: [
          'Makes functions run in parallel',
          'Makes a function return a Promise',
          'Automatically handles errors in functions',
          'Improves function performance'
        ],
        correctAnswer: 'Makes a function return a Promise'
      },
      {
        question: 'Which HTTP status code indicates a successful request?',
        options: [
          '200',
          '404',
          '500',
          '301'
        ],
        correctAnswer: '200'
      },
      {
        question: 'What is a Service Worker in web development?',
        options: [
          'A JavaScript library for web services',
          'A script that runs in the background separate from a webpage',
          'A type of web server',
          'A worker thread in multi-threading JavaScript'
        ],
        correctAnswer: 'A script that runs in the background separate from a webpage'
      },
      {
        question: 'What is the purpose of GraphQL?',
        options: [
          'To create visual charts in web applications',
          'To query and manipulate data from multiple sources with a single API',
          'To optimize SQL database queries',
          'To generate graph-based data structures'
        ],
        correctAnswer: 'To query and manipulate data from multiple sources with a single API'
      },
      {
        question: 'Which of the following is a JavaScript build tool?',
        options: [
          'Webpack',
          'React',
          'Node.js',
          'Express'
        ],
        correctAnswer: 'Webpack'
      },
      {
        question: 'What is the purpose of the "srcset" attribute in an image tag?',
        options: [
          'To provide multiple sources for video files',
          'To provide alternative image sources for different device resolutions',
          'To set the source of an image',
          'To preload images for faster rendering'
        ],
        correctAnswer: 'To provide alternative image sources for different device resolutions'
      },
      {
        question: 'Which CSS property is used to create a grid layout?',
        options: [
          'grid',
          'flex',
          'table',
          'block'
        ],
        correctAnswer: 'grid'
      },
      {
        question: 'What is the purpose of the "aria-label" attribute?',
        options: [
          'To provide text labels for forms',
          'To label elements for styling purposes',
          'To provide accessible names for elements',
          'To add metadata to HTML elements'
        ],
        correctAnswer: 'To provide accessible names for elements'
      },
      {
        question: 'What is a JWT (JSON Web Token)?',
        options: [
          'A JavaScript framework',
          'A JSON-based open standard for authentication',
          'A tool for validating JSON data',
          'A type of web server'
        ],
        correctAnswer: 'A JSON-based open standard for authentication'
      },
      {
        question: 'What is the purpose of the "preload" resource hint?',
        options: [
          'To indicate resources that should be loaded before the page displays',
          'To prevent resources from loading',
          'To optimize image loading',
          'To prioritize JavaScript execution'
        ],
        correctAnswer: 'To indicate resources that should be loaded before the page displays'
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
      },
      {
        question: 'What is a "rigidbody" in game physics?',
        options: [
          'A character with a muscular physique',
          'A simulated physical object affected by forces',
          'A game asset with fixed position',
          'A type of collision detection'
        ],
        correctAnswer: 'A simulated physical object affected by forces'
      },
      {
        question: 'What is "procedural generation" in game development?',
        options: [
          'A method to create content algorithmically',
          'A step-by-step development process',
          'A technique for optimizing game procedures',
          'A debugging method'
        ],
        correctAnswer: 'A method to create content algorithmically'
      },
      {
        question: 'What is "ray casting" used for in games?',
        options: [
          'Creating lighting effects',
          'Detecting objects along a ray',
          'Generating 3D models',
          'Creating particle effects'
        ],
        correctAnswer: 'Detecting objects along a ray'
      },
      {
        question: 'Which programming pattern is commonly used for handling game states?',
        options: [
          'Observer Pattern',
          'Factory Pattern',
          'State Pattern',
          'Singleton Pattern'
        ],
        correctAnswer: 'State Pattern'
      },
      {
        question: 'What is the purpose of "delta time" in game development?',
        options: [
          'To calculate high scores',
          'To ensure consistent movement regardless of frame rate',
          'To track changes in player position',
          'To measure loading times'
        ],
        correctAnswer: 'To ensure consistent movement regardless of frame rate'
      },
      {
        question: 'What is a "navmesh" in game development?',
        options: [
          'A network communication protocol',
          'A data structure for pathfinding',
          'A user interface element',
          'A technique for rendering meshes'
        ],
        correctAnswer: 'A data structure for pathfinding'
      },
      {
        question: 'What is "LOD" in game development?',
        options: [
          'Level of Detail',
          'Limit of Distance',
          'Load on Demand',
          'Layers of Design'
        ],
        correctAnswer: 'Level of Detail'
      },
      {
        question: 'What is the purpose of a "sprite sheet" in 2D game development?',
        options: [
          'To organize character statistics',
          'To combine multiple images into a single image for efficiency',
          'To apply special effects to sprites',
          'To track sprite animations'
        ],
        correctAnswer: 'To combine multiple images into a single image for efficiency'
      },
      {
        question: 'What is "culling" in game rendering?',
        options: [
          'Removing objects not visible to the camera',
          'Selecting the best-performing assets',
          'Eliminating unnecessary code',
          'Reducing texture sizes'
        ],
        correctAnswer: 'Removing objects not visible to the camera'
      },
      {
        question: 'What is a "mesh" in 3D game development?',
        options: [
          'A collection of vertices forming a 3D object',
          'A grid system for level design',
          'A network of game servers',
          'A type of particle effect'
        ],
        correctAnswer: 'A collection of vertices forming a 3D object'
      },
      {
        question: 'What is "tessellation" in game graphics?',
        options: [
          'A technique for creating photo-realistic textures',
          'Subdividing polygons into smaller pieces for detail',
          'A method for compressing game assets',
          'An algorithm for optimizing game performance'
        ],
        correctAnswer: 'Subdividing polygons into smaller pieces for detail'
      },
      {
        question: 'What is the "uncanny valley" in game character design?',
        options: [
          'A region in game maps that causes glitches',
          'A phenomenon where near-realistic human characters appear eerie',
          'A design principle for creating alien characters',
          'A technique for creating horror game environments'
        ],
        correctAnswer: 'A phenomenon where near-realistic human characters appear eerie'
      },
      {
        question: 'What is a "game loop"?',
        options: [
          'A repetitive gameplay mechanic',
          'The main cycle of processing that drives the game',
          'A circular level design',
          'A technique for creating infinite gameplay'
        ],
        correctAnswer: 'The main cycle of processing that drives the game'
      },
      {
        question: 'What is "normal mapping" in game development?',
        options: [
          'A technique to create detailed textures without adding geometry',
          'A method for mapping control schemes',
          'A process for normalizing game difficulty',
          'A way to create standard maps for games'
        ],
        correctAnswer: 'A technique to create detailed textures without adding geometry'
      },
      {
        question: 'What is a "shader graph" in modern game engines?',
        options: [
          'A graphical representation of game performance',
          'A visual programming interface for creating shaders',
          'A chart showing different shade levels in a game',
          'A tool for mapping light sources'
        ],
        correctAnswer: 'A visual programming interface for creating shaders'
      },
      {
        question: 'What is "inverse kinematics" used for in games?',
        options: [
          'Reversing character animations',
          'Calculating appropriate limb positions based on end points',
          'Creating physics-based puzzles',
          'Optimizing collision detection'
        ],
        correctAnswer: 'Calculating appropriate limb positions based on end points'
      },
      {
        question: 'What is "occlusion culling" in game development?',
        options: [
          'A technique for hiding invisible objects for performance',
          'A method for darkening occluded areas',
          'A system for managing object interactions',
          'A process for reducing texture quality at distance'
        ],
        correctAnswer: 'A technique for hiding invisible objects for performance'
      },
      {
        question: 'What is a "texture atlas"?',
        options: [
          'A guide for creating textures',
          'A collection of textures organized by theme',
          'A large image containing multiple smaller textures',
          'A system for mapping textures to 3D models'
        ],
        correctAnswer: 'A large image containing multiple smaller textures'
      },
      {
        question: 'What is the purpose of "ambient occlusion" in game lighting?',
        options: [
          'To create soft shadows in areas where objects meet',
          'To simulate ambient light sources',
          'To reduce the overall brightness of a scene',
          'To create a fog effect in games'
        ],
        correctAnswer: 'To create soft shadows in areas where objects meet'
      },
      {
        question: 'What is "frustum culling" in 3D games?',
        options: [
          'A technique to reduce player frustration',
          'Removing objects outside the camera\'s viewable area',
          'Optimizing textures that cause rendering issues',
          'A method for handling game crashes'
        ],
        correctAnswer: 'Removing objects outside the camera\'s viewable area'
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
      },
      {
        question: 'What is the time complexity of insertion in a balanced binary search tree?',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n²)'
        ],
        correctAnswer: 'O(log n)'
      },
      {
        question: 'Which data structure is best for implementing a priority queue?',
        options: [
          'Linked List',
          'Binary Search Tree',
          'Heap',
          'Hash Table'
        ],
        correctAnswer: 'Heap'
      },
      {
        question: 'What is a B-tree used for?',
        options: [
          'Binary data processing',
          'Efficient storage of data in databases and file systems',
          'Graphical data representation',
          'Memory allocation'
        ],
        correctAnswer: 'Efficient storage of data in databases and file systems'
      },
      {
        question: 'What is the difference between a stack and a queue?',
        options: [
          'Stacks are faster than queues',
          'Stacks use LIFO, queues use FIFO',
          'Stacks store more data than queues',
          'Stacks are for primitive types, queues for objects'
        ],
        correctAnswer: 'Stacks use LIFO, queues use FIFO'
      },
      {
        question: 'What is a hash collision?',
        options: [
          'When a hash function crashes',
          'When two inputs produce the same hash value',
          'When a hash table becomes full',
          'When a hash can\'t be decrypted'
        ],
        correctAnswer: 'When two inputs produce the same hash value'
      },
      {
        question: 'What is a trie data structure used for?',
        options: [
          'Sorting algorithms',
          'Efficient retrieval of keys in a dataset',
          'Managing tree-based data',
          'Graph traversal'
        ],
        correctAnswer: 'Efficient retrieval of keys in a dataset'
      },
      {
        question: 'Which of the following is NOT a graph traversal algorithm?',
        options: [
          'Breadth-First Search',
          'Depth-First Search',
          'Binary Search',
          'Dijkstra\'s Algorithm'
        ],
        correctAnswer: 'Binary Search'
      },
      {
        question: 'What is a doubly linked list?',
        options: [
          'A linked list with exactly two nodes',
          'A linked list where each node has references to both next and previous nodes',
          'A linked list that can be traversed twice as fast',
          'A linked list that stores twice the data'
        ],
        correctAnswer: 'A linked list where each node has references to both next and previous nodes'
      },
      {
        question: 'What is a min-heap?',
        options: [
          'A heap with the minimum number of elements',
          'A heap where the parent nodes are smaller than or equal to their children',
          'A heap optimized for minimum memory usage',
          'A heap with the minimum possible height'
        ],
        correctAnswer: 'A heap where the parent nodes are smaller than or equal to their children'
      },
      {
        question: 'What is an AVL tree?',
        options: [
          'A tree named after its inventors (Adelson-Velsky and Landis)',
          'A self-balancing binary search tree',
          'Both A and B',
          'A specialized tree for audio-visual data'
        ],
        correctAnswer: 'Both A and B'
      },
      {
        question: 'Which data structure would be most efficient for implementing an LRU cache?',
        options: [
          'Array',
          'Hash Table with Doubly Linked List',
          'Binary Search Tree',
          'Stack'
        ],
        correctAnswer: 'Hash Table with Doubly Linked List'
      },
      {
        question: 'What is a disjoint-set data structure used for?',
        options: [
          'Storing unrelated data elements',
          'Tracking elements split across multiple sets',
          'Finding if two elements belong to the same set',
          'Implementing graph algorithms'
        ],
        correctAnswer: 'Finding if two elements belong to the same set'
      },
      {
        question: 'What is the time complexity of the Floyd-Warshall algorithm?',
        options: [
          'O(n)',
          'O(n log n)',
          'O(n²)',
          'O(n³)'
        ],
        correctAnswer: 'O(n³)'
      },
      {
        question: 'Which of the following is NOT a property of a red-black tree?',
        options: [
          'Every node is either red or black',
          'All leaf nodes are red',
          'If a node is red, its children are black',
          'Every path from root to leaf has the same number of black nodes'
        ],
        correctAnswer: 'All leaf nodes are red'
      },
      {
        question: 'What is the purpose of a Bloom filter?',
        options: [
          'To filter out noise in data',
          'To test whether an element is a member of a set',
          'To sort data efficiently',
          'To compress data structures'
        ],
        correctAnswer: 'To test whether an element is a member of a set'
      },
      {
        question: 'What is a skip list?',
        options: [
          'A list that skips over null values',
          'A data structure that allows fast search within an ordered sequence',
          'A specialized list for skipping unnecessary operations',
          'A list implementation that uses less memory'
        ],
        correctAnswer: 'A data structure that allows fast search within an ordered sequence'
      },
      {
        question: 'What is a spatial data structure?',
        options: [
          'A data structure designed to store data in multiple dimensions',
          'A data structure for storing 3D models',
          'A specialized structure for geographic information',
          'A data structure that optimizes memory space'
        ],
        correctAnswer: 'A data structure designed to store data in multiple dimensions'
      },
      {
        question: 'What is memoization related to?',
        options: [
          'Memory management',
          'Dynamic programming',
          'Memorizing algorithms',
          'Memory leak prevention'
        ],
        correctAnswer: 'Dynamic programming'
      },
      {
        question: 'What does the Bellman-Ford algorithm do?',
        options: [
          'Sorts data efficiently',
          'Finds the shortest path in a graph with negative weights',
          'Balances binary trees',
          'Resolves hash collisions'
        ],
        correctAnswer: 'Finds the shortest path in a graph with negative weights'
      },
      {
        question: 'What is a Fibonacci heap used for?',
        options: [
          'Storing sequences in the Fibonacci pattern',
          'Implementing priority queues with better amortized complexity',
          'Generating Fibonacci numbers efficiently',
          'Balancing binary search trees'
        ],
        correctAnswer: 'Implementing priority queues with better amortized complexity'
      }
    ]
  };
  
  // Get random selection of questions
  const getRandomQuestions = (topic, count = 10) => {
    const allQuestions = questionBanks[topic] || [];
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Handle topic selection
  const handleTopicSelect = (topicName) => {
    setSelectedTopic(topicName);
    const randomQuestions = getRandomQuestions(topicName);
    setQuestions(randomQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
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
        // Always use newScore which has the correct final score including the last question
        saveQuizResult(newScore);
        setShowScore(true);
      }
    }, 500);
  };
  
  // Save quiz results to backend
  const saveQuizResult = async (finalScore) => {
    if (!user) {
      console.error('Cannot save quiz result: No user logged in');
      return;
    }
    
    console.log('Starting to save quiz result for user:', user, 'with final score:', finalScore);
    setLoading(true);
    
    try {
      // Get authentication token if available
      const authToken = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (authToken) {
        console.log('Found auth token, adding to headers');
        headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        console.log('No auth token found');
      }
      
      // Always use the finalScore parameter, which contains the correct final score
      // including the last question result
      const scoreToSave = finalScore;
      
      // Prepare data to save
      const resultData = {
        username: user.username,
        topic: selectedTopic,
        score: scoreToSave,
        total: questions.length
      };
      
      console.log('Saving quiz result data:', resultData);
      
      // Try authenticated endpoint first
      if (authToken) {
        try {
          console.log('Attempting to save via authenticated endpoint');
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
          } else {
            console.error('Failed to save result (authenticated):', response.status);
            const errorText = await response.text();
            console.error('Error response:', errorText);
          }
        } catch (err) {
          console.error('Error saving result (authenticated):', err);
          // Fall through to non-authenticated endpoint
        }
      }
      
      // Fall back to non-authenticated endpoint
      console.log('Falling back to non-authenticated endpoint');
      const response = await fetch('http://localhost:5000/api/save_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultData)
      });
      
      if (response.ok) {
        console.log('Quiz result saved successfully (non-authenticated)');
        // Dispatch event to notify dashboard to refresh
        window.dispatchEvent(new Event('quiz-completed'));
      } else {
        console.error('Failed to save result (non-authenticated):', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
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
            {topicsData.map((topic) => (
              <div 
                key={topic.id} 
                className="topic-card"
                onClick={() => handleTopicSelect(topic.name)}
                style={{
                  background: topic.gradient,
                  borderColor: topic.color
                }}
              >
                <div className="topic-icon">{topic.icon}</div>
                <h3 className="topic-name">{topic.name}</h3>
                <p className="topic-description">{topic.description}</p>
                <div className="topic-questions-count">
                  {questionBanks[topic.name]?.length || 0} Questions Available
                </div>
                <button className="start-quiz-btn">Start Quiz</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz-container" style={{
          background: getTopicData(selectedTopic).gradient,
          borderColor: getTopicData(selectedTopic).color
        }}>
          {showScore ? (
            <div className="score-section">
              <div className="topic-icon-large">{getTopicData(selectedTopic).icon}</div>
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
              <div className="quiz-actions">
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
            </div>
          ) : (
            <>
              <div className="question-header">
                <div className="topic-badge">
                  <span className="topic-icon-small">{getTopicData(selectedTopic).icon}</span>
                  <h3>{selectedTopic}</h3>
                </div>
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
                  style={{
                    width: `${(currentQuestion / questions.length) * 100}%`,
                    backgroundColor: getTopicData(selectedTopic).color
                  }}
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
