# Finance Dashboard: Technical Documentation

This project is a high-performance, responsive finance management dashboard built for an Indian college student persona. It focuses on clean, modular React architecture, premium UI/UX design, and robust client-side data management.

## Project Overview

The Finance Dashboard provides a centralized interface for tracking income and expenses. The application is built using React 19 and Vite, ensuring a lightweight and rapid development environment. All styling is implemented using Vanilla CSS to demonstrate a deep understanding of the box model, flexbox, grid, and modern design principles like glass-morphism.

## Feature Implementation Details

### 1. Unified Dashboard Insights
The dashboard has been optimized for "one-glance" density.
- **Summary Cards**: Immediate overview of Balance, Income, and Expenses.
- **Three-Chart Layout (Single Row)**: 
    - **Balance Trend (50%)**: A line chart showing long-term cumulative totals.
    - **Expense Breakdown (25%)**: A pie chart with a dynamic, compact legend showing top 5 spending categories.
    - **Weekly Spending (25%)**: A new bar chart showing daily expense activity for the last 7 days.
- **Responsive Stacking**: The charts automatically transition from a horizontal row to a vertical stack on mobile devices.

### 2. Advanced Transaction Management
The Transactions page was engineered to handle complex data exploration through an elastic filtering system.
- **Search and Filter**: Users can search by description or category. I implemented a 250ms debounced search to prevent unnecessary re-renders.
- **Advanced Range Filtering**: Added support for filtering by Date Range (From/To) and Amount Range (Min/Max).
- **Multi-Field Sorting**: Transactions can be sorted by Date (Newest/Oldest) or Amount (Highest/Lowest).
- **Responsive Stack**: The control bar (Search and Filters) stacks vertically on mobile to prevent overflow.

### 3. Role-Based Access Control (RBAC)
The application includes a simulated role-based system (Admin and Viewer).
- **Admin**: Has full permissions to Add, Edit, and Delete transactions.
- **Viewer**: Has read-only access. The UI dynamically hides action buttons based on the user's current role.
- **State Management**: The role state is managed globally via the React Context API and persisted.

### 4. Client-Side Data Persistence
I implemented a robust persistence layer using the browser's `localStorage` to ensure a seamless experience.
- **v2 Engine**: Uses a versioned storage key (`finapp_v2`) to maintain data integrity across updates.
- **Synchronization**: Automatically syncs the transaction list and user preferences (Theme/Role) on every update.

### 5. Multi-Format Data Portability
Data can be exported via a consolidated "Save" dropdown.
- **CSV Export**: Consists of custom logic that converts JSON data into valid RFC 4180 CSV strings.
- **JSON Export**: Provides raw data export for external backup or programmatic use.

### 6. Premium UI/UX & Consistency
- **Glass-morphism**: Consistently applied across all cards and modals using backdrop-filters.
- **Themed Loading**: Created a custom `Loader` wrapper that uses `react-spinners`, ensuring a unified loading experience across Dashboard, Transactions, and Insights.
- **Transitions**: Global page entry animations and smooth layout shifts.

## Pages Overview

### Dashboard (`/`)
Central hub presenting all high-level metrics and visual trends on a single, non-scrolling row.

### Transactions (`/transactions`)
The functional workplace for data management with advanced filtering, sorting, and export tools.

### Insights (`/insights`)
Automated data analysis providing smart notifications on monthly trends, largest expenses, and peak category spending.

### NotFound (404)
A custom-designed error page that gracefully guides users back to the Dashboard.

## Challenges Encountered and Solutions

### 1. Multi-Chart Grid Density
- **Problem**: Fitting three charts onto one row made some legends disappear and items look cramped.
- **Solution**: I implemented a proportional grid (`2fr 1fr 1fr`) and built a "Compact Legend" system that only displays the top 5 categories, ensuring the most important data is always visible.

### 2. Complex Filter Intersections
- **Problem**: Simultaneously applying 8 different filters (Type, Category, Date, etc.) led to state conflicts.
- **Solution**: I centralized all filtering logic into a single `useMemo` block in `Transactions.jsx`, ensuring that results are always consistent regardless of the order filters are toggled.

### 3. Mobile Layout Overflows
- **Problem**: Fixed-width buttons and horizontal filters caused horizontal scroll on mobile.
- **Solution**: I completely refactored the media queries to force column stacking and set `max-width` constraints on action buttons for a fluid mobile experience.

## Installation and Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Toggle between Light/Dark modes and Admin/Viewer roles in the header for testing.
