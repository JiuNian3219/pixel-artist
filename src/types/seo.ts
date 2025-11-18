export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  robots?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export type PageKey = "/" | "/creator" | "/404";