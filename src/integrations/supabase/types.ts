export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      artist_master: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id?: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      biletinial_events: {
        Row: {
          artist: string[] | null
          canonical_venue_id: string | null
          created_at: string
          date: string
          description: string | null
          genre: string | null
          id: number
          last_seen: string
          name: string
          promoter: string | null
          provider: string
          venue: string
        }
        Insert: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at: string
          date: string
          description?: string | null
          genre?: string | null
          id?: number
          last_seen: string
          name: string
          promoter?: string | null
          provider: string
          venue: string
        }
        Update: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string
          name?: string
          promoter?: string | null
          provider?: string
          venue?: string
        }
        Relationships: []
      }
      biletinial_price_history: {
        Row: {
          category: string
          change_date: string
          change_type: string
          event_id: number
          id: number
          price: number | null
          sold_out: boolean
        }
        Insert: {
          category: string
          change_date: string
          change_type: string
          event_id: number
          id?: number
          price?: number | null
          sold_out: boolean
        }
        Update: {
          category?: string
          change_date?: string
          change_type?: string
          event_id?: number
          id?: number
          price?: number | null
          sold_out?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "biletinial_price_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "biletinial_events"
            referencedColumns: ["id"]
          },
        ]
      }
      biletinial_prices: {
        Row: {
          category: string
          created_at: string
          event_id: number
          id: number
          is_active: boolean
          last_seen: string
          price: number | null
          sold_out: boolean
        }
        Insert: {
          category: string
          created_at: string
          event_id: number
          id?: number
          is_active?: boolean
          last_seen: string
          price?: number | null
          sold_out: boolean
        }
        Update: {
          category?: string
          created_at?: string
          event_id?: number
          id?: number
          is_active?: boolean
          last_seen?: string
          price?: number | null
          sold_out?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "biletinial_prices_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "biletinial_events"
            referencedColumns: ["id"]
          },
        ]
      }
      biletix_events: {
        Row: {
          artist: string[] | null
          canonical_venue_id: string | null
          created_at: string
          date: string | null
          description: string | null
          genre: string | null
          id: number
          last_seen: string | null
          name: string | null
          promoter: string | null
          provider: string | null
          venue: string | null
        }
        Insert: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider?: string | null
          venue?: string | null
        }
        Update: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      biletix_price_history: {
        Row: {
          category: string | null
          change_date: string
          change_type: string | null
          event_id: number | null
          id: number
          price: number | null
          sold_out: boolean | null
        }
        Insert: {
          category?: string | null
          change_date?: string
          change_type?: string | null
          event_id?: number | null
          id?: number
          price?: number | null
          sold_out?: boolean | null
        }
        Update: {
          category?: string | null
          change_date?: string
          change_type?: string | null
          event_id?: number | null
          id?: number
          price?: number | null
          sold_out?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "biletix_price_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "biletix_events"
            referencedColumns: ["id"]
          },
        ]
      }
      biletix_prices: {
        Row: {
          category: string | null
          created_at: string
          event_id: number | null
          id: number
          is_active: boolean | null
          last_seen: string | null
          price: number | null
          sold_out: boolean | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          sold_out?: boolean | null
        }
        Update: {
          category?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          sold_out?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "biletix_prices_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "biletix_events"
            referencedColumns: ["id"]
          },
        ]
      }
      bubilet_events: {
        Row: {
          artist: string[] | null
          canonical_venue_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          genre: string | null
          id: number
          last_seen: string | null
          name: string | null
          promoter: string | null
          provider: string | null
          venue: string | null
        }
        Insert: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider?: string | null
          venue?: string | null
        }
        Update: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      bubilet_price_history: {
        Row: {
          category: string | null
          change_date: string | null
          change_type: string | null
          event_id: number
          id: number
          price: number | null
          remaining: number | null
          sold_out: boolean | null
        }
        Insert: {
          category?: string | null
          change_date?: string | null
          change_type?: string | null
          event_id: number
          id?: number
          price?: number | null
          remaining?: number | null
          sold_out?: boolean | null
        }
        Update: {
          category?: string | null
          change_date?: string | null
          change_type?: string | null
          event_id?: number
          id?: number
          price?: number | null
          remaining?: number | null
          sold_out?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bubilet_price_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bubilet_price_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["bubilet_event_id"]
          },
        ]
      }
      bubilet_prices: {
        Row: {
          category: string | null
          created_at: string | null
          event_id: number
          id: number
          is_active: boolean | null
          last_seen: string | null
          price: number | null
          remaining: number | null
          sold_out: boolean | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          event_id: number
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          remaining?: number | null
          sold_out?: boolean | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          event_id?: number
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          remaining?: number | null
          sold_out?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bubilet_prices_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bubilet_prices_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["bubilet_event_id"]
          },
        ]
      }
      bugece_events: {
        Row: {
          artist: string[] | null
          canonical_venue_id: string | null
          created_at: string
          date: string | null
          description: string | null
          genre: string | null
          id: number
          last_seen: string | null
          name: string | null
          promoter: string | null
          provider: string
          venue: string | null
        }
        Insert: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider: string
          venue?: string | null
        }
        Update: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider?: string
          venue?: string | null
        }
        Relationships: []
      }
      bugece_price_history: {
        Row: {
          category: string | null
          change_date: string
          change_type: string | null
          event_id: number
          id: number
          price: number | null
          sold_out: boolean | null
        }
        Insert: {
          category?: string | null
          change_date?: string
          change_type?: string | null
          event_id: number
          id?: number
          price?: number | null
          sold_out?: boolean | null
        }
        Update: {
          category?: string | null
          change_date?: string
          change_type?: string | null
          event_id?: number
          id?: number
          price?: number | null
          sold_out?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bugece_price_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bugece_events"
            referencedColumns: ["id"]
          },
        ]
      }
      bugece_prices: {
        Row: {
          category: string | null
          created_at: string
          event_id: number | null
          id: number
          is_active: boolean | null
          last_seen: string | null
          price: number | null
          sold_out: boolean
        }
        Insert: {
          category?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          sold_out: boolean
        }
        Update: {
          category?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          sold_out?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "bugece_prices_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bugece_events"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_artists: {
        Row: {
          artist_name_view: string
          created_at: string | null
          data_source: string | null
          id: string
          normalized_name: string
          spotify_link: string | null
          unified_profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          artist_name_view: string
          created_at?: string | null
          data_source?: string | null
          id?: string
          normalized_name: string
          spotify_link?: string | null
          unified_profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          artist_name_view?: string
          created_at?: string | null
          data_source?: string | null
          id?: string
          normalized_name?: string
          spotify_link?: string | null
          unified_profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      canonical_venues: {
        Row: {
          capacity: number | null
          city: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_memory_artists: {
        Row: {
          chat: string
          id: number
        }
        Insert: {
          chat: string
          id?: number
        }
        Update: {
          chat?: string
          id?: number
        }
        Relationships: []
      }
      debug_log: {
        Row: {
          id: string
          inserted_at: string | null
          message: string
          type: string
        }
        Insert: {
          id?: string
          inserted_at?: string | null
          message: string
          type: string
        }
        Update: {
          id?: string
          inserted_at?: string | null
          message?: string
          type?: string
        }
        Relationships: []
      }
      events_to_standardize: {
        Row: {
          created_at: string
          event_id: number
          id: number
          provider: string
          raw_venue: string
        }
        Insert: {
          created_at?: string
          event_id: number
          id?: number
          provider: string
          raw_venue: string
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: number
          provider?: string
          raw_venue?: string
        }
        Relationships: []
      }
      manual_venue_map: {
        Row: {
          canonical_id: string
          confidence_score: number | null
          created_at: string | null
          created_by: string | null
          notes: string | null
          raw_name: string
          updated_at: string | null
        }
        Insert: {
          canonical_id: string
          confidence_score?: number | null
          created_at?: string | null
          created_by?: string | null
          notes?: string | null
          raw_name: string
          updated_at?: string | null
        }
        Update: {
          canonical_id?: string
          confidence_score?: number | null
          created_at?: string | null
          created_by?: string | null
          notes?: string | null
          raw_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manuel_venue_map_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "canonical_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manuel_venue_map_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "manuel_venue_map_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "manuel_venue_map_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "venue_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manuel_venue_map_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "venue_list_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories_artist_name: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      passo_events: {
        Row: {
          artist: string[] | null
          canonical_venue_id: string | null
          created_at: string
          date: string | null
          description: string | null
          genre: string | null
          id: number
          last_seen: string | null
          name: string | null
          promoter: string | null
          provider: string
          venue: string | null
        }
        Insert: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider: string
          venue?: string | null
        }
        Update: {
          artist?: string[] | null
          canonical_venue_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: number
          last_seen?: string | null
          name?: string | null
          promoter?: string | null
          provider?: string
          venue?: string | null
        }
        Relationships: []
      }
      passo_price_history: {
        Row: {
          category: string | null
          change_date: string
          change_type: string | null
          event_id: number
          id: number
          price: number | null
          sold_out: boolean | null
        }
        Insert: {
          category?: string | null
          change_date: string
          change_type?: string | null
          event_id: number
          id?: number
          price?: number | null
          sold_out?: boolean | null
        }
        Update: {
          category?: string | null
          change_date?: string
          change_type?: string | null
          event_id?: number
          id?: number
          price?: number | null
          sold_out?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "passo_price_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "passo_events"
            referencedColumns: ["id"]
          },
        ]
      }
      passo_prices: {
        Row: {
          category: string | null
          created_at: string
          event_id: number | null
          id: number
          is_active: boolean | null
          last_seen: string | null
          price: number | null
          sold_out: boolean
        }
        Insert: {
          category?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          sold_out: boolean
        }
        Update: {
          category?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          last_seen?: string | null
          price?: number | null
          sold_out?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "passo_prices_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "passo_events"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_campaigns: {
        Row: {
          ad_archive_id: string | null
          ad_caption: string | null
          ad_duration_days: number | null
          ad_end_date: string | null
          ad_start_date: string | null
          ad_status: string
          created_at: string | null
          event_id: string | null
          id: string
          match_confidence: number | null
          page_name: string
          promoter_id: string
          updated_at: string | null
        }
        Insert: {
          ad_archive_id?: string | null
          ad_caption?: string | null
          ad_duration_days?: number | null
          ad_end_date?: string | null
          ad_start_date?: string | null
          ad_status: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          match_confidence?: number | null
          page_name: string
          promoter_id: string
          updated_at?: string | null
        }
        Update: {
          ad_archive_id?: string | null
          ad_caption?: string | null
          ad_duration_days?: number | null
          ad_end_date?: string | null
          ad_start_date?: string | null
          ad_status?: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          match_confidence?: number | null
          page_name?: string
          promoter_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_past_or_not"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_sale_status_view"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "unique_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_artists"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_artists_normalised"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_category_sellout_days"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vw_bubilet_remaining_long"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_analytics_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_campaigns_ingest: {
        Row: {
          ad_archive_id: string | null
          ad_caption: string | null
          ad_duration_days: number | null
          ad_end_date: string | null
          ad_start_date: string | null
          ad_status: string | null
          created_at: string
          event_id: string | null
          id: string
          match_confidence: number | null
          page_name: string | null
          SHOW: boolean | null
          updated_at: string
        }
        Insert: {
          ad_archive_id?: string | null
          ad_caption?: string | null
          ad_duration_days?: number | null
          ad_end_date?: string | null
          ad_start_date?: string | null
          ad_status?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          match_confidence?: number | null
          page_name?: string | null
          SHOW?: boolean | null
          updated_at?: string
        }
        Update: {
          ad_archive_id?: string | null
          ad_caption?: string | null
          ad_duration_days?: number | null
          ad_end_date?: string | null
          ad_start_date?: string | null
          ad_status?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          match_confidence?: number | null
          page_name?: string | null
          SHOW?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_past_or_not"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_sale_status_view"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "unique_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_artists"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_artists_normalised"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_category_sellout_days"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_ingest_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vw_bubilet_remaining_long"
            referencedColumns: ["unique_event_id"]
          },
        ]
      }
      promoters: {
        Row: {
          created_at: string | null
          id: string
          instagram_link: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          instagram_link?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          instagram_link?: string | null
          name?: string
        }
        Relationships: []
      }
      promoters_duplicate: {
        Row: {
          created_at: string | null
          id: string
          instagram_link: string | null
          meta_ads_query: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          instagram_link?: string | null
          meta_ads_query?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          instagram_link?: string | null
          meta_ads_query?: string | null
          name?: string
        }
        Relationships: []
      }
      saved_filter_views: {
        Row: {
          created_at: string
          filters: Json
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          filters: Json
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      spotify_calendar_mock: {
        Row: {
          artist_name: string
          concert_city: number | null
          concert_date_str: string | null
          concert_datetime: string | null
          concert_location_full: string
          concert_url: string | null
          concert_venue_brief: string | null
          concert_venue_detailed: string | null
          spotify_link: string | null
        }
        Insert: {
          artist_name: string
          concert_city?: number | null
          concert_date_str?: string | null
          concert_datetime?: string | null
          concert_location_full: string
          concert_url?: string | null
          concert_venue_brief?: string | null
          concert_venue_detailed?: string | null
          spotify_link?: string | null
        }
        Update: {
          artist_name?: string
          concert_city?: number | null
          concert_date_str?: string | null
          concert_datetime?: string | null
          concert_location_full?: string
          concert_url?: string | null
          concert_venue_brief?: string | null
          concert_venue_detailed?: string | null
          spotify_link?: string | null
        }
        Relationships: []
      }
      unified_artist_profile: {
        Row: {
          agency: string | null
          apple_music: string | null
          artist: string | null
          artist_link: string | null
          booking_emails: string | null
          city_1: string | null
          city_2: string | null
          city_3: string | null
          city_4: string | null
          city_5: string | null
          description: string | null
          facebook_link: string | null
          followers: number | null
          instagram_link: string | null
          listeners_1: number | null
          listeners_2: number | null
          listeners_3: number | null
          listeners_4: number | null
          listeners_5: number | null
          monthly_listeners: number | null
          soundcloud: string | null
          spotify_link: string | null
          territory: string | null
          twitter_link: string | null
          uuid: string
          wikipedia: string | null
          youtube_link: string | null
        }
        Insert: {
          agency?: string | null
          apple_music?: string | null
          artist?: string | null
          artist_link?: string | null
          booking_emails?: string | null
          city_1?: string | null
          city_2?: string | null
          city_3?: string | null
          city_4?: string | null
          city_5?: string | null
          description?: string | null
          facebook_link?: string | null
          followers?: number | null
          instagram_link?: string | null
          listeners_1?: number | null
          listeners_2?: number | null
          listeners_3?: number | null
          listeners_4?: number | null
          listeners_5?: number | null
          monthly_listeners?: number | null
          soundcloud?: string | null
          spotify_link?: string | null
          territory?: string | null
          twitter_link?: string | null
          uuid?: string
          wikipedia?: string | null
          youtube_link?: string | null
        }
        Update: {
          agency?: string | null
          apple_music?: string | null
          artist?: string | null
          artist_link?: string | null
          booking_emails?: string | null
          city_1?: string | null
          city_2?: string | null
          city_3?: string | null
          city_4?: string | null
          city_5?: string | null
          description?: string | null
          facebook_link?: string | null
          followers?: number | null
          instagram_link?: string | null
          listeners_1?: number | null
          listeners_2?: number | null
          listeners_3?: number | null
          listeners_4?: number | null
          listeners_5?: number | null
          monthly_listeners?: number | null
          soundcloud?: string | null
          spotify_link?: string | null
          territory?: string | null
          twitter_link?: string | null
          uuid?: string
          wikipedia?: string | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      unique_events: {
        Row: {
          artist: string[] | null
          artist_id: string[] | null
          artist_name_normalised: boolean | null
          biletinial_event_id: number | null
          biletix_event_id: number | null
          bubilet_event_id: number | null
          bugece_event_id: number | null
          canonical_venue_id: string
          created_at: string | null
          date: string
          description: string | null
          genre: string | null
          id: string
          name: string
          passo_event_id: number | null
          promoter: string[] | null
          promoter_id: string[] | null
          promoter_name_standardized: boolean | null
          providers: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          artist?: string[] | null
          artist_id?: string[] | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id: string
          created_at?: string | null
          date: string
          description?: string | null
          genre?: string | null
          id?: string
          name: string
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string[] | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          artist?: string[] | null
          artist_id?: string[] | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id?: string
          created_at?: string | null
          date?: string
          description?: string | null
          genre?: string | null
          id?: string
          name?: string
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string[] | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_unique_biletinial_v2"
            columns: ["biletinial_event_id"]
            isOneToOne: false
            referencedRelation: "biletinial_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_unique_biletix_v2"
            columns: ["biletix_event_id"]
            isOneToOne: false
            referencedRelation: "biletix_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_unique_bubilet"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_unique_bubilet"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["bubilet_event_id"]
          },
          {
            foreignKeyName: "fk_unique_bugece_v2"
            columns: ["bugece_event_id"]
            isOneToOne: false
            referencedRelation: "bugece_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_unique_passo_v2"
            columns: ["passo_event_id"]
            isOneToOne: false
            referencedRelation: "passo_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "canonical_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_list_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      unique_events_backup: {
        Row: {
          artist: string[] | null
          artist_id: string[] | null
          artist_name_normalised: boolean | null
          biletinial_event_id: number | null
          biletix_event_id: number | null
          bubilet_event_id: number | null
          bugece_event_id: number | null
          canonical_venue_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          genre: string | null
          id: string | null
          name: string | null
          passo_event_id: number | null
          promoter: string[] | null
          promoter_id: string[] | null
          promoter_name_standardized: boolean | null
          providers: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          artist?: string[] | null
          artist_id?: string[] | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string | null
          name?: string | null
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string[] | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          artist?: string[] | null
          artist_id?: string[] | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string | null
          name?: string | null
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string[] | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unique_events_clean: {
        Row: {
          artist: string[] | null
          artist_master_id: number | null
          artist_name_normalised: boolean | null
          biletinial_event_id: number | null
          biletix_event_id: number | null
          bubilet_event_id: number | null
          bugece_event_id: number | null
          canonical_venue_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          genre: string | null
          id: string | null
          name: string | null
          passo_event_id: number | null
          promoter: string | null
          promoter_id: string | null
          providers: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          artist?: string[] | null
          artist_master_id?: number | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string | null
          name?: string | null
          passo_event_id?: number | null
          promoter?: string | null
          promoter_id?: string | null
          providers?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          artist?: string[] | null
          artist_master_id?: number | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string | null
          name?: string | null
          passo_event_id?: number | null
          promoter?: string | null
          promoter_id?: string | null
          providers?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unique_events_duplicate: {
        Row: {
          artist: string[] | null
          artist_master_id: number | null
          artist_name_normalised: boolean | null
          biletinial_event_id: number | null
          biletix_event_id: number | null
          bubilet_event_id: number | null
          bugece_event_id: number | null
          canonical_venue_id: string
          created_at: string | null
          date: string
          description: string | null
          genre: string | null
          id: string
          name: string
          passo_event_id: number | null
          promoter: string[] | null
          promoter_id: string | null
          promoter_ids_multiple: Json | null
          promoter_name_standardized: boolean | null
          providers: string[] | null
          updated_at: string
        }
        Insert: {
          artist?: string[] | null
          artist_master_id?: number | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id: string
          created_at?: string | null
          date: string
          description?: string | null
          genre?: string | null
          id?: string
          name: string
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string | null
          promoter_ids_multiple?: Json | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          updated_at?: string
        }
        Update: {
          artist?: string[] | null
          artist_master_id?: number | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id?: string
          created_at?: string | null
          date?: string
          description?: string | null
          genre?: string | null
          id?: string
          name?: string
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string | null
          promoter_ids_multiple?: Json | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unique_events_duplicate_artist_master_id_fkey"
            columns: ["artist_master_id"]
            isOneToOne: false
            referencedRelation: "artist_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_biletinial_event_id_fkey"
            columns: ["biletinial_event_id"]
            isOneToOne: false
            referencedRelation: "biletinial_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_biletix_event_id_fkey"
            columns: ["biletix_event_id"]
            isOneToOne: false
            referencedRelation: "biletix_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_bubilet_event_id_fkey"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_bubilet_event_id_fkey"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["bubilet_event_id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_bugece_event_id_fkey"
            columns: ["bugece_event_id"]
            isOneToOne: false
            referencedRelation: "bugece_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "canonical_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_passo_event_id_fkey"
            columns: ["passo_event_id"]
            isOneToOne: false
            referencedRelation: "passo_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_analytics_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_duplicate_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      unique_events_yedek: {
        Row: {
          artist: string[] | null
          artist_id: string[] | null
          artist_master_id: number | null
          artist_name_normalised: boolean | null
          biletinial_event_id: number | null
          biletix_event_id: number | null
          bubilet_event_id: number | null
          bugece_event_id: number | null
          canonical_venue_id: string
          created_at: string | null
          date: string
          description: string | null
          genre: string | null
          id: string
          name: string
          passo_event_id: number | null
          promoter: string[] | null
          promoter_id: string | null
          promoter_name_standardized: boolean | null
          providers: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          artist?: string[] | null
          artist_id?: string[] | null
          artist_master_id?: number | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id: string
          created_at?: string | null
          date: string
          description?: string | null
          genre?: string | null
          id?: string
          name: string
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          artist?: string[] | null
          artist_id?: string[] | null
          artist_master_id?: number | null
          artist_name_normalised?: boolean | null
          biletinial_event_id?: number | null
          biletix_event_id?: number | null
          bubilet_event_id?: number | null
          bugece_event_id?: number | null
          canonical_venue_id?: string
          created_at?: string | null
          date?: string
          description?: string | null
          genre?: string | null
          id?: string
          name?: string
          passo_event_id?: number | null
          promoter?: string[] | null
          promoter_id?: string | null
          promoter_name_standardized?: boolean | null
          providers?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unique_events_yedek_artist_master_id_fkey"
            columns: ["artist_master_id"]
            isOneToOne: false
            referencedRelation: "artist_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_biletinial_event_id_fkey"
            columns: ["biletinial_event_id"]
            isOneToOne: false
            referencedRelation: "biletinial_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_biletix_event_id_fkey"
            columns: ["biletix_event_id"]
            isOneToOne: false
            referencedRelation: "biletix_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_bubilet_event_id_fkey"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_bubilet_event_id_fkey"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["bubilet_event_id"]
          },
          {
            foreignKeyName: "unique_events_yedek_bugece_event_id_fkey"
            columns: ["bugece_event_id"]
            isOneToOne: false
            referencedRelation: "bugece_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "canonical_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_yedek_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_yedek_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_passo_event_id_fkey"
            columns: ["passo_event_id"]
            isOneToOne: false
            referencedRelation: "passo_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_analytics_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_yedek_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      unmatched_venues: {
        Row: {
          id: string
          inserted_at: string
          normalized_name: string | null
          process_bool: boolean | null
          provider: string
          raw_name: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          normalized_name?: string | null
          process_bool?: boolean | null
          provider: string
          raw_name: string
        }
        Update: {
          id?: string
          inserted_at?: string
          normalized_name?: string | null
          process_bool?: boolean | null
          provider?: string
          raw_name?: string
        }
        Relationships: []
      }
      venue_review_queue: {
        Row: {
          ai_reason: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          provider: string
          record_id: number
          status: string | null
          suggested_canonical_id: string | null
          table_name: string
          updated_at: string | null
          venue_name: string
        }
        Insert: {
          ai_reason?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          provider: string
          record_id: number
          status?: string | null
          suggested_canonical_id?: string | null
          table_name: string
          updated_at?: string | null
          venue_name: string
        }
        Update: {
          ai_reason?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          provider?: string
          record_id?: number
          status?: string | null
          suggested_canonical_id?: string | null
          table_name?: string
          updated_at?: string | null
          venue_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_promoter_campaigns: {
        Row: {
          ad_caption: string | null
          ad_duration_days: number | null
          ad_end_date: string | null
          ad_start_date: string | null
          ad_status: string | null
          created_at: string | null
          event_id: string | null
          event_name: string | null
          id: string | null
          instagram_link: string | null
          match_confidence: number | null
          page_name: string | null
          promoter_id: string | null
          promoter_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_past_or_not"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_sale_status_view"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "unique_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_artists"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_artists_normalised"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_event_category_sellout_days"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vw_bubilet_remaining_long"
            referencedColumns: ["unique_event_id"]
          },
          {
            foreignKeyName: "promoter_campaigns_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_analytics_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_list_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_campaigns_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      active_ticket_view: {
        Row: {
          category: string | null
          last_seen: string | null
          platform: string | null
          price: number | null
          sold_out: boolean | null
          unique_event_id: string | null
        }
        Relationships: []
      }
      artist_analytics_full: {
        Row: {
          agency: string | null
          booking_emails: string | null
          canonical_id: string | null
          description: string | null
          event_stats: Json | null
          favorite_venues: Json | null
          followers: number | null
          frequent_collaborators: Json | null
          genre_analysis: Json | null
          monthly_listeners: number | null
          name: string | null
          performance_cities: Json | null
          performance_timeline: Json | null
          pricing_analytics: Json | null
          social_links: Json | null
          spotify_link: string | null
          territory: string | null
          top_cities: Json | null
        }
        Relationships: []
      }
      artist_details: {
        Row: {
          agency: string | null
          apple_music: string | null
          artist_link: string | null
          booking_emails: string | null
          canonical_id: string | null
          created_at: string | null
          data_source: string | null
          description: string | null
          facebook_link: string | null
          followers: number | null
          instagram_link: string | null
          monthly_listeners: number | null
          name: string | null
          normalized_name: string | null
          soundcloud: string | null
          spotify_link: string | null
          territory: string | null
          top_cities: Json | null
          total_events: number | null
          twitter_link: string | null
          updated_at: string | null
          wikipedia: string | null
          youtube_link: string | null
        }
        Relationships: []
      }
      artist_list_summary: {
        Row: {
          activity_status: string | null
          agency: string | null
          booking_emails: string | null
          canonical_id: string | null
          cities_performed: number | null
          followers: number | null
          last_performance: string | null
          monthly_listeners: number | null
          name: string | null
          next_performance: string | null
          normalized_name: string | null
          past_events: number | null
          popularity_tier: string | null
          recent_events: number | null
          social_presence: Json | null
          spotify_link: string | null
          territory: string | null
          top_cities: Json | null
          top_genres: string[] | null
          total_events: number | null
          unique_venues: number | null
          upcoming_events: number | null
        }
        Relationships: []
      }
      bubilet_daily_total_sales: {
        Row: {
          day: string | null
          total_revenue: number | null
          total_tickets_sold: number | null
        }
        Relationships: []
      }
      bubilet_dashboard: {
        Row: {
          potential_revenue: number | null
          remaining_revenue: number | null
          revenue_so_far: number | null
          total_events: number | null
        }
        Relationships: []
      }
      bubilet_overall_sales: {
        Row: {
          bubilet_event_id: number | null
          canonical_venue_id: string | null
          category: string | null
          date: string | null
          name: string | null
          price: number | null
          remaining: number | null
          total_potential: number | null
          total_sales: number | null
          unique_event_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "canonical_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["canonical_venue_id"]
            isOneToOne: false
            referencedRelation: "venue_list_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      eligible_events: {
        Row: {
          artist: string[] | null
          canonical_venue_id: string | null
          date: string | null
          description: string | null
          event_id: number | null
          genre: string | null
          name: string | null
          promoter: string | null
          provider: string | null
        }
        Relationships: []
      }
      event_details_full: {
        Row: {
          artists: Json | null
          availability: Json | null
          created_at: string | null
          date: string | null
          description: string | null
          genre: string | null
          id: string | null
          name: string | null
          price_analytics: Json | null
          pricing: Json | null
          promoters: Json | null
          providers: string[] | null
          status: string | null
          updated_at: string | null
          venue_capacity: number | null
          venue_city: string | null
          venue_id: string | null
          venue_name: string | null
        }
        Relationships: []
      }
      event_list_summary: {
        Row: {
          artist_count: number | null
          date: string | null
          date_category: string | null
          days_until_event: number | null
          genre: string | null
          id: string | null
          name: string | null
          price_range: Json | null
          providers: string[] | null
          status: string | null
          ticket_availability: Json | null
          top_artists: Json | null
          venue_city: string | null
          venue_id: string | null
          venue_name: string | null
        }
        Relationships: []
      }
      event_past_or_not: {
        Row: {
          date: string | null
          id: string | null
          is_past: boolean | null
          name: string | null
        }
        Insert: {
          date?: string | null
          id?: string | null
          is_past?: never
          name?: string | null
        }
        Update: {
          date?: string | null
          id?: string | null
          is_past?: never
          name?: string | null
        }
        Relationships: []
      }
      event_sale_status_view: {
        Row: {
          status: string | null
          total_categories: number | null
          total_sold_out: number | null
          unique_event_id: string | null
        }
        Relationships: []
      }
      normalized_artist_names: {
        Row: {
          canonical_form: string | null
          raw_name: string | null
        }
        Relationships: []
      }
      promoter_analytics_full: {
        Row: {
          artist_metrics: Json | null
          business_metrics: Json | null
          created_at: string | null
          genre_analytics: Json | null
          id: string | null
          instagram_link: string | null
          name: string | null
          past_events_count: number | null
          time_analytics: Json | null
          total_events_count: number | null
          upcoming_events_count: number | null
          venue_analytics: Json | null
        }
        Relationships: []
      }
      promoter_list_summary: {
        Row: {
          activity_status: string | null
          cities: string[] | null
          cities_count: number | null
          created_at: string | null
          genres_count: number | null
          genres_promoted: string[] | null
          id: string | null
          instagram_link: string | null
          last_event_date: string | null
          name: string | null
          next_event_date: string | null
          past_events: number | null
          recent_events: number | null
          scale_tier: string | null
          top_artists: Json | null
          total_events: number | null
          unique_artists_count: number | null
          upcoming_events: number | null
          venues_used: number | null
        }
        Relationships: []
      }
      provider_distribution_counts: {
        Row: {
          biletinial_count: number | null
          biletix_count: number | null
          bubilet_count: number | null
          bugece_count: number | null
          passo_count: number | null
        }
        Relationships: []
      }
      ticket_history_view: {
        Row: {
          category: string | null
          created_at: string | null
          last_seen: string | null
          platform: string | null
          price: number | null
          sold_out: boolean | null
          unique_event_id: string | null
        }
        Relationships: []
      }
      v_avg_ticket_price_per_venue: {
        Row: {
          avg_price: number | null
          max_price: number | null
          min_price: number | null
          price_samples: number | null
          venue_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "canonical_venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "event_details_full"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "event_list_summary"
            referencedColumns: ["venue_id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_details_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_events_canonical_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_list_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      v_event_artists: {
        Row: {
          artist_clean: string | null
          event_id: string | null
        }
        Relationships: []
      }
      v_event_artists_normalised: {
        Row: {
          artist_display: string | null
          artist_key: string | null
          event_id: string | null
        }
        Relationships: []
      }
      v_event_category_sellout_days: {
        Row: {
          category: string | null
          event_name: string | null
          first_seen: string | null
          provider: string | null
          sellout_days: number | null
          sellout_interval: unknown | null
          sold_out_date: string | null
          unique_event_id: string | null
        }
        Relationships: []
      }
      venue_details_full: {
        Row: {
          capacity: number | null
          city: string | null
          created_at: string | null
          day_of_week_distribution: Json | null
          event_stats: Json | null
          genre_distribution: Json | null
          id: string | null
          name: string | null
          pricing_analytics: Json | null
          similar_venues: Json | null
          top_artists: Json | null
          top_promoters: Json | null
          utilization_metrics: Json | null
        }
        Insert: {
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          day_of_week_distribution?: never
          event_stats?: never
          genre_distribution?: never
          id?: string | null
          name?: string | null
          pricing_analytics?: never
          similar_venues?: never
          top_artists?: never
          top_promoters?: never
          utilization_metrics?: never
        }
        Update: {
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          day_of_week_distribution?: never
          event_stats?: never
          genre_distribution?: never
          id?: string | null
          name?: string | null
          pricing_analytics?: never
          similar_venues?: never
          top_artists?: never
          top_promoters?: never
          utilization_metrics?: never
        }
        Relationships: []
      }
      venue_list_summary: {
        Row: {
          avg_ticket_price: number | null
          capacity: number | null
          city: string | null
          id: string | null
          name: string | null
          recent_events: number | null
          top_genres: string[] | null
          total_events: number | null
          upcoming_events: number | null
        }
        Relationships: []
      }
      vw_bubilet_remaining_long: {
        Row: {
          bubilet_event_id: number | null
          category: string | null
          remaining: number | null
          ts: string | null
          unique_event_id: string | null
          unique_event_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bubilet_prices_event_id_fkey"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bubilet_prices_event_id_fkey"
            columns: ["bubilet_event_id"]
            isOneToOne: false
            referencedRelation: "bubilet_overall_sales"
            referencedColumns: ["bubilet_event_id"]
          },
        ]
      }
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      calculate_artist_growth: {
        Args: { artist_uuid: string; time_range?: string }
        Returns: Json
      }
      call_standardize_queue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      crosstab: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      crosstab2: {
        Args: { "": string }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_2"][]
      }
      crosstab3: {
        Args: { "": string }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_3"][]
      }
      crosstab4: {
        Args: { "": string }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_4"][]
      }
      debug_all_unmatched_venues: {
        Args: Record<PropertyKey, never>
        Returns: {
          source_table: string
          event_id: number
          original_venue: string
          normalized_venue: string
          manual_match: string
          fuzzy_match: string
        }[]
      }
      events_by_promoter_and_day: {
        Args: { p_promoter: string; p_start: string; p_end: string }
        Returns: {
          day: string
          events: number
        }[]
      }
      exact_canonical_venue_match: {
        Args: { input_name: string }
        Returns: {
          canonical_id: string
        }[]
      }
      exact_manual_match: {
        Args: { input_name: string }
        Returns: {
          canonical_id: string
          canonical_name: string
        }[]
      }
      f_clean_artist: {
        Args: { raw: string }
        Returns: string
      }
      fn_extract_artists: {
        Args: { p_raw: string }
        Returns: string[]
      }
      fn_sanitize_artist_name: {
        Args: { p_raw: string }
        Returns: string
      }
      get_artist_calendar: {
        Args: { artist_uuid: string; year_param: number; month_param: number }
        Returns: Json
      }
      get_artist_details: {
        Args: { artist_uuid: string }
        Returns: Json
      }
      get_artist_events: {
        Args: { artist_uuid: string }
        Returns: {
          id: string
          name: string
          date: string
          venue_name: string
          venue_city: string
          status: string
        }[]
      }
      get_artist_tour_stats: {
        Args: { artist_uuid: string; date_from?: string; date_to?: string }
        Returns: Json
      }
      get_artist_upcoming_events: {
        Args: { artist_uuid: string; limit_count?: number }
        Returns: Json
      }
      get_bubilet_remaining_matrix: {
        Args: { p_unique: string }
        Returns: Json
      }
      get_daily_bubilet_sales: {
        Args: { p_event_id: string }
        Returns: {
          sale_date: string
          tickets_sold: number
          revenue: number
          avg_price: number
          categories_count: number
          total_revenue_generated: number
          total_revenue_potential: number
          total_revenue: number
        }[]
      }
      get_event_filter_options: {
        Args: Record<PropertyKey, never>
        Returns: {
          genres: string[]
          cities: string[]
          venues: Json
          providers: string[]
          price_range: Json
        }[]
      }
      get_event_pricing_history: {
        Args: { event_uuid: string; days_back?: number }
        Returns: {
          provider: string
          category: string
          price_history: Json
          current_price: number
          lowest_price: number
          highest_price: number
          price_trend: string
        }[]
      }
      get_event_statistics: {
        Args: { event_uuid: string }
        Returns: {
          total_price_categories: number
          active_providers: number
          price_range_spread: number
          days_on_sale: number
          price_volatility: string
        }[]
      }
      get_event_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_event_tickets: {
        Args: { p_event: string; p_status?: string }
        Returns: Json
      }
      get_events_filtered: {
        Args: {
          status_filter?: string[]
          date_from?: string
          date_to?: string
          genre_filter?: string[]
          venue_ids?: string[]
          city_filter?: string[]
          has_tickets_only?: boolean
          provider_filter?: string[]
          price_min?: number
          price_max?: number
          limit_count?: number
          offset_count?: number
          sort_by?: string
          sort_order?: string
        }
        Returns: {
          id: string
          name: string
          date: string
          status: string
          genre: string
          venue_id: string
          venue_name: string
          venue_city: string
          artist_count: number
          top_artists: Json
          price_range: Json
          ticket_availability: Json
          date_category: string
          days_until_event: number
          total_count: number
        }[]
      }
      get_promoter_campaigns: {
        Args: { promoter_uuid: string; limit_count?: number }
        Returns: {
          campaigns: Json
        }[]
      }
      get_promoter_events: {
        Args: {
          promoter_uuid: string
          include_past?: boolean
          search_term?: string
          genre_filter?: string[]
          city_filter?: string[]
          sort_by?: string
          sort_order?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          events: Json
          total_count: number
        }[]
      }
      get_similar_artists: {
        Args: { artist_uuid: string; limit_count?: number }
        Returns: Json
      }
      get_similar_events: {
        Args: {
          event_uuid: string
          limit_count?: number
          include_past_events?: boolean
        }
        Returns: {
          id: string
          name: string
          date: string
          venue_name: string
          venue_city: string
          artist_names: string[]
          genre: string
          similarity_score: number
          similarity_reasons: string[]
          price_range: Json
        }[]
      }
      get_venue_calendar: {
        Args: { venue_uuid: string; year_param: number; month_param: number }
        Returns: Json
      }
      get_venue_events: {
        Args: {
          venue_uuid: string
          time_filter?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          event_id: string
          event_name: string
          event_date: string
          genre: string
          status: string
          artists: Json
          min_price: number
          max_price: number
          providers: string[]
          promoters: Json
          promoter_names: string
          capacity: number
          tickets_sold: number
          ticket_sold_percentage: number
        }[]
      }
      get_venue_past_events: {
        Args: {
          venue_uuid: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          events: Json
          total_count: number
        }[]
      }
      get_venue_revenue_trends: {
        Args: { venue_uuid: string; months_back?: number }
        Returns: Json
      }
      get_venue_upcoming_events: {
        Args: { venue_uuid: string; limit_count?: number }
        Returns: Json
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      match_canonical_venue: {
        Args: { input_name: string; threshold?: number }
        Returns: {
          canonical_id: string
          score: number
        }[]
      }
      match_canonical_venue_verbose: {
        Args: { input_name: string; threshold?: number }
        Returns: {
          canonical_id: string
          canonical_name: string
          score: number
        }[]
      }
      norm: {
        Args: { t: string }
        Returns: string
      }
      normalize_artist_name: {
        Args: { input_name: string }
        Returns: string
      }
      refresh_agency_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      safe_to_text_array: {
        Args: { t: string }
        Returns: string[]
      }
      sanitize_artist_name: {
        Args: { raw: string }
        Returns: string
      }
      search_artists_unified: {
        Args: {
          search_term: string
          agency_filter?: string
          limit_count?: number
        }
        Returns: {
          id: number
          artist: string
          agency: string
          agent_info: string
          contact_info: string
          territory: string
          spotify_link: string
          monthly_listeners: string
          followers: string
          city_1: string
          listeners_1: string
          city_2: string
          listeners_2: string
          city_3: string
          listeners_3: string
          city_4: string
          listeners_4: string
          city_5: string
          listeners_5: string
        }[]
      }
      search_events: {
        Args: {
          search_term?: string
          date_start?: string
          date_end?: string
          event_status?: string[]
          genre_filter?: string[]
          city_filter?: string[]
          venue_ids?: string[]
          artist_ids?: string[]
          has_tickets_only?: boolean
          min_price?: number
          max_price?: number
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          event_data: Json
          total_count: number
        }[]
      }
      search_promoters_db: {
        Args: {
          search_term?: string
          activity_filter?: string[]
          scale_filter?: string[]
          city_filter?: string[]
          genre_filter?: string[]
          min_events?: number
          has_upcoming_events?: boolean
          sort_by?: string
          sort_order?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          promoters: Json
          total_count: number
          facets: Json
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      split_artists: {
        Args: { txt: string[] } | { txt: string }
        Returns: string[]
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      turkish_unaccent: {
        Args: { input_text: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      update_promoter_id_manually: {
        Args: {
          event_row: Database["public"]["Tables"]["unique_events"]["Row"]
        }
        Returns: {
          artist: string[] | null
          artist_id: string[] | null
          artist_name_normalised: boolean | null
          biletinial_event_id: number | null
          biletix_event_id: number | null
          bubilet_event_id: number | null
          bugece_event_id: number | null
          canonical_venue_id: string
          created_at: string | null
          date: string
          description: string | null
          genre: string | null
          id: string
          name: string
          passo_event_id: number | null
          promoter: string[] | null
          promoter_id: string[] | null
          promoter_name_standardized: boolean | null
          providers: string[] | null
          status: string
          updated_at: string
        }
      }
      update_promoter_ids: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_unique_event_statuses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      upsert_single_unique_event: {
        Args: { p_provider: string; p_event_id: number }
        Returns: undefined
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
      tablefunc_crosstab_2: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
      }
      tablefunc_crosstab_3: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
      }
      tablefunc_crosstab_4: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
        category_4: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
