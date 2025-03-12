const BALL_KNOWLEDGE = {
  BALL_KNOWLEDGE: {
    DASHBOARD: {
      TITLE: '⚽ Ball Knowledge',
      SUBTITLE: 'Test your football knowledge with exciting quizzes.',
      PLAY_QUIZ: {
        TITLE: '🎮 Play Quiz',
        SUBTITLE: 'Test your football knowledge!',
        BUTTON: 'Start Now'
      },
      CREATED_QUIZZES: {
        TITLE: '📂 Quizzes',
        SUBTITLE: 'View your created quizzes!',
        BUTTON: 'View Quizzes'
      },
      AUTHENTICATION: {
        LOGIN_TITLE: '🔑 Login',
        LOGIN_SUBTITLE: 'Unlock full access & save your progress!',
        LOGOUT_TITLE: '🔒 Logout',
        LOGOUT_SUBTITLE: 'Sign out from your account',
        GUEST_EXIT_TITLE: '🚪 Exit',
        GUEST_EXIT_SUBTITLE: 'Leave guest mode and log in for a better experience.',
        BUTTON_LOGIN: 'Login',
        BUTTON_LOGOUT: 'Logout',
        BUTTON_EXIT_GUEST: 'Exit Guest'
      }
    },
    CREATED_QUIZZES: {
      TITLE: '📂 My Created Quizzes',
      LOADING: 'Loading quizzes...',
      QUIZ_ITEM: {
        CATEGORY: 'Category',
        DIFFICULTY: 'Difficulty',
        QUESTIONS: 'Questions'
      },
      ACTIONS: {
        EDIT: 'Edit',
        DELETE: 'Delete',
        CREATE_NEW: 'Create New Quiz'
      },
      TOAST: {
        QUIZ_DELETED_TITLE: 'Quiz Deleted',
        QUIZ_DELETED_MESSAGE: 'Your quiz has been deleted.'
      }
    },
    GUEST_REGISTER: {
      TITLE: '🎮 Join as Guest',
      FORM: {
        PLACEHOLDER_USERNAME: 'Username',
        PLACEHOLDER_FULLNAME: 'Full Name',
        BUTTON_JOIN: 'Join as Guest',
        BUTTON_JOINING: 'Joining...'
      },
      TOAST: {
        SUCCESS_TITLE: 'Guest Account Created!',
        SUCCESS_MESSAGE: 'Redirecting...',
        ERROR_TITLE: 'Guest Registration Failed',
        ERROR_MESSAGE: 'Something went wrong!'
      }
    },
    JOIN_SESSION: {
      TITLE: 'Join Session',
      INPUT_PLACEHOLDER: 'Enter Session Key',
      BUTTON_JOIN: 'Join Session',
      PLAYERS_JOINED: 'Players Joined:',
      TOAST: {
        SOCKET_WARNING: 'Socket not connected, cannot join session'
      }
    },
    LOGIN: {
      TITLE: '🔐 Login',
      INPUTS: {
        PLACEHOLDER_USERNAME: 'Username',
        PLACEHOLDER_PASSWORD: 'Password'
      },
      BUTTON_LOGIN: 'Login',
      LINK_SIGNUP_TEXT: "Don't have an account?",
      LINK_SIGNUP: 'Sign Up',
      TOAST: {
        ERROR_TITLE: 'Login Failed',
        ERROR_MESSAGE: 'Invalid credentials',
        MISSING_CREDENTIALS_TITLE: 'Missing Credentials',
        MISSING_CREDENTIALS_MESSAGE: 'Please enter both username and password.'
      }
    },
    QUIZ_CREATE: {
      TITLE: '📝 Create Your Quiz',
      FORM: {
        LABEL_TITLE: 'Title:',
        LABEL_CATEGORY: 'Category:',
        LABEL_DIFFICULTY: 'Difficulty:',
        LABEL_PUBLIC: 'Public',
        LABEL_PRIVATE: 'Private'
      },
      DIFFICULTY_OPTIONS: {
        EASY: 'Easy',
        MEDIUM: 'Medium',
        HARD: 'Hard'
      },
      QUESTIONS: {
        SECTION_TITLE: 'Add Questions:',
        PLACEHOLDER_QUESTION: 'Question Text',
        PLACEHOLDER_OPTION: 'Option',
        PLACEHOLDER_CORRECT_ANSWER: 'Correct Answer',
        BUTTON_ADD_QUESTION: 'Add Question',
        SECTION_LIST_TITLE: 'Questions:',
        BUTTON_REMOVE_QUESTION: 'Remove Question'
      },
      BUTTON_SUBMIT: 'Submit Quiz',
      TOAST: {
        INCOMPLETE_QUESTION_TITLE: 'Incomplete Question',
        INCOMPLETE_QUESTION_MESSAGE: 'Please enter a question and correct answer.',
        QUIZ_INCOMPLETE_TITLE: 'Quiz Incomplete',
        QUIZ_INCOMPLETE_MESSAGE: 'Fill all fields and add at least one question.'
      }
    },
    QUIZ_DASHBOARD: {
      TITLE: '🎯 Choose Your Quiz',
      SUBTITLE: 'Select how you want to start your quiz journey.',
      OPTIONS: {
        RANDOM: {
          TITLE: '🎲 Play a Random Quiz',
          SUBTITLE: 'Start a random public quiz instantly!',
          BUTTON: 'Play Now'
        },
        JOIN_SESSION: {
          TITLE: '🔑 Join a Quiz Session',
          SUBTITLE: 'Enter a session key and join an ongoing quiz.',
          BUTTON: 'Join Now'
        },
        CHOOSE_QUIZ: {
          TITLE: '📋 Choose a Public Quiz',
          SUBTITLE: 'Select from available quizzes.',
          BUTTON: 'Browse'
        }
      }
    },
    QUIZ_EDITOR: {
      TITLE: '✏️ Edit Quiz',
      LOADING: 'Loading quiz...',
      ERROR: 'Error loading quiz',
      FORM: {
        LABEL_TITLE: 'Title:',
        LABEL_CATEGORY: 'Category:',
        LABEL_DIFFICULTY: 'Difficulty:',
        LABEL_PUBLIC: 'Public',
        LABEL_PRIVATE: 'Private'
      },
      DIFFICULTY_OPTIONS: {
        EASY: 'Easy',
        MEDIUM: 'Medium',
        HARD: 'Hard'
      },
      QUESTIONS: {
        SECTION_TITLE: 'Questions:',
        PLACEHOLDER_QUESTION: 'Question Text',
        PLACEHOLDER_OPTION: 'Option',
        LABEL_CORRECT_ANSWER: 'Correct Answer:',
        BUTTON_ADD_QUESTION: 'Add Question',
        BUTTON_REMOVE_QUESTION: 'Remove Question'
      },
      BUTTON_UPDATE: 'Update Quiz',
      TOAST: {
        INCOMPLETE_QUESTION_TITLE: 'Incomplete Question',
        INCOMPLETE_QUESTION_MESSAGE: 'Please enter a question and correct answer.',
        QUIZ_INCOMPLETE_TITLE: 'Quiz Incomplete',
        QUIZ_INCOMPLETE_MESSAGE: 'Fill all fields and add at least one question.'
      }
    },
    QUIZ_LEADERBOARD: {
      TITLE: '🏆 Leaderboard',
      POINTS: 'pts',
      RETURN_MESSAGE: 'Returning to Home in {countdown} seconds...',
      BUTTON_HOME: 'Return to Home'
    },
    QUIZ_LIST: {
      TITLE: '📋 Available Quizzes',
      LOADING: 'Loading quizzes...',
      CATEGORY: 'Category:',
      DIFFICULTY: 'Difficulty:',
      QUESTIONS: 'Questions:',
      BUTTON_START: 'Start Quiz'
    },
    QUIZ_QUESTION: {
      LOADING: 'Loading question...',
      NOT_FOUND: 'Question not found!',
      TIMER: 'Time left: ',
      SECONDS: 'seconds',
      WAITING_NEXT: 'Waiting for the next question...',
      BUTTON_SUBMIT: 'Submit Answer',
      BUTTON_BACK: 'Back to Quiz',
      CORRECT_ANSWER: 'Correct Answer!',
      INCORRECT_ANSWER: 'Incorrect Answer!'
    },
    QUIZ_START: {
      LOADING: 'Loading quiz...',
      NOT_FOUND: 'Quiz not found or has no questions!',
      CATEGORY: 'Category:',
      DIFFICULTY: 'Difficulty:',
      SESSION_KEY: 'Session Key:',
      PLAYERS: 'Players:',
      WAITING: 'Waiting for the host to start the quiz...',
      BUTTON_START: 'Start Quiz',
      BUTTON_BACK: 'Back to Quizzes'
    },
    REGISTER: {
      TITLE: '📝 Register',
      ALREADY_ACCOUNT: 'Already have an account?',
      BUTTON_LOGIN: 'Login',
      FORM: {
        PLACEHOLDER_USERNAME: 'Username',
        PLACEHOLDER_FULLNAME: 'Full Name',
        PLACEHOLDER_EMAIL: 'Email',
        PLACEHOLDER_PASSWORD: 'Password',
        PLACEHOLDER_CONFIRM_PASSWORD: 'Confirm Password',
        BUTTON_REGISTER: 'Register',
        BUTTON_REGISTERING: 'Registering...'
      },
      TOAST: {
        SUCCESS_TITLE: 'Registration Successful!',
        SUCCESS_MESSAGE: 'Redirecting to login...',
        ERROR_TITLE: 'Registration Failed',
        ERROR_MESSAGE: 'Something went wrong!',
        PASSWORD_MISMATCH_TITLE: 'Passwords do not match',
        PASSWORD_MISMATCH_MESSAGE: 'Please make sure both passwords are identical'
      }
    }
  }
}

export default BALL_KNOWLEDGE
