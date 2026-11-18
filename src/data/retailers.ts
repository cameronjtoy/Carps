import type { Retailer, SectionId } from '../types';

export interface RetailerSeed extends Retailer {
  /** Which sections this store stocks (drives mock price generation) */
  carries: SectionId[];
  search: (q: string) => string;
}

const q = encodeURIComponent;
// Stores without a stable search URL fall back to a site-restricted web search.
const siteSearch = (domain: string) => (s: string) => `https://duckduckgo.com/?q=${q(`site:${domain} ${s}`)}`;

export const retailerSeeds: RetailerSeed[] = [
  { id: 'r-autozone', name: 'AutoZone', url: 'https://www.autozone.com', shippingNote: 'Free in-store pickup', carries: ['maintenance'], search: (s) => `https://www.autozone.com/searchresult?searchText=${q(s)}` },
  { id: 'r-oreilly', name: "O'Reilly Auto Parts", url: 'https://www.oreillyauto.com', shippingNote: 'Free in-store pickup', carries: ['maintenance'], search: (s) => `https://www.oreillyauto.com/search?q=${q(s)}` },
  { id: 'r-advance', name: 'Advance Auto Parts', url: 'https://shop.advanceautoparts.com', shippingNote: 'Free shipping $35+', carries: ['maintenance'], search: (s) => `https://shop.advanceautoparts.com/web/SearchResults?searchTerm=${q(s)}` },
  { id: 'r-rockauto', name: 'RockAuto', url: 'https://www.rockauto.com', shippingNote: 'Ships from multiple warehouses', carries: ['maintenance', 'chassis'], search: (s) => `https://www.rockauto.com/en/partsearch/?partnum=${q(s)}` },
  { id: 'r-walmart', name: 'Walmart', url: 'https://www.walmart.com', shippingNote: 'Free shipping $35+', carries: ['maintenance'], search: (s) => `https://www.walmart.com/search?q=${q(s)}` },
  { id: 'r-amazon', name: 'Amazon', url: 'https://www.amazon.com', shippingNote: 'Free shipping w/ Prime', carries: ['maintenance', 'power', 'chassis', 'style'], search: (s) => `https://www.amazon.com/s?k=${q(s)}` },
  { id: 'r-summit', name: 'Summit Racing', url: 'https://www.summitracing.com', shippingNote: 'Free shipping $109+', carries: ['power', 'chassis', 'wheels-tires', 'style', 'maintenance'], search: (s) => `https://www.summitracing.com/search?keyword=${q(s)}` },
  { id: 'r-tirerack', name: 'Tire Rack', url: 'https://www.tirerack.com', shippingNote: 'Ships to installer network', carries: ['wheels-tires', 'chassis'], search: siteSearch('tirerack.com') },
  { id: 'r-vivid', name: 'Vivid Racing', url: 'https://www.vividracing.com', shippingNote: 'Free shipping $199+', carries: ['power', 'chassis', 'wheels-tires', 'style'], search: siteSearch('vividracing.com') },
  { id: 'r-ecs', name: 'ECS Tuning', url: 'https://www.ecstuning.com', shippingNote: 'Free shipping $49+', carries: ['power', 'chassis', 'maintenance'], search: siteSearch('ecstuning.com') },
  { id: 'r-ebay', name: 'eBay Motors', url: 'https://www.ebay.com/motors', shippingNote: 'Varies by seller', carries: ['power', 'chassis', 'wheels-tires', 'style', 'maintenance'], search: (s) => `https://www.ebay.com/sch/i.html?_nkw=${q(s)}` },
];

export const retailers: Retailer[] = retailerSeeds.map(({ carries: _c, search: _s, ...r }) => r);
