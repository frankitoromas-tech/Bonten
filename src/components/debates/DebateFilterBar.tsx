'use client';
import React from 'react';
import { DEBATE_TAGS } from '@/data/debates';
import { motion } from 'framer-motion';

interface DebateFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export default function DebateFilterBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagSelect,
}: DebateFilterBarProps) {
  return (
    <div className="search-filter-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Buscar debate..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar debates"
        />
      </div>

      <div className="tags-filter">
        {DEBATE_TAGS.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
