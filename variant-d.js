import { initToolbarInteractions } from './chrome.js';
import { applyCodexIcons } from './icons.js';
import { ARTICLE_TYPES } from './shared-data.js';

const canvas = document.getElementById('canvas');
const sectionSheet = document.getElementById('sectionSheet');
const sheetContent = document.getElementById('sheetContent');
const closeSheet = document.getElementById('closeSheet');
const sheetTypeToggle = document.getElementById('sheetTypeToggle');
const categorySheet = document.getElementById('categorySheet');
const categoryContent = document.getElementById('categoryContent');
const closeCategorySheet = document.getElementById('closeCategorySheet');
let categoryBackBtn = document.getElementById('categoryBackBtn');
const categorySheetTitle = document.getElementById('categorySheetTitle');
const citationSheet = document.getElementById('citationSheet');
const citationContent = document.getElementById('citationContent');
const closeCitationSheet = document.getElementById('closeCitationSheet');
const citationBackBtn = document.getElementById('citationBackBtn');
const citationSearchInput = document.getElementById('citationSearchInput');
const addCitationBtn = document.getElementById('addCitationBtn');
const recommendedSourcesContainer = document.getElementById('recommendedSourcesContainer');
const recommendedSourcesChips = document.getElementById('recommendedSourcesChips');
let currentType = ARTICLE_TYPES[0];
let sheetBackdrop = null;
let categoryBackdrop = null;
let citationBackdrop = null;
let navigationStack = [];
let selectedCategory = null; // Track selected category for contextual menu
let insertedSections = []; // Track what sections are already added
let modalContext = null; // Track which modal context is active: 'category' or 'examples'
let slashReminderShown = false; // Track if slash reminder has been shown
let slashReminderDismissed = false; // Track if user dismissed reminder

// Section-specific examples from Wikipedia
const SECTION_EXAMPLES = {
  'introduction': {
    heading: 'Example introductions from Wikipedia',
    examples: [
      {
        title: 'Serena Williams',
        text: '<b>Serena Williams</b> (born September 26, 1981) is an American former professional tennis player. Widely regarded as one of the greatest tennis players of all time, she was ranked world No. 1 in singles by the Women\'s Tennis Association (WTA) for 319 weeks, including a joint-record 186 consecutive weeks.',
        url: 'https://en.wikipedia.org/wiki/Serena_Williams'
      },
      {
        title: 'Lionel Messi',
        text: '<b>Lionel Messi</b> (born 24 June 1987) is an Argentine professional footballer who plays as a forward for and captains both Major League Soccer club Inter Miami and the Argentina national team. Widely regarded as one of the greatest players of all time, Messi has won a record eight Ballon d\'Or awards.',
        url: 'https://en.wikipedia.org/wiki/Lionel_Messi'
      }
    ]
  },
  'early-life': {
    heading: 'Example "Early life" sections from Wikipedia',
    examples: [
      {
        title: 'Serena Williams',
        text: 'Williams was born on September 26, 1981, in Saginaw, Michigan, to Oracene Price and Richard Williams. She is the youngest of Price\'s five daughters, and has four older sisters: half-sisters Yetunde, Lyndrea, and Isha Price, and full sister Venus. When the children were young, the family moved to Compton, California, where Williams started playing tennis at age four. Her father home-schooled Williams and her sister Venus and, since they were young, took them to public tennis courts.',
        url: 'https://en.wikipedia.org/wiki/Serena_Williams#Early_life'
      },
      {
        title: 'Barack Obama',
        text: 'Obama was born on August 4, 1961, at Kapiolani Medical Center for Women and Children in Honolulu, Hawaii. He is the only president born outside the contiguous 48 states. He was born to an American mother and a Kenyan father. His mother, Ann Dunham, was born in Wichita, Kansas, and spent much of her childhood in the Seattle area. His father, Barack Obama Sr., was a Luo from Nyang\'oma Kogelo, Kenya.',
        url: 'https://en.wikipedia.org/wiki/Barack_Obama#Early_life_and_career'
      }
    ]
  },
  'career': {
    heading: 'Example "Career" sections from Wikipedia',
    examples: [
      {
        title: 'Serena Williams',
        text: 'Williams turned professional in 1995 and won her first major championship in 1999 at the US Open. She captured her 23rd Grand Slam singles title at the 2017 Australian Open, passing Steffi Graf to become the Open Era leader. Williams has won 14 Grand Slam doubles titles, all with her sister Venus, and the pair are unbeaten in Grand Slam doubles finals. Williams is also a four-time Olympic gold medalist, having won one in singles and three in women\'s doubles.',
        url: 'https://en.wikipedia.org/wiki/Serena_Williams#Professional_career'
      },
      {
        title: 'Taylor Swift',
        text: 'Swift signed a record deal with Big Machine Records in 2005 and released her eponymous debut studio album the following year. With 157 weeks on the Billboard 200 by December 2009, the album was the longest-charting album of the 2000s decade. Swift\'s second studio album, Fearless (2008), topped the Billboard 200 for 11 weeks and was the only album from the 2000s decade to spend one year in the top 10.',
        url: 'https://en.wikipedia.org/wiki/Taylor_Swift#2004%E2%80%932008:_Career_beginnings_and_Fearless'
      }
    ]
  },
  'personal-life': {
    heading: 'Example "Personal life" sections from Wikipedia',
    examples: [
      {
        title: 'Serena Williams',
        text: 'Williams began dating Reddit co-founder Alexis Ohanian in October 2015. They became engaged in December 2016 and married on November 16, 2017, in New Orleans. Their daughter, Alexis Olympia Ohanian Jr., was born on September 1, 2017. Williams announced her second pregnancy during the 2023 Met Gala, and gave birth to her daughter Adira River Ohanian on August 22, 2023.',
        url: 'https://en.wikipedia.org/wiki/Serena_Williams#Personal_life'
      },
      {
        title: 'Elon Musk',
        text: 'Musk has been married three times, twice to actress Talulah Riley. He has had relationships with Canadian musician Grimes and Shivon Zilis, an executive at Neuralink. Musk has eleven living children. He practices intermittent fasting and identifies as a cultural Christian. Musk has expressed concern about the decline in birth rates in developed countries and advocates for increasing birth rates.',
        url: 'https://en.wikipedia.org/wiki/Elon_Musk#Personal_life'
      }
    ]
  },
  'work': {
    heading: 'Example "Work and contributions" sections from Wikipedia',
    examples: [
      {
        title: 'Marie Curie',
        text: 'Curie\'s achievements include the development of the theory of radioactivity, techniques for isolating radioactive isotopes, and the discovery of two elements, polonium and radium. Under her direction, the world\'s first studies were conducted into the treatment of neoplasms using radioactive isotopes. She founded the Curie Institutes in Paris and in Warsaw, which remain major centres of medical research today.',
        url: 'https://en.wikipedia.org/wiki/Marie_Curie#Scientific_career'
      }
    ]
  },
  'awards': {
    heading: 'Example "Awards and honors" sections from Wikipedia',
    examples: [
      {
        title: 'Meryl Streep',
        text: 'Streep has received numerous accolades, including a record 21 Academy Award nominations, winning three, and a record 34 Golden Globe Award nominations, winning eight. She has also received two British Academy Film Awards, two Screen Actors Guild Awards, and three Primetime Emmy Awards, in addition to nominations for a Tony Award and six Grammy Awards.',
        url: 'https://en.wikipedia.org/wiki/Meryl_Streep#Accolades'
      }
    ]
  },
  'playing-style': {
    heading: 'Example "Playing style" sections from Wikipedia',
    examples: [
      {
        title: 'Serena Williams',
        text: 'Williams\'s aggressive playing style is characterized by powerful groundstrokes and a strong serve. Her serve has been described as one of the greatest in the history of the game. She hits with heavy topspin and is known for her ability to hit winners from anywhere on the court. Her athleticism, court coverage, and mental toughness have been widely praised by players, coaches, and tennis commentators.',
        url: 'https://en.wikipedia.org/wiki/Serena_Williams#Playing_style'
      }
    ]
  },
  'early-career': {
    heading: 'Example "Early career" sections from Wikipedia',
    examples: [
      {
        title: 'Virat Kohli',
        text: 'Kohli was the captain of the victorious Indian team at the 2008 Under-19 World Cup held in Malaysia. He scored 235 runs in six matches at an average of 47 and was the leading run-scorer for India in the tournament. His performances in youth cricket earned him a call-up to the Delhi Ranji Trophy team. He made his Ranji Trophy debut for Delhi against Tamil Nadu in November 2006 at the age of 18.',
        url: 'https://en.wikipedia.org/wiki/Virat_Kohli#Early_career'
      },
      {
        title: 'Sachin Tendulkar',
        text: 'Tendulkar made his Test debut against Pakistan in Karachi in November 1989 aged 16 years and 205 days. He scored 15 runs, being bowled by Waqar Younis in his first innings, and was run out for 59 runs in his second. He made his first Test century in August 1990 against England in Manchester. At the age of 17 years and 112 days, he became the second-youngest player to score a Test century.',
        url: 'https://en.wikipedia.org/wiki/Sachin_Tendulkar#Early_career'
      }
    ]
  },
  'major-league': {
    heading: 'Example "Major league career" sections from Wikipedia',
    examples: [
      {
        title: 'MS Dhoni',
        text: 'Dhoni made his One Day International (ODI) debut in December 2004 against Bangladesh, and played his first Test match a year later against Sri Lanka. In 2007, he took over the ODI captaincy from Rahul Dravid. Under his captaincy, India won the 2007 ICC World Twenty20, the 2010 and 2016 Asia Cups, the 2011 ICC Cricket World Cup and the 2013 ICC Champions Trophy.',
        url: 'https://en.wikipedia.org/wiki/MS_Dhoni#International_career'
      },
      {
        title: 'AB de Villiers',
        text: 'De Villiers made his international debut in a Test match against England in 2004 and first played an ODI in early 2005. His debut in Twenty20 International cricket came in 2006. He primarily played as a wicket-keeper-batsman in limited overs cricket. He scored over 8,000 runs in both Test and ODI cricket and is the only batsman in the history of cricket to average above 50 with a strike rate of above 100.',
        url: 'https://en.wikipedia.org/wiki/AB_de_Villiers#International_career'
      }
    ]
  },
  'statistics': {
    heading: 'Example "Career statistics" sections from Wikipedia',
    examples: [
      {
        title: 'Sachin Tendulkar',
        text: 'Tendulkar is the leading run scorer of all time in international cricket, and the only player to have scored one hundred international centuries, the first batsman to score a double century in an ODI, the holder of the record for the number of runs in both Test and ODI cricket, and the only player to complete more than 30,000 runs in international cricket.',
        url: 'https://en.wikipedia.org/wiki/Sachin_Tendulkar#Career_statistics'
      },
      {
        title: 'Jacques Kallis',
        text: 'As of October 2013, Kallis has scored 13,289 runs in Test cricket at an average of 55.37 with 45 centuries. He has taken 292 wickets at an average of 32.65. In One Day Internationals, he has scored 11,579 runs at an average of 44.36 with 17 centuries. He has taken 273 wickets at an average of 31.79.',
        url: 'https://en.wikipedia.org/wiki/Jacques_Kallis#Career_statistics'
      }
    ]
  },
  'olympic-career': {
    heading: 'Example "Olympic career" sections from Wikipedia',
    examples: [
      {
        title: 'Simone Biles',
        text: 'At the 2016 Summer Olympics in Rio de Janeiro, Biles won individual gold medals in the all-around, vault, and floor exercise, bronze on balance beam, and gold as part of the United States team, dubbed the "Final Five". At the 2020 Summer Olympics in Tokyo, held in 2021, she won bronze on balance beam and, as part of the United States team, silver in the team all-around.',
        url: 'https://en.wikipedia.org/wiki/Simone_Biles#Olympic_career'
      },
      {
        title: 'Usain Bolt',
        text: 'Bolt is an eight-time Olympic gold medalist. At the 2008 Beijing Olympics, he won the 100 metres, 200 metres and 4×100 metres relay, all in world record times. He duplicated this feat at the 2012 London Olympics, becoming the first man to win both the 100 and 200 metres at successive Olympic Games. He won a third gold medal in the 100 metres at the 2016 Rio Olympics.',
        url: 'https://en.wikipedia.org/wiki/Usain_Bolt#Olympic_career'
      }
    ]
  },
  'other-competitions': {
    heading: 'Example "Other competitions" sections from Wikipedia',
    examples: [
      {
        title: 'Katie Ledecky',
        text: 'At the 2013 World Aquatics Championships in Barcelona, Ledecky won gold in the 400-, 800-, and 1500-meter freestyle, and in the 4×200-meter freestyle relay. At the 2015 World Championships in Kazan, Russia, Ledecky won five gold medals and broke three world records. She won the 200-, 400-, 800-, and 1500-meter freestyle events and anchored the winning 4×200-meter freestyle relay.',
        url: 'https://en.wikipedia.org/wiki/Katie_Ledecky#World_Championships'
      }
    ]
  },

  // NEW SECTION EXAMPLES FOR 8 NEW TEMPLATES

  // Films
  'plot': {
    heading: 'Example "Plot" sections from Wikipedia',
    examples: [
      {
        title: 'The Shawshank Redemption',
        text: 'In 1947, banker Andy Dufresne is convicted of murdering his wife and her lover and sentenced to two consecutive life sentences at Shawshank State Penitentiary in Maine. He is befriended by Ellis "Red" Redding, an inmate and prison contraband smuggler serving a life sentence. Andy finds his existence in prison difficult, and is harassed by the prison gang "the Sisters" and their leader, Bogs. In 1949, Andy overhears the captain of the guards, Byron Hadley, complaining about being taxed on an inheritance and offers to help him shelter the money legally.',
        url: 'https://en.wikipedia.org/wiki/The_Shawshank_Redemption#Plot'
      },
      {
        title: 'Parasite (2019 film)',
        text: 'The Kim family—father Ki-taek, mother Chung-sook, daughter Ki-jung, and son Ki-woo—live in a cramped semi-basement apartment, struggling to make ends meet. One day, Ki-woo\'s friend Min-hyuk, who is leaving to study abroad, suggests that Ki-woo take over his job tutoring the daughter of the wealthy Park family. Ki-woo poses as a university student and is hired by the Parks. Impressed by Ki-woo, Mrs. Park asks him if he knows an art tutor for her young son; Ki-woo recommends his sister Ki-jung, who poses as "Jessica," an art therapy expert.',
        url: 'https://en.wikipedia.org/wiki/Parasite_(2019_film)#Plot'
      }
    ]
  },
  'cast': {
    heading: 'Example "Cast" sections from Wikipedia',
    examples: [
      {
        title: 'Inception',
        text: '<b>Leonardo DiCaprio</b> as Dom Cobb, a professional thief who specializes in extracting information from the subconscious. <b>Ken Watanabe</b> as Saito, a Japanese businessman who employs Cobb. <b>Joseph Gordon-Levitt</b> as Arthur, Cobb\'s partner. <b>Marion Cotillard</b> as Mal Cobb, Dom\'s deceased wife. <b>Elliot Page</b> as Ariadne, a graduate student of architecture recruited to construct the dream worlds.',
        url: 'https://en.wikipedia.org/wiki/Inception#Cast'
      }
    ]
  },
  'reception': {
    heading: 'Example "Reception" sections from Wikipedia',
    examples: [
      {
        title: 'The Dark Knight',
        text: 'The Dark Knight received widespread critical acclaim. On Rotten Tomatoes, the film holds an approval rating of 94% based on 345 reviews, with an average rating of 8.6/10. On Metacritic, the film has a score of 84 out of 100 based on 39 critics, indicating "universal acclaim". Roger Ebert of the Chicago Sun-Times gave the film four stars out of four and described it as a "haunted film that leaps beyond its origins and becomes an engrossing tragedy." The film won two Academy Awards: Best Sound Editing and Best Supporting Actor for Heath Ledger.',
        url: 'https://en.wikipedia.org/wiki/The_Dark_Knight#Critical_response'
      }
    ]
  },

  // TV Series
  'premise': {
    heading: 'Example "Premise" sections from Wikipedia',
    examples: [
      {
        title: 'Breaking Bad',
        text: 'Set in Albuquerque, New Mexico, between 2008 and 2010, Breaking Bad follows Walter White, a struggling high school chemistry teacher who is diagnosed with inoperable, advanced lung cancer. Together with his former student Jesse Pinkman, White turns to a life of crime by producing and selling methamphetamine to secure his family\'s financial future before he dies, while navigating the dangers of the criminal underworld.',
        url: 'https://en.wikipedia.org/wiki/Breaking_Bad#Premise'
      }
    ]
  },

  // Books
  'themes': {
    heading: 'Example "Themes" sections from Wikipedia',
    examples: [
      {
        title: 'To Kill a Mockingbird',
        text: 'Scholars have noted that Lee addresses issues of class, courage, compassion, and gender roles in the Deep South. The book is widely taught in schools in the United States with lessons that emphasize tolerance and decry prejudice. Despite its widespread use in classrooms, the novel has been the subject of campaigns for removal due to its use of racial epithets. The novel has been noted for its poignant exploration of different forms of courage and for Scout\'s progression from childhood innocence to a more adult perspective.',
        url: 'https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird#Themes'
      }
    ]
  },

  // Video Games
  'gameplay': {
    heading: 'Example "Gameplay" sections from Wikipedia',
    examples: [
      {
        title: 'The Legend of Zelda: Breath of the Wild',
        text: 'Breath of the Wild is an action-adventure game set in an open world where players are tasked with exploring the kingdom of Hyrule while controlling Link. Players can travel anywhere in the game world, discovering over 100 shrines (mini-dungeons) and four Divine Beasts (large dungeons). The game features a physics engine that allows for environmental interactions and puzzle-solving. Players can climb most surfaces, swim, paraglide, and cook meals that provide various benefits. Combat involves melee weapons, bows, and shields, with a weapon degradation system.',
        url: 'https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild#Gameplay'
      }
    ]
  },

  // Companies
  'history': {
    heading: 'Example "History" sections from Wikipedia',
    examples: [
      {
        title: 'Apple Inc.',
        text: 'Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership. The company\'s first product was the Apple I, a computer designed and hand-built entirely by Wozniak. To finance its creation, Jobs sold his Volkswagen Bus, and Wozniak sold his HP-65 calculator. In 1977, the Apple II was introduced, becoming one of the first highly successful mass-produced microcomputers. Apple went public on December 12, 1980, to instant financial success.',
        url: 'https://en.wikipedia.org/wiki/Apple_Inc.#History'
      }
    ]
  },
  'products': {
    heading: 'Example "Products and services" sections',
    examples: [
      {
        title: 'Tesla, Inc.',
        text: 'Tesla\'s automotive segment includes the design, development, manufacturing, sales, and leasing of electric vehicles as well as sales of automotive regulatory credits. Additionally, the segment includes services and other revenue, parts and accessories, sales of used vehicles, and vehicle insurance. Tesla currently produces four consumer vehicles: the Model S sedan, the Model X SUV, the Model 3 sedan, and the Model Y crossover. The company also produces the Tesla Semi, an all-electric commercial truck.',
        url: 'https://en.wikipedia.org/wiki/Tesla,_Inc.#Products_and_services'
      }
    ]
  },

  // Buildings
  'design': {
    heading: 'Example "Architecture and design" sections',
    examples: [
      {
        title: 'Sydney Opera House',
        text: 'The Sydney Opera House is a modern expressionist design, with a series of large precast concrete "shells", each composed of sections of a sphere of 75.2 metres (246 ft 8.6 in) radius, forming the roofs of the structure. The building covers 1.8 hectares (4.4 acres) of land and is 183 m (600 ft) long and 120 m (394 ft) wide at its widest point. It is supported on 588 concrete piers sunk as much as 25 m (82 ft) below sea level.',
        url: 'https://en.wikipedia.org/wiki/Sydney_Opera_House#Design'
      }
    ]
  },

  // Sports Teams
  'achievements': {
    heading: 'Example "Achievements" sections',
    examples: [
      {
        title: 'Manchester United F.C.',
        text: 'Manchester United have won a record 20 League titles, 12 FA Cups, 6 League Cups and a record 21 FA Community Shields. The club has also won three UEFA Champions League titles, one UEFA Europa League, one UEFA Cup Winners\' Cup, one UEFA Super Cup, one Intercontinental Cup and one FIFA Club World Cup. In 1968, under the management of Matt Busby, Manchester United became the first English club to win the European Cup.',
        url: 'https://en.wikipedia.org/wiki/Manchester_United_F.C.#Honours'
      }
    ]
  },

  // Historical Events
  'background': {
    heading: 'Example "Background" sections',
    examples: [
      {
        title: 'Apollo 11',
        text: 'President John F. Kennedy announced in May 1961 that the United States should commit itself to achieving the goal, before the decade was out, of landing a man on the Moon and returning him safely to the Earth. This announcement was made in the context of the Cold War and the Space Race with the Soviet Union. The Soviets had achieved several firsts in space exploration: first artificial satellite (Sputnik 1), first human in space (Yuri Gagarin), and first spacewalk (Alexei Leonov).',
        url: 'https://en.wikipedia.org/wiki/Apollo_11#Background'
      }
    ]
  },
  'legacy': {
    heading: 'Example "Legacy" sections',
    examples: [
      {
        title: 'Fall of the Berlin Wall',
        text: 'The fall of the Berlin Wall paved the way for German reunification, which formally concluded on 3 October 1990. The fall of the Berlin Wall is considered a key moment in the collapse of communism in Eastern Europe and the end of the Cold War. November 9 is now celebrated as the "Day of Freedom and Unity" in Germany. The physical wall has been mostly removed, but some portions remain as memorials and tourist attractions, including the East Side Gallery, where artists have painted murals on a 1.3 km section of the wall.',
        url: 'https://en.wikipedia.org/wiki/Berlin_Wall#Legacy'
      }
    ]
  }
};

// Section templates for different article types
const SECTION_TEMPLATES = {
  // Technology articles
  'technology-computing-&-it': {
    introduction: {
      template: `'''[Software/Technology Name]''' is a [type of technology/software]. [Brief description of what it does/is used for].`,
      placeholder: 'Click to start writing the introduction...'
    },
    sections: [
      { id: 'history', title: 'History', placeholder: 'What do sources say about the development and release history?' },
      { id: 'features', title: 'Features', placeholder: 'What key features and capabilities are documented in sources?' },
      { id: 'technical', title: 'Technical details', placeholder: 'What do sources say about technical architecture, requirements, or specifications?' },
      { id: 'reception', title: 'Reception', placeholder: 'What do sources say about critical reception, adoption, and impact?' },
      { id: 'see-also', title: 'See also', placeholder: 'List related technologies or articles...' }
    ],
    guidelines: {
      title: 'Technology Article Guidelines',
      points: [
        'Must have significant coverage in reliable sources',
        'Avoid promotional language - write from neutral viewpoint',
        'Include technical details but keep accessible',
        'Cite sources for claims about adoption or impact'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)'
    }
  },
  'technology-engineering': {
    introduction: {
      template: `'''[Technology/System Name]''' is a [type] used for [purpose]. [Key application or significance].`,
      placeholder: 'Click to start writing the introduction...'
    },
    sections: [
      { id: 'history', title: 'History', placeholder: 'Describe the development and evolution...' },
      { id: 'design', title: 'Design and operation', placeholder: 'Explain how it works and key design principles...' },
      { id: 'applications', title: 'Applications', placeholder: 'Describe real-world uses and implementations...' },
      { id: 'advantages', title: 'Advantages and limitations', placeholder: 'Discuss benefits and drawbacks...' },
      { id: 'see-also', title: 'See also', placeholder: 'List related topics...' }
    ],
    guidelines: {
      title: 'Engineering Article Guidelines',
      points: [
        'Focus on encyclopedic significance',
        'Balance technical detail with accessibility',
        'Cite engineering publications and standards',
        'Maintain neutral, objective tone'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Science'
    }
  },
  // People (existing templates)
  'people-athletes': {
    introduction: {
      template: `'''[Name]''' (born [date]) is a [nationality] [sport] athlete. Known for [major achievement], [he/she] [current status - e.g., currently plays for [team] / is retired].

[Brief career highlight or notable accomplishment].`,
      placeholder: 'Click to start writing the introduction...'
    },
    sections: [
      { id: 'early-life', title: 'Early life and education', placeholder: 'What do sources say about their childhood, family background, education, and early interest in the sport?' },
      { id: 'career', title: 'Career', placeholder: 'What do sources say about their professional career, major achievements, and milestones?' },
      { id: 'playing-style', title: 'Playing style', placeholder: 'How do sources describe their distinctive playing style, techniques, and approach?' },
      { id: 'statistics', title: 'Career statistics', placeholder: 'What career statistics and records are documented in reliable sources?' },
      { id: 'awards', title: 'Awards and honors', placeholder: 'What major awards, honors, and recognitions are documented in sources?' },
      { id: 'personal-life', title: 'Personal life', placeholder: 'What do sources say about their personal life, family, and interests outside of sport?' }
    ],
    guidelines: {
      title: 'Biography Guidelines',
      points: [
        'Subject must meet notability guidelines',
        'Requires reliable, independent sources',
        'Written from a neutral point of view',
        'Avoid promotional or biased language'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(people)'
    }
  },
  'people-musicians': {
    introduction: {
      template: `'''[Name]''' (born [date]) is a [nationality] [genre] musician and [instrument/role]. Known for [major work or contribution], [he/she] has [notable achievement].

[Brief career highlight].`,
      placeholder: 'Click to start writing the introduction...'
    },
    sections: [
      { id: 'early-life', title: 'Early life', placeholder: 'What do sources say about their childhood, family background, and early musical influences?' },
      { id: 'career', title: 'Career', placeholder: 'What do sources say about their musical career, major albums, tours, and collaborations?' },
      { id: 'musical-style', title: 'Musical style and influences', placeholder: 'How do sources describe their musical style, influences, and artistic approach?' },
      { id: 'discography', title: 'Discography', placeholder: 'What albums, singles, and major recordings are documented in sources?' },
      { id: 'awards', title: 'Awards and recognition', placeholder: 'What major awards, honors, and critical recognition are documented in sources?' },
      { id: 'personal-life', title: 'Personal life', placeholder: 'What do sources say about their personal life and interests outside of music?' }
    ],
    guidelines: {
      title: 'Biography Guidelines',
      points: [
        'Subject must meet notability guidelines',
        'Requires reliable, independent sources',
        'Written from a neutral point of view',
        'Avoid promotional or biased language'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(people)'
    }
  },
  // Default template for other people subcategories
  'people-default': {
    introduction: {
      template: `'''[Name]''' (born [date]) is a [nationality] [profession]. [He/She] is known for [major achievement or contribution].

[Brief background or notable work].`,
      placeholder: 'Click to start writing the introduction...'
    },
    sections: [
      { id: 'early-life', title: 'Early life and education', placeholder: 'What do sources say about their childhood, family background, and education?' },
      { id: 'career', title: 'Career', placeholder: 'What do sources say about their professional career and major achievements?' },
      { id: 'work', title: 'Work and contributions', placeholder: 'What do sources say about their notable work, projects, or contributions?' },
      { id: 'recognition', title: 'Recognition and awards', placeholder: 'What major awards, honors, and recognition are documented in sources?' },
      { id: 'personal-life', title: 'Personal life', placeholder: 'What do sources say about their personal life and interests?' }
    ],
    guidelines: {
      title: 'Biography Guidelines',
      points: [
        'Subject must meet notability guidelines',
        'Requires reliable, independent sources',
        'Written from a neutral point of view',
        'Avoid promotional or biased language'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(people)'
    }
  },
  // Granular template: Cricket players in major league
  'people-athletes-cricket-major': {
    introduction: {
      template: `'''[Name]''' (born [date]) is a [nationality] cricket player who plays for [team] in [league]. Known for [batting/bowling style], [he/she] has [major achievement].

[Brief career highlight].`,
      placeholder: 'Click to start writing about this cricket player...'
    },
    sections: [
      { id: 'early-career', title: 'Early career', placeholder: 'Describe their early cricket career, domestic cricket, and youth achievements...' },
      { id: 'major-league', title: 'Major league career', placeholder: 'Describe their major league debut, key matches, and achievements...' },
      { id: 'playing-style', title: 'Playing style', placeholder: 'Describe their batting/bowling technique, strengths, and distinctive style...' },
      { id: 'statistics', title: 'Career statistics', placeholder: 'Include their career statistics: matches, runs, wickets, averages...' },
      { id: 'awards', title: 'Awards and honors', placeholder: 'List cricket awards, player of the match/series awards, and honors...' },
      { id: 'personal-life', title: 'Personal life', placeholder: 'Describe their personal life and interests outside cricket...' }
    ],
    sectionGuidance: {
      introduction: {
        title: 'Cricket intro must include:',
        points: [
          'Full name and date of birth',
          'Playing role (batsman/bowler/all-rounder)',
          'Major league teams (current first)',
          'Notable achievement or record'
        ]
      },
      statistics: {
        title: 'Statistics requirements:',
        points: [
          'Use official league statistics only',
          'Format: Matches | Runs/Wickets | Average',
          'Separate T20, ODI, Test if applicable',
          'Update to current season'
        ]
      }
    },
    guidelines: {
      title: 'Cricket Biography Guidelines',
      points: [
        'Must have played in IPL, BBL, CPL, PSL, or The Hundred',
        'Include stats from ESPNcricinfo or official league sites',
        'Need three or more reliable sources (not social media)',
        'Use neutral tone, avoid promotional language'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(sports)',
      shortLabel: 'cricket notability guidelines'
    }
  },
  // Granular template: Olympic athletes
  'people-athletes-olympic': {
    introduction: {
      template: `'''[Name]''' (born [date]) is a [nationality] [sport] athlete who competed in the [year] Olympic Games. [He/She] won [medals] in [events].

[Brief Olympic highlight].`,
      placeholder: 'Click to start writing about this Olympic athlete...'
    },
    sections: [
      { id: 'early-life', title: 'Early life and training', placeholder: 'Describe their early life, how they got into the sport, and training...' },
      { id: 'olympic-career', title: 'Olympic career', placeholder: 'Describe their Olympic Games participation, events competed, and results...' },
      { id: 'other-competitions', title: 'Other competitions', placeholder: 'Describe World Championships, regional competitions, and other achievements...' },
      { id: 'records', title: 'Records and achievements', placeholder: 'List Olympic records, world records, or notable achievements...' },
      { id: 'post-olympic', title: 'Post-Olympic career', placeholder: 'Describe their career after Olympics, coaching, or other activities...' },
      { id: 'personal-life', title: 'Personal life', placeholder: 'Describe their personal life and interests...' }
    ],
    guidelines: {
      title: 'Olympic Athlete Guidelines',
      points: [
        'Must have competed in Olympic Games',
        'Include official Olympic results and statistics',
        'Cite Olympic Committee sources and sports publications',
        'Focus on verified achievements and records'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(sports)'
    }
  },
  // Granular template: Social media platforms
  'technology-internet-social': {
    introduction: {
      template: `'''[Platform Name]''' is a [type] social media platform launched in [year] by [founder/company]. The platform allows users to [main functionality].

[Brief description of reach or significance].`,
      placeholder: 'Click to start writing about this social media platform...'
    },
    sections: [
      { id: 'history', title: 'History', placeholder: 'Describe the founding, launch, and major milestones...' },
      { id: 'features', title: 'Features', placeholder: 'Describe key features, user interface, and functionality...' },
      { id: 'user-base', title: 'User base and growth', placeholder: 'Describe user demographics, growth statistics, and market reach...' },
      { id: 'business-model', title: 'Business model', placeholder: 'Describe monetization, advertising, premium features...' },
      { id: 'reception', title: 'Reception and impact', placeholder: 'Describe critical reception, cultural impact, and controversies...' },
      { id: 'see-also', title: 'See also', placeholder: 'List related platforms or articles...' }
    ],
    guidelines: {
      title: 'Social Media Platform Guidelines',
      points: [
        'Must have significant coverage in reliable tech publications',
        'Include verifiable user statistics and business information',
        'Maintain neutral tone, avoid promotional language',
        'Address controversies and criticisms with proper sourcing'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(web)'
    }
  },
  // Granular template: Websites and web services
  'technology-internet-websites': {
    introduction: {
      template: `'''[Website Name]''' is a [type of website/service] launched in [year]. The site provides [main service/purpose] to [target audience].

[Brief description of significance].`,
      placeholder: 'Click to start writing about this website...'
    },
    sections: [
      { id: 'history', title: 'History', placeholder: 'Describe founding, launch, and evolution of the website...' },
      { id: 'services', title: 'Services and features', placeholder: 'Describe main services, features, and functionality...' },
      { id: 'technology', title: 'Technology', placeholder: 'Describe technical architecture, platforms, and innovations...' },
      { id: 'business', title: 'Business and revenue', placeholder: 'Describe business model, revenue sources, and funding...' },
      { id: 'reception', title: 'Reception and impact', placeholder: 'Describe media coverage, user reception, and industry impact...' },
      { id: 'see-also', title: 'See also', placeholder: 'List related websites or services...' }
    ],
    guidelines: {
      title: 'Website Article Guidelines',
      points: [
        'Must have significant independent coverage in reliable sources',
        'Include verifiable traffic statistics and business information',
        'Avoid promotional tone and maintain neutrality',
        'Cite established tech and business publications'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(web)'
    }
  },

  // NEW TEMPLATES - 8 additional article types

  // 1. Films
  'culture-films': {
    introduction: {
      template: `'''[Film Title]''' is a [year] [genre] film directed by [director name]. The film stars [main cast] and follows [one-sentence plot summary].

Released on [date] by [studio/distributor], the film [notable achievement or reception].`,
      placeholder: 'Click to start writing about this film...'
    },
    sections: [
      { id: 'plot', title: 'Plot', placeholder: 'Summarize the main story without revealing the ending. Focus on major plot points that are well-documented in sources.' },
      { id: 'cast', title: 'Cast', placeholder: 'List principal cast members and their roles. Include any notable casting decisions documented in sources.' },
      { id: 'production', title: 'Production', placeholder: 'Describe development, filming locations, budget, and production challenges documented in sources.' },
      { id: 'music', title: 'Music and soundtrack', placeholder: 'Describe the film score, composer, and any notable songs if significantly covered in sources.' },
      { id: 'release', title: 'Release', placeholder: 'Document theatrical release dates, box office performance, and home media releases from reliable sources.' },
      { id: 'reception', title: 'Reception', placeholder: 'Summarize critical reception using reviews from established publications. Include awards and nominations.' }
    ],
    sectionGuidance: {
      plot: {
        title: 'Plot section guidance:',
        points: [
          'Keep summary concise (300-700 words typical)',
          'Avoid excessive detail - focus on main story arc',
          'No need to cite plot if watching the film verifies it',
          'Avoid revealing surprise endings in opening paragraphs'
        ]
      },
      reception: {
        title: 'Reception requirements:',
        points: [
          'Cite professional reviews from established critics',
          'Include aggregate scores (Rotten Tomatoes, Metacritic)',
          'Balance positive and negative reception',
          'Avoid user reviews - focus on professional criticism'
        ]
      }
    },
    guidelines: {
      title: 'Film Article Guidelines',
      points: [
        'Must have theatrical or major streaming release',
        'Cite professional film critics and trade publications',
        'Include box office data from reliable tracking services',
        'Maintain neutral tone when describing reception'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(films)'
    }
  },

  // 2. TV Series
  'culture-tv-series': {
    introduction: {
      template: `'''[Series Title]''' is a [genre] television series created by [creator name]. The series premiered on [date] on [network/platform] and [current status - e.g., concluded after X seasons / is currently airing].

The show follows [brief premise] and stars [main cast members].`,
      placeholder: 'Click to start writing about this TV series...'
    },
    sections: [
      { id: 'premise', title: 'Premise', placeholder: 'Describe the basic setup, setting, and main characters. Keep it concise and well-sourced.' },
      { id: 'cast', title: 'Cast and characters', placeholder: 'List main cast members and describe principal characters. Note any major casting changes.' },
      { id: 'episodes', title: 'Episodes', placeholder: 'Provide an overview of seasons and episode count. Link to detailed episode lists if extensive.' },
      { id: 'production', title: 'Production', placeholder: 'Describe development, filming locations, and production details documented in sources.' },
      { id: 'broadcast', title: 'Broadcast and release', placeholder: 'Document original broadcast schedule, streaming availability, and international distribution.' },
      { id: 'reception', title: 'Reception', placeholder: 'Summarize critical reception, ratings, awards, and cultural impact from reliable sources.' }
    ],
    sectionGuidance: {
      premise: {
        title: 'Premise guidance:',
        points: [
          'Describe core concept without episode-by-episode details',
          'Focus on the overall story arc and setting',
          'Mention genre and tone of the series',
          'Keep to 2-3 paragraphs maximum'
        ]
      }
    },
    guidelines: {
      title: 'TV Series Guidelines',
      points: [
        'Must have broadcast on television or major streaming platform',
        'Cite TV critics, trade publications, and ratings data',
        'Include Emmy/Golden Globe recognition if applicable',
        'Avoid episode-by-episode plot summaries in main article'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(films)'
    }
  },

  // 3. Books/Novels
  'culture-literature-books': {
    introduction: {
      template: `'''[Book Title]''' is a [year] [genre] novel by [author name]. Published by [publisher], the book [brief description of subject matter].

The novel [notable reception, awards, or significance].`,
      placeholder: 'Click to start writing about this book...'
    },
    sections: [
      { id: 'plot', title: 'Plot summary', placeholder: 'Provide a concise overview of the main story. Avoid excessive detail and spoilers.' },
      { id: 'characters', title: 'Characters', placeholder: 'Describe major characters if significantly discussed in secondary sources.' },
      { id: 'themes', title: 'Themes and analysis', placeholder: 'Discuss major themes and literary analysis from published criticism and reviews.' },
      { id: 'publication', title: 'Publication history', placeholder: 'Document original publication, editions, translations documented in sources.' },
      { id: 'reception', title: 'Reception and legacy', placeholder: 'Summarize critical reception, sales figures, awards, and lasting cultural impact.' },
      { id: 'adaptations', title: 'Adaptations', placeholder: 'Document any film, TV, or stage adaptations if they exist and are well-sourced.' }
    ],
    sectionGuidance: {
      plot: {
        title: 'Plot summary guidance:',
        points: [
          'Keep summary brief (400-700 words typical)',
          'Focus on main plot points and narrative arc',
          'Avoid chapter-by-chapter breakdown',
          'Balance detail with readability'
        ]
      },
      themes: {
        title: 'Themes section requirements:',
        points: [
          'Rely on published literary criticism',
          'Cite academic sources and professional reviews',
          'Avoid original research or personal interpretation',
          'Focus on widely recognized themes'
        ]
      }
    },
    guidelines: {
      title: 'Book Article Guidelines',
      points: [
        'Must have professional publication or significant coverage',
        'Cite professional literary critics and reviews',
        'Include publication data from reliable sources',
        'Avoid plot-only articles - include reception and analysis'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(books)'
    }
  },

  // 4. Video Games
  'culture-video-games': {
    introduction: {
      template: `'''[Game Title]''' is a [year] [genre] video game developed by [developer] and published by [publisher]. Released for [platforms], the game [brief description of gameplay or story].

The game [notable achievement, sales, or critical reception].`,
      placeholder: 'Click to start writing about this video game...'
    },
    sections: [
      { id: 'gameplay', title: 'Gameplay', placeholder: 'Describe core gameplay mechanics, objectives, and player interactions documented in sources.' },
      { id: 'plot', title: 'Plot', placeholder: 'Summarize the story if narrative-focused. Keep concise and avoid excessive detail.' },
      { id: 'development', title: 'Development', placeholder: 'Document development history, team, engine, and design decisions covered in sources.' },
      { id: 'release', title: 'Release', placeholder: 'Document release dates, platforms, special editions, and post-launch content from sources.' },
      { id: 'reception', title: 'Reception', placeholder: 'Summarize critical reviews from gaming publications. Include aggregate scores and sales data.' },
      { id: 'legacy', title: 'Legacy', placeholder: 'Discuss lasting impact, sequels, awards, and cultural significance if well-documented.' }
    },
    sectionGuidance: {
      gameplay: {
        title: 'Gameplay section guidance:',
        points: [
          'Describe what players actually do in the game',
          'Focus on core mechanics, not every feature',
          'Use gaming publications as sources',
          'Balance technical detail with accessibility'
        ]
      },
      reception: {
        title: 'Reception requirements:',
        points: [
          'Cite professional gaming publications',
          'Include Metacritic/OpenCritic aggregate scores',
          'Document sales figures from reliable sources',
          'Include major gaming awards if won'
        ]
      }
    },
    guidelines: {
      title: 'Video Game Article Guidelines',
      points: [
        'Must have commercial release or significant coverage',
        'Cite professional gaming media and reviews',
        'Include sales and player count data when available',
        'Avoid excessive gameplay detail - focus on notable aspects'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(video_games)'
    }
  },

  // 5. Companies
  'society-companies': {
    introduction: {
      template: `'''[Company Name]''' is a [type of company] headquartered in [location]. Founded in [year] by [founder(s)], the company [primary business activity].

[Notable fact about size, market position, or significance].`,
      placeholder: 'Click to start writing about this company...'
    },
    sections: [
      { id: 'history', title: 'History', placeholder: 'Describe founding, major milestones, acquisitions, and evolution documented in sources.' },
      { id: 'products', title: 'Products and services', placeholder: 'Describe main products, services, and business lines covered in reliable sources.' },
      { id: 'operations', title: 'Operations', placeholder: 'Describe business model, markets served, and operational structure from sources.' },
      { id: 'financials', title: 'Financial performance', placeholder: 'Include revenue, profit, and market data from financial publications and filings.' },
      { id: 'leadership', title: 'Leadership and governance', placeholder: 'List key executives and board structure if documented in reliable sources.' },
      { id: 'reception', title: 'Reception and criticism', placeholder: 'Document media coverage, controversies, and public perception from reliable sources.' }
    ],
    sectionGuidance: {
      financials: {
        title: 'Financial section guidance:',
        points: [
          'Use official financial reports and SEC filings',
          'Cite business publications like WSJ, Bloomberg, FT',
          'Include revenue, profit, market cap if public',
          'Update with most recent fiscal year data'
        ]
      }
    },
    guidelines: {
      title: 'Company Article Guidelines',
      points: [
        'Must have significant independent media coverage',
        'Cite business publications and financial sources',
        'Maintain neutral tone - avoid promotional language',
        'Include both positive and critical coverage'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)'
    }
  },

  // 6. Buildings/Landmarks
  'geography-buildings': {
    introduction: {
      template: `'''[Building Name]''' is a [type of building] located in [location]. Completed in [year], the structure was designed by [architect] and [primary use or purpose].

The building [notable architectural feature or historical significance].`,
      placeholder: 'Click to start writing about this building...'
    },
    sections: [
      { id: 'design', title: 'Architecture and design', placeholder: 'Describe architectural style, materials, notable features documented in sources.' },
      { id: 'history', title: 'History', placeholder: 'Document construction, ownership changes, renovations, and historical context from sources.' },
      { id: 'features', title: 'Notable features', placeholder: 'Describe significant interior/exterior elements, innovations, or unique characteristics.' },
      { id: 'use', title: 'Current use', placeholder: 'Describe current function, tenants, or public access from reliable sources.' },
      { id: 'significance', title: 'Cultural significance', placeholder: 'Discuss heritage status, architectural importance, and cultural impact from sources.' },
      { id: 'reception', title: 'Reception', placeholder: 'Include critical reception from architectural critics and publications.' }
    },
    sectionGuidance: {
      design: {
        title: 'Architecture section guidance:',
        points: [
          'Cite architectural publications and historians',
          'Describe style and notable design elements',
          'Include dimensions and materials if significant',
          'Explain design in accessible language'
        ]
      }
    },
    guidelines: {
      title: 'Building Article Guidelines',
      points: [
        'Must have architectural or historical significance',
        'Cite architectural publications and historians',
        'Include heritage designations if applicable',
        'Document with reliable sources, not just local coverage'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)'
    }
  },

  // 7. Sports Teams
  'society-sports-teams': {
    introduction: {
      template: `'''[Team Name]''' is a professional [sport] team based in [location]. Founded in [year], the team competes in [league] and plays home games at [venue].

The team has won [championships or notable achievements].`,
      placeholder: 'Click to start writing about this sports team...'
    },
    sections: [
      { id: 'history', title: 'History', placeholder: 'Describe founding, major eras, relocations, and historical milestones documented in sources.' },
      { id: 'stadium', title: 'Stadium and facilities', placeholder: 'Describe home venue, capacity, facilities, and any notable features from sources.' },
      { id: 'rivalries', title: 'Rivalries', placeholder: 'Document major rivalries if well-covered in sports media and publications.' },
      { id: 'achievements', title: 'Achievements and records', placeholder: 'List championships, titles, and major records from official league sources.' },
      { id: 'players', title: 'Notable players', placeholder: 'Mention historically significant players, Hall of Famers, or retired numbers.' },
      { id: 'culture', title: 'Fan culture and support', placeholder: 'Describe fan base, traditions, and support if significantly documented in sources.' }
    },
    sectionGuidance: {
      achievements: {
        title: 'Achievements section guidance:',
        points: [
          'Use official league records and statistics',
          'Include championships and major titles',
          'List division/conference titles if space allows',
          'Cite sports publications and official sources'
        ]
      }
    },
    guidelines: {
      title: 'Sports Team Guidelines',
      points: [
        'Must compete in established professional league',
        'Cite sports publications and official league sources',
        'Include verifiable statistics and records',
        'Maintain neutral tone in rivalry descriptions'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(sports)'
    }
  },

  // 8. Historical Events
  'history-events': {
    introduction: {
      template: `The '''[Event Name]''' was a [type of event] that took place on [date] in [location]. The event [brief description of what happened].

The event [significance or lasting impact].`,
      placeholder: 'Click to start writing about this historical event...'
    },
    sections: [
      { id: 'background', title: 'Background', placeholder: 'Describe historical context and circumstances leading to the event from historical sources.' },
      { id: 'event', title: 'Event', placeholder: 'Describe what happened chronologically. Use primary and secondary historical sources.' },
      { id: 'participants', title: 'Key participants', placeholder: 'Identify major individuals or groups involved, documented in historical sources.' },
      { id: 'aftermath', title: 'Aftermath', placeholder: 'Describe immediate consequences and short-term impacts documented in sources.' },
      { id: 'legacy', title: 'Legacy and significance', placeholder: 'Discuss long-term impact and historical interpretation from scholarly sources.' },
      { id: 'commemoration', title: 'Commemoration', placeholder: 'Document memorials, anniversaries, or how the event is remembered if significant.' }
    ],
    sectionGuidance: {
      background: {
        title: 'Background section guidance:',
        points: [
          'Provide context necessary to understand the event',
          'Cite historical scholarship and primary sources',
          'Keep focused on directly relevant background',
          'Avoid excessive detail about preceding years'
        ]
      },
      legacy: {
        title: 'Legacy section requirements:',
        points: [
          'Cite historical scholarship and analysis',
          'Discuss historiography if significantly debated',
          'Explain lasting impact on subsequent events',
          'Include diverse scholarly perspectives'
        ]
      }
    },
    guidelines: {
      title: 'Historical Event Guidelines',
      points: [
        'Must have significant historical importance',
        'Cite academic historians and scholarly sources',
        'Include multiple perspectives when events are disputed',
        'Use primary sources alongside secondary analysis'
      ],
      link: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(events)'
    }
  }
};

// Recommended sources by article category (placeholder data for demo)
const RECOMMENDED_SOURCES = {
  'people-athletes-cricket-major': [
    { name: 'ESPNCricinfo', url: 'https://www.espncricinfo.com' },
    { name: 'IPL Official', url: 'https://www.iplt20.com' },
    { name: 'Wisden', url: 'https://www.wisden.com' },
    { name: 'The Guardian Cricket', url: 'https://www.theguardian.com/sport/cricket' },
    { name: 'BBC Sport Cricket', url: 'https://www.bbc.com/sport/cricket' }
  ],
  'people-athletes-olympic': [
    { name: 'Olympics.com', url: 'https://olympics.com' },
    { name: 'World Athletics', url: 'https://worldathletics.org' },
    { name: 'Olympic Channel', url: 'https://www.olympicchannel.com' },
    { name: 'Sports Illustrated', url: 'https://www.si.com' }
  ],
  'people-musicians': [
    { name: 'AllMusic', url: 'https://www.allmusic.com' },
    { name: 'Rolling Stone', url: 'https://www.rollingstone.com' },
    { name: 'Billboard', url: 'https://www.billboard.com' },
    { name: 'Pitchfork', url: 'https://pitchfork.com' }
  ],
  'technology-internet-social': [
    { name: 'TechCrunch', url: 'https://techcrunch.com' },
    { name: 'The Verge', url: 'https://www.theverge.com' },
    { name: 'Wired', url: 'https://www.wired.com' },
    { name: 'Ars Technica', url: 'https://arstechnica.com' }
  ],
  'technology-computing-&-it': [
    { name: 'TechCrunch', url: 'https://techcrunch.com' },
    { name: 'The Verge', url: 'https://www.theverge.com' },
    { name: 'Ars Technica', url: 'https://arstechnica.com' },
    { name: 'ZDNet', url: 'https://www.zdnet.com' }
  ],

  // NEW ARTICLE TYPE SOURCES
  'culture-films': [
    { name: 'Variety', url: 'https://variety.com' },
    { name: 'The Hollywood Reporter', url: 'https://www.hollywoodreporter.com' },
    { name: 'IndieWire', url: 'https://www.indiewire.com' },
    { name: 'Rotten Tomatoes', url: 'https://www.rottentomatoes.com' },
    { name: 'Box Office Mojo', url: 'https://www.boxofficemojo.com' }
  ],
  'culture-tv-series': [
    { name: 'Variety', url: 'https://variety.com' },
    { name: 'The Hollywood Reporter', url: 'https://www.hollywoodreporter.com' },
    { name: 'Deadline', url: 'https://deadline.com' },
    { name: 'TV Guide', url: 'https://www.tvguide.com' },
    { name: 'Entertainment Weekly', url: 'https://ew.com' }
  ],
  'culture-literature-books': [
    { name: 'The New York Times Books', url: 'https://www.nytimes.com/section/books' },
    { name: 'The Guardian Books', url: 'https://www.theguardian.com/books' },
    { name: 'Publishers Weekly', url: 'https://www.publishersweekly.com' },
    { name: 'Kirkus Reviews', url: 'https://www.kirkusreviews.com' },
    { name: 'Goodreads', url: 'https://www.goodreads.com' }
  ],
  'culture-video-games': [
    { name: 'IGN', url: 'https://www.ign.com' },
    { name: 'GameSpot', url: 'https://www.gamespot.com' },
    { name: 'Polygon', url: 'https://www.polygon.com' },
    { name: 'Eurogamer', url: 'https://www.eurogamer.net' },
    { name: 'Metacritic', url: 'https://www.metacritic.com' }
  ],
  'society-companies': [
    { name: 'Bloomberg', url: 'https://www.bloomberg.com' },
    { name: 'Wall Street Journal', url: 'https://www.wsj.com' },
    { name: 'Financial Times', url: 'https://www.ft.com' },
    { name: 'Forbes', url: 'https://www.forbes.com' },
    { name: 'Reuters', url: 'https://www.reuters.com' }
  ],
  'geography-buildings': [
    { name: 'Architectural Digest', url: 'https://www.architecturaldigest.com' },
    { name: 'Dezeen', url: 'https://www.dezeen.com' },
    { name: 'ArchDaily', url: 'https://www.archdaily.com' },
    { name: 'The Architect\'s Newspaper', url: 'https://www.archpaper.com' }
  ],
  'society-sports-teams': [
    { name: 'ESPN', url: 'https://www.espn.com' },
    { name: 'Sports Illustrated', url: 'https://www.si.com' },
    { name: 'The Athletic', url: 'https://theathletic.com' },
    { name: 'BBC Sport', url: 'https://www.bbc.com/sport' },
    { name: 'Official League Website', url: '#' }
  ],
  'history-events': [
    { name: 'History.com', url: 'https://www.history.com' },
    { name: 'Britannica', url: 'https://www.britannica.com' },
    { name: 'Smithsonian Magazine', url: 'https://www.smithsonianmag.com' },
    { name: 'National Archives', url: 'https://www.archives.gov' },
    { name: 'Academic journals (JSTOR)', url: 'https://www.jstor.org' }
  ]
};

// Wikipedia main topic classifications with Codex icons
const WIKIPEDIA_CATEGORIES = [
  {
    id: 'people',
    name: 'People',
    icon: 'cdxIconUserAvatar',
    skipSubcategories: false,
    subcategories: [
      { id: 'academics', name: 'Academics', hasGranularTypes: false, template: 'people-default' },
      { id: 'activists', name: 'Activists', hasGranularTypes: false, template: 'people-default' },
      { id: 'actors', name: 'Actors & Actresses', hasGranularTypes: false, template: 'people-default' },
      { id: 'artists', name: 'Artists', hasGranularTypes: false, template: 'people-default' },
      {
        id: 'athletes',
        name: 'Athletes',
        hasGranularTypes: true,
        types: [
          { id: 'cricket-major', name: 'Cricket players in major league', template: 'people-athletes-cricket-major' },
          { id: 'olympic', name: 'Olympic athletes', template: 'people-athletes-olympic' },
          { id: 'general', name: 'Other athletes', template: 'people-athletes' }
        ]
      },
      { id: 'authors', name: 'Authors & Writers', hasGranularTypes: false, template: 'people-default' },
      { id: 'business', name: 'Business people', hasGranularTypes: false, template: 'people-default' },
      { id: 'musicians', name: 'Musicians', hasGranularTypes: false, template: 'people-musicians' },
      { id: 'politicians', name: 'Politicians', hasGranularTypes: false, template: 'people-default' },
      { id: 'scientists', name: 'Scientists', hasGranularTypes: false, template: 'people-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'people-default' }
    ]
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: 'cdxIconImage',
    skipSubcategories: false,
    subcategories: [
      { id: 'arts', name: 'Arts & Entertainment', hasGranularTypes: false, template: 'culture-default' },
      {
        id: 'film-tv',
        name: 'Film & Television',
        hasGranularTypes: true,
        types: [
          { id: 'films', name: 'Films', template: 'culture-films' },
          { id: 'tv-series', name: 'TV Series', template: 'culture-tv-series' },
          { id: 'general', name: 'Other', template: 'culture-default' }
        ]
      },
      {
        id: 'literature',
        name: 'Literature',
        hasGranularTypes: true,
        types: [
          { id: 'books', name: 'Books & Novels', template: 'culture-literature-books' },
          { id: 'general', name: 'Other', template: 'culture-default' }
        ]
      },
      {
        id: 'gaming',
        name: 'Video Games',
        hasGranularTypes: true,
        types: [
          { id: 'video-games', name: 'Video games', template: 'culture-video-games' },
          { id: 'general', name: 'Other', template: 'culture-default' }
        ]
      },
      { id: 'performing', name: 'Performing Arts', hasGranularTypes: false, template: 'culture-default' },
      { id: 'popular', name: 'Popular Culture', hasGranularTypes: false, template: 'culture-default' },
      { id: 'museums', name: 'Museums & Galleries', hasGranularTypes: false, template: 'culture-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'culture-default' }
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'cdxIconMapPin',
    skipSubcategories: false,
    subcategories: [
      { id: 'cities', name: 'Cities & Towns', hasGranularTypes: false, template: 'geography-default' },
      { id: 'countries', name: 'Countries', hasGranularTypes: false, template: 'geography-default' },
      {
        id: 'landmarks',
        name: 'Landmarks & Buildings',
        hasGranularTypes: true,
        types: [
          { id: 'buildings', name: 'Buildings & Architecture', template: 'geography-buildings' },
          { id: 'general', name: 'Other landmarks', template: 'geography-default' }
        ]
      },
      { id: 'natural', name: 'Natural features', hasGranularTypes: false, template: 'geography-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'geography-default' }
    ]
  },
  {
    id: 'history',
    name: 'History',
    icon: 'cdxIconClock',
    skipSubcategories: false,
    subcategories: [
      { id: 'ancient', name: 'Ancient History', hasGranularTypes: false, template: 'history-default' },
      { id: 'medieval', name: 'Medieval History', hasGranularTypes: false, template: 'history-default' },
      { id: 'modern', name: 'Modern History', hasGranularTypes: false, template: 'history-default' },
      { id: 'wars', name: 'Wars & Conflicts', hasGranularTypes: false, template: 'history-default' },
      {
        id: 'events',
        name: 'Historical Events',
        hasGranularTypes: true,
        types: [
          { id: 'major-events', name: 'Major historical events', template: 'history-events' },
          { id: 'general', name: 'Other', template: 'history-default' }
        ]
      },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'history-default' }
    ]
  },
  {
    id: 'science',
    name: 'Natural Sciences',
    icon: 'cdxIconSearch',
    skipSubcategories: false,
    subcategories: [
      { id: 'biology', name: 'Biology', hasGranularTypes: false, template: 'science-default' },
      { id: 'chemistry', name: 'Chemistry', hasGranularTypes: false, template: 'science-default' },
      { id: 'physics', name: 'Physics', hasGranularTypes: false, template: 'science-default' },
      { id: 'astronomy', name: 'Astronomy', hasGranularTypes: false, template: 'science-default' },
      { id: 'animals', name: 'Animals & Plants', hasGranularTypes: false, template: 'science-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'science-default' }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: 'cdxIconRobot',
    skipSubcategories: false,
    subcategories: [
      { id: 'computing', name: 'Computing & IT', hasGranularTypes: false, template: 'technology-computing-&-it' },
      { id: 'engineering', name: 'Engineering', hasGranularTypes: false, template: 'technology-engineering' },
      {
        id: 'internet',
        name: 'Internet & Web',
        hasGranularTypes: true,
        types: [
          { id: 'social-media', name: 'Social media platforms', template: 'technology-internet-social' },
          { id: 'websites', name: 'Websites and web services', template: 'technology-internet-websites' },
          { id: 'general', name: 'Other', template: 'technology-internet' }
        ]
      },
      { id: 'transport', name: 'Transportation', hasGranularTypes: false, template: 'technology-default' },
      { id: 'inventions', name: 'Inventions', hasGranularTypes: false, template: 'technology-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'technology-default' }
    ]
  },
  {
    id: 'society',
    name: 'Society',
    icon: 'cdxIconUserGroup',
    skipSubcategories: false,
    subcategories: [
      { id: 'education', name: 'Education', hasGranularTypes: false, template: 'society-default' },
      { id: 'law', name: 'Law & Legal', hasGranularTypes: false, template: 'society-default' },
      { id: 'politics', name: 'Politics & Government', hasGranularTypes: false, template: 'society-default' },
      {
        id: 'orgs',
        name: 'Organizations & Companies',
        hasGranularTypes: true,
        types: [
          { id: 'companies', name: 'Companies & Businesses', template: 'society-companies' },
          { id: 'sports-teams', name: 'Sports teams', template: 'society-sports-teams' },
          { id: 'general', name: 'Other organizations', template: 'society-default' }
        ]
      },
      { id: 'economics', name: 'Economics', hasGranularTypes: false, template: 'society-default' },
      { id: 'military', name: 'Military', hasGranularTypes: false, template: 'society-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'society-default' }
    ]
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'cdxIconHeart',
    skipSubcategories: false,
    subcategories: [
      { id: 'medicine', name: 'Medicine', hasGranularTypes: false, template: 'health-default' },
      { id: 'diseases', name: 'Diseases & Conditions', hasGranularTypes: false, template: 'health-default' },
      { id: 'healthcare', name: 'Healthcare', hasGranularTypes: false, template: 'health-default' },
      { id: 'mental', name: 'Mental Health', hasGranularTypes: false, template: 'health-default' },
      { id: 'nutrition', name: 'Nutrition', hasGranularTypes: false, template: 'health-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'health-default' }
    ]
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: 'cdxIconLightbulb',
    skipSubcategories: false,
    subcategories: [
      { id: 'ethics', name: 'Ethics', hasGranularTypes: false, template: 'philosophy-default' },
      { id: 'logic', name: 'Logic', hasGranularTypes: false, template: 'philosophy-default' },
      { id: 'metaphysics', name: 'Metaphysics', hasGranularTypes: false, template: 'philosophy-default' },
      { id: 'political', name: 'Political Philosophy', hasGranularTypes: false, template: 'philosophy-default' },
      { id: 'aesthetics', name: 'Aesthetics', hasGranularTypes: false, template: 'philosophy-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'philosophy-default' }
    ]
  },
  {
    id: 'religion',
    name: 'Religion',
    icon: 'cdxIconBook',
    skipSubcategories: false,
    subcategories: [
      { id: 'christianity', name: 'Christianity', hasGranularTypes: false, template: 'religion-default' },
      { id: 'islam', name: 'Islam', hasGranularTypes: false, template: 'religion-default' },
      { id: 'buddhism', name: 'Buddhism', hasGranularTypes: false, template: 'religion-default' },
      { id: 'hinduism', name: 'Hinduism', hasGranularTypes: false, template: 'religion-default' },
      { id: 'judaism', name: 'Judaism', hasGranularTypes: false, template: 'religion-default' },
      { id: 'other', name: 'Other Religions', hasGranularTypes: false, template: 'religion-default' }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'cdxIconMathematics',
    skipSubcategories: false,
    subcategories: [
      { id: 'algebra', name: 'Algebra', hasGranularTypes: false, template: 'mathematics-default' },
      { id: 'geometry', name: 'Geometry', hasGranularTypes: false, template: 'mathematics-default' },
      { id: 'calculus', name: 'Calculus', hasGranularTypes: false, template: 'mathematics-default' },
      { id: 'statistics', name: 'Statistics', hasGranularTypes: false, template: 'mathematics-default' },
      { id: 'number-theory', name: 'Number Theory', hasGranularTypes: false, template: 'mathematics-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'mathematics-default' }
    ]
  },
  {
    id: 'humanities',
    name: 'Humanities',
    icon: 'cdxIconArticle',
    skipSubcategories: false,
    subcategories: [
      { id: 'archaeology', name: 'Archaeology', hasGranularTypes: false, template: 'humanities-default' },
      { id: 'languages', name: 'Languages', hasGranularTypes: false, template: 'humanities-default' },
      { id: 'linguistics', name: 'Linguistics', hasGranularTypes: false, template: 'humanities-default' },
      { id: 'anthropology', name: 'Anthropology', hasGranularTypes: false, template: 'humanities-default' },
      { id: 'cultural', name: 'Cultural Studies', hasGranularTypes: false, template: 'humanities-default' },
      { id: 'other', name: 'Other', hasGranularTypes: false, template: 'humanities-default' }
    ]
  }
];


function openBottomSheet() {
  // Create backdrop if it doesn't exist
  if (!sheetBackdrop) {
    sheetBackdrop = document.createElement('div');
    sheetBackdrop.className = 'sheet-backdrop';
    document.body.appendChild(sheetBackdrop);
    
    sheetBackdrop.addEventListener('click', closeBottomSheet);
  }
  
  // Update sheet type toggle to match current type
  sheetTypeToggle.textContent = `${currentType.name} ▾`;
  
  // Populate sheet with section cards
  sheetContent.innerHTML = '';
  currentType.outline.forEach((section) => {
    const card = createCard(section);
    sheetContent.appendChild(card);
  });
  
  // Show backdrop and sheet
  setTimeout(() => {
    sheetBackdrop.classList.add('visible');
    sectionSheet.classList.add('open');
  }, 10);
}

function closeBottomSheet() {
  sectionSheet.classList.remove('open');
  if (sheetBackdrop) {
    sheetBackdrop.classList.remove('visible');
  }
}

function createCard(section) {
  const card = document.createElement('article');
  card.className = 'section-card';
  card.dataset.sectionId = section.id;

  // Check if section is already inserted
  const isInserted = document.querySelector(`.article-section[data-section-id="${section.id}"]`);
  const buttonText = isInserted ? 'Remove section' : 'Insert section';
  const buttonClass = isInserted ? 'cdx-button--quiet' : 'cdx-button--progressive';

  card.innerHTML = `
    <header>
      <h2>${section.title}</h2>
      <div class="section-guidance">${section.guidance}</div>
    </header>
    <div class="section-actions">
      <button type="button" class="cdx-button ${buttonClass}" data-action="insert-section">${buttonText}</button>
    </div>
  `;

  // Mark completed cards
  if (isInserted) {
    card.classList.add('completed');
    addProgressBadge(card);
  }

  const insertSectionBtn = card.querySelector('[data-action="insert-section"]');
  insertSectionBtn.addEventListener('click', () => insertSectionOld(card, section));

  return card;
}

function insertSectionOld(card, section) {
  // Check if section already exists in canvas
  const existingSection = document.querySelector(`.article-section[data-section-id="${section.id}"]`);
  if (existingSection) {
    // Remove the existing section
    existingSection.remove();

    // Reset card to incomplete state
    card.classList.remove('completed');
    const badge = card.querySelector('.progress-badge');
    if (badge) badge.remove();

    // Update button text back to "Insert section"
    const btn = card.querySelector('[data-action="insert-section"]');
    if (btn) {
      btn.textContent = 'Insert section';
      btn.className = 'cdx-button cdx-button--progressive';
    }

    return;
  }

  // Create section in main canvas
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'article-section just-inserted';
  sectionDiv.dataset.sectionId = section.id;
  sectionDiv.innerHTML = `
    <div class="section-header">
      <h2 class="section-heading">${section.title}</h2>
      <button class="remove-section-btn" title="Remove section" data-section-id="${section.id}">×</button>
    </div>
    <div class="section-content" contenteditable="true" data-placeholder="${section.guidance}" data-section-id="${section.id}"></div>
    <div class="citation-prompt">
      <span class="citation-prompt-icon">💡</span>
      <span class="citation-prompt-text">Remember to add citations using the toolbar</span>
    </div>
  `;

  // Insert into canvas
  canvas.appendChild(sectionDiv);
  
  // Add event listener for remove button
  const removeBtn = sectionDiv.querySelector('.remove-section-btn');
  removeBtn.addEventListener('click', () => {
    sectionDiv.remove();
    
    // Update the card state in bottom sheet if it exists
    const card = document.querySelector(`.section-card[data-section-id="${section.id}"]`);
    if (card) {
      card.classList.remove('completed');
      const badge = card.querySelector('.progress-badge');
      if (badge) badge.remove();
      
      const btn = card.querySelector('[data-action="insert-section"]');
      if (btn) {
        btn.textContent = 'Insert section';
        btn.className = 'cdx-button cdx-button--progressive';
      }
    }
  });
  
  // Visual feedback: brief highlight animation
  sectionDiv.style.opacity = '0';
  sectionDiv.style.transform = 'translateY(10px)';
  sectionDiv.style.transition = 'all 0.3s ease';
  
  setTimeout(() => {
    sectionDiv.style.opacity = '1';
    sectionDiv.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove just-inserted class after animation
  setTimeout(() => {
    sectionDiv.classList.remove('just-inserted');
  }, 2000);

  card.classList.add('completed');
  addProgressBadge(card);

  // Update button text to indicate it can be removed
  const btn = card.querySelector('[data-action="insert-section"]');
  if (btn) {
    btn.textContent = 'Remove section';
    btn.className = 'cdx-button cdx-button--quiet';
  }

  // Get the content block
  const contentBlock = sectionDiv.querySelector('.section-content');

  // Close the bottom sheet after inserting
  closeBottomSheet();

  // Hide type selector and tips panel once editing begins
  setTimeout(() => {
    const typeSelector = document.querySelector('.type-selector');
    if (typeSelector) typeSelector.style.display = 'none';
    
    if (tipsPanel) tipsPanel.style.display = 'none';
  }, 500);

  // Provide better mobile editing experience
  if (window.innerWidth <= 768) {
    // Make editing area more prominent on mobile
    contentBlock.style.minHeight = '150px';
    contentBlock.style.fontSize = '16px'; // Prevents iOS zoom
  }

  // Focus on the new section and ensure keyboard appears
  setTimeout(() => {
    sectionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Ensure contentEditable is properly set
    contentBlock.contentEditable = 'true';
    contentBlock.focus();

    // Force keyboard to appear on mobile by selecting text
    if (window.innerWidth <= 768) {
      // Place cursor in empty contenteditable
      const range = document.createRange();
      range.selectNodeContents(contentBlock);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Desktop: just place cursor at start
      const range = document.createRange();
      range.selectNodeContents(contentBlock);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, 600);
}

function addProgressBadge(card) {
  if (card.querySelector('.progress-badge')) {
    return;
  }
  const badge = document.createElement('div');
  badge.className = 'progress-badge';
  badge.textContent = 'Section started';
  card.insertBefore(badge, card.firstChild);
}

function renderCards() {
  // In the new bottom sheet approach, we don't render cards inline
  // Cards are rendered on-demand when the bottom sheet opens
  // Just clear any old inline cards if they exist
  const existingCards = canvas.querySelectorAll('.section-card');
  existingCards.forEach(card => card.remove());
}


function openSheetTypeMenu() {
  const menu = document.createElement('div');
  menu.className = 'sheet-type-menu';
  menu.setAttribute('role', 'menu');
  
  ARTICLE_TYPES.forEach((type) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'sheet-type-option';
    option.dataset.id = type.id;
    option.textContent = type.name;
    
    // Highlight current type
    if (type.id === currentType.id) {
      option.classList.add('selected');
    }
    
    option.addEventListener('click', () => {
      currentType = type;
      sheetTypeToggle.textContent = `${type.name} ▾`;
      sheetTypeToggle.setAttribute('aria-expanded', 'false');
      menu.remove();
      
      // Refresh section cards for new type
      sheetContent.innerHTML = '';
      currentType.outline.forEach((section) => {
        const card = createCard(section);
        sheetContent.appendChild(card);
      });
    });
    menu.appendChild(option);
  });

  // Position menu below the toggle
  const rect = sheetTypeToggle.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.minWidth = `${rect.width}px`;

  document.body.appendChild(menu);
  sheetTypeToggle.setAttribute('aria-expanded', 'true');

  const closeMenu = (event) => {
    if (event.target.closest('.sheet-type-menu') || event.target === sheetTypeToggle) {
      return;
    }
    menu.remove();
    sheetTypeToggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', closeMenu);
  };

  setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

// Category Selection Functions
function openCategorySelector() {
  // Create backdrop if it doesn't exist
  if (!categoryBackdrop) {
    categoryBackdrop = document.createElement('div');
    categoryBackdrop.className = 'sheet-backdrop';
    document.body.appendChild(categoryBackdrop);
    categoryBackdrop.addEventListener('click', closeCategorySelector);
  }

  // Blur canvas to hide the cursor
  canvas.blur();

  // Reset navigation
  navigationStack = [];
  modalContext = 'category';
  showMainTopics();

  categorySheet.classList.add('active');
  categoryBackdrop.style.display = 'block';
  categoryBackBtn.style.display = 'none';
}

function closeCategorySelector() {
  categorySheet.classList.remove('active');
  if (categoryBackdrop) {
    categoryBackdrop.style.display = 'none';
  }
  navigationStack = [];
  modalContext = null;
}

function showMainTopics() {
  categorySheetTitle.textContent = 'What is this article about?';
  categoryBackBtn.style.display = 'none';

  // Create search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'category-search';
  searchBar.innerHTML = `
    <input
      type="text"
      class="category-search-input"
      placeholder="Search article types (e.g., cricket players)..."
      aria-label="Search article types"
      id="categorySearchInput">
  `;

  const accordion = document.createElement('div');
  accordion.className = 'category-accordion';

  WIKIPEDIA_CATEGORIES.forEach(topic => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.dataset.topicId = topic.id;

    // Main category header (clickable to expand)
    const header = document.createElement('button');
    header.className = 'accordion-header';
    header.type = 'button';
    header.innerHTML = `
      <span class="cdx-icon cdx-icon--medium accordion-icon" data-icon="${topic.icon}"></span>
      <span class="accordion-title">${topic.name}</span>
      <span class="cdx-icon accordion-chevron" data-icon="cdxIconExpand"></span>
    `;

    // Subcategories panel (hidden by default)
    const panel = document.createElement('div');
    panel.className = 'accordion-panel';

    // Create subcategory chips using Codex components
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'subcategory-chips';

    topic.subcategories.forEach(subcategory => {
      const chip = document.createElement('div');
      chip.className = 'cdx-input-chip';
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');

      // Check if subcategory is object (new format) or string (old format)
      const isObject = typeof subcategory === 'object';
      const subName = isObject ? subcategory.name : subcategory;
      const hasGranular = isObject && subcategory.hasGranularTypes;

      // Add expandable class if it has granular types
      if (hasGranular) {
        chip.classList.add('chip-expandable');
        chip.dataset.subcategoryId = subcategory.id;
      }

      // Build chip HTML with indicator and count
      let chipHTML = `<span class="cdx-input-chip__text">${subName}</span>`;
      if (hasGranular) {
        const typeCount = subcategory.types ? subcategory.types.length : 0;
        chipHTML += `
          <span class="chip-badge-group">
            <span class="chip-count">${typeCount}</span>
            <span class="chip-indicator">›</span>
          </span>
        `;
      }
      chip.innerHTML = chipHTML;

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hasGranular) {
          // Has granular types - expand inline or show new sheet
          expandSubcategory(topic, subcategory, chip, chipsContainer);
        } else {
          // No granular types - direct selection
          selectCategory(topic, subcategory);
        }
      });
      chipsContainer.appendChild(chip);
    });

    panel.appendChild(chipsContainer);

    // Header click toggles expansion
    header.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAccordionItem(accordionItem);
    });

    accordionItem.appendChild(header);
    accordionItem.appendChild(panel);
    accordion.appendChild(accordionItem);
  });

  categoryContent.innerHTML = '';
  categoryContent.appendChild(searchBar);
  categoryContent.appendChild(accordion);

  // Apply Codex icons to newly created elements
  applyCodexIcons();

  // Add search functionality with debouncing
  const searchInput = document.getElementById('categorySearchInput');
  let searchTimeout;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim().toLowerCase();

    searchTimeout = setTimeout(() => {
      if (query.length > 0) {
        performSearch(query);
      } else {
        // Show accordion again when search is cleared
        accordion.style.display = 'flex';
        const existingResults = categoryContent.querySelector('.search-results');
        if (existingResults) {
          existingResults.remove();
        }
      }
    }, 300); // 300ms debounce
  });
}

// Search function with grouped results
function performSearch(query) {
  const accordion = document.querySelector('.category-accordion');
  let existingResults = categoryContent.querySelector('.search-results');

  // Hide accordion during search
  accordion.style.display = 'none';

  // Create or update results container
  if (!existingResults) {
    existingResults = document.createElement('div');
    existingResults.className = 'search-results';
    categoryContent.appendChild(existingResults);
  }

  // Search across all categories
  const results = [];

  WIKIPEDIA_CATEGORIES.forEach(topic => {
    const topicResults = [];

    topic.subcategories.forEach(subcategory => {
      const isObject = typeof subcategory === 'object';
      const subName = isObject ? subcategory.name : subcategory;

      // Check if subcategory name matches
      if (subName.toLowerCase().includes(query)) {
        topicResults.push({
          type: 'subcategory',
          topic: topic,
          subcategory: subcategory,
          name: subName,
          path: `${topic.name} › ${subName}`
        });
      }

      // Check granular types if they exist
      if (isObject && subcategory.hasGranularTypes && subcategory.types) {
        subcategory.types.forEach(granularType => {
          if (granularType.name.toLowerCase().includes(query)) {
            topicResults.push({
              type: 'granular',
              topic: topic,
              subcategory: subcategory,
              granularType: granularType,
              name: granularType.name,
              path: `${topic.name} › ${subName}`
            });
          }
        });
      }
    });

    if (topicResults.length > 0) {
      results.push({
        topic: topic,
        items: topicResults
      });
    }
  });

  // Render results
  if (results.length === 0) {
    existingResults.innerHTML = `
      <div class="search-results-empty">
        No matching article types found for "${query}"
      </div>
    `;
  } else {
    let resultsHTML = '';
    results.forEach(group => {
      resultsHTML += `
        <div class="search-group">
          <h5 class="search-group-title">${group.topic.name}</h5>
      `;

      group.items.forEach(item => {
        resultsHTML += `
          <button class="search-result-item" data-result-type="${item.type}" data-result-id="${item.type === 'granular' ? item.granularType.id : (typeof item.subcategory === 'object' ? item.subcategory.id : item.name)}">
            <span class="search-path">${item.path}</span>
            <span class="search-match">${item.name}</span>
          </button>
        `;
      });

      resultsHTML += '</div>';
    });

    existingResults.innerHTML = resultsHTML;

    // Add click handlers to results
    existingResults.querySelectorAll('.search-result-item').forEach((resultBtn, index) => {
      resultBtn.addEventListener('click', () => {
        // Find the corresponding result
        let resultItem = null;
        for (const group of results) {
          const found = group.items.find((item, idx) => {
            // Match by checking if this is the right button
            return resultBtn.dataset.resultId === (item.type === 'granular' ? item.granularType.id : (typeof item.subcategory === 'object' ? item.subcategory.id : item.name));
          });
          if (found) {
            resultItem = found;
            break;
          }
        }

        if (resultItem) {
          if (resultItem.type === 'granular') {
            // Direct selection of granular type
            selectGranularType(resultItem.topic, resultItem.subcategory, resultItem.granularType);
          } else {
            // Direct selection of subcategory
            selectCategory(resultItem.topic, resultItem.subcategory);
          }
        }
      });
    });
  }
}

function toggleAccordionItem(item) {
  const isExpanded = item.classList.contains('expanded');

  if (isExpanded) {
    // Collapse this item
    item.classList.remove('expanded');
  } else {
    // Collapse all other items first (auto-collapse)
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(i => i.classList.remove('expanded'));

    // Expand this item
    item.classList.add('expanded');

    // Smooth scroll to keep it in view
    setTimeout(() => {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

function showSubcategories(topic) {
  navigationStack.push({ type: 'main' });
  categorySheetTitle.textContent = topic.name;
  categoryBackBtn.style.display = 'flex';
  
  const list = document.createElement('div');
  list.className = 'subcategory-list';
  
  topic.subcategories.forEach(subcategory => {
    const chip = document.createElement('div');
    chip.className = 'cdx-input-chip';
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.innerHTML = `
      <span class="cdx-input-chip__text">${subcategory}</span>
    `;
    chip.addEventListener('click', () => selectCategory(topic, subcategory));
    list.appendChild(chip);
  });
  
  categoryContent.innerHTML = '';
  categoryContent.appendChild(list);
}

// Inline expansion for all granular types
function expandSubcategory(topic, subcategory, chipElement, chipsContainer) {
  const types = subcategory.types || [];

  // Check if already expanded
  const existingExpansion = chipsContainer.parentElement.querySelector('.granular-expansion-wrapper');
  if (existingExpansion) {
    // Collapse if clicking the same chip
    const expandedChipId = existingExpansion.dataset.subcategoryId;
    if (expandedChipId === subcategory.id) {
      existingExpansion.remove();
      chipElement.classList.remove('chip-expanded');
      return;
    } else {
      // Remove previous expansion
      existingExpansion.remove();
      const prevChip = chipsContainer.querySelector('.chip-expanded');
      if (prevChip) prevChip.classList.remove('chip-expanded');
    }
  }

  // Always inline expansion regardless of count
  chipElement.classList.add('chip-expanded');

  const granularContainer = document.createElement('div');
  granularContainer.className = 'granular-types-inline';
  granularContainer.dataset.subcategoryId = subcategory.id;

  types.forEach(type => {
    const typeChip = document.createElement('div');
    typeChip.className = 'granular-type-chip';
    typeChip.textContent = type.name;
    typeChip.addEventListener('click', (e) => {
      e.stopPropagation();
      selectGranularType(topic, subcategory, type);
    });
    granularContainer.appendChild(typeChip);
  });

  // Insert right after the clicked chip (not at the end)
  // We need to wrap the expansion in a full-width container
  const expansionWrapper = document.createElement('div');
  expansionWrapper.className = 'granular-expansion-wrapper';
  expansionWrapper.dataset.subcategoryId = subcategory.id;
  expansionWrapper.appendChild(granularContainer);

  // Insert after the current chip
  chipElement.parentNode.insertBefore(expansionWrapper, chipElement.nextSibling);

  // Smooth scroll to show expansion
  setTimeout(() => {
    expansionWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// Show granular types in new sheet (for 4+ types)
function showGranularTypesSheet(topic, subcategory, types) {
  navigationStack.push({ type: 'subcategory', topic: topic });
  categorySheetTitle.textContent = subcategory.name;
  categoryBackBtn.style.display = 'flex';

  const list = document.createElement('div');
  list.className = 'granular-types-list';

  types.forEach(type => {
    const chip = document.createElement('div');
    chip.className = 'cdx-input-chip';
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.innerHTML = `
      <span class="cdx-input-chip__text">${type.name}</span>
    `;
    chip.addEventListener('click', () => selectGranularType(topic, subcategory, type));
    list.appendChild(chip);
  });

  categoryContent.innerHTML = '';
  categoryContent.appendChild(list);

  // Apply icons
  applyCodexIcons();
}

// Select granular type (3rd level selection)
function selectGranularType(topic, subcategory, type) {
  // Store selection
  selectedCategory = {
    topic: topic,
    subcategory: subcategory,
    type: type
  };

  // Get template - try granular first, then fallback
  const template = SECTION_TEMPLATES[type.template]
    || SECTION_TEMPLATES[subcategory.template]
    || SECTION_TEMPLATES[`${topic.id}-default`]
    || SECTION_TEMPLATES['people-default'];

  // Navigate to guidelines screen
  showGuidelinesScreen(topic, subcategory, type, template);
}

// Shared guidelines screen function
function showGuidelinesScreen(topic, subcategory, type, template) {
  // Push to navigation stack
  navigationStack.push({ type: 'guidelines', topic: topic });

  // Show back button
  categoryBackBtn.style.display = 'flex';

  // Update title
  categorySheetTitle.textContent = 'Ready to start?';

  // Context description for granular type
  const typeName = type.name.toLowerCase();
  let contextDescription = typeName;

  // Special handling for specific types
  if (typeName.includes('cricket')) {
    contextDescription = 'this cricket player';
  } else if (typeName.includes('olympic')) {
    contextDescription = 'this Olympic athlete';
  } else if (typeName.includes('social media')) {
    contextDescription = 'this social media platform';
  } else if (typeName.includes('website')) {
    contextDescription = 'this website or web service';
  }

  // Show guidelines preview screen
  const guidelineDiv = document.createElement('div');
  guidelineDiv.className = 'article-preview-screen';

  guidelineDiv.innerHTML = `
    <div class="preview-header">
      <p class="preview-intro">Start with an introduction that summarizes ${contextDescription}. You can add more sections as you write.</p>
    </div>

    <div class="reality-check">
      <span class="cdx-icon cdx-icon--medium reality-icon" data-icon="cdxIconLightbulb"></span>
      <div class="reality-content">
        <div class="reality-label">${template.guidelines.title}</div>
        <div class="reality-points">
          ${template.guidelines.points.slice(0, 3).map(point => `
            <span class="reality-point">${point}</span>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="action-paths">
      <a href="${template.guidelines.link}" target="_blank" class="path-help">
        Read ${template.guidelines.shortLabel || (typeName + ' notability guidelines')}
      </a>
      <button class="cdx-button cdx-button--action-progressive cdx-button--weight-primary cdx-button--size-large path-confident">
        Start writing
      </button>
    </div>
  `;

  categoryContent.innerHTML = '';
  categoryContent.appendChild(guidelineDiv);

  // Apply icons
  applyCodexIcons();

  // Handle confident path - start with introduction template
  const confidentBtn = guidelineDiv.querySelector('.path-confident');
  confidentBtn.addEventListener('click', () => {
    insertIntroduction(template);
    closeCategorySelector();
  });
}

function selectCategory(topic, subcategory) {
  // Handle both old string format and new object format
  const isObject = typeof subcategory === 'object';

  // Store selected category for contextual menu later
  selectedCategory = {
    topic: topic,
    subcategory: isObject ? subcategory : { name: subcategory }
  };

  // Push to navigation stack so we can go back
  navigationStack.push({ type: 'guidelines', topic: topic });

  // Show back button
  categoryBackBtn.style.display = 'flex';

  // Update title - neutral, not about the category itself
  categorySheetTitle.textContent = 'Ready to start?';

  // Get the appropriate template - handle new object format
  let template;
  if (isObject && subcategory.template) {
    // New format: use template property directly
    template = SECTION_TEMPLATES[subcategory.template]
      || SECTION_TEMPLATES[`${topic.id}-default`]
      || SECTION_TEMPLATES['people-default'];
  } else {
    // Old format: construct template key from names
    const subName = isObject ? subcategory.name : subcategory;
    const templateKey = `${topic.id}-${subName.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`;
    template = SECTION_TEMPLATES[templateKey]
      || SECTION_TEMPLATES[`${topic.id}-default`]
      || SECTION_TEMPLATES['people-default'];
  }

  // Create contextual description based on topic and subcategory
  const contextualDescriptions = {
    // People
    'people-academics': 'this academic or scholar',
    'people-activists': 'this activist or advocate',
    'people-actors-&-actresses': 'this actor or performer',
    'people-artists': 'this artist or creative figure',
    'people-athletes': 'this athlete or sports figure',
    'people-authors-&-writers': 'this author or writer',
    'people-business-people': 'this business leader or entrepreneur',
    'people-musicians': 'this musician or band',
    'people-politicians': 'this political figure',
    'people-scientists': 'this scientist or researcher',
    'people-other': 'this person',
    // Culture
    'culture-arts-&-entertainment': 'this cultural work or topic',
    'culture-film-&-music': 'this film, music, or media work',
    'culture-literature': 'this literary work or author',
    'culture-performing-arts': 'this performance or performing artist',
    'culture-popular-culture': 'this cultural phenomenon or work',
    'culture-museums-&-galleries': 'this museum, gallery, or cultural institution',
    'culture-other': 'this cultural topic',
    // Geography
    'geography-cities-&-towns': 'this city or town',
    'geography-countries': 'this country or nation',
    'geography-landmarks': 'this landmark or place',
    'geography-natural-features': 'this natural feature or location',
    'geography-other': 'this place or location',
    // History
    'history-ancient-history': 'this historical topic or period',
    'history-medieval-history': 'this historical topic or period',
    'history-modern-history': 'this historical topic or period',
    'history-wars-&-conflicts': 'this war, conflict, or battle',
    'history-historical-events': 'this historical event',
    'history-other': 'this historical topic',
    // Science
    'science-biology': 'this biological concept or organism',
    'science-chemistry': 'this chemical concept or compound',
    'science-physics': 'this physics concept or phenomenon',
    'science-astronomy': 'this astronomical concept or object',
    'science-animals-&-plants': 'this animal, plant, or species',
    'science-other': 'this scientific topic',
    // Technology
    'technology-computing-&-it': 'this software, technology, or IT system',
    'technology-engineering': 'this engineering concept or technology',
    'technology-internet-&-web': 'this internet technology or web platform',
    'technology-transportation': 'this transportation technology or vehicle',
    'technology-inventions': 'this invention or innovation',
    'technology-other': 'this technology or innovation',
    // Society
    'society-education': 'this educational institution or concept',
    'society-law-&-legal': 'this legal concept or case',
    'society-politics-&-government': 'this political institution or concept',
    'society-organizations': 'this organization or institution',
    'society-economics': 'this economic concept or topic',
    'society-military': 'this military topic or organization',
    'society-other': 'this social topic',
    // Health
    'health-medicine': 'this medical topic or treatment',
    'health-diseases-&-conditions': 'this disease or medical condition',
    'health-healthcare': 'this healthcare topic or system',
    'health-mental-health': 'this mental health topic or condition',
    'health-nutrition': 'this nutrition or dietary topic',
    'health-other': 'this health topic',
    // Philosophy
    'philosophy-ethics': 'this ethical concept or theory',
    'philosophy-logic': 'this logical concept or system',
    'philosophy-metaphysics': 'this metaphysical concept',
    'philosophy-political-philosophy': 'this political philosophy concept',
    'philosophy-aesthetics': 'this aesthetic concept or theory',
    'philosophy-other': 'this philosophical topic',
    // Religion
    'religion-christianity': 'this Christian topic or concept',
    'religion-islam': 'this Islamic topic or concept',
    'religion-buddhism': 'this Buddhist topic or concept',
    'religion-hinduism': 'this Hindu topic or concept',
    'religion-judaism': 'this Jewish topic or concept',
    'religion-other-religions': 'this religious topic',
    // Mathematics
    'mathematics-algebra': 'this mathematical concept',
    'mathematics-geometry': 'this mathematical concept',
    'mathematics-calculus': 'this mathematical concept',
    'mathematics-statistics': 'this statistical concept',
    'mathematics-number-theory': 'this mathematical concept',
    'mathematics-other': 'this mathematical topic',
    // Humanities
    'humanities-archaeology': 'this archaeological topic or site',
    'humanities-languages': 'this language or linguistic topic',
    'humanities-linguistics': 'this linguistic concept',
    'humanities-anthropology': 'this anthropological topic',
    'humanities-cultural-studies': 'this cultural topic',
    'humanities-other': 'this humanities topic'
  };

  // Get context description - handle both old and new formats
  const subName = isObject ? subcategory.name : subcategory;
  const contextKey = `${topic.id}-${subName.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`;
  const contextDescription = contextualDescriptions[contextKey] || 'the topic';

  // Show exciting preview screen - no scroll needed
  const guidelineDiv = document.createElement('div');
  guidelineDiv.className = 'article-preview-screen';

  // Get first 4 sections for preview
  const previewSections = template.sections.slice(0, 4);

  guidelineDiv.innerHTML = `
    <div class="preview-header">
      <p class="preview-intro">Start with an introduction that summarizes ${contextDescription}. You can add more sections as you write.</p>
    </div>

    <div class="reality-check">
      <span class="cdx-icon cdx-icon--medium reality-icon" data-icon="cdxIconLightbulb"></span>
      <div class="reality-content">
        <div class="reality-label">${template.guidelines.title}</div>
        <div class="reality-points">
          ${template.guidelines.points.slice(0, 3).map(point => `
            <span class="reality-point">${point}</span>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="action-paths">
      <a href="${template.guidelines.link}" target="_blank" class="path-help">
        Read ${template.guidelines.shortLabel || (subName.toLowerCase() + ' notability guidelines')}
      </a>
      <button class="cdx-button cdx-button--action-progressive cdx-button--weight-primary cdx-button--size-large path-confident">
        Start writing
      </button>
    </div>
  `;

  categoryContent.innerHTML = '';
  categoryContent.appendChild(guidelineDiv);

  // Apply icons
  applyCodexIcons();

  // Handle confident path - start with introduction template
  const confidentBtn = guidelineDiv.querySelector('.path-confident');
  confidentBtn.addEventListener('click', () => {
    insertIntroduction(template);
    closeCategorySelector();
  });
}

function insertIntroduction(template) {
  // Clear canvas only for introduction (fresh start)
  canvas.innerHTML = '';

  // Disable canvas contentEditable - we'll use structured sections instead
  canvas.contentEditable = 'false';

  // Create introduction wrapper
  const introWrapper = document.createElement('div');
  introWrapper.className = 'section-wrapper intro-wrapper';
  introWrapper.dataset.sectionId = 'introduction';

  // Create introduction content area
  const introContent = document.createElement('div');
  introContent.className = 'intro-content';
  introContent.contentEditable = 'true';

  // Ensure intro content is properly editable on mobile
  introContent.addEventListener('click', (e) => {
    e.stopPropagation();
    introContent.focus();

    // On mobile, ensure cursor is positioned
    if (window.innerWidth <= 768) {
      const range = document.createRange();
      const sel = window.getSelection();

      if (introContent.textContent.length > 0) {
        // Place cursor at end of existing content
        range.setStart(introContent, introContent.childNodes.length);
        range.collapse(true);
      } else {
        // Empty content - just focus
        range.selectNodeContents(introContent);
        range.collapse(false);
      }

      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  // Create contextual description (same mapping as in selectCategory)
  const contextualDescriptions = {
    // People
    'people-academics': 'this academic or scholar',
    'people-activists': 'this activist or advocate',
    'people-actors-&-actresses': 'this actor or performer',
    'people-artists': 'this artist or creative figure',
    'people-athletes': 'this athlete or sports figure',
    'people-authors-&-writers': 'this author or writer',
    'people-business-people': 'this business leader or entrepreneur',
    'people-musicians': 'this musician or band',
    'people-politicians': 'this political figure',
    'people-scientists': 'this scientist or researcher',
    'people-other': 'this person',
    // Culture
    'culture-arts-&-entertainment': 'this cultural work or topic',
    'culture-film-&-music': 'this film, music, or media work',
    'culture-literature': 'this literary work or author',
    'culture-performing-arts': 'this performance or performing artist',
    'culture-popular-culture': 'this cultural phenomenon or work',
    'culture-museums-&-galleries': 'this museum, gallery, or cultural institution',
    'culture-other': 'this cultural topic',
    // Geography
    'geography-cities-&-towns': 'this city or town',
    'geography-countries': 'this country or nation',
    'geography-landmarks': 'this landmark or place',
    'geography-natural-features': 'this natural feature or location',
    'geography-other': 'this place or location',
    // History
    'history-ancient-history': 'this historical topic or period',
    'history-medieval-history': 'this historical topic or period',
    'history-modern-history': 'this historical topic or period',
    'history-wars-&-conflicts': 'this war, conflict, or battle',
    'history-historical-events': 'this historical event',
    'history-other': 'this historical topic',
    // Science
    'science-biology': 'this biological concept or organism',
    'science-chemistry': 'this chemical concept or compound',
    'science-physics': 'this physics concept or phenomenon',
    'science-astronomy': 'this astronomical concept or object',
    'science-animals-&-plants': 'this animal, plant, or species',
    'science-other': 'this scientific topic',
    // Technology
    'technology-computing-&-it': 'this software, technology, or IT system',
    'technology-engineering': 'this engineering concept or technology',
    'technology-internet-&-web': 'this internet technology or web platform',
    'technology-transportation': 'this transportation technology or vehicle',
    'technology-inventions': 'this invention or innovation',
    'technology-other': 'this technology or innovation',
    // Society
    'society-education': 'this educational institution or concept',
    'society-law-&-legal': 'this legal concept or case',
    'society-politics-&-government': 'this political institution or concept',
    'society-organizations': 'this organization or institution',
    'society-economics': 'this economic concept or topic',
    'society-military': 'this military topic or organization',
    'society-other': 'this social topic',
    // Health
    'health-medicine': 'this medical topic or treatment',
    'health-diseases-&-conditions': 'this disease or medical condition',
    'health-healthcare': 'this healthcare topic or system',
    'health-mental-health': 'this mental health topic or condition',
    'health-nutrition': 'this nutrition or dietary topic',
    'health-other': 'this health topic',
    // Philosophy
    'philosophy-ethics': 'this ethical concept or theory',
    'philosophy-logic': 'this logical concept or system',
    'philosophy-metaphysics': 'this metaphysical concept',
    'philosophy-political-philosophy': 'this political philosophy concept',
    'philosophy-aesthetics': 'this aesthetic concept or theory',
    'philosophy-other': 'this philosophical topic',
    // Religion
    'religion-christianity': 'this Christian topic or concept',
    'religion-islam': 'this Islamic topic or concept',
    'religion-buddhism': 'this Buddhist topic or concept',
    'religion-hinduism': 'this Hindu topic or concept',
    'religion-judaism': 'this Jewish topic or concept',
    'religion-other-religions': 'this religious topic',
    // Mathematics
    'mathematics-algebra': 'this mathematical concept',
    'mathematics-geometry': 'this mathematical concept',
    'mathematics-calculus': 'this mathematical concept',
    'mathematics-statistics': 'this statistical concept',
    'mathematics-number-theory': 'this mathematical concept',
    'mathematics-other': 'this mathematical topic',
    // Humanities
    'humanities-archaeology': 'this archaeological topic or site',
    'humanities-languages': 'this language or linguistic topic',
    'humanities-linguistics': 'this linguistic concept',
    'humanities-anthropology': 'this anthropological topic',
    'humanities-cultural-studies': 'this cultural topic',
    'humanities-other': 'this humanities topic'
  };

  // Handle both object and string subcategory formats
  let contextKey = null;
  if (selectedCategory) {
    const subName = typeof selectedCategory.subcategory === 'object'
      ? selectedCategory.subcategory.name
      : selectedCategory.subcategory;
    contextKey = `${selectedCategory.topic.id}-${subName.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`;
  }
  const contextDescription = contextKey ? (contextualDescriptions[contextKey] || 'the topic') : 'the topic';

  introContent.setAttribute('data-placeholder', `Write an introduction that summarizes ${contextDescription}...`);

  // Create helper container with examples button and citation prompt
  const examplesHelper = document.createElement('div');
  examplesHelper.className = 'examples-helper';
  examplesHelper.innerHTML = `
    <div class="citation-prompt examples-prompt">
      <span class="cdx-icon cdx-icon--small" data-icon="cdxIconLightbulb" style="color: #72777d;"></span>
      <span>See&nbsp;example</span>
    </div>
    <div class="citation-prompt">
      <span class="cdx-icon cdx-icon--small" data-icon="cdxIconReference" style="color: #72777d;"></span>
      <span>Add&nbsp;citation</span>
    </div>
  `;

  // Contextual checklist block under intro placeholder
  let introGuidance = null;
  if (template.sectionGuidance && template.sectionGuidance.introduction) {
    introGuidance = document.createElement('div');
    introGuidance.className = 'section-guidance-inline';
    const introPointsHtml = template.sectionGuidance.introduction.points
      .map(point => `<span>${point}</span>`)
      .join('');
    introGuidance.innerHTML = `
      <div class="section-guidance-title">${template.sectionGuidance.introduction.title}</div>
      <div class="section-guidance-points">${introPointsHtml}</div>
    `;
  }

  // Assemble the introduction wrapper
  introWrapper.appendChild(introContent);
  if (introGuidance) {
    introWrapper.appendChild(introGuidance);
  }
  introWrapper.appendChild(examplesHelper);

  // Make the entire intro wrapper clickable to focus content
  introWrapper.style.cursor = 'text';
  introWrapper.addEventListener('click', (e) => {
    // Don't focus if clicking on buttons or other interactive elements
    if (e.target.closest('button') || e.target.closest('.citation-prompt')) {
      return;
    }
    introContent.focus();
  });

  // Append introduction wrapper to canvas
  canvas.appendChild(introWrapper);

  // Apply icons
  applyCodexIcons();

  // Handle examples prompt click
  const examplesPrompt = examplesHelper.querySelector('.examples-prompt');
  examplesPrompt.addEventListener('click', () => {
    openExamplesSheet(template, 'introduction');
  });

  // Handle citation prompt click - handled by global listener now
  // const citationPrompts = examplesHelper.querySelectorAll('.citation-prompt');
  // citationPrompts[1].addEventListener('click', () => {
  //   openCitationDialog();
  // });

  // Focus on introduction content for immediate editing
  introContent.focus();
}

function openInfoboxSheet(template) {
  // Create infobox bottom sheet
  if (!categoryBackdrop) {
    categoryBackdrop = document.createElement('div');
    categoryBackdrop.className = 'sheet-backdrop';
    document.body.appendChild(categoryBackdrop);
    categoryBackdrop.addEventListener('click', () => {
      closeInfoboxSheet();
    });
  }

  modalContext = 'infobox';
  categorySheetTitle.textContent = 'Add an infobox';
  categoryBackBtn.style.display = 'flex'; // Show back arrow

  // Create infobox content
  const infoboxContainer = document.createElement('div');
  infoboxContainer.className = 'infobox-form-container';

  infoboxContainer.innerHTML = `
    <div class="infobox-intro">
      <p class="infobox-intro-text">Add key facts about this person. You can always edit or add more fields later.</p>
    </div>

    <div class="infobox-form">
      <div class="infobox-field">
        <label class="infobox-label">Name</label>
        <input type="text" class="infobox-input" placeholder="Full name">
      </div>

      <div class="infobox-field">
        <label class="infobox-label">Born</label>
        <input type="text" class="infobox-input" placeholder="Date of birth">
      </div>

      <div class="infobox-field">
        <label class="infobox-label">Occupation</label>
        <input type="text" class="infobox-input" placeholder="e.g., Tennis player">
      </div>

      <div class="infobox-field">
        <label class="infobox-label">Nationality</label>
        <input type="text" class="infobox-input" placeholder="e.g., American">
      </div>

      <div class="infobox-field">
        <label class="infobox-label">Known for</label>
        <input type="text" class="infobox-input" placeholder="Major achievement">
      </div>
    </div>

    <div class="infobox-actions">
      <button class="cdx-button cdx-button--action-progressive cdx-button--weight-primary cdx-button--size-large infobox-insert-btn">
        Insert infobox
      </button>
      <button class="cdx-button cdx-button--weight-quiet cdx-button--size-large infobox-skip-btn">
        Skip for now
      </button>
    </div>
  `;

  categoryContent.innerHTML = '';
  categoryContent.appendChild(infoboxContainer);

  // Apply Codex icons
  applyCodexIcons();

  // Handle insert button
  const insertBtn = infoboxContainer.querySelector('.infobox-insert-btn');
  insertBtn.addEventListener('click', () => {
    alert('Infobox would be inserted into the article');
    closeInfoboxSheet();
  });

  // Handle skip button
  const skipBtn = infoboxContainer.querySelector('.infobox-skip-btn');
  skipBtn.addEventListener('click', () => {
    closeInfoboxSheet();
  });

  categorySheet.classList.add('active');
  categoryBackdrop.style.display = 'block';
}

function closeInfoboxSheet() {
  categorySheet.classList.remove('active');
  categoryBackdrop.style.display = 'none';
  modalContext = null;
  canvas.focus(); // Return focus to editor
}

function openExamplesSheet(template, sectionId = 'introduction') {
  // Create examples bottom sheet
  if (!categoryBackdrop) {
    categoryBackdrop = document.createElement('div');
    categoryBackdrop.className = 'sheet-backdrop';
    document.body.appendChild(categoryBackdrop);
    categoryBackdrop.addEventListener('click', () => {
      closeExamplesSheet();
    });
  }

  modalContext = 'examples';
  categorySheetTitle.textContent = 'Examples';
  categoryBackBtn.style.display = 'flex'; // Show back arrow

  // Get section-specific examples or fall back to introduction
  console.log('Opening examples for section:', sectionId);
  const sectionExamples = SECTION_EXAMPLES[sectionId] || SECTION_EXAMPLES['introduction'];
  console.log('Section examples:', sectionExamples);

  // Create examples content
  const examplesContainer = document.createElement('div');
  examplesContainer.className = 'examples-container';

  // Build examples HTML dynamically
  const examplesHTML = sectionExamples.examples.map(example => `
    <div class="example-card">
      <div class="example-text">
        <p>${example.text}</p>
      </div>
      <a href="${example.url}" target="_blank" class="example-read-more">
        Read full article →
      </a>
    </div>
  `).join('');

  // Filter out already inserted sections for suggestions
  const availableSections = template.sections.filter(section => !insertedSections.includes(section.id));

  // Infobox suggestion HTML (only for introduction section)
  const infoboxHTML = sectionId === 'introduction' ? `
    <div class="examples-divider"></div>

    <div class="infobox-suggestion-inline">
      <div class="infobox-preview-label">
        <span class="cdx-icon cdx-icon--small" data-icon="cdxIconInfoFilled" style="color: #54595d;"></span>
        <span>Add an infobox</span>
      </div>
      <div class="infobox-preview-miniature">
        <div class="infobox-preview-image">[Photo]</div>
        <div class="infobox-preview-field"><strong>Born</strong>: [Date]</div>
        <div class="infobox-preview-field"><strong>Occupation</strong>: [Role]</div>
        <div class="infobox-preview-field"><strong>Nationality</strong>: [Country]</div>
      </div>
      <p class="infobox-preview-help">Infoboxes show key facts at a glance</p>
      <button class="cdx-button cdx-button--action-progressive cdx-button--size-medium infobox-add-btn-inline">
        <span class="cdx-icon cdx-icon--small" data-icon="cdxIconAdd"></span>
        Add infobox
      </button>
    </div>
  ` : '';

  const suggestionsHTML = availableSections.length > 0 ? `
    <div class="examples-divider"></div>

    <div class="other-sections-available">
      <h4 class="examples-heading-secondary">Rather start elsewhere?</h4>
      <p class="section-helper-text-subtle">Some writers prefer to start with:</p>
      <div class="section-quick-links">
        ${availableSections
          .slice(0, 2)
          .map(section => `
            <button class="section-quick-link" data-section-id="${section.id}">
              ${section.title}
            </button>
          `).join('')}
      </div>
    </div>
  ` : '';

  // Contextual examples formatted like Wikipedia
  examplesContainer.innerHTML = `
    <div class="examples-caveat">
      <span class="cdx-icon cdx-icon--medium examples-caveat-icon" data-icon="cdxIconLightbulb"></span>
      <div class="examples-caveat-content">
        <p class="examples-caveat-text">Use these as inspiration for structure. Remember: start with reliable sources and write in your own words.</p>
      </div>
    </div>

    <div class="examples-section">
      <h4 class="examples-heading">${sectionExamples.heading}</h4>
      ${examplesHTML}
    </div>

    ${infoboxHTML}
    ${suggestionsHTML}
  `;

  categoryContent.innerHTML = '';
  categoryContent.appendChild(examplesContainer);

  // Apply Codex icons to newly created elements
  applyCodexIcons();

  // Handle infobox button click (inline in examples sheet)
  const infoboxBtn = examplesContainer.querySelector('.infobox-add-btn-inline');
  if (infoboxBtn) {
    infoboxBtn.addEventListener('click', () => {
      openInfoboxSheet(template);
    });
  }

  // Handle section quick links
  const quickLinks = examplesContainer.querySelectorAll('.section-quick-link');
  quickLinks.forEach(link => {
    link.addEventListener('click', () => {
      const sectionId = link.dataset.sectionId;
      const section = template.sections.find(s => s.id === sectionId);
      if (section) {
        insertSection(section);
        closeExamplesSheet();
      }
    });
  });

  categorySheet.classList.add('active');
  categoryBackdrop.style.display = 'block';
}

function closeExamplesSheet() {
  categorySheet.classList.remove('active');
  categoryBackdrop.style.display = 'none';
  modalContext = null;
  canvas.focus(); // Return focus to editor
}

function showContextualSections() {
  if (!selectedCategory) return;

  // Get the template - handle both object and string subcategory formats
  const subName = typeof selectedCategory.subcategory === 'object'
    ? selectedCategory.subcategory.name
    : selectedCategory.subcategory;
  const templateKey = `${selectedCategory.topic.id}-${subName.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`;
  const template = SECTION_TEMPLATES[templateKey] || SECTION_TEMPLATES[`${selectedCategory.topic.id}-default`] || SECTION_TEMPLATES['people-default'];
  
  // Create backdrop
  if (!categoryBackdrop) {
    categoryBackdrop = document.createElement('div');
    categoryBackdrop.className = 'sheet-backdrop';
    document.body.appendChild(categoryBackdrop);
    categoryBackdrop.addEventListener('click', closeCategorySelector);
  }
  
  // Show section list
  categorySheetTitle.textContent = 'Add a section';
  categoryBackBtn.style.display = 'none';
  
  const sectionList = document.createElement('div');
  sectionList.className = 'section-selection-list';
  sectionList.innerHTML = `
    <p class="section-help-text">Choose the next section to add to your article:</p>
  `;
  
  const chipsContainer = document.createElement('div');
  chipsContainer.className = 'subcategory-list';
  
  template.sections.forEach(section => {
    // Skip already inserted sections
    if (insertedSections.includes(section.id)) return;
    
    const chip = document.createElement('div');
    chip.className = 'cdx-input-chip';
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.innerHTML = `
      <span class="cdx-input-chip__text">${section.title}</span>
    `;
    chip.addEventListener('click', () => {
      insertSection(section);
      closeCategorySelector();
    });
    chipsContainer.appendChild(chip);
  });
  
  sectionList.appendChild(chipsContainer);
  categoryContent.innerHTML = '';
  categoryContent.appendChild(sectionList);
  
  categorySheet.classList.add('active');
  categoryBackdrop.style.display = 'block';
}

function insertSection(section) {
  const templateKey = selectedCategory
    ? (selectedCategory.type ? selectedCategory.type.template
      : (typeof selectedCategory.subcategory === 'object' ? selectedCategory.subcategory.template : null))
    : null;
  const template = templateKey ? SECTION_TEMPLATES[templateKey] : null;

  // Create a wrapper div for this entire section (heading + content + helper buttons)
  const sectionWrapper = document.createElement('div');
  sectionWrapper.className = 'section-wrapper';
  sectionWrapper.dataset.sectionId = section.id;

  // Create section header container
  const headerContainer = document.createElement('div');
  headerContainer.className = 'section-header-container';

  // Create section heading
  const heading = document.createElement('h2');
  heading.className = 'section-heading';
  heading.textContent = section.title;

  // Create discard button
  const discardBtn = document.createElement('button');
  discardBtn.type = 'button';
  discardBtn.className = 'section-discard-btn';
  discardBtn.setAttribute('aria-label', `Remove ${section.title} section`);
  discardBtn.innerHTML = '<span class="cdx-icon" data-icon="cdxIconClose"></span>';
  discardBtn.addEventListener('click', () => {
    // Remove section from inserted sections tracking
    const index = insertedSections.indexOf(section.id);
    if (index > -1) {
      insertedSections.splice(index, 1);
    }
    // Remove the section wrapper from DOM
    sectionWrapper.remove();
  });

  // Assemble header container
  headerContainer.appendChild(heading);
  headerContainer.appendChild(discardBtn);

  // Create section content
  const content = document.createElement('p');
  content.className = 'section-content';
  content.contentEditable = 'true';
  content.setAttribute('data-placeholder', section.placeholder);

  // Ensure content is properly editable on mobile
  content.addEventListener('click', (e) => {
    e.stopPropagation();
    content.focus();

    // On mobile, ensure cursor is positioned
    if (window.innerWidth <= 768) {
      const range = document.createRange();
      const sel = window.getSelection();

      if (content.textContent.length > 0) {
        // Place cursor at end of existing content
        range.setStart(content, content.childNodes.length);
        range.collapse(true);
      } else {
        // Empty content - just focus
        range.selectNodeContents(content);
        range.collapse(false);
      }

      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  // Create helper buttons for this specific section
  const helperDiv = document.createElement('div');
  helperDiv.className = 'examples-helper';
  helperDiv.innerHTML = `
    <div class="citation-prompt examples-prompt">
      <span class="cdx-icon cdx-icon--small" data-icon="cdxIconLightbulb" style="color: #72777d;"></span>
      <span>See&nbsp;example</span>
    </div>
    <div class="citation-prompt">
      <span class="cdx-icon cdx-icon--small" data-icon="cdxIconReference" style="color: #72777d;"></span>
      <span>Add&nbsp;citation</span>
    </div>
  `;

  const templateGuidance = (template && template.sectionGuidance && template.sectionGuidance[section.id]) || null;
  let guidanceBlock = null;
  if (templateGuidance) {
    guidanceBlock = document.createElement('div');
    guidanceBlock.className = 'section-guidance-inline';
    const pointsHtml = templateGuidance.points
      .map(point => `<span>${point}</span>`)
      .join('');
    guidanceBlock.innerHTML = `
      <div class="section-guidance-title">${templateGuidance.title}</div>
      <div class="section-guidance-points">${pointsHtml}</div>
    `;
  }

  // Assemble the section
  sectionWrapper.appendChild(headerContainer);
  sectionWrapper.appendChild(content);
  if (guidanceBlock) {
    sectionWrapper.appendChild(guidanceBlock);
  }
  sectionWrapper.appendChild(helperDiv);

  // Make the entire section wrapper clickable to focus content
  sectionWrapper.style.cursor = 'text';
  sectionWrapper.addEventListener('click', (e) => {
    // Don't focus if clicking on buttons or other interactive elements
    if (e.target.closest('button') || e.target.closest('.citation-prompt')) {
      return;
    }
    content.focus();
  });

  // Append the complete section to canvas (preserves existing content)
  canvas.appendChild(sectionWrapper);

  // Apply icons
  applyCodexIcons();

  // Add event listeners to helper buttons
  const examplesPrompt = helperDiv.querySelector('.examples-prompt');
  examplesPrompt.addEventListener('click', () => {
    if (template) {
      openExamplesSheet(template, section.id);
    }
  });

  // Citation prompt click handled by global listener
  // const citationPrompt = helperDiv.querySelectorAll('.citation-prompt')[1];
  // citationPrompt.addEventListener('click', () => {
  //   openCitationDialog();
  // });

  // Focus and select content
  content.focus();
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(content);
  selection.removeAllRanges();
  selection.addRange(range);

  // Track insertion
  insertedSections.push(section.id);

  // Show slash reminder after first section on mobile
  // DISABLED: Slash reminder popup removed
  // if (insertedSections.length === 1 && window.innerWidth <= 768 && !slashReminderShown) {
  //   setTimeout(() => showSlashReminder(), 2000); // Show after 2 seconds
  // }
}

function showSlashReminder() {
  if (slashReminderDismissed) return;

  slashReminderShown = true;

  // Create reminder chip
  const reminder = document.createElement('div');
  reminder.className = 'slash-reminder';
  reminder.innerHTML = `
    <span class="slash-reminder-text">Press <kbd>/</kbd> to add sections</span>
    <button class="slash-reminder-dismiss" aria-label="Dismiss">×</button>
  `;

  document.body.appendChild(reminder);

  // Apply icons if needed
  applyCodexIcons();

  // Fade in
  setTimeout(() => {
    reminder.classList.add('visible');
  }, 100);

  // Auto-hide after 10 seconds
  const autoHideTimeout = setTimeout(() => {
    hideSlashReminder();
  }, 10000);

  // Dismiss button
  const dismissBtn = reminder.querySelector('.slash-reminder-dismiss');
  dismissBtn.addEventListener('click', () => {
    clearTimeout(autoHideTimeout);
    hideSlashReminder();
    slashReminderDismissed = true;
  });
}

function hideSlashReminder() {
  const reminder = document.querySelector('.slash-reminder');
  if (reminder) {
    reminder.classList.remove('visible');
    setTimeout(() => {
      reminder.remove();
    }, 300); // Match CSS transition time
  }
}

function goBack() {
  if (navigationStack.length > 0) {
    const lastItem = navigationStack.pop();

    if (navigationStack.length === 0) {
      // Back to main topics accordion
      showMainTopics();
    } else if (lastItem.type === 'guidelines') {
      // Going back from guidelines to main topics accordion
      // Find and re-expand the topic that was selected
      showMainTopics();

      // After a brief delay, re-expand the topic they were on
      setTimeout(() => {
        const topicItem = document.querySelector(`.accordion-item[data-topic-id="${lastItem.topic.id}"]`);
        if (topicItem) {
          toggleAccordionItem(topicItem);
        }
      }, 100);
    }
  }
}

function init() {
  initToolbarInteractions();
  renderCards();
  applyCodexIcons();

  // iOS requires user interaction to trigger keyboard
  // Add a tap listener to focus and show keyboard
  canvas.addEventListener('click', function focusCanvas(e) {
    canvas.focus();

    // Place cursor at click position or start
    const range = document.createRange();
    const selection = window.getSelection();

    try {
      // Try to place cursor at click position
      if (canvas.childNodes.length > 0) {
        range.selectNodeContents(canvas);
        range.collapse(true);
      } else {
        range.setStart(canvas, 0);
        range.collapse(true);
      }
    } catch (e) {
      // Fallback to start
      range.selectNodeContents(canvas);
      range.collapse(true);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }, { once: false });

  // Try to focus on load (works on desktop, not iOS)
  setTimeout(() => {
    canvas.focus();
  }, 100);

  // === SIMPLIFIED SLASH COMMAND ===
  canvas.addEventListener('keydown', (e) => {
    if (e.key === '/') {
      e.preventDefault();

      // If we already have a category selected and sections inserted, show contextual sections
      if (selectedCategory && insertedSections.length > 0) {
        showContextualSections();
      } else if (canvas.textContent.trim() === '') {
        // Empty canvas - show category selector first
        openCategorySelector();
      } else {
        // Has content but no category selected - show section selector
        openBottomSheet();
      }
    }
  });

  // === STANDARD EVENT HANDLERS ===

  // Close sheet button
  closeSheet.addEventListener('click', (e) => {
    closeBottomSheet();
  });

  // Sheet type toggle
  sheetTypeToggle.addEventListener('click', (e) => {
    const alreadyExpanded = sheetTypeToggle.getAttribute('aria-expanded') === 'true';
    if (alreadyExpanded) {
      document.querySelector('.sheet-type-menu')?.remove();
      sheetTypeToggle.setAttribute('aria-expanded', 'false');
      return;
    }
    openSheetTypeMenu();
  });

  // Canvas focus/blur handling
  canvas.addEventListener('focus', () => {
    canvas.classList.add('focused');
  });

  canvas.addEventListener('blur', () => {
    canvas.classList.remove('focused');
  });

  // Click outside canvas to blur
  document.addEventListener('click', (e) => {
    if (!canvas.contains(e.target)) {
      canvas.blur();
    }
  });

  // Category selector close button
  closeCategorySheet.addEventListener('click', () => {
    closeCategorySelector();
  });

  // Category back button - handles category selector, examples modal, and infobox modal
  categoryBackBtn.addEventListener('click', () => {
    if (modalContext === 'examples') {
      closeExamplesSheet();
    } else if (modalContext === 'infobox') {
      closeInfoboxSheet();
    } else if (modalContext === 'category') {
      goBack();
    }
  });

  // Citation dialog event listeners
  closeCitationSheet.addEventListener('click', closeCitationDialog);
  citationBackBtn.addEventListener('click', closeCitationDialog);

  addCitationBtn.addEventListener('click', () => {
    const sourceUrl = citationSearchInput.value.trim();
    if (sourceUrl) {
      // Placeholder: In real implementation, this would insert citation
      console.log('Adding citation from:', sourceUrl);
      alert('Citation added! (This is a demo - no actual citation inserted)');
      closeCitationDialog();
    } else {
      alert('Please enter a source URL');
    }
  });

  // Recommended source chip click handlers will be added dynamically
}

// Citation Dialog Functions
function openCitationDialog() {
  // Create backdrop if it doesn't exist
  if (!citationBackdrop) {
    citationBackdrop = document.createElement('div');
    citationBackdrop.className = 'sheet-backdrop';
    document.body.appendChild(citationBackdrop);
    citationBackdrop.addEventListener('click', closeCitationDialog);
  }

  // Show recommended sources if we have a selected category
  updateRecommendedSources();

  // Show backdrop and sheet
  citationBackdrop.style.display = 'block';
  setTimeout(() => {
    citationSheet.classList.add('active');
  }, 10);

  // Focus on search input
  setTimeout(() => {
    citationSearchInput.focus();
  }, 350);
}

function closeCitationDialog() {
  citationSheet.classList.remove('active');
  if (citationBackdrop) {
    citationBackdrop.style.display = 'none';
  }
  // Clear input
  citationSearchInput.value = '';
}

function updateRecommendedSources() {
  // Get recommended sources based on selected category
  let templateKey = selectedCategory?.template || selectedCategory?.granularType?.template;

  // For demo/testing: Default to cricket sources if no category selected
  if (!templateKey) {
    templateKey = 'people-athletes-cricket-major';
  }

  if (templateKey && RECOMMENDED_SOURCES[templateKey]) {
    const sources = RECOMMENDED_SOURCES[templateKey];

    // Update title based on category
    const titleElement = recommendedSourcesContainer.querySelector('.recommended-sources-title');
    if (templateKey.includes('cricket')) {
      titleElement.textContent = 'Recommended cricket sources:';
    } else if (templateKey.includes('olympic')) {
      titleElement.textContent = 'Recommended Olympic sources:';
    } else if (templateKey.includes('musicians')) {
      titleElement.textContent = 'Recommended music sources:';
    } else if (templateKey.includes('technology')) {
      titleElement.textContent = 'Recommended tech sources:';
    } else {
      titleElement.textContent = 'Recommended sources:';
    }

    // Clear and populate chips
    recommendedSourcesChips.innerHTML = '';
    sources.forEach(source => {
      const chip = document.createElement('button');
      chip.className = 'recommended-source-chip';
      chip.textContent = source.name;
      chip.addEventListener('click', () => {
        citationSearchInput.value = source.url;
        citationSearchInput.focus();
      });
      recommendedSourcesChips.appendChild(chip);
    });

    // Show container
    recommendedSourcesContainer.style.display = 'block';
  } else {
    // Hide container if no recommended sources
    recommendedSourcesContainer.style.display = 'none';
  }
}

// Make citation dialog accessible from citation prompts
function setupCitationPromptListeners() {
  // Listen for clicks on citation prompts (will be dynamically added)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.citation-prompt')) {
      openCitationDialog();
    }
  });
}

init();
setupCitationPromptListeners();
