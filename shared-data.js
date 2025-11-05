// Shared article type data for outline prototypes
export const ARTICLE_TYPES = [
  {
    id: 'biography',
    name: 'Biography',
    outline: [
      { 
        id: 'lead', 
        title: 'Lead paragraph', 
        guidance: '[Full Name] (born [date]) is a [nationality] [profession] known for [major achievements].'
      },
      { 
        id: 'early-life', 
        title: 'Early life', 
        guidance: '[Name] was born in [location] on [date]. [Early background and education]...'
      },
      { 
        id: 'career', 
        title: 'Career', 
        guidance: '[Name] began their career in [year/field]. [Major roles and achievements]...'
      },
      { 
        id: 'recognition', 
        title: 'Recognition', 
        guidance: '[Name] has received [awards/honors] for [achievements]...'
      }
    ],
    tips: [
      'Use neutral tone and cite independent secondary sources.',
      'Avoid lists of trivial details; emphasize verifiable milestones.'
    ],
    policyUrl: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(people)'
  },
  {
    id: 'organization',
    name: 'Organization',
    outline: [
      { 
        id: 'overview', 
        title: 'Overview', 
        guidance: '[Organization Name] is a [type] based in [location] that [primary purpose/activity].'
      },
      { 
        id: 'history', 
        title: 'History', 
        guidance: '[Organization] was founded in [year] by [founders]. [Key milestones]...'
      },
      { 
        id: 'operations', 
        title: 'Operations', 
        guidance: '[Organization] provides [products/services]. [Key programs or activities]...'
      },
      { 
        id: 'impact', 
        title: 'Impact and reception', 
        guidance: '[Organization] has been recognized for [achievements]. [Coverage and criticism]...'
      }
    ],
    tips: [
      'Cite at least two independent, reputable sources discussing the organization.',
      'Avoid promotional language and sourced claims directly from company materials only.'
    ],
    policyUrl: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)'
  },
  {
    id: 'event',
    name: 'Event',
    outline: [
      { 
        id: 'overview', 
        title: 'Overview', 
        guidance: 'The [Event Name] took place on [date] in [location]. [Key participants and purpose]...'
      },
      { 
        id: 'background', 
        title: 'Background', 
        guidance: 'The event was organized in response to [context]. [Leading circumstances]...'
      },
      { 
        id: 'details', 
        title: 'Event details', 
        guidance: 'On [date], [what happened]. [Key moments in chronological order]...'
      },
      { 
        id: 'aftermath', 
        title: 'Aftermath', 
        guidance: 'Following the event, [immediate outcomes]. [Long-term significance]...'
      }
    ],
    tips: [
      'Prioritize coverage from established publications or academic sources.',
      'Clarify disputed information with attribution to sources.'
    ],
    policyUrl: 'https://en.wikipedia.org/wiki/Wikipedia:Notability_(events)'
  }
];
