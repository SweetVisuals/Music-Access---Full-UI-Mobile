
import { Project } from '../types';
import { MOCK_PROJECTS } from '../constants';

// IMPORTANT: These must be set in your environment variables.
// Your Supabase URL, e.g., "https://<your-project-ref>.supabase.co"
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL; 
// Your Supabase anon key (public key)
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

// Helper function to transform snake_case to camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const transformObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => transformObjectKeys(v));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            result[toCamelCase(key)] = transformObjectKeys(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
};


export const getProjects = async (): Promise<Project[]> => {
    // If credentials are missing, return mock data immediately to avoid app errors in development
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("Supabase URL or Anon Key is missing. Using MOCK_PROJECTS.");
        return MOCK_PROJECTS;
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // If the response is not OK (e.g. 404, 401), throw to catch block to use mock data
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.warn("Supabase response error:", errorData);
            throw new Error(errorData.message || 'Failed to fetch projects from Supabase.');
        }

        const data = await response.json();

        // Transform snake_case keys from Supabase to camelCase for our app
        const transformedData = data.map((project: any) => transformObjectKeys(project));
        
        return transformedData as Project[];
    } catch (error) {
        console.warn("Failed to fetch projects from Supabase, falling back to mock data.", error);
        return MOCK_PROJECTS;
    }
};
