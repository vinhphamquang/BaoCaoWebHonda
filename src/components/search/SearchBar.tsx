'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserActivity } from '@/hooks/useUserActivity';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    className?: string;
    showSuggestions?: boolean;
    autoFocus?: boolean;
}

interface SearchSuggestion {
    id: string;
    text: string;
    type: 'recent' | 'popular' | 'model';
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Tìm kiếm xe Honda...",
    onSearch,
    className = "",
    showSuggestions = true,
    autoFocus = false
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { lastSearches, addSearchTerm } = useUserActivity();

    // Popular search terms
    const popularSearches = [
        'Honda Civic',
        'Honda CR-V',
        'Honda Accord',
        'Honda City',
        'SUV',
        'Sedan',
        'Xe 7 chỗ',
        'Xe tiết kiệm nhiên liệu'
    ];

    // Honda models
    const hondaModels = [
        'Civic', 'CR-V', 'Accord', 'City', 'HR-V', 'Pilot',
        'Brio', 'Jazz', 'Insight', 'BR-V', 'Ridgeline'
    ];

    // Generate suggestions based on query
    const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
        if (!searchQuery.trim()) {
            // Show recent searches and popular searches when no query
            const recentSuggestions: SearchSuggestion[] = lastSearches.map((search, index) => ({
                id: `recent-${index}`,
                text: search,
                type: 'recent'
            }));

            const popularSuggestions: SearchSuggestion[] = popularSearches
                .slice(0, 5)
                .map((search, index) => ({
                    id: `popular-${index}`,
                    text: search,
                    type: 'popular'
                }));

            return [...recentSuggestions.slice(0, 3), ...popularSuggestions];
        }

        const lowerQuery = searchQuery.toLowerCase();
        const suggestions: SearchSuggestion[] = [];

        // Model suggestions
        hondaModels
            .filter(model => model.toLowerCase().includes(lowerQuery))
            .forEach((model, index) => {
                suggestions.push({
                    id: `model-${index}`,
                    text: `Honda ${model}`,
                    type: 'model'
                });
            });

        // Popular search suggestions
        popularSearches
            .filter(search => search.toLowerCase().includes(lowerQuery))
            .forEach((search, index) => {
                if (!suggestions.some(s => s.text.toLowerCase() === search.toLowerCase())) {
                    suggestions.push({
                        id: `popular-match-${index}`,
                        text: search,
                        type: 'popular'
                    });
                }
            });

        return suggestions.slice(0, 8);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (showSuggestions) {
            const newSuggestions = generateSuggestions(value);
            setSuggestions(newSuggestions);
            setIsOpen(true);
        }
    };

    // Handle search submission
    const handleSearch = (searchQuery: string) => {
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) return;

        // Add to search history
        addSearchTerm(trimmedQuery);

        // Close suggestions
        setIsOpen(false);

        // Call onSearch callback if provided
        if (onSearch) {
            onSearch(trimmedQuery);
        } else {
            // Navigate to cars page with search query
            router.push(`/cars?search=${encodeURIComponent(trimmedQuery)}`);
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setQuery(suggestion.text);
        handleSearch(suggestion.text);
    };

    // Handle clear search
    const handleClear = () => {
        setQuery('');
        setIsOpen(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto focus
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // Generate suggestions when component mounts
    useEffect(() => {
        if (showSuggestions) {
            setSuggestions(generateSuggestions(''));
        }
    }, [lastSearches, showSuggestions]);

    const getSuggestionIcon = (type: SearchSuggestion['type']) => {
        switch (type) {
            case 'recent':
                return <Clock className="h-4 w-4 text-gray-400" />;
            case 'popular':
                return <TrendingUp className="h-4 w-4 text-gray-400" />;
            case 'model':
                return <Search className="h-4 w-4 text-gray-400" />;
            default:
                return <Search className="h-4 w-4 text-gray-400" />;
        }
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => showSuggestions && setIsOpen(true)}
                        placeholder={placeholder}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />

                    {/* Search Icon */}
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                    {/* Clear Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4 text-gray-400" />
                        </button>
                    )}

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                        </div>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {/* Recent Searches Header */}
                    {suggestions.some(s => s.type === 'recent') && (
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                            Tìm kiếm gần đây
                        </div>
                    )}

                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            {getSuggestionIcon(suggestion.type)}
                            <span className="text-gray-900">{suggestion.text}</span>
                            {suggestion.type === 'popular' && (
                                <span className="ml-auto text-xs text-gray-400">Phổ biến</span>
                            )}
                        </button>
                    ))}

                    {/* Search with current query */}
                    {query.trim() && (
                        <button
                            onClick={() => handleSearch(query)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-200 bg-gray-50"
                        >
                            <Search className="h-4 w-4 text-red-500" />
                            <span className="text-gray-900">
                                Tìm kiếm "<span className="font-medium">{query}</span>"
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;