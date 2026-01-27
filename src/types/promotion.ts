export interface Promotion {
  id: number;
  title_uk: string;
  title_en: string;
  subtitle_uk: string | null;
  subtitle_en: string | null;
  discount_text: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}
