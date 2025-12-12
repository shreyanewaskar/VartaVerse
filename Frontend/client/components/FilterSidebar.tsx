import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterCategory {
  title: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  filters: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (category: string, optionId: string, checked: boolean) => void;
  onClearAll?: () => void;
}

export default function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: FilterSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(filters.map((f) => f.title))
  );

  const toggleCategory = (title: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-gradient-to-b from-media-pearl-aqua to-media-frozen-water rounded-2xl p-6 h-fit sticky top-20 space-y-4">
      <h3 className="text-lg font-bold text-media-dark-raspberry mb-4">
        Filters
      </h3>

      <div className="space-y-3">
        {filters.map((category) => (
          <div key={category.title} className="border-b border-media-pearl-aqua/30 pb-4">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.title)}
              className="w-full flex items-center justify-between py-2 text-media-dark-raspberry font-semibold hover:text-media-berry-crush smooth-all"
            >
              {category.title}
              <ChevronDown
                className={cn(
                  "w-4 h-4 smooth-all",
                  expandedCategories.has(category.title) ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Category Options */}
            {expandedCategories.has(category.title) && (
              <div className="space-y-2 mt-3 pl-2 animate-slide-up">
                {category.options.map((option) => {
                  const isChecked =
                    selectedFilters[category.title]?.includes(option.id) || false;
                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          onFilterChange(
                            category.title,
                            option.id,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 rounded accent-media-berry-crush cursor-pointer"
                      />
                      <span className="text-sm text-media-dark-raspberry group-hover:text-media-berry-crush smooth-all">
                        {option.label}
                      </span>
                      {isChecked && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-media-berry-crush glow-accent" />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Clear Filters Button */}
      <button 
        onClick={onClearAll}
        className="w-full mt-4 px-4 py-2 rounded-lg border-2 border-media-berry-crush text-media-berry-crush font-semibold hover:bg-media-berry-crush/10 smooth-all"
      >
        Clear All
      </button>
    </aside>
  );
}
