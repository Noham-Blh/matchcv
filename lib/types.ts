export type PlanType = "free" | "credits" | "subscription";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  credits: number;
  plan: PlanType;
  is_admin: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  job_title: string | null;
  company_name: string | null;
  job_offer_text: string;
  original_cv_text: string;
  generated_cv: string;
  generated_cover_letter: string;
  match_score: number | null;
  template: "classic" | "modern";
  created_at: string;
}

export interface ClaudeGenerationResult {
  optimizedCv: string;
  coverLetter: string;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

// Type minimal de la base Supabase, utilisé par @supabase/ssr pour le typage.
// À régénérer avec `supabase gen types typescript` une fois le schéma appliqué.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
      };
      generations: {
        Row: Generation;
        Insert: Partial<Generation> & { user_id: string };
        Update: Partial<Generation>;
      };
    };
  };
}
