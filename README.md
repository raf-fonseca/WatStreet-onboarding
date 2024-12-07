# Stock Visualization Onboarding Task

## Overview

Similar to your interview assignment, you'll create a fullscreen dashboard to visualize stock data using our tech stack.

This should take a few hours, but you have a lot of time (until the start of the new term). The purpose of this is so everyone's up to speed and we can get straight into our projects next term. Feel free to share ideas and ask questions, but please make individual submissions.

Feel free to take inspiration from the existing internal dashboard repo, but just mention in your pull request where you did that, if you do.

Please read through the entire instructions before starting. Good luck!

## Requirements

### Layout

-   Fullscreen dashboard layout
-   Main content area with a line chart
-   Sidebar showing stock metrics
-   Some kind of time range selector
-   Styling is fully up to you! Either reference our existing dashboard design or get creative on your own

#### Chart (Main Content)

-   Line chart showing AAPL stock price over time
-   Interactive tooltip showing price and timestamp on hover
-   Price on Y-axis, time on X-axis
-   Grid lines for better readability
-   Smooth transitions/animations (optional)

#### Stock Info (Sidebar)

Display metrics you get from the API.

### Technical Requirements

#### API Integration

The API route is at [https://ishaand.com/api/watstreet](https://ishaand.com/api/watstreet). Set this URL in an environment variable and use it to fetch data.

1. Implement timerange selection as a [URL query parameter](https://apipheny.io/what-are-api-parameters/)
2. Handle API errors properly
3. Implement proper TypeScript types for API responses
4. Use environment variables for API configuration

**Endpoint:** GET `/api/watstreet`

Returns mock stock data and metrics for different time ranges.

**Authentication:** Use this header

```bash
Authorization: Bearer sk-watstreet
```

**Query Parameters:**

-   `timerange` (required) - One of: `1d`, `1w`, `1m`, `1y`

**Example Request:**

```bash
curl -X GET 'https://ishaand.com/api/watstreet?timerange=1d' \
-H 'Auth: Bearer sk-watstreet'
```

#### Data Structure

You'll be working with this data structure from the API:

```typescript
type APIResponse = {
    ticker: string;
    data: StockData[];
    metrics: StockMetrics;
};

type StockData = {
    timestamp: string;
    price: number;
    volume: number;
};

type StockMetrics = {
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    marketCap: number;
};
```

#### Technologies

-   Next.js
-   React + TypeScript
-   visx for chart visualization
-   shadcn/ui for UI components
-   Tailwind CSS for styling

## Setup Instructions

1. Create a new [Next.js project with TypeScript](https://nextjs.org/docs)
2. Set up [shadcn/ui](https://ui.shadcn.com/docs/installation/next)
3. Create a `.env.local` file with:
    ```
    NEXT_PUBLIC_API_URL=https://ishaand.com/api/watstreet
    NEXT_PUBLIC_API_KEY=sk-watstreet
    ```

## Things You Should Think About

-   Clean, well-organized TypeScript code
-   Proper component structure and organization
-   Effective use of shadcn/ui components
-   Smooth user interactions and transitions
-   Code readability and maintainability
-   Proper error handling
-   Responsive design considerations

## Submission

1. Create a new branch: `feature/<name>-onboarding`

-   e.g. `feature/ishaan-onboarding`

2. Implement the required features
3. Create a pull request with:
    - Screen recording of your implementation
    - Brief explanation of your work
    - Any challenges you faced
    - Questions you have (optional)

## Bonus Features

If you finish early / want to go further, try these:

-   Loading states/skeletons
-   Responsive mobile view
-   Implement [sonner](https://ui.shadcn.com/docs/components/sonner) toasts for data fetching confirmations, promises, and errors
-   Anything else you can think of!

## Resources

-   Next.js docs: https://nextjs.org/docs
-   visx docs: https://airbnb.io/visx/
    -   Note that this based on [D3.js, their docs](https://d3js.org/) will be helpful
-   shadcn/ui docs: https://ui.shadcn.com/
