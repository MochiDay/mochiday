export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applied: boolean | null;
          created_at: string;
          id: number;
          job_url: string;
          user_id: string;
        };
        Insert: {
          applied?: boolean | null;
          created_at?: string;
          id?: number;
          job_url: string;
          user_id: string;
        };
        Update: {
          applied?: boolean | null;
          created_at?: string;
          id?: number;
          job_url?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_applications_job_url_fkey";
            columns: ["job_url"];
            isOneToOne: true;
            referencedRelation: "jobs";
            referencedColumns: ["job_url"];
          },
          {
            foreignKeyName: "public_applications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      jobs: {
        Row: {
          company: string;
          created_at: string;
          id: number;
          image: string | null;
          job_board: string | null;
          job_title: string | null;
          job_url: string;
          location: string | null;
        };
        Insert: {
          company: string;
          created_at?: string;
          id?: number;
          image?: string | null;
          job_board?: string | null;
          job_title?: string | null;
          job_url: string;
          location?: string | null;
        };
        Update: {
          company?: string;
          created_at?: string;
          id?: number;
          image?: string | null;
          job_board?: string | null;
          job_title?: string | null;
          job_url?: string;
          location?: string | null;
        };
        Relationships: [];
      };
      user_details: {
        Row: {
          auth_to_work_in_usa: boolean;
          created_at: string;
          current_company: string;
          current_location: string;
          disability: string;
          first_name: string;
          future_sponsership_required: boolean;
          gender: string;
          github_url: string | null;
          hispanic: boolean;
          id: number;
          last_name: string;
          linkedin_url: string | null;
          middle_name: string | null;
          phone: string;
          pronouns: string;
          race: string;
          resume_link: string;
          type_of_sponsership: string | null;
          user_id: string;
          veteran_status: string;
          website_url: string | null;
        };
        Insert: {
          auth_to_work_in_usa: boolean;
          created_at?: string;
          current_company: string;
          current_location: string;
          disability: string;
          first_name: string;
          future_sponsership_required: boolean;
          gender: string;
          github_url?: string | null;
          hispanic: boolean;
          id?: number;
          last_name: string;
          linkedin_url?: string | null;
          middle_name?: string | null;
          phone: string;
          pronouns: string;
          race: string;
          resume_link: string;
          type_of_sponsership?: string | null;
          user_id: string;
          veteran_status: string;
          website_url?: string | null;
        };
        Update: {
          auth_to_work_in_usa?: boolean;
          created_at?: string;
          current_company?: string;
          current_location?: string;
          disability?: string;
          first_name?: string;
          future_sponsership_required?: boolean;
          gender?: string;
          github_url?: string | null;
          hispanic?: boolean;
          id?: number;
          last_name?: string;
          linkedin_url?: string | null;
          middle_name?: string | null;
          phone?: string;
          pronouns?: string;
          race?: string;
          resume_link?: string;
          type_of_sponsership?: string | null;
          user_id?: string;
          veteran_status?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_user_details_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          password: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          password?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          password?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
