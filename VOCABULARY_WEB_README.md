# Vocabulary Web Feature

## Overview

The Vocabulary Web is a beautiful visual representation of a user's current knowledge level that updates over time as their knowledge improves. Each dot represents a single lexeme, and its color represents the user's confidence in that lexeme based on their placement test and study progress.

## Features

- **Interactive Visualization**: Each dot represents a lexeme with color-coded confidence levels
- **CEFR Level Organization**: Words are organized by CEFR levels (A1, A2, B1, B2, C1, C2)
- **Frequency-Based Layout**: Most common lexemes are closest to the center
- **Real-time Controls**: Adjust confidence percentages for each CEFR level
- **Interactive Navigation**: Pan, zoom, and hover for detailed information
- **Export Functionality**: Save the visualization as a PNG image

## How to Use

### Accessing the Vocabulary Web

1. Navigate to the home page of your language learning app
2. Click the "Vocabulary Web" button
3. You'll be taken to a full-screen visualization

### Understanding the Visualization

- **Red dots (10)**: High confidence - you know these words well
- **Orange dots (7)**: Medium-high confidence - you're familiar with these words
- **Yellow dots (5)**: Medium confidence - you have some knowledge of these words
- **Blue dots (1)**: Low confidence - you're still learning these words

### Controls

#### Display Settings
- **Point Size**: Adjust the size of all dots (1.0 to 5.0)
- **Recenter**: Reset the view to the center
- **Export PNG**: Save the current visualization as an image

#### CEFR Level Controls
For each CEFR level (A1-C2), you can adjust the percentage of words at each confidence level:
- **10 (Red)**: High confidence percentage
- **7 (Orange)**: Medium-high confidence percentage  
- **5 (Yellow)**: Medium confidence percentage
- **1 (Blue)**: Automatically calculated (remaining percentage)

### Navigation

- **Pan**: Click and drag to move around the visualization
- **Zoom**: Use mouse wheel to zoom in/out
- **Hover**: Hover over any dot to see detailed information (lemma, CEFR level, confidence)

## Technical Implementation

The Vocabulary Web is built using:
- **React** with TypeScript for the component structure
- **HTML5 Canvas** for the interactive visualization
- **Golden Angle Spiral** layout algorithm for optimal dot distribution
- **Deterministic sampling** for consistent confidence assignments
- **Responsive design** that works on different screen sizes

## Data Structure

Each lexeme in the visualization contains:
- `lemma`: The word or phrase
- `pos`: Part of speech
- `level`: CEFR level (A1, A2, B1, B2, C1, C2)
- `rank`: Frequency rank (lower = more common)
- `conf`: Confidence level (1, 5, 7, or 10)

## Future Enhancements

- **Real-time Data**: Connect to actual user study data
- **Progress Tracking**: Show how confidence levels change over time
- **Study Recommendations**: Suggest words to study based on current levels
- **Multiple Languages**: Support for different target languages
- **Mobile Optimization**: Touch-friendly controls for mobile devices

## Integration

The Vocabulary Web is accessible via:
- **Route**: `/vocabulary-web`
- **Home Page Button**: "Vocabulary Web" button on the main dashboard
- **Navigation**: Back button to return to home page

This feature provides users with an engaging and intuitive way to visualize their language learning progress, making it easier to understand their current knowledge gaps and celebrate their achievements.