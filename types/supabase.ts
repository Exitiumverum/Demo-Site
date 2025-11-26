/**
 * Supabase Database types
 * 
 * For now, we'll use a generic Database type.
 * In the future, you can generate proper types using:
 * npx supabase gen types typescript --project-id <your-project-id> > types/supabase.ts
 */
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};

