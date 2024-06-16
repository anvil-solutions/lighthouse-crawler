interface LighthouseResult {
  file: string;
  scores: Record<string, number | null>;
}

interface BasicPageData {
  links: string[];
  title: string | null;
}

interface PageData extends BasicPageData {
  location: string;
  path: string;
  result?: LighthouseResult | null;
}
