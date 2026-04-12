/**
 * Central UI Configuration
 */

// Profile/Dashboard UI
export const profileUi = {
  dashboardSubtitle: 'Your Transformation Dashboard',
  defaultName: 'FITNESS ENTHUSIAST',
  defaultBio: 'Your fitness journey starts here.',

  // ✅ FIX ADDED HERE
  progressTitle: 'Progress',

  targetPrefix: 'TARGET:',
  targetEmpty: '--',
  progressCompleted: 'Completed',
  analyticsTitle: 'Body Weight Analytics',
  chartTitle: 'Weight Progress',
  chartEmpty: 'Log your weight to see your trend',
  rangeWeek: 'Week',
  rangeMonth: 'Month',
  rangeYear: 'Year',
  editProfile: 'Edit Profile',

  kpi: {
    starting: 'Starting Weight',
    current: 'Current Weight',
    goal: 'Goal Weight',
    bmi: 'BMI',
    totalLost: 'Total Lost',
    goalRemaining: 'Goal Remaining',
  },

  editForm: {
    fullName: 'Full Name',
    startingWeight: 'Starting Weight (kg)',
    currentWeight: 'Current Weight (kg)',
    goal: 'Target Weight (kg) / Goal',
    bio: 'Bio (Optional)',
    cancel: 'Cancel',
    save: 'Save Changes',
    saving: 'Saving...',
  },

  avatar: {
    uploadChange: 'Upload / Change Photo',
    remove: 'Remove Photo',
    changePhoto: 'Change Photo',
    uploading: 'Uploading...',
    preview: 'Previewing image...',
    success: 'Photo updated successfully!',
    removed: 'Photo removed successfully!',
    ariaOpen: 'Open profile image options',
  },

  messages: {
    sessionExpired: 'Session expired. Please login again.',
    profileUpdated: 'Profile updated successfully!',
    unexpected: 'An unexpected error occurred. Please try again.',
    networkError: 'Network error. Please check your connection.',
    validationError: 'Please check your input and try again.',
  },
  lower: {
  progressTitle: "Progress Overview",
  progressDone: "completed",
  quote: "Consistency beats motivation. Keep going.",
  activityTitle: "Recent Activity",
  activityItems: [
    "Workout logged",
    "Weight updated",
    "Goal reviewed"
  ]
},
actions: {
  editProfile: "Edit Profile",
  logout: "Logout"
}
};

// Authentication UI
export const authUi = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Access your fitness dashboard',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    submitButton: 'Sign In',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign Up',
  },

  signup: {
    title: 'Join Our Gym',
    subtitle: 'Start your fitness journey today',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Create a password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    submitButton: 'Create Account',
    hasAccount: 'Already have an account?',
    signInLink: 'Sign In',
  },

  forgotPassword: {
    title: 'Reset Password',
    subtitle: "We'll send you instructions to reset your password",
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    submitButton: 'Send Reset Link',
    backToLogin: 'Back to Sign In',
  },
};

// Navigation UI
export const navUi = {
  logo: 'GYM',
  home: 'Home',
  about: 'About',
  trainers: 'Trainers',
  pricing: 'Pricing',
  contact: 'Contact',
  login: 'Sign In',
  dashboard: 'Dashboard',
  logout: 'Logout',
  mobileMenuOpen: 'Open menu',
  mobileMenuClose: 'Close menu',
};

// Hero Section UI
export const heroUi = {
  title: ['Transform', 'Your Body'],
  subtitle: 'Join our premium gym and achieve your fitness goals',
  primaryButton: 'Start Free Trial',
  secondaryButton: 'View Membership Plans',
  stats: {
    members: '500+ Members',
    experience: '10+ Years Experience',
    success: '95% Success Rate',
  },
};

// Features Section UI
export const featuresUi = {
  title: 'Why Choose Our Gym',
  subtitle: 'We provide everything you need to succeed',
  features: [
    {
      title: 'Expert Trainers',
      description: 'Certified professionals to guide your fitness journey',
      icon: 'trainer',
    },
    {
      title: 'Modern Equipment',
      description: 'State-of-the-art fitness equipment and facilities',
      icon: 'equipment',
    },
    {
      title: 'Personalized Plans',
      description: 'Custom workout and nutrition plans tailored to you',
      icon: 'plans',
    },
    {
      title: 'Group Classes',
      description: 'Energizing group fitness classes for all levels',
      icon: 'classes',
    },
  ],
};

// Pricing Section UI
export const pricingUi = {
  title: 'Membership Plans',
  subtitle: 'Choose the perfect plan for your fitness goals',
  plans: {
    basic: {
      name: 'Basic',
      price: '$29',
      period: '/month',
      features: ['Access to gym equipment', 'During off-peak hours', '1 personal training session/month'],
      popular: false,
    },
    premium: {
      name: 'Premium',
      price: '$59',
      period: '/month',
      features: ['Full gym access', 'All group classes', '4 personal training sessions/month', 'Nutrition consultation'],
      popular: true,
    },
    elite: {
      name: 'Elite',
      price: '$99',
      period: '/month',
      features: ['Unlimited access', 'Private training sessions', 'Custom meal plans', 'Priority booking', 'Spa access'],
      popular: false,
    },
  },
  cta: 'Start Your Journey Today',
};

// Contact Section UI
export const contactUi = {
  title: 'Get In Touch',
  subtitle: "Have questions? We're here to help",
  form: {
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    messageLabel: 'Message',
    messagePlaceholder: 'How can we help you?',
    submitButton: 'Send Message',
  },
  info: {
    address: '123 Fitness Street, Gym City, GC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@gym.com',
    hours: 'Mon-Fri: 5AM-11PM, Sat-Sun: 6AM-10PM',
  },
};

// Common UI
export const commonUi = {
  buttons: {
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    remove: 'Remove',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    retry: 'Retry',
    confirm: 'Confirm',
  },
  messages: {
    success: 'Operation completed successfully',
    error: 'An error occurred',
    warning: 'Please review your input',
    info: 'Information',
    loading: 'Loading...',
    noData: 'No data available',
    networkError: 'Network error. Please try again.',
    serverError: 'Server error. Please try again later.',
  },
};

// Admin UI
export const adminUi = {
  dashboard: 'Dashboard',
  members: 'Members',
  trainers: 'Trainers',
  pricing: 'Pricing',
  transformations: 'Transformations',
  settings: 'Settings',
};

// Master export
export const uiConfig = {
  profile: profileUi,
  auth: authUi,
  nav: navUi,
  hero: heroUi,
  features: featuresUi,
  pricing: pricingUi,
  contact: contactUi,
  common: commonUi,
  admin: adminUi,
};