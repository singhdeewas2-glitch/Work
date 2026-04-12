# Project Structure Guide

This document explains the project structure and how to maintain it without external help.

## 📁 Directory Structure

```
src/
├── 📄 App.jsx                 # Main application entry point
├── 📄 main.jsx                # React DOM rendering
│
├── 📁 components/             # Reusable UI components
│   ├── 📁 UI/              # Base components (Button, FormField, etc.)
│   ├── 📁 Profile/          # Profile-specific components
│   ├── 📁 charts/           # Chart components
│   └── 📁 [feature]/         # Other feature components
│
├── 📁 pages/                  # Route/page components
│   ├── 📁 Profile/          # Profile page
│   ├── 📁 AdminDashboard/    # Admin dashboard
│   └── 📁 [page]/           # Other pages
│
├── 📁 sections/               # Homepage sections
│   ├── 📄 Hero.jsx           # Hero section
│   ├── 📄 Features.jsx       # Features section
│   └── 📄 [section].jsx      # Other sections
│
├── 📁 hooks/                  # Business logic hooks
│   ├── 📄 useWeightChartData.js
│   └── 📄 useProfileImageUpload.js
│
├── 📁 services/                # API layer
│   ├── 📄 httpClient.js      # HTTP utilities
│   ├── 📄 profileService.js   # Profile API calls
│   ├── 📄 uploadService.js    # File upload operations
│   └── 📄 [service].js      # Other services
│
├── 📁 config/                  # Configuration files
│   ├── 📄 uiConfig.js        # UI text and labels
│   ├── 📄 contactConfig.js    # Contact information
│   └── 📄 [config].js        # Other configs
│
├── 📁 context/                 # State management
│   └── 📄 AuthContext.jsx     # Authentication state
│
├── 📁 styles/                  # Styling
│   ├── 📄 variables.css       # CSS variables
│   ├── 📄 base.css           # Base styles
│   └── 📄 [module].css        # Component/module styles
│
├── 📁 utils/                   # Utility functions
└── 📁 assets/                  # Static assets
```

## 🎯 Separation of Concerns

### **Components (UI Layer)**
- **Purpose**: Pure presentation, no business logic
- **Location**: `src/components/`
- **Rules**:
  - Receive data via props
  - Handle UI state only
  - No API calls directly
  - Use reusable UI components

### **Hooks (Logic Layer)**
- **Purpose**: Business logic and state management
- **Location**: `src/hooks/`
- **Rules**:
  - Handle complex state logic
  - API calls through services
  - Return state and handlers
  - No UI rendering

### **Services (API Layer)**
- **Purpose**: External API communication
- **Location**: `src/services/`
- **Rules**:
  - HTTP requests only
  - Error handling and validation
  - No UI logic
  - Return standardized responses

### **Config (Data Layer)**
- **Purpose**: Editable application data
- **Location**: `src/config/`
- **Rules**:
  - No logic, just data
  - Export helper functions
  - Single source of truth

## 🔄 Making Changes Without External Help

### **Changing Text Content**
1. **UI Text**: Edit `src/config/uiConfig.js`
2. **Contact Info**: Edit `src/config/contactConfig.js`
3. **No need to touch components**

### **Adding New Features**
1. **Create component** in `src/components/[feature]/`
2. **Create hook** for logic in `src/hooks/`
3. **Create service** for API in `src/services/`
4. **Add config** if needed in `src/config/`

### **Modifying Existing Features**
1. **UI Changes**: Edit component in `src/components/`
2. **Logic Changes**: Edit hook in `src/hooks/`
3. **API Changes**: Edit service in `src/services/`
4. **Config Changes**: Edit appropriate config file

## 📱 Responsive Design Guidelines

### **Mobile First Approach**
- Use CSS variables from `src/styles/variables.css`
- Test on mobile before desktop
- Use ResponsiveContainer for charts

### **Breakpoints**
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🚀 Quick Reference

### **Adding New Button**
```jsx
import { Button } from '../UI';

<Button variant="primary" onClick={handleClick}>
  Button Text
</Button>
```

### **Adding New Form Field**
```jsx
import { FormField } from '../UI';

<FormField
  label="Field Label"
  type="text"
  name="fieldName"
  value={value}
  onChange={handleChange}
  required
/>
```

### **Using Contact Config**
```jsx
import { getWhatsAppUrl, getPhoneUrl } from '../../config/contactConfig';

<a href={getWhatsAppUrl()}>WhatsApp</a>
<a href={getPhoneUrl()}>Call</a>
```

### **Using UI Config**
```jsx
import { uiConfig } from '../../config/uiConfig';

<h1>{uiConfig.profile.title}</h1>
<button>{uiConfig.common.buttons.save}</button>
```

## ✅ Quality Standards

- **No hardcoded values** in components
- **Centralized configuration** for all editable data
- **Clear separation** between UI, logic, and API
- **Consistent naming** and file organization
- **Comprehensive error handling** with user-friendly messages
- **Responsive design** for all screen sizes

This structure ensures the project remains maintainable and editable without external assistance.
