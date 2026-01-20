# Travel Planner - AI-Powered Travel Itinerary Generator

An intelligent, AI-powered travel planning application that generates personalized travel itineraries using Google Gemini AI. The application creates detailed day-by-day travel plans with destination highlights, activities, and budget estimates.

## 🌟 Features

- **AI-Powered Planning**: Generate comprehensive travel plans using Google Gemini AI
- **Smart Caching**: Automatically checks database before generating new plans to save API costs
- **Dynamic Content**: All content including images, highlights, and itineraries are dynamically generated
- **SEO Optimized**: Server-rendered pages with proper meta tags for social sharing
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Image Integration**: Automatic image fetching from Unsplash API
- **Social Sharing**: One-click Facebook sharing with proper Open Graph tags

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Google Gemini 2.0 Flash
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Image API**: Unsplash API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([Get it here](https://ai.google.dev/gemini-api/docs/api-key))
- Unsplash API key ([Get it here](https://unsplash.com/developers))

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment-8-travel-planner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-planner?retryWrites=true&w=majority

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Unsplash API Key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Site URL (for social sharing meta tags)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: For production, update `NEXT_PUBLIC_SITE_URL` to your actual domain.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Application Flow

### 1. Home Page (`/`)

- **Prompt Input Field**: Users enter their travel request (e.g., "A romantic 4-day trip to Paris")
- **Travel Validation**: System validates if the prompt is travel-related
- **Latest Plans Display**: Shows 3-4 most recently generated travel plans from database
- **Empty State**: If no plans exist, shows a friendly message

### 2. Plan Generation Flow (`/api/plans/generate`)

When a user submits a prompt:

1. **Input Validation**
   - Checks if prompt is non-empty
   - Validates prompt contains travel-related keywords
   - Extracts destination and duration from prompt

2. **Database Check**
   - Searches MongoDB for existing plan with matching destination and duration
   - If found, returns existing plan slug (no API call needed)
   - If not found, proceeds to generation

3. **AI Generation** (if needed)
   - Calls Google Gemini API with structured prompt
   - Receives JSON response with:
     - Title and description
     - 4-6 highlights (attractions, food, tips, budget)
     - Day-by-day itinerary with activities
     - Budget estimate

4. **Image Fetching**
   - Fetches destination hero image from Unsplash
   - Fetches images for each day based on activities

5. **Database Storage**
   - Creates unique slug (e.g., `paris-romantic-4-days`)
   - Saves complete plan to MongoDB Atlas
   - Returns slug to redirect user

6. **Redirect**
   - User is redirected to `/plan/[slug]` page

### 3. Plan Details Page (`/plan/[slug]`)

- **Server-Side Rendering**: Page is rendered on server for SEO
- **Dynamic Content**: All content loaded from database
- **Components**:
  - **Hero Section**: Destination image, title, description, duration
  - **Destination Highlights**: Attractions, food, tips, budget cards
  - **Itinerary**: Day-by-day breakdown with activities and times
- **Social Sharing**: Facebook share button with proper meta tags
- **404 Handling**: Shows not-found page if slug doesn't exist

### 4. Direct Slug Access

- User can directly visit `/plan/[slug]` URL
- System checks database for slug
- If found: displays plan
- If not found: shows 404 page

## 🏗️ Core Functionalities

### 1. Prompt Processing & Validation

**Location**: `app/api/plans/generate/route.js`

- Validates prompt is travel-related using keyword matching
- Extracts destination using regex patterns
- Extracts duration (number of days)
- Returns appropriate error messages for invalid inputs

**Keywords Checked**: travel, trip, visit, tour, vacation, journey, destination, itinerary, explore, adventure, holiday, sightseeing, days, day

### 2. Database Optimization

**Location**: `app/api/plans/generate/route.js` (lines 103-116)

- Checks MongoDB before generating new plan
- Prevents duplicate API calls for same destination + duration
- Reduces API costs significantly
- Returns existing plan slug if match found

**Query**:
```javascript
TravelPlan.findOne({
  destination: { $regex: new RegExp(destination, 'i') },
  duration: duration
})
```

### 3. AI Plan Generation

**Location**: `lib/gemini.js`

- Uses Google Gemini 2.0 Flash model
- Structured JSON response format
- Generates:
  - Compelling title
  - Engaging description (100+ characters)
  - 4-6 highlights with icons and colors
  - Complete day-by-day itinerary
  - Budget estimates

**Prompt Engineering**: Detailed prompt with examples and requirements ensures consistent output format.

### 4. Image Management

**Location**: `lib/images.js`

- **Destination Images**: Fetches from Unsplash based on destination name
- **Day Images**: Fetches based on destination + activity keywords
- **Fallback**: Default images if API fails or key not set
- **Caching**: Images stored in database, not re-fetched

**Unsplash Integration**:
- Search API for destination photos
- Landscape orientation
- High-quality images
- Error handling with fallbacks

### 5. Slug Generation

**Location**: `lib/slug.js`

- Creates URL-friendly slugs from destination and duration
- Ensures uniqueness by checking database
- Format: `destination-duration-days` (e.g., `paris-romantic-4-days`)
- Handles duplicates by appending numbers

### 6. Server-Side Rendering

**Location**: `app/plan/[slug]/page.jsx`

- **Metadata Generation**: Dynamic meta tags for SEO
- **Open Graph Tags**: Proper tags for Facebook sharing
- **Twitter Cards**: Summary cards for Twitter
- **404 Handling**: Uses Next.js `notFound()` function

**Metadata Includes**:
- Title: "Plan Title - X Day Travel Plan"
- Description: Plan description
- Image: Destination image
- URL: Full canonical URL

### 7. Social Sharing

**Location**: `components/Plan/PlanNavbar.jsx`

- Facebook share button
- Opens Facebook share dialog
- Uses current page URL
- Proper Open Graph tags ensure rich previews

**Implementation**:
```javascript
window.open(
  `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  'facebook-share-dialog',
  'width=626,height=436'
);
```

### 8. Latest Plans Display

**Location**: `components/Home/Feature.jsx` & `app/api/plans/latest/route.js`

- Fetches 3-4 latest plans from database
- Sorted by creation date (newest first)
- Displays as cards with images
- Empty state if no plans exist
- Clickable cards navigate to plan pages

**Query**:
```javascript
TravelPlan.find()
  .sort({ createdAt: -1 })
  .limit(3)
  .select('slug destination duration title description imageUrl')
```

## 📁 Project Structure

```
assignment-8-travel-planner/
├── app/
│   ├── api/
│   │   └── plans/
│   │       ├── [slug]/
│   │       │   └── route.js          # Get plan by slug API
│   │       ├── generate/
│   │       │   └── route.js          # Generate plan API
│   │       └── latest/
│   │           └── route.js          # Get latest plans API
│   ├── plan/
│   │   └── [slug]/
│   │       ├── page.jsx              # Plan details page (SSR)
│   │       └── not-found.jsx        # 404 page
│   ├── layout.js                     # Root layout
│   └── page.js                       # Home page
├── components/
│   ├── Home/
│   │   ├── Feature.jsx               # Latest plans display
│   │   ├── HeroSection.jsx           # Home hero
│   │   ├── HomeNavbar.jsx            # Home navigation
│   │   ├── HomeFooter.jsx            # Home footer
│   │   └── PromptField.jsx           # Prompt input component
│   └── Plan/
│       ├── DestinationHighlights.jsx # Highlights section
│       ├── Itinerary.jsx             # Day-by-day itinerary
│       ├── PlanHeroSection.jsx       # Plan hero section
│       ├── PlanNavbar.jsx            # Plan navigation + share
│       └── PlanFooter.jsx            # Plan footer
├── lib/
│   ├── gemini.js                     # Gemini AI integration
│   ├── images.js                     # Unsplash API integration
│   ├── mongodb.js                    # MongoDB connection
│   └── slug.js                       # Slug generation
├── models/
│   └── TravelPlan.js                 # Mongoose schema
└── public/                           # Static assets
```

## 🔄 API Endpoints

### POST `/api/plans/generate`

Generate a new travel plan or retrieve existing one.

**Request Body**:
```json
{
  "prompt": "A romantic 4-day trip to Paris"
}
```

**Response** (Success):
```json
{
  "slug": "paris-romantic-4-days",
  "message": "Travel plan generated successfully"
}
```

**Response** (Existing Plan):
```json
{
  "slug": "paris-romantic-4-days",
  "message": "Plan found in database"
}
```

### GET `/api/plans/[slug]`

Get travel plan by slug.

**Response**:
```json
{
  "_id": "...",
  "slug": "paris-romantic-4-days",
  "destination": "Paris",
  "duration": 4,
  "title": "Paris: The Ultimate City of Lights",
  "description": "...",
  "imageUrl": "...",
  "highlights": [...],
  "itinerary": [...],
  "budget": "€500 - €800 per person"
}
```

### GET `/api/plans/latest?limit=4`

Get latest travel plans.

**Query Parameters**:
- `limit` (optional): Number of plans to return (default: 4, max: 10)

**Response**:
```json
{
  "plans": [...],
  "count": 4
}
```

## ✅ Requirements Checklist

### Core Requirements

- ✅ **AI-Based Travel Planner**: Uses Google Gemini AI for plan generation
- ✅ **Prompt Input Field**: Home page has prompt input that redirects to plan page
- ✅ **Dynamic Plan Page**: All content (images, text, highlights, itinerary) is dynamic
- ✅ **Server-Rendered Plan Page**: Plan pages are SSR with slug-based URLs
- ✅ **Database Check Before Generation**: Checks MongoDB before calling Gemini API
- ✅ **Travel Prompt Validation**: Validates prompts contain travel-related keywords
- ✅ **MongoDB Atlas**: Uses MongoDB Atlas (not local MongoDB)
- ✅ **Plan Storage**: All generated plans saved to database
- ✅ **Image API Integration**: Uses Unsplash API for images
- ✅ **Facebook Share Button**: Share button in plan navbar
- ✅ **Meta Tags**: Proper Open Graph and Twitter meta tags
- ✅ **Direct Slug Access**: Handles direct `/plan/[slug]` access with 404 for invalid slugs
- ✅ **Latest Plans Display**: Home page shows 3-4 latest plans from database

### Technical Requirements

- ✅ **Environment Variables**: All keys in `.env.local` file
- ✅ **MongoDB Atlas**: Database hosted on MongoDB Atlas
- ✅ **Gemini API**: Properly integrated with structured output

## 🎨 UI/UX Features

- **Modern Design**: Clean, modern interface with gradient effects
- **Responsive Layout**: Works seamlessly on mobile, tablet, and desktop
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: User-friendly error messages
- **Smooth Transitions**: CSS animations and transitions
- **Image Optimization**: Next.js Image component for optimized images
- **Accessibility**: Semantic HTML and proper ARIA labels

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- Vercel: Add in Project Settings → Environment Variables
- Netlify: Add in Site Settings → Environment Variables
- Other platforms: Follow their respective documentation

### MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
4. Get connection string and add to `MONGODB_URI`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔧 Configuration

### MongoDB Connection

Connection is handled in `lib/mongodb.js` with automatic reconnection handling.

### Gemini API

- Model: `gemini-2.0-flash-exp`
- Response Format: JSON
- Error handling with fallbacks

### Unsplash API

- Search endpoint for destination images
- Activity-based search for day images
- Fallback to default images on error

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB Atlas connection string
   - Verify IP whitelist includes your IP
   - Check database user credentials

2. **Gemini API Errors**
   - Verify API key is correct
   - Check API quota/limits
   - Ensure prompt format is correct

3. **Image Loading Issues**
   - Verify Unsplash API key
   - Check image URLs in database
   - Verify Next.js image domain configuration

4. **Slug Not Found**
   - Check database for existing plans
   - Verify slug generation logic
   - Check URL format

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

This is an assignment project. Contributions and suggestions are welcome!

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using Next.js, Google Gemini AI, and MongoDB Atlas**
