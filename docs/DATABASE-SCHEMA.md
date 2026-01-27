# Database Schema (Supabase)

## products

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| name | text | Product name |
| price | numeric | Price in UAH |
| brand_id | integer | FK to brands |
| category_id | integer | FK to categories |
| product_description | text | Full description |
| preview_image | text | Main image URL (Supabase Storage) |
| images | text[] | Array of image URLs |
| colors | text[] | Product colors |
| tags | text[] | Product tags |
| gender | text | male/female/unisex |
| external_url | text | Link to seller website |
| inst_url | text | Link to Instagram |

## brands

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| name | text | Brand name |
| marketing_desc | text | Description |
| internal_url | text | Internal page URL |
| external_url | text | Brand website |
| inst_url | text | Instagram URL |

## categories

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| name | text | Category name |
| marketing_desc | text | Description |
| parent_category | integer | FK for hierarchy (self-referencing) |

## Relationships

```
products.brand_id → brands.id
products.category_id → categories.id
categories.parent_category → categories.id
```

## Notes

- All tables use `SERIAL` for auto-incrementing IDs
- Gender is constrained to: `male`, `female`, `unisex`
- Images are stored in Supabase Storage; URLs point to storage buckets
- See [DATABASE-SEEDING.md](DATABASE-SEEDING.md) for table creation SQL and sample data
