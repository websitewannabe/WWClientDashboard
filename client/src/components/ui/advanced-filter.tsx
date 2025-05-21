import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Filter, X, Check, Search } from 'lucide-react';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface FilterCondition {
  field: string;
  operator: string;
  value: string | number | Date | null;
}

export interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  operators?: string[];
  options?: { value: string; label: string }[];
}

interface AdvancedFilterProps {
  filterOptions: FilterOption[];
  onFilterChange: (filters: FilterCondition[]) => void;
  placeholder?: string;
  className?: string;
}

// Default operators for each type
const defaultOperators = {
  text: ['contains', 'equals', 'starts with', 'ends with'],
  number: ['equals', 'greater than', 'less than', 'between'],
  date: ['equals', 'before', 'after', 'between'],
  select: ['equals', 'not equals']
};

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filterOptions,
  onFilterChange,
  placeholder = 'Filter...',
  className
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [currentOperator, setCurrentOperator] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<string | number | Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addFilter = () => {
    if (currentField && currentOperator && currentValue) {
      const newFilter = {
        field: currentField,
        operator: currentOperator,
        value: currentValue
      };
      const updatedFilters = [...filters, newFilter];
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
      resetCurrentFilter();
    }
  };

  const removeFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetCurrentFilter = () => {
    setCurrentField(null);
    setCurrentOperator(null);
    setCurrentValue(null);
  };

  const resetAllFilters = () => {
    setFilters([]);
    onFilterChange([]);
    resetCurrentFilter();
  };

  const getFilterOption = (id: string) => {
    return filterOptions.find(option => option.id === id);
  };

  const getOperators = (field: string | null) => {
    if (!field) return [];
    const option = getFilterOption(field);
    if (!option) return [];
    
    return option.operators || defaultOperators[option.type] || [];
  };

  const renderValueInput = () => {
    if (!currentField) return null;

    const option = getFilterOption(currentField);
    if (!option) return null;

    switch (option.type) {
      case 'text':
        return (
          <Input
            placeholder="Value"
            value={currentValue as string || ''}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="Value"
            value={currentValue as number || ''}
            onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
          />
        );

      case 'date':
        return (
          <DatePicker
            selected={currentValue as Date || null}
            onSelect={(date) => setCurrentValue(date)}
            placeholderText="Select date"
          />
        );

      case 'select':
        return (
          <Select
            value={currentValue as string || ''}
            onValueChange={(value) => setCurrentValue(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              {option.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  const getFieldLabel = (fieldId: string) => {
    const option = getFilterOption(fieldId);
    return option ? option.label : fieldId;
  };

  const getValueLabel = (field: string, value: string | number | Date | null) => {
    if (value === null) return '';
    
    const option = getFilterOption(field);
    if (!option) return String(value);
    
    if (option.type === 'select') {
      const selectOption = option.options?.find(opt => opt.value === value);
      return selectOption ? selectOption.label : String(value);
    }
    
    if (option.type === 'date' && value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    return String(value);
  };

  return (
    <div className={className}>
      <div className="flex items-center relative w-full">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={placeholder} 
            className="pl-9 pr-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-2.5 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-2" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[380px] p-0" align="end">
            <div className="p-4 border-b">
              <h3 className="font-medium text-sm">Advanced Filter</h3>
              {filters.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {filters.map((filter, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <span>
                        {getFieldLabel(filter.field)} {filter.operator} {getValueLabel(filter.field, filter.value)}
                      </span>
                      <button
                        className="ml-1 h-3 w-3 rounded-full"
                        onClick={() => removeFilter(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-b">
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="field">Field</Label>
                  <Select
                    value={currentField || ''}
                    onValueChange={(value) => {
                      setCurrentField(value);
                      setCurrentOperator(null);
                      setCurrentValue(null);
                    }}
                  >
                    <SelectTrigger id="field">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {currentField && (
                  <div>
                    <Label htmlFor="operator">Operator</Label>
                    <Select
                      value={currentOperator || ''}
                      onValueChange={setCurrentOperator}
                    >
                      <SelectTrigger id="operator">
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperators(currentField).map((operator) => (
                          <SelectItem key={operator} value={operator}>
                            {operator}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {currentField && currentOperator && (
                  <div>
                    <Label htmlFor="value">Value</Label>
                    {renderValueInput()}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCurrentFilter}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={addFilter}
                  disabled={!currentField || !currentOperator || currentValue === null || currentValue === ''}
                >
                  Add Filter
                </Button>
              </div>
            </div>
            
            <div className="p-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={resetAllFilters}>
                Clear All
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                <Check className="h-4 w-4 mr-1" />
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default AdvancedFilter;