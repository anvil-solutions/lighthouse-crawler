export interface LighthouseResult {
  file: string;
  scores: Record<string, number | null>;
}

export interface BasicPageData {
  links: string[];
  title: string | null;
}

export interface PageData extends BasicPageData {
  location: string;
  path: string;
  result?: LighthouseResult | null;
}
