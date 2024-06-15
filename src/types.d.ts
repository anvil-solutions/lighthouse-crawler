interface LighthouseResult {
  file: string;
  scores: Record<string, number | null>;
}

interface BasicPageData {
  links: string[];
  title: string;
}

interface PageData extends BasicPageData {
  location: string;
  path: string;
}
