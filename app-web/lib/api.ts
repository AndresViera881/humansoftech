const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  sortOrder: number;
  subcategories?: ApiSubcategory[];
  _count?: { products: number };
}

export interface ApiSubcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  _count?: { products: number };
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  description: string | null;
  images: string[];
  badge: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  condition?: 'nuevo' | 'seminuevo';
  categoryId: string;
  subcategoryId: string | null;
  category: ApiCategory;
  subcategory: ApiSubcategory | null;
  createdAt: string;
}

export interface ProductsResponse {
  data: ApiProduct[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  price: number;
  categoryId: string;
  subcategoryId?: string;
  description?: string;
  images?: string[];
  badge?: string;
  stock?: number;
  featured?: boolean;
  condition?: 'nuevo' | 'seminuevo';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `API error ${res.status}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiRole {
  id: string;
  name: string;
  description: string | null;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  role: { id: string; name: string };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  roleId: string;
  active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  active?: boolean;
}

export const api = {
  upload: {
    image: async (file: File): Promise<{ url: string; publicId: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? `Upload error ${res.status}`);
      }
      return res.json() as Promise<{ url: string; publicId: string }>;
    },
    images: async (files: File[]): Promise<{ url: string; publicId: string }[]> => {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const res = await fetch(`${API_URL}/upload/multiple`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? `Upload error ${res.status}`);
      }
      return res.json() as Promise<{ url: string; publicId: string }[]>;
    },
  },
  auth: {
    login: (email: string, password: string) =>
      request<{ user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  categories: {
    list: (includeSubcategories = false) =>
      request<ApiCategory[]>(`/categories${includeSubcategories ? '?include=subcategories' : ''}`),
  },
  subcategories: {
    listByCategory: (categoryId: string) =>
      request<ApiSubcategory[]>(`/subcategories?categoryId=${categoryId}`),
  },
  products: {
    list: (filters: ProductFilters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
      });
      const qs = params.toString();
      return request<ProductsResponse>(`/products${qs ? `?${qs}` : ''}`);
    },
    create: (payload: CreateProductPayload) =>
      request<ApiProduct>('/products', { method: 'POST', body: JSON.stringify({ ...payload, images: payload.images ?? [] }) }),
    update: (id: string, payload: Partial<CreateProductPayload>) =>
      request<ApiProduct>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    delete: (id: string) =>
      request<void>(`/products/${id}`, { method: 'DELETE' }),
  },
  roles: {
    list: () => request<ApiRole[]>('/roles'),
  },
  users: {
    list: () => request<ApiUser[]>('/users'),
    create: (payload: CreateUserPayload) =>
      request<ApiUser>('/users', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: UpdateUserPayload) =>
      request<ApiUser>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    delete: (id: string) =>
      request<void>(`/users/${id}`, { method: 'DELETE' }),
  },
  visits: {
    record: (page: string) =>
      request<void>('/visits', { method: 'POST', body: JSON.stringify({ page }) }),
    stats: () =>
      request<{ total: number; today: number; week: number }>('/visits/stats'),
  },
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
