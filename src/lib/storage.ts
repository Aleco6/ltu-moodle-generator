import { setCookie, getCookie, deleteCookie } from './cookies';

interface TabData {
  count: number;
  labels: string[];
  contents: string[];
  title: string;
  accent: string;
}

const DEFAULT_TAB_DATA: TabData = {
  count: 1,
  labels: ["Tab 1"],
  contents: ["Replace this with your content for Tab 1."],
  title: "Tabs Generator",
  accent: "#2563eb"
};

export function getStoredTabData(): TabData {
  if (typeof window === 'undefined') return DEFAULT_TAB_DATA;
  
  try {
    // Get data from cookie
    const cookieData = getCookie('tabData');
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      return {
        count: Math.max(1, Math.min(8, parseInt(parsed.count, 10) || DEFAULT_TAB_DATA.count)),
        labels: Array.isArray(parsed.labels) ? parsed.labels : DEFAULT_TAB_DATA.labels,
        contents: Array.isArray(parsed.contents) ? parsed.contents : DEFAULT_TAB_DATA.contents,
        title: parsed.title || DEFAULT_TAB_DATA.title,
        accent: parsed.accent || DEFAULT_TAB_DATA.accent
      };
    }
  } catch (error) {
    console.error('Failed to retrieve tab data:', error);
  }

  return DEFAULT_TAB_DATA;
}

export function storeTabData(data: TabData): void {
  if (typeof window === 'undefined') return;

  try {
    // Store in cookie
    setCookie('tabData', JSON.stringify(data));
    
    // Debug log
    console.log('Stored tab data:', data);
    console.log('Current cookie:', document.cookie);
  } catch (error) {
    console.error('Failed to store tab data:', error);
  }
}

export function clearStoredTabData(): void {
  if (typeof window === 'undefined') return;
  deleteCookie('tabData');
}