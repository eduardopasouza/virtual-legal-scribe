
import React from 'react';
import { DocumentMetadata } from '@/hooks/useDocuments';
import { DocumentFilters } from './DocumentFilters';

interface DocumentFilterSectionProps {
  documents: DocumentMetadata[];
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFilteredDocumentsChange: (docs: DocumentMetadata[]) => void;
  categories: Array<{ value: string; label: string }>;
}

export function DocumentFilterSection({
  documents,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onFilteredDocumentsChange,
  categories
}: DocumentFilterSectionProps) {
  React.useEffect(() => {
    let results = documents;
    
    if (searchTerm) {
      results = results.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'petition') {
        results = results.filter(doc => doc.document_type === 'petition');
      } else if (selectedCategory === 'contract') {
        results = results.filter(doc => doc.document_type === 'contract');
      } else if (selectedCategory === 'evidence') {
        results = results.filter(doc => doc.document_type === 'evidence');
      } else if (selectedCategory === 'proceeding') {
        results = results.filter(doc => doc.document_type === 'proceeding');
      } else if (selectedCategory === 'legal-research') {
        results = results.filter(doc => doc.document_type === 'legal-research');
      } else if (selectedCategory === 'court-decision') {
        const courtExtensions = ['.pdf'];
        results = results.filter(doc => 
          doc.document_type === 'court-decision' || 
          courtExtensions.some(ext => doc.name.toLowerCase().endsWith(ext))
        );
      } else {
        const extensionMapping: {[key: string]: string[]} = {
          'petition': ['.pdf', '.docx'],
          'contract': ['.pdf', '.docx'],
          'evidence': ['.jpg', '.png', '.pdf', '.mp4'],
          'proceeding': ['.pdf'],
          'legal-research': ['.pdf', '.docx', '.txt'],
          'court-decision': ['.pdf'],
          'other': ['.xlsx', '.pptx', '.zip']
        };
        
        const extensions = extensionMapping[selectedCategory] || [];
        results = results.filter(doc => 
          extensions.some(ext => doc.name.toLowerCase().endsWith(ext))
        );
      }
    }
    
    onFilteredDocumentsChange(results);
  }, [searchTerm, selectedCategory, documents]);

  return (
    <DocumentFilters
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      onSearchChange={onSearchChange}
      onCategoryChange={onCategoryChange}
      categories={categories}
    />
  );
}
