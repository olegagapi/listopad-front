// Helper to generate slug from name and id
export function generateSlug(name: string, id: number | string): string {
    return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`;
}

// Helper to parse id from slug
export function getIdFromSlug(slug: string): string | null {
    const parts = slug.split('-');
    return parts[parts.length - 1] || null;
}
