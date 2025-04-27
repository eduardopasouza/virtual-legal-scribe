
export interface DocumentMetadata {
  id?: string;
  name: string;
  size: number;
  type: string;
  case_id?: string | null;
  uploaded_at?: string;
  file_path?: string;
  created_by?: string;
  document_type?: string;
  has_extracted_text?: boolean;
  processed_status?: 'pending' | 'processed' | 'failed';
  content_size?: number;
}

export interface DocumentContent {
  text: string;
  pages?: number;
  metadata?: Record<string, any>;
  error?: string;
}
