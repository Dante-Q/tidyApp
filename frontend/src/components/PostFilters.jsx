import { useState } from "react";
import { MultiSelect, TextInput } from "@mantine/core";
import BEACH_TAGS from "../config/beachTags.js";
import "./PostFilters.css";

/**
 * Reusable filter component for posts
 * Provides tag filtering and text search functionality
 */
export default function PostFilters({ onFilterChange }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleTagChange = (tags) => {
    setSelectedTags(tags);
    onFilterChange({ tags, searchText });
  };

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    onFilterChange({ tags: selectedTags, searchText: text });
  };

  const handleClear = () => {
    setSelectedTags([]);
    setSearchText("");
    onFilterChange({ tags: [], searchText: "" });
  };

  const hasActiveFilters = selectedTags.length > 0 || searchText.length > 0;

  return (
    <div className="post-filters">
      <div className="filters-row">
        {/* Search Input */}
        <TextInput
          placeholder="Search posts by title or content..."
          value={searchText}
          onChange={handleSearchChange}
          classNames={{
            root: "filter-search-root",
            input: "filter-search-input",
          }}
        />

        {/* Beach Tags Filter */}
        <MultiSelect
          placeholder="Filter by tags"
          data={BEACH_TAGS.map((tag) => ({
            value: tag.slug,
            label: `${tag.icon} ${tag.name}`,
          }))}
          value={selectedTags}
          onChange={handleTagChange}
          searchable
          clearable
          comboboxProps={{
            position: "bottom",
            middlewares: { flip: false, shift: false },
          }}
          withinPortal={false}
          classNames={{
            root: "filter-tags-root",
            input: "filter-tags-input",
            pill: "filter-tags-pill",
            dropdown: "filter-tags-dropdown",
            option: "filter-tags-option",
          }}
        />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button onClick={handleClear} className="btn-clear-filters">
            ✖ Clear
          </button>
        )}
      </div>
    </div>
  );
}
