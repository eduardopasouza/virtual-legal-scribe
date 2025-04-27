export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          agent: string
          case_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          result: string | null
          status: string | null
        }
        Insert: {
          action: string
          agent: string
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          result?: string | null
          status?: string | null
        }
        Update: {
          action?: string
          agent?: string
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          result?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          case_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          priority: string
          resolved_at: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          case_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title: string
          type: string
        }
        Update: {
          case_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          area_direito: string | null
          client: string
          court: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          main_agent: string | null
          number: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          area_direito?: string | null
          client: string
          court?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          main_agent?: string | null
          number?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          area_direito?: string | null
          client?: string
          court?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          main_agent?: string | null
          number?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          country_id: number | null
          id: number
          name: string
        }
        Insert: {
          country_id?: number | null
          id?: never
          name: string
        }
        Update: {
          country_id?: number | null
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      deadlines: {
        Row: {
          case_id: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          status: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          status?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      document_content: {
        Row: {
          content: string | null
          document_id: string | null
          extracted_at: string | null
          id: string
          metadata: Json | null
          pages: number | null
        }
        Insert: {
          content?: string | null
          document_id?: string | null
          extracted_at?: string | null
          id?: string
          metadata?: Json | null
          pages?: number | null
        }
        Update: {
          content?: string | null
          document_id?: string | null
          extracted_at?: string | null
          id?: string
          metadata?: Json | null
          pages?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_content_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string | null
          content_size: number | null
          created_by: string | null
          document_type: string | null
          file_path: string | null
          has_extracted_text: boolean | null
          id: string
          name: string
          processed_status: string | null
          size: number
          type: string
          uploaded_at: string | null
        }
        Insert: {
          case_id?: string | null
          content_size?: number | null
          created_by?: string | null
          document_type?: string | null
          file_path?: string | null
          has_extracted_text?: boolean | null
          id?: string
          name: string
          processed_status?: string | null
          size: number
          type: string
          uploaded_at?: string | null
        }
        Update: {
          case_id?: string | null
          content_size?: number | null
          created_by?: string | null
          document_type?: string | null
          file_path?: string | null
          has_extracted_text?: boolean | null
          id?: string
          name?: string
          processed_status?: string | null
          size?: number
          type?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          end_time: string
          id: string
          related_case: string | null
          start_time: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          end_time: string
          id?: string
          related_case?: string | null
          start_time: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          end_time?: string
          id?: string
          related_case?: string | null
          start_time?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_related_case_fkey"
            columns: ["related_case"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_stages: {
        Row: {
          case_id: string
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          id: string
          stage_name: string
          stage_number: number
          started_at: string | null
          status: string
        }
        Insert: {
          case_id: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          stage_name: string
          stage_number: number
          started_at?: string | null
          status?: string
        }
        Update: {
          case_id?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          stage_name?: string
          stage_number?: number
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
