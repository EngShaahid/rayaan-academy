/* =========================================================
   Rayaan Academy - shared course data
   All figures (enrollments, ratings, people) are DEMO data.
   ========================================================= */
(function () {
  'use strict';

  const BRAND = {
    name: 'Rayaan Academy',
    tagline: 'Learn Today. Build Tomorrow.',
    email: 'info@rayaan-academy.example',
    phone: '+252 00 000 0000',
    address: 'Your campus address here'
  };

  const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  const CATEGORIES = [
    { id: 'web-development', name: 'Web Development', icon: 'bi-code-slash' },
    { id: 'programming', name: 'Programming', icon: 'bi-terminal' },
    { id: 'english', name: 'English Language', icon: 'bi-translate' },
    { id: 'mathematics', name: 'Mathematics', icon: 'bi-calculator' },
    { id: 'graphic-design', name: 'Graphic Design', icon: 'bi-palette' },
    { id: 'networking', name: 'Networking & CCNA', icon: 'bi-diagram-3' },
    { id: 'linux', name: 'Linux & System Administration', icon: 'bi-hdd-stack' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: 'bi-shield-lock' },
    { id: 'cloud', name: 'Cloud Computing', icon: 'bi-cloud' },
    { id: 'data-ai', name: 'Data Science & AI', icon: 'bi-cpu' },
    { id: 'database', name: 'Database Management', icon: 'bi-database' },
    { id: 'office', name: 'Office Productivity', icon: 'bi-file-earmark-spreadsheet' }
  ];

  const INSTRUCTORS = [
    { id: 'amina-hassan', name: 'Amina Hassan', role: 'Senior Web Engineer', expertise: 'web-development', bio: 'Builds accessible, fast web interfaces and has mentored junior developers for years. Focuses on clean HTML, modern CSS and practical JavaScript.' },
    { id: 'abdirahman-ali', name: 'Abdirahman Ali', role: 'Full-Stack Developer', expertise: 'web-development', bio: 'Works across the stack with Node.js, Express and React. Teaches by building real projects from the first lesson.' },
    { id: 'hodan-farah', name: 'Hodan Farah', role: 'Software Engineer and Python Trainer', expertise: 'programming', bio: 'Uses Python for automation and data work. Known for breaking complex ideas into small, clear steps.' },
    { id: 'sarah-mitchell', name: 'Sarah Mitchell', role: 'English Language Instructor', expertise: 'english', bio: 'Teaches English for academic and professional communication, with a focus on speaking confidence and clear writing.' },
    { id: 'yusuf-omar', name: 'Yusuf Omar', role: 'Mathematics Lecturer', expertise: 'mathematics', bio: 'Helps students rebuild their foundations in algebra, functions and statistics through worked examples.' },
    { id: 'layla-ahmed', name: 'Layla Ahmed', role: 'Brand and Graphic Designer', expertise: 'graphic-design', bio: 'Designs identities and marketing material. Teaches layout, typography and color through hands-on briefs.' },
    { id: 'mohamed-nur', name: 'Mohamed Nur', role: 'Network Engineer', expertise: 'networking', bio: 'Designs and maintains enterprise networks. Prepares learners for networking certifications with lab-first teaching.' },
    { id: 'khalid-yusuf', name: 'Khalid Yusuf', role: 'Linux and Cloud Engineer', expertise: 'linux', bio: 'Runs production Linux servers and cloud workloads. Teaches the command line as a daily working tool.' },
    { id: 'fatima-abdi', name: 'Fatima Abdi', role: 'Security Analyst', expertise: 'cybersecurity', bio: 'Works on threat detection and security awareness. Teaches defensive security and responsible, legal testing practice.' },
    { id: 'ibrahim-said', name: 'Ibrahim Said', role: 'Data Scientist', expertise: 'data-ai', bio: 'Builds data pipelines and machine learning models. Teaches with real datasets and reproducible notebooks.' }
  ];

  // Compact source format: modules = [[title, [lesson titles]]]
  const RAW_COURSES = [
    {
      id: 'html-css-fundamentals', title: 'HTML & CSS Fundamentals', category: 'web-development',
      instructor: 'amina-hassan', level: 'Beginner', duration: 12, price: 'Free', enrollments: 4820, rating: 4.8, featured: true,
      description: 'Build your first responsive web pages with semantic HTML and modern CSS, from page structure to Flexbox and Grid layouts.',
      prerequisites: ['Basic computer skills', 'A code editor such as VS Code'],
      outcomes: ['Write semantic, accessible HTML5 pages', 'Style pages with selectors, the box model and custom properties', 'Build responsive layouts with Flexbox and Grid', 'Publish a small multi-page website'],
      tags: ['HTML', 'CSS', 'Responsive', 'Beginner'],
      modules: [
        ['Getting Started with the Web', ['How the web works', 'Setting up your editor', 'Your first HTML page']],
        ['Semantic HTML', ['Headings, paragraphs and lists', 'Links and images', 'Forms and inputs', 'Page landmarks and accessibility']],
        ['Styling with CSS', ['Selectors and specificity', 'The box model', 'Colors, fonts and units', 'CSS custom properties']],
        ['Layout and Responsive Design', ['Flexbox essentials', 'CSS Grid essentials', 'Media queries and mobile-first design', 'Project: a responsive portfolio']]
      ]
    },
    {
      id: 'javascript-beginner-advanced', title: 'JavaScript from Beginner to Advanced', category: 'programming',
      instructor: 'amina-hassan', level: 'Beginner', duration: 28, price: 'Paid', enrollments: 6210, rating: 4.9, featured: true,
      description: 'Learn JavaScript from variables and functions to the DOM, asynchronous code and modern ES6+ patterns used in real projects.',
      prerequisites: ['HTML & CSS basics'],
      outcomes: ['Use variables, types, functions and control flow confidently', 'Manipulate the DOM and handle events', 'Work with promises, async/await and fetch', 'Structure code with modules and classes'],
      tags: ['JavaScript', 'ES6', 'DOM', 'Async'],
      modules: [
        ['JavaScript Basics', ['Variables and data types', 'Operators and expressions', 'Conditionals and loops']],
        ['Functions and Objects', ['Functions and scope', 'Arrays and array methods', 'Objects and destructuring', 'Classes and prototypes']],
        ['The DOM', ['Selecting and changing elements', 'Events and event delegation', 'Building an interactive to-do app']],
        ['Asynchronous JavaScript', ['Callbacks and the event loop', 'Promises', 'Async/await and fetch', 'Error handling patterns']]
      ]
    },
    {
      id: 'full-stack-web-development', title: 'Full-Stack Web Development', category: 'web-development',
      instructor: 'abdirahman-ali', level: 'Intermediate', duration: 48, price: 'Paid', enrollments: 3150, rating: 4.7, featured: true,
      description: 'Combine front-end and back-end skills to design, build and deploy a complete web application with a database and authentication.',
      prerequisites: ['HTML, CSS and JavaScript fundamentals'],
      outcomes: ['Plan a full-stack application architecture', 'Build REST APIs and connect them to a front end', 'Store data in a relational database', 'Deploy an application to a cloud host'],
      tags: ['Full-Stack', 'API', 'Database', 'Deployment'],
      modules: [
        ['Planning the Application', ['Requirements and user stories', 'Front end and back end responsibilities', 'Project setup and version control with Git']],
        ['Building the Back End', ['Designing a REST API', 'Routing and controllers', 'Connecting to a database', 'Validation and error handling']],
        ['Building the Front End', ['Consuming the API', 'State and UI updates', 'Forms and user feedback']],
        ['Security and Deployment', ['Authentication concepts', 'Environment variables and secrets', 'Deploying to production', 'Capstone project review']]
      ]
    },
    {
      id: 'react-fundamentals', title: 'React Fundamentals', category: 'web-development',
      instructor: 'abdirahman-ali', level: 'Intermediate', duration: 18, price: 'Paid', enrollments: 2740, rating: 4.7,
      description: 'Understand components, props, state and hooks, and build fast, maintainable user interfaces with React.',
      prerequisites: ['Solid JavaScript fundamentals'],
      outcomes: ['Build reusable components with props', 'Manage state with hooks', 'Fetch and display remote data', 'Organise a React project for growth'],
      tags: ['React', 'Components', 'Hooks', 'SPA'],
      modules: [
        ['React Essentials', ['Why React?', 'JSX and components', 'Props and composition']],
        ['State and Hooks', ['useState', 'useEffect', 'Lifting state up', 'Custom hooks']],
        ['Real-World React', ['Lists, keys and forms', 'Fetching data', 'Routing basics', 'Project: course browser app']]
      ]
    },
    {
      id: 'nodejs-express', title: 'Node.js and Express', category: 'web-development',
      instructor: 'abdirahman-ali', level: 'Intermediate', duration: 20, price: 'Paid', enrollments: 2310, rating: 4.6,
      description: 'Build server-side applications and REST APIs with Node.js and Express, including middleware, routing and data persistence.',
      prerequisites: ['JavaScript fundamentals', 'Basic command line use'],
      outcomes: ['Understand the Node.js runtime and npm', 'Create Express servers and middleware', 'Design and document REST APIs', 'Connect APIs to a database'],
      tags: ['Node.js', 'Express', 'REST', 'Back End'],
      modules: [
        ['Node.js Foundations', ['The Node.js runtime', 'Modules and npm', 'Working with the file system']],
        ['Express Applications', ['Routing', 'Middleware', 'Request validation', 'Error handling middleware']],
        ['APIs and Data', ['REST design principles', 'Connecting a database', 'Testing your API', 'Project: notes API']]
      ]
    },
    {
      id: 'python-programming', title: 'Python Programming', category: 'programming',
      instructor: 'hodan-farah', level: 'Beginner', duration: 22, price: 'Free', enrollments: 7340, rating: 4.9, featured: true,
      description: 'Start programming with Python. Learn the syntax, data structures and problem-solving skills used in automation, web and data work.',
      prerequisites: ['No programming experience required'],
      outcomes: ['Write clear Python programs', 'Use lists, dictionaries, sets and tuples', 'Read and write files', 'Automate everyday tasks with scripts'],
      tags: ['Python', 'Automation', 'Beginner', 'Problem Solving'],
      modules: [
        ['Python Basics', ['Installing Python', 'Variables and types', 'Input and output']],
        ['Control Flow', ['Conditions', 'Loops', 'Functions', 'Error handling']],
        ['Data Structures', ['Lists and tuples', 'Dictionaries and sets', 'Comprehensions']],
        ['Practical Python', ['Working with files', 'Modules and packages', 'Project: automation script']]
      ]
    },
    {
      id: 'english-beginner-advanced', title: 'English Language from Beginner to Advanced', category: 'english',
      instructor: 'sarah-mitchell', level: 'Beginner', duration: 40, price: 'Paid', enrollments: 5480, rating: 4.8, featured: true,
      description: 'Improve your grammar, vocabulary, listening, speaking and writing step by step, from everyday English to professional communication.',
      prerequisites: ['None, suitable for all levels'],
      outcomes: ['Use core grammar tenses accurately', 'Expand everyday and academic vocabulary', 'Speak with more confidence and fluency', 'Write clear emails, reports and essays'],
      tags: ['English', 'Grammar', 'Speaking', 'Writing'],
      modules: [
        ['Foundations', ['Sentence structure', 'Present tenses', 'Everyday vocabulary']],
        ['Building Fluency', ['Past and future tenses', 'Listening practice', 'Conversation strategies', 'Pronunciation basics']],
        ['Academic and Professional English', ['Writing clear paragraphs', 'Formal emails', 'Presentations in English']],
        ['Advanced Skills', ['Conditionals and modal verbs', 'Essay writing', 'Debate and discussion']]
      ]
    },
    {
      id: 'mathematics-fundamentals', title: 'Mathematics Fundamentals', category: 'mathematics',
      instructor: 'yusuf-omar', level: 'Beginner', duration: 16, price: 'Free', enrollments: 3920, rating: 4.6,
      description: 'Strengthen the core mathematics needed for university and IT studies: arithmetic, algebra, functions, logic and basic statistics.',
      prerequisites: ['Secondary school arithmetic'],
      outcomes: ['Solve linear and quadratic equations', 'Work with functions and graphs', 'Apply logic and set notation', 'Calculate basic descriptive statistics'],
      tags: ['Math', 'Algebra', 'Statistics', 'Logic'],
      modules: [
        ['Number Skills', ['Fractions, decimals and percentages', 'Exponents and roots', 'Order of operations']],
        ['Algebra', ['Expressions and equations', 'Linear equations', 'Quadratic equations']],
        ['Functions and Logic', ['Functions and graphs', 'Sets and Venn diagrams', 'Propositional logic']],
        ['Intro to Statistics', ['Mean, median and mode', 'Spread and variance', 'Reading charts correctly']]
      ]
    },
    {
      id: 'graphic-design-ps-ai', title: 'Graphic Design with Photoshop and Illustrator', category: 'graphic-design',
      instructor: 'layla-ahmed', level: 'Beginner', duration: 24, price: 'Paid', enrollments: 2980, rating: 4.7,
      description: 'Learn design principles and the essential tools of Photoshop and Illustrator to create logos, social media graphics and print material.',
      prerequisites: ['A computer able to run Adobe Photoshop and Illustrator'],
      outcomes: ['Apply layout, color and typography principles', 'Edit and retouch images in Photoshop', 'Create vector graphics and logos in Illustrator', 'Prepare files for web and print'],
      tags: ['Design', 'Photoshop', 'Illustrator', 'Branding'],
      modules: [
        ['Design Principles', ['Balance, contrast and hierarchy', 'Color theory', 'Typography basics']],
        ['Photoshop Essentials', ['Layers and masks', 'Selections', 'Photo retouching', 'Social media graphics']],
        ['Illustrator Essentials', ['Shapes and the pen tool', 'Working with type', 'Designing a logo']],
        ['Production', ['Exporting for web', 'Preparing files for print', 'Project: brand kit']]
      ]
    },
    {
      id: 'networking-fundamentals', title: 'Computer Networking Fundamentals', category: 'networking',
      instructor: 'mohamed-nur', level: 'Beginner', duration: 18, price: 'Free', enrollments: 3560, rating: 4.7,
      description: 'Understand how networks work: the OSI and TCP/IP models, IP addressing, switching, routing and common network services.',
      prerequisites: ['Basic computer skills'],
      outcomes: ['Explain the OSI and TCP/IP models', 'Calculate IPv4 subnets', 'Describe switching and routing', 'Troubleshoot common network problems'],
      tags: ['Networking', 'TCP/IP', 'Subnetting', 'Troubleshooting'],
      modules: [
        ['Network Basics', ['What is a network?', 'Network devices', 'The OSI model']],
        ['Addressing', ['IPv4 addressing', 'Subnetting step by step', 'IPv6 introduction']],
        ['Switching and Routing', ['How switches learn', 'VLAN concepts', 'Routing fundamentals']],
        ['Services and Troubleshooting', ['DNS and DHCP', 'Wireless basics', 'Troubleshooting with ping and traceroute']]
      ]
    },
    {
      id: 'ccna-preparation', title: 'CCNA Preparation', category: 'networking',
      instructor: 'mohamed-nur', level: 'Intermediate', duration: 45, price: 'Paid', enrollments: 2140, rating: 4.8,
      description: 'Prepare for the Cisco CCNA exam with structured lessons and lab practice on switching, routing, security, automation and services.',
      prerequisites: ['Computer Networking Fundamentals or equivalent'],
      outcomes: ['Configure VLANs, trunks and STP', 'Configure static routing and OSPF', 'Apply ACLs and basic device security', 'Practise with exam-style questions'],
      tags: ['CCNA', 'Cisco', 'Routing', 'Switching'],
      modules: [
        ['Network Access', ['VLANs and trunking', 'Spanning Tree Protocol', 'EtherChannel']],
        ['IP Connectivity', ['Static routing', 'OSPF single area', 'First hop redundancy']],
        ['IP Services and Security', ['NAT and DHCP', 'Access control lists', 'Device hardening']],
        ['Automation and Exam Prep', ['Network automation concepts', 'Lab practice session', 'Exam strategy and review']]
      ]
    },
    {
      id: 'linux-system-administration', title: 'Linux System Administration', category: 'linux',
      instructor: 'khalid-yusuf', level: 'Intermediate', duration: 30, price: 'Paid', enrollments: 2650, rating: 4.8, featured: true,
      description: 'Manage Linux servers with confidence: the command line, users and permissions, services, networking, storage and shell scripting.',
      prerequisites: ['Basic computer skills', 'Interest in servers and infrastructure'],
      outcomes: ['Navigate and manage files from the terminal', 'Manage users, groups and permissions', 'Control services with systemd', 'Automate tasks with Bash scripts'],
      tags: ['Linux', 'Bash', 'Servers', 'systemd'],
      modules: [
        ['Command Line Essentials', ['The Linux file system', 'Navigating with the shell', 'Working with files and text']],
        ['Users and Permissions', ['Users and groups', 'File permissions', 'sudo and privilege']],
        ['System Management', ['Packages and updates', 'Processes and systemd', 'Logs and monitoring', 'Storage and mounts']],
        ['Networking and Scripting', ['Network configuration', 'SSH and remote access', 'Bash scripting basics']]
      ]
    },
    {
      id: 'cybersecurity-fundamentals', title: 'Cybersecurity Fundamentals', category: 'cybersecurity',
      instructor: 'fatima-abdi', level: 'Beginner', duration: 20, price: 'Free', enrollments: 4410, rating: 4.8, featured: true,
      description: 'Learn the core concepts of protecting systems and data: threats, cryptography basics, network security and secure habits.',
      prerequisites: ['Basic computer and networking knowledge'],
      outcomes: ['Explain the CIA triad and common threats', 'Recognise phishing and social engineering', 'Understand encryption and hashing basics', 'Apply security best practices'],
      tags: ['Security', 'CIA Triad', 'Cryptography', 'Awareness'],
      modules: [
        ['Security Concepts', ['The CIA triad', 'Threats, vulnerabilities and risk', 'Security frameworks overview']],
        ['Common Attacks', ['Malware types', 'Phishing and social engineering', 'Password attacks']],
        ['Defensive Controls', ['Encryption and hashing', 'Firewalls and network security', 'Identity and access management']],
        ['Secure Practice', ['Incident response basics', 'Security awareness habits', 'Career paths in security']]
      ]
    },
    {
      id: 'ethical-hacking-fundamentals', title: 'Ethical Hacking Fundamentals', category: 'cybersecurity',
      instructor: 'fatima-abdi', level: 'Advanced', duration: 26, price: 'Paid', enrollments: 1980, rating: 4.7,
      description: 'Learn the methodology of authorised penetration testing in a legal lab environment, from reconnaissance to reporting.',
      prerequisites: ['Cybersecurity Fundamentals', 'Linux command line basics', 'Networking basics'],
      outcomes: ['Follow a legal, authorised testing methodology', 'Perform reconnaissance and scanning in a lab', 'Understand common web vulnerabilities', 'Write a professional findings report'],
      tags: ['Ethical Hacking', 'Pentesting', 'OWASP', 'Lab'],
      modules: [
        ['Ethics and Setup', ['Legal and ethical boundaries', 'Building a safe practice lab', 'Testing methodology']],
        ['Reconnaissance', ['Passive information gathering', 'Network scanning concepts', 'Service enumeration']],
        ['Vulnerabilities', ['OWASP Top 10 overview', 'Authentication weaknesses', 'Misconfiguration risks']],
        ['Reporting', ['Risk rating', 'Writing a findings report', 'Remediation advice']]
      ]
    },
    {
      id: 'cloud-computing', title: 'Cloud Computing', category: 'cloud',
      instructor: 'khalid-yusuf', level: 'Intermediate', duration: 22, price: 'Paid', enrollments: 2480, rating: 4.6,
      description: 'Understand cloud models and core services for compute, storage, networking and security, and deploy your first cloud workloads.',
      prerequisites: ['Networking and Linux basics'],
      outcomes: ['Compare IaaS, PaaS and SaaS', 'Launch and manage virtual machines', 'Use object storage and managed databases', 'Apply cloud security and cost basics'],
      tags: ['Cloud', 'AWS', 'Azure', 'DevOps'],
      modules: [
        ['Cloud Concepts', ['What is cloud computing?', 'Service and deployment models', 'Shared responsibility']],
        ['Core Services', ['Virtual machines', 'Storage services', 'Cloud networking', 'Managed databases']],
        ['Operations', ['Identity and access', 'Monitoring and cost control', 'Project: deploy a web server']]
      ]
    },
    {
      id: 'data-science-ml', title: 'Data Science and Machine Learning', category: 'data-ai',
      instructor: 'ibrahim-said', level: 'Advanced', duration: 36, price: 'Paid', enrollments: 3310, rating: 4.8, featured: true,
      description: 'Analyse data with Python, visualise insights and build machine learning models for prediction and classification.',
      prerequisites: ['Python Programming', 'Basic statistics'],
      outcomes: ['Clean and explore data with pandas', 'Visualise data effectively', 'Train and evaluate machine learning models', 'Communicate results clearly'],
      tags: ['Data Science', 'Machine Learning', 'pandas', 'AI'],
      modules: [
        ['Data Analysis', ['The data science workflow', 'pandas essentials', 'Cleaning data']],
        ['Visualisation', ['Choosing the right chart', 'Plotting with Python', 'Exploratory data analysis']],
        ['Machine Learning', ['Supervised learning', 'Regression models', 'Classification models', 'Model evaluation']],
        ['Projects', ['Feature engineering', 'Ethics in AI', 'Capstone: prediction project']]
      ]
    },
    {
      id: 'sql-database-management', title: 'SQL and Database Management', category: 'database',
      instructor: 'ibrahim-said', level: 'Beginner', duration: 16, price: 'Free', enrollments: 4060, rating: 4.7,
      description: 'Design relational databases and write SQL queries to store, retrieve, join and analyse data.',
      prerequisites: ['Basic computer skills'],
      outcomes: ['Design normalised relational tables', 'Write SELECT queries with filters and sorting', 'Join and aggregate data', 'Manage data with INSERT, UPDATE and DELETE'],
      tags: ['SQL', 'MySQL', 'Database Design', 'Queries'],
      modules: [
        ['Database Concepts', ['What is a relational database?', 'Tables, keys and relationships', 'Normalisation basics']],
        ['Querying Data', ['SELECT and WHERE', 'Sorting and limiting', 'Aggregate functions', 'GROUP BY and HAVING']],
        ['Working with Data', ['JOIN types', 'INSERT, UPDATE and DELETE', 'Indexes and performance', 'Project: school database']]
      ]
    },
    {
      id: 'microsoft-office-productivity', title: 'Microsoft Office and Productivity', category: 'office',
      instructor: 'sarah-mitchell', level: 'Beginner', duration: 14, price: 'Free', enrollments: 5120, rating: 4.6,
      description: 'Work faster with Word, Excel and PowerPoint: professional documents, spreadsheets with formulas and clear presentations.',
      prerequisites: ['Access to Microsoft Office or a compatible suite'],
      outcomes: ['Format professional documents in Word', 'Use formulas, functions and charts in Excel', 'Design clear presentations in PowerPoint', 'Organise files and email productively'],
      tags: ['Word', 'Excel', 'PowerPoint', 'Productivity'],
      modules: [
        ['Microsoft Word', ['Document formatting', 'Styles and tables of contents', 'Mail merge']],
        ['Microsoft Excel', ['Cells, ranges and formatting', 'Formulas and functions', 'Charts and tables', 'Sorting and filtering']],
        ['PowerPoint and Productivity', ['Slide design principles', 'Presenting with confidence', 'File and email organisation']]
      ]
    }
  ];

  // Normalise raw data into a consistent structure used everywhere.
  const COURSES = RAW_COURSES.map(function (c) {
    let lessonIndex = 0;
    const modules = c.modules.map(function (m, mi) {
      return {
        id: c.id + '-m' + (mi + 1),
        title: m[0],
        lessons: m[1].map(function (title, li) {
          lessonIndex += 1;
          return {
            id: c.id + '-m' + (mi + 1) + '-l' + (li + 1),
            title: title,
            minutes: 8 + ((lessonIndex * 7 + mi * 3) % 14),
            preview: mi === 0 && li === 0,
            videoUrl: SAMPLE_VIDEO,
            description: 'In this lesson you will work through "' + title + '" with a short explanation, a worked example and a practice task. Take notes below and mark the lesson complete when you are done.'
          };
        })
      };
    });
    return Object.assign({}, c, {
      modules: modules,
      lessons: lessonIndex,
      thumbnail: 'assets/images/courses/' + c.id + '.svg',
      featured: Boolean(c.featured)
    });
  });

  const LEARNING_PATHS = [
    { id: 'front-end-developer', title: 'Front-End Developer', icon: 'bi-window-stack', level: 'Beginner to Intermediate',
      description: 'Go from your first web page to modern interactive interfaces.',
      courses: ['html-css-fundamentals', 'javascript-beginner-advanced', 'react-fundamentals'] },
    { id: 'full-stack-developer', title: 'Full-Stack Developer', icon: 'bi-layers', level: 'Beginner to Advanced',
      description: 'Build complete web applications, from interface to database and deployment.',
      courses: ['html-css-fundamentals', 'javascript-beginner-advanced', 'nodejs-express', 'sql-database-management', 'full-stack-web-development'] },
    { id: 'network-engineer', title: 'Network Engineer', icon: 'bi-router', level: 'Beginner to Intermediate',
      description: 'Learn networking from the ground up and prepare for the CCNA exam.',
      courses: ['networking-fundamentals', 'linux-system-administration', 'ccna-preparation'] },
    { id: 'cybersecurity-analyst', title: 'Cybersecurity Analyst', icon: 'bi-shield-check', level: 'Beginner to Advanced',
      description: 'Build the networking, Linux and security skills needed for a security career.',
      courses: ['networking-fundamentals', 'linux-system-administration', 'cybersecurity-fundamentals', 'ethical-hacking-fundamentals'] },
    { id: 'data-scientist', title: 'Data Scientist', icon: 'bi-graph-up-arrow', level: 'Beginner to Advanced',
      description: 'Combine mathematics, Python and SQL to analyse data and build models.',
      courses: ['mathematics-fundamentals', 'python-programming', 'sql-database-management', 'data-science-ml'] },
    { id: 'cloud-engineer', title: 'Cloud Engineer', icon: 'bi-cloud-check', level: 'Intermediate',
      description: 'Run and automate infrastructure on Linux and in the cloud.',
      courses: ['networking-fundamentals', 'linux-system-administration', 'cloud-computing'] }
  ];

  // Which practice quiz (see js/quiz.js) belongs to each category
  const QUIZ_FOR_CATEGORY = {
    'web-development': 'programming', 'programming': 'programming', 'data-ai': 'programming', 'database': 'programming',
    'english': 'english', 'office': 'english', 'mathematics': 'mathematics', 'graphic-design': 'mathematics',
    'networking': 'networking', 'linux': 'networking', 'cloud': 'networking', 'cybersecurity': 'cybersecurity'
  };
  function getQuizIdForCourse(course) { return course ? (QUIZ_FOR_CATEGORY[course.category] || 'programming') : 'programming'; }

  function getCourseById(id) { return COURSES.find(function (c) { return c.id === id; }) || null; }
  function getCategory(id) { return CATEGORIES.find(function (c) { return c.id === id; }) || null; }
  function getInstructor(id) { return INSTRUCTORS.find(function (i) { return i.id === id; }) || null; }
  function getAllLessons(course) {
    return course ? course.modules.reduce(function (acc, m) { return acc.concat(m.lessons); }, []) : [];
  }

  window.RA_DATA = Object.freeze({
    BRAND: BRAND,
    CATEGORIES: CATEGORIES,
    INSTRUCTORS: INSTRUCTORS,
    COURSES: COURSES,
    LEARNING_PATHS: LEARNING_PATHS,
    SAMPLE_VIDEO: SAMPLE_VIDEO,
    getCourseById: getCourseById,
    getCategory: getCategory,
    getInstructor: getInstructor,
    getAllLessons: getAllLessons,
    getQuizIdForCourse: getQuizIdForCourse
  });
})();
