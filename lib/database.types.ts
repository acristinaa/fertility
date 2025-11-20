export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'client' | 'coach' | 'doctor' | 'admin'
          timezone: string
          created_at: string
          email: string | null
          avatar_url: string | null
          bio: string | null
          specialization: string | null
          phone: string | null
          locale: string
          is_active: boolean
        }
        Insert: {
          id: string
          full_name?: string | null
          role: 'client' | 'coach' | 'doctor' | 'admin'
          timezone?: string
          created_at?: string
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          specialization?: string | null
          phone?: string | null
          locale?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'client' | 'coach' | 'doctor' | 'admin'
          timezone?: string
          created_at?: string
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          specialization?: string | null
          phone?: string | null
          locale?: string
          is_active?: boolean
        }
      }
      programs: {
        Row: {
          id: number
          client_id: string
          provider_id: string
          provider_type: 'coach' | 'doctor'
          title: string
          description: string | null
          status: 'active' | 'completed' | 'paused' | 'canceled'
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: never
          client_id: string
          provider_id: string
          provider_type: 'coach' | 'doctor'
          title: string
          description?: string | null
          status?: 'active' | 'completed' | 'paused' | 'canceled'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: never
          client_id?: string
          provider_id?: string
          provider_type?: 'coach' | 'doctor'
          title?: string
          description?: string | null
          status?: 'active' | 'completed' | 'paused' | 'canceled'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: number
          client_id: string
          provider_id: string
          provider_type: 'coach' | 'doctor'
          scheduled_at: string
          duration_minutes: number
          status: 'scheduled' | 'completed' | 'canceled'
          created_at: string
          program_id: number | null
          session_type: string
          mode: string
          price_cents: number | null
          currency: string
          canceled_reason: string | null
          client_rating: number | null
          client_feedback: string | null
        }
        Insert: {
          id?: never
          client_id: string
          provider_id: string
          provider_type: 'coach' | 'doctor'
          scheduled_at: string
          duration_minutes?: number
          status: 'scheduled' | 'completed' | 'canceled'
          created_at?: string
          program_id?: number | null
          session_type?: string
          mode?: string
          price_cents?: number | null
          currency?: string
          canceled_reason?: string | null
          client_rating?: number | null
          client_feedback?: string | null
        }
        Update: {
          id?: never
          client_id?: string
          provider_id?: string
          provider_type?: 'coach' | 'doctor'
          scheduled_at?: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'canceled'
          created_at?: string
          program_id?: number | null
          session_type?: string
          mode?: string
          price_cents?: number | null
          currency?: string
          canceled_reason?: string | null
          client_rating?: number | null
          client_feedback?: string | null
        }
      }
      goals: {
        Row: {
          id: number
          client_id: string
          program_id: number | null
          title: string
          description: string | null
          status: 'active' | 'achieved' | 'dropped'
          target_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          client_id: string
          program_id?: number | null
          title: string
          description?: string | null
          status?: 'active' | 'achieved' | 'dropped'
          target_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          client_id?: string
          program_id?: number | null
          title?: string
          description?: string | null
          status?: 'active' | 'achieved' | 'dropped'
          target_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      action_items: {
        Row: {
          id: number
          client_id: string
          session_id: number | null
          goal_id: number | null
          created_by: string
          title: string
          description: string | null
          due_date: string | null
          status: 'open' | 'in_progress' | 'done' | 'canceled'
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: never
          client_id: string
          session_id?: number | null
          goal_id?: number | null
          created_by: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: 'open' | 'in_progress' | 'done' | 'canceled'
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: never
          client_id?: string
          session_id?: number | null
          goal_id?: number | null
          created_by?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: 'open' | 'in_progress' | 'done' | 'canceled'
          created_at?: string
          completed_at?: string | null
        }
      }
      session_notes: {
        Row: {
          id: number
          session_id: number
          client_id: string
          author_id: string
          note_text: string
          created_at: string
          visibility: 'private' | 'client_visible'
          note_type: 'general' | 'summary' | 'homework' | 'medical'
        }
        Insert: {
          id?: never
          session_id: number
          client_id: string
          author_id: string
          note_text: string
          created_at?: string
          visibility?: 'private' | 'client_visible'
          note_type?: 'general' | 'summary' | 'homework' | 'medical'
        }
        Update: {
          id?: never
          session_id?: number
          client_id?: string
          author_id?: string
          note_text?: string
          created_at?: string
          visibility?: 'private' | 'client_visible'
          note_type?: 'general' | 'summary' | 'homework' | 'medical'
        }
      }
      client_coach_links: {
        Row: {
          id: number
          client_id: string
          coach_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: never
          client_id: string
          coach_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: never
          client_id?: string
          coach_id?: string
          status?: string
          created_at?: string
        }
      }
      client_doctor_links: {
        Row: {
          id: number
          client_id: string
          doctor_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: never
          client_id: string
          doctor_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: never
          client_id?: string
          doctor_id?: string
          status?: string
          created_at?: string
        }
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
  }
}
