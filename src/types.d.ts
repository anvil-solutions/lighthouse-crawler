interface BasicPageData {
  links: string[];
  title: string;
}

interface PageData extends BasicPageData {
  location: string;
  path: string;
}

