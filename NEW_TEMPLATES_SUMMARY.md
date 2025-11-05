# Eight New Article Template Options

This document summarizes the 8 new article template options added to the article creation flow, designed with key principles in mind: minimizing interactions, using fill-in-the-blank templates, respecting experienced editors, and supporting newcomers.

## Design Principles Applied

1. **Minimal Interactions**: Each template uses fill-in-the-blank style with bracketed placeholders [like this] instead of dropdowns
2. **Intent Understanding**: Templates are grounded in specific article types (Films, TV Series, Books, etc.)
3. **Experience-Aware**: Templates are unobtrusive for experienced editors but provide helpful guidance for newcomers
4. **Contextual Guidance**: Modal sheets provide section-specific help with real Wikipedia examples
5. **No AI Dependency**: Pure template-based approach with manual fill-in-the-blank interaction

## The 8 New Templates

### 1. Films (culture-films)
**Location**: Culture > Film & Television > Films

**Introduction Template**:
```
'''[Film Title]''' is a [year] [genre] film directed by [director name].
The film stars [main cast] and follows [one-sentence plot summary].

Released on [date] by [studio/distributor], the film [notable achievement or reception].
```

**Sections**: Plot, Cast, Production, Music and soundtrack, Release, Reception

**Key Features**:
- Section-specific guidance for Plot (300-700 word length) and Reception (aggregate scores)
- Recommended sources: Variety, Hollywood Reporter, IndieWire, Rotten Tomatoes, Box Office Mojo
- Real examples from The Shawshank Redemption, Parasite, Inception, The Dark Knight

---

### 2. TV Series (culture-tv-series)
**Location**: Culture > Film & Television > TV Series

**Introduction Template**:
```
'''[Series Title]''' is a [genre] television series created by [creator name].
The series premiered on [date] on [network/platform] and [current status].

The show follows [brief premise] and stars [main cast members].
```

**Sections**: Premise, Cast and characters, Episodes, Production, Broadcast and release, Reception

**Key Features**:
- Guidance on keeping premise concise (2-3 paragraphs max)
- Recommended sources: Variety, Hollywood Reporter, Deadline, TV Guide, Entertainment Weekly
- Real example from Breaking Bad

---

### 3. Books/Novels (culture-literature-books)
**Location**: Culture > Literature > Books & Novels

**Introduction Template**:
```
'''[Book Title]''' is a [year] [genre] novel by [author name].
Published by [publisher], the book [brief description of subject matter].

The novel [notable reception, awards, or significance].
```

**Sections**: Plot summary, Characters, Themes and analysis, Publication history, Reception and legacy, Adaptations

**Key Features**:
- Plot summary guidance (400-700 words typical)
- Themes section requires published literary criticism
- Recommended sources: NY Times Books, The Guardian Books, Publishers Weekly, Kirkus Reviews
- Real example from To Kill a Mockingbird

---

### 4. Video Games (culture-video-games)
**Location**: Culture > Video Games > Video games

**Introduction Template**:
```
'''[Game Title]''' is a [year] [genre] video game developed by [developer] and published by [publisher].
Released for [platforms], the game [brief description of gameplay or story].

The game [notable achievement, sales, or critical reception].
```

**Sections**: Gameplay, Plot, Development, Release, Reception, Legacy

**Key Features**:
- Gameplay section focuses on core mechanics without excessive detail
- Reception requires professional gaming publications and aggregate scores
- Recommended sources: IGN, GameSpot, Polygon, Eurogamer, Metacritic
- Real example from The Legend of Zelda: Breath of the Wild

---

### 5. Companies (society-companies)
**Location**: Society > Organizations & Companies > Companies & Businesses

**Introduction Template**:
```
'''[Company Name]''' is a [type of company] headquartered in [location].
Founded in [year] by [founder(s)], the company [primary business activity].

[Notable fact about size, market position, or significance].
```

**Sections**: History, Products and services, Operations, Financial performance, Leadership and governance, Reception and criticism

**Key Features**:
- Financial section uses SEC filings and business publications
- Emphasizes neutral tone and avoiding promotional language
- Recommended sources: Bloomberg, Wall Street Journal, Financial Times, Forbes, Reuters
- Real examples from Apple Inc. and Tesla, Inc.

---

### 6. Buildings/Landmarks (geography-buildings)
**Location**: Geography > Landmarks & Buildings > Buildings & Architecture

**Introduction Template**:
```
'''[Building Name]''' is a [type of building] located in [location].
Completed in [year], the structure was designed by [architect] and [primary use or purpose].

The building [notable architectural feature or historical significance].
```

**Sections**: Architecture and design, History, Notable features, Current use, Cultural significance, Reception

**Key Features**:
- Architecture section explains design in accessible language
- Includes heritage designations and cultural importance
- Recommended sources: Architectural Digest, Dezeen, ArchDaily, The Architect's Newspaper
- Real example from Sydney Opera House

---

### 7. Sports Teams (society-sports-teams)
**Location**: Society > Organizations & Companies > Sports teams

**Introduction Template**:
```
'''[Team Name]''' is a professional [sport] team based in [location].
Founded in [year], the team competes in [league] and plays home games at [venue].

The team has won [championships or notable achievements].
```

**Sections**: History, Stadium and facilities, Rivalries, Achievements and records, Notable players, Fan culture and support

**Key Features**:
- Achievements section uses official league statistics
- Maintains neutral tone in rivalry descriptions
- Recommended sources: ESPN, Sports Illustrated, The Athletic, BBC Sport, Official League sources
- Real example from Manchester United F.C.

---

### 8. Historical Events (history-events)
**Location**: History > Historical Events > Major historical events

**Introduction Template**:
```
The '''[Event Name]''' was a [type of event] that took place on [date] in [location].
The event [brief description of what happened].

The event [significance or lasting impact].
```

**Sections**: Background, Event, Key participants, Aftermath, Legacy and significance, Commemoration

**Key Features**:
- Background provides necessary context without excessive detail
- Legacy section cites historical scholarship and diverse perspectives
- Recommended sources: History.com, Britannica, Smithsonian, National Archives, JSTOR
- Real examples from Apollo 11 and Fall of the Berlin Wall

---

## Implementation Details

### Modal Sheet Guidance
Each template includes section-specific guidance that appears in modal sheets when users need help with a particular section. For example:
- Film "Plot" section shows guidance on length and spoiler avoidance
- Book "Themes" section emphasizes using published criticism
- Company "Financials" section guides on using official sources

### Recommended Sources
Each template includes 4-5 recommended reliable sources specific to that article type, helping users find appropriate citations without searching.

### Real Wikipedia Examples
Key sections include actual examples from existing Wikipedia articles, showing users what good content looks like in practice.

### Category Integration
Templates are integrated into the existing category hierarchy:
- **Culture** now has subcategories for Film & Television, Literature, and Video Games
- **Society** now distinguishes Companies & Businesses and Sports teams
- **Geography** now has Buildings & Architecture
- **History** now has Major historical events with dedicated template

## User Experience Benefits

1. **Quick Start**: Users see relevant section structures immediately based on article type
2. **Guided Writing**: Fill-in-the-blank placeholders show exactly what information goes where
3. **Quality Assurance**: Section guidance prevents common mistakes (excessive detail, wrong sources)
4. **Discovery**: Modal sheets with examples help users understand Wikipedia standards
5. **Efficiency**: Experienced editors can quickly skip guidance and start writing
6. **Support**: Newcomers get comprehensive help without feeling overwhelmed

## Technical Implementation

- All templates follow consistent structure with `introduction`, `sections`, `sectionGuidance`, and `guidelines`
- Templates integrate seamlessly with existing category selector UI
- Each template links to relevant Wikipedia notability guidelines
- Modal sheets dynamically load section examples and guidance on demand
