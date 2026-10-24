/**
 * DYNAMIC CATEGORY CATALOG PAGE (`/category/:slug`)
 * Phase 2 Locked File — Renders category header, sub-class FilterSidebar (Price,
 * Quality Grade / Rug Size, Design Style, Room), search bar, sort selector, and
 * responsive ProductCard grid.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Home,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Category, Product } from '../../types/database.types';
import {
  applyCatalogFilters,
  CatalogFilterState,
  extractFilterOptions,
  fetchProductsByCategory,
} from '../../services/catalogService';
import { FilterSidebar } from '../../components/catalog/FilterSidebar';
import { ProductCard } from '../../components/catalog/ProductCard';
import { triggerGlobalInquiryModal } from '../../utils/pricingEngine';

export const CategoryPage: React.FC = () => {
  const { slug = 'wallpaper' } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const filterOptions = useMemo(
    () =>
      extractFilterOptions(
        rawProducts,
        category?.pricing_mode || 'CUSTOM_SQFT'
      ),
    [rawProducts, category?.pricing_mode]
  );

  const [filters, setFilters] = useState<CatalogFilterState>({
    searchQuery: '',
    maxPrice: 25000,
    selectedQualityTiers: [],
    selectedDesignStyles: [],
    selectedRoomTypes: [],
    selectedRugSizes: [],
    sortBy: 'featured',
  });

  useEffect(() => {
    setIsLoading(true);
    void fetchProductsByCategory(slug).then(({ category: cat, products }) => {
      setCategory(cat);
      setRawProducts(products);
      const opts = extractFilterOptions(
        products,
        cat?.pricing_mode || 'CUSTOM_SQFT'
      );
      setFilters({
        searchQuery: '',
        maxPrice: opts.maxPriceBoundary,
        selectedQualityTiers: [],
        selectedDesignStyles: [],
        selectedRoomTypes: [],
        selectedRugSizes: [],
        sortBy: 'featured',
      });
      setIsLoading(false);
    });
  }, [slug]);

  const filteredProducts = useMemo(
    () =>
      applyCatalogFilters(
        rawProducts,
        filters,
        category?.pricing_mode || 'CUSTOM_SQFT'
      ),
    [rawProducts, filters, category?.pricing_mode]
  );

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      maxPrice: filterOptions.maxPriceBoundary,
      selectedQualityTiers: [],
      selectedDesignStyles: [],
      selectedRoomTypes: [],
      selectedRugSizes: [],
      sortBy: 'featured',
    });
  };

  if (!isLoading && !category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#1E1E1C]">Category Not Found</h1>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  const isFixedRug = category?.pricing_mode === 'FIXED_RUG';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Banner */}
      <div className="bg-[#F0ECE1] rounded-3xl p-6 sm:p-8 border border-[#E5DFD3] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="text-xs text-[#6E6A63] hover:underline">
              Home
            </Link>
            <span className="text-xs text-[#6E6A63]">/</span>
            <span className="text-xs font-bold text-[#9C5A3C]">
              {category?.name}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isFixedRug
                  ? 'bg-[#1E1E1C] text-white'
                  : 'bg-white text-[#1E1E1C] border border-[#E5DFD3]'
              }`}
            >
              {isFixedRug
                ? 'Machine-Made • Predefined Sizes Only'
                : 'Custom Dimensions & Material Quality Tiers'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#1E1E1C]">
            {category?.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            {category?.short_description}
          </p>
        </div>

        {!isFixedRug && (
          <button
            type="button"
            onClick={() =>
              triggerGlobalInquiryModal({
                queryType: 'HOME_MEASUREMENT',
                productTitle: `${category?.name} Home Measurement`,
              })
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold shrink-0 transition"
          >
            <Home className="w-4 h-4" />
            <span>Book Home Measurement Visit 🏡</span>
          </button>
        )}
      </div>

      {/* Search, Sort & Mobile Filter Trigger Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E5DFD3]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#6E6A63] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
            placeholder={`Search inside ${category?.name || 'category'}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs font-bold text-[#1E1E1C]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9C5A3C]" />
            <span>Filters</span>
          </button>

          <select
            aria-label="Sort products"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortBy: e.target.value as CatalogFilterState['sortBy'],
              })
            }
            className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs font-semibold text-[#1E1E1C] focus:outline-none"
          >
            <option value="featured">Sort: Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Filter Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          pricingMode={category?.pricing_mode || 'CUSTOM_SQFT'}
          materialFilterLabel={
            category?.material_filter_label || 'Material Quality'
          }
          options={filterOptions}
          filters={filters}
          onChangeFilters={setFilters}
          onResetFilters={handleResetFilters}
          mobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5DFD3] p-12 text-center space-y-3">
              <p className="text-base font-bold text-[#1E1E1C]">
                No products match your selected filters.
              </p>
              <p className="text-xs text-[#6E6A63]">
                Try increasing the price slider or clearing a design filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#1E1E1C] text-white text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
