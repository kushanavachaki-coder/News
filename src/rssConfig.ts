export interface RSSFeedSource {
  id: string;
  url: string;
  category: string;
  publisher: string;
}

export const RSS_SOURCES: RSSFeedSource[] = [
  {
    id: "the-hindu-national",
    url: "https://www.thehindu.com/news/national/feeder/default.rss",
    category: "India",
    publisher: "The Hindu"
  },
  {
    id: "bbc-world",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "World",
    publisher: "BBC News"
  },
  {
    id: "bbc-business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    category: "Business",
    publisher: "BBC News"
  },
  {
    id: "bbc-tech",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    category: "Technology",
    publisher: "BBC News"
  },
  {
    id: "techcrunch-ai",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "AI",
    publisher: "TechCrunch"
  },
  {
    id: "sciencedaily-biotech",
    url: "https://www.sciencedaily.com/rss/matter_energy/biotechnology.xml",
    category: "Biotechnology",
    publisher: "ScienceDaily"
  },
  {
    id: "space-com",
    url: "https://www.space.com/feeds/all",
    category: "Space",
    publisher: "Space.com"
  },
  {
    id: "sciencedaily-space",
    url: "https://www.sciencedaily.com/rss/space_time/space_astronomy.xml",
    category: "Space",
    publisher: "ScienceDaily"
  },
  {
    id: "bbc-environment",
    url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    category: "Environment",
    publisher: "BBC News"
  },
  {
    id: "grist-environment",
    url: "https://grist.org/feed/",
    category: "Environment",
    publisher: "Grist"
  },
  {
    id: "espn-sports",
    url: "https://www.espn.com/espn/rss/news",
    category: "Sports",
    publisher: "ESPN"
  },
  {
    id: "bbc-entertainment",
    url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    category: "Entertainment",
    publisher: "BBC News"
  },
  {
    id: "ign-gaming",
    url: "https://feeds.feedburner.com/ign/news",
    category: "Gaming",
    publisher: "IGN"
  }
];
