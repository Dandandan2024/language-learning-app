# Vocabulary Web Feature

## Overview

The Vocabulary Web is a beautiful visual representation of a user's current knowledge level that updates over time as their knowledge improves. Each dot represents a single lexeme, and its color represents the user's confidence in that lexeme based on their placement test and study progress.

**Key Change**: The color coding is now **automatically calculated** based on the user's actual study performance and cannot be manually adjusted. This provides a true reflection of their current knowledge level.

## Features

- **Data-Driven Visualization**: Each dot represents a lexeme with color-coded confidence levels based on actual study data
- **CEFR Level Organization**: Words are organized by CEFR levels (A1, A2, B1, B2, C1, C2)
- **Frequency-Based Layout**: Most common lexemes are closest to the centre
- **Real-time Data**: Pulls live data from your study database
- **Interactive Navigation**: Pan, zoom, and hover for detailed information
- **Export Functionality**: Save the visualization as a PNG image

## How Confidence is Calculated

The confidence level for each word is automatically determined by analyzing:

1. **Stability Score**: How well the word is retained in long-term memory
2. **Difficulty Rating**: How challenging the word is for the user
3. **Recent Performance**: Average rating from the last 5 reviews (1-4 scale)
4. **Study History**: Number of lapses and repetitions
5. **Study Status**: Whether the word is suspended or active

### Confidence Levels

- **Red dots (10) - Mastered**: High stability, low difficulty, consistent good performance
- **Orange dots (7) - Well Known**: Good stability, moderate difficulty, mostly good performance
- **Yellow dots (5) - Familiar**: Moderate stability, some difficulty, mixed performance
- **Blue dots (1) - Learning**: Low stability, high difficulty, or never studied

## How to Use

### Accessing the Vocabulary Web

1. Navigate to the home page of your language learning app
2. Click the "Vocabulary Web" button
3. You'll be taken to a full-screen visualization

### Understanding the Visualization

The visualization automatically loads your current vocabulary data and displays:
- **Word Distribution**: All lexemes in your vocabulary database
- **Progress Tracking**: Real-time confidence levels based on study performance
- **Learning Gaps**: Areas where you need more practice (blue dots)
- **Achievements**: Words you've mastered (red dots)

### Controls

#### Display Settings
- **Point Size**: Adjust the size of all dots (1.0 to 5.0)
- **Recenter**: Reset the view to the center
- **Export PNG**: Save the current visualization as an image

### Navigation

- **Pan**: Click and drag to move around the visualization
- **Zoom**: Use mouse wheel to zoom in/out
- **Hover**: Hover over any dot to see detailed information (lemma, CEFR level, confidence status)

## Technical Implementation

The Vocabulary Web is built using:
- **React** with TypeScript for the component structure
- **HTML5 Canvas** for the interactive visualization
- **Golden Angle Spiral** layout algorithm for optimal dot distribution
- **Database Integration** with Prisma for real-time data fetching
- **Intelligent Confidence Algorithm** based on spaced repetition metrics
- **Responsive design** that works on different screen sizes

## Data Sources

The visualization pulls data from your database:

1. **Lexemes**: All vocabulary words with CEFR levels and frequency ranks
2. **LexemeStates**: User's progress tracking (stability, difficulty, reps, lapses)
3. **Reviews**: Study session results and performance ratings
4. **User Authentication**: Secure access to personal study data

## API Endpoint

The component fetches data from `/api/vocabulary-web/data` which:
- Authenticates the user session
- Fetches all lexemes ordered by frequency
- Retrieves user-specific study states and review history
- Returns structured data for confidence calculation

## Confidence Algorithm

The confidence calculation uses a weighted approach:

```typescript
baseConfidence = stability * 0.6 + (1 - difficulty) * 0.4
ratingBonus = (averageRating - 2.5) * 0.2  // -0.3 to +0.3
lapsePenalty = Math.min(lapses * 0.1, 0.3)  // Max 0.3 penalty
finalConfidence = baseConfidence + ratingBonus - lapsePenalty
```

This provides a nuanced understanding of each word's retention status.

## Future Enhancements

- **Progress Tracking**: Show how confidence levels change over time
- **Study Recommendations**: Suggest words to study based on current levels
- **Multiple Languages**: Support for different target languages
- **Mobile Optimization**: Touch-friendly controls for mobile devices
- **Real-time Updates**: Live updates as study sessions are completed

## Integration

The Vocabulary Web is accessible via:
- **Route**: `/vocabulary-web`
- **Home Page Button**: "Vocabulary Web" button on the main dashboard
- **Navigation**: Back button to return to home page
- **API**: `/api/vocabulary-web/data` for data fetching

## Benefits

This data-driven approach provides:
- **Accurate Assessment**: Real confidence levels based on actual performance
- **Motivation**: Visual progress tracking and achievement recognition
- **Study Planning**: Clear identification of areas needing attention
- **Transparency**: Honest reflection of current knowledge state
- **Engagement**: Beautiful, interactive visualization of learning journey

The Vocabulary Web now serves as a true mirror of your language learning progress, automatically updating as you study and providing insights that help guide your learning journey.