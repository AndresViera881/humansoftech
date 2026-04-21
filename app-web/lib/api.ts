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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  photo?: string | null;
  cedula?: string | null;
}

export interface ApiMenuItem {
  id: string;
  label: string;
  icon: string | null;
  path: string | null;
  children?: ApiMenuItem[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  menus: ApiMenuItem[];
  permissions: string[];
}

export interface ApiRole {
  id: string;
  name: string;
  description: string | null;
}

export interface ApiMenu {
  id: string;
  label: string;
  icon: string | null;
  path: string | null;
  parentId: string | null;
  sortOrder: number;
  active: boolean;
  children?: ApiMenu[];
}

export interface ApiPermission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  cedula: string | null;
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
  photo?: string;
  cedula?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  active?: boolean;
  photo?: string;
  cedula?: string;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('tc_session');
    if (saved) return JSON.parse(saved).token ?? null;
  } catch { /* */ }
  return null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `API error ${res.status}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const api = {
  upload: {
    image: async (file: File): Promise<{ url: string; publicId: string }> => {
      const token = getToken();
      const formData = new FormData();
      formData.append('file', file);
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData, headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? `Upload error ${res.status}`);
      }
      return res.json() as Promise<{ url: string; publicId: string }>;
    },
    images: async (files: File[]): Promise<{ url: string; publicId: string }[]> => {
      const token = getToken();
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/upload/multiple`, { method: 'POST', body: formData, headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? `Upload error ${res.status}`);
      }
      return res.json() as Promise<{ url: string; publicId: string }[]>;
    },
  },
  auth: {
    login: (cedula: string, password: string) =>
      request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ cedula, password }),
      }),
    register: (name: string, cedula: string, password: string) =>
      request<LoginResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, cedula, password }),
      }),
    changePassword: (userId: string, currentPassword: string, newPassword: string) =>
      request<{ message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ userId, currentPassword, newPassword }),
      }),
  },
  categories: {
    list: (includeSubcategories = false) =>
      request<ApiCategory[]>(`/categories${includeSubcategories ? '?include=subcategories' : ''}`),
    create: (payload: { name: string; slug: string; description?: string; sortOrder?: number }) =>
      request<ApiCategory>('/categories', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: { name?: string; slug?: string; description?: string; active?: boolean; sortOrder?: number }) =>
      request<ApiCategory>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    delete: (id: string) =>
      request<void>(`/categories/${id}`, { method: 'DELETE' }),
  },
  subcategories: {
    list: () => request<ApiSubcategory[]>('/subcategories'),
    listByCategory: (categoryId: string) =>
      request<ApiSubcategory[]>(`/subcategories?categoryId=${categoryId}`),
    create: (payload: { name: string; slug: string; description?: string; categoryId: string }) =>
      request<ApiSubcategory>('/subcategories', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: { name?: string; slug?: string; description?: string }) =>
      request<ApiSubcategory>(`/subcategories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    delete: (id: string) =>
      request<void>(`/subcategories/${id}`, { method: 'DELETE' }),
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
    getAccess: (id: string) => request<{ menuIds: string[]; permissionIds: string[] }>(`/roles/${id}/access`),
    setMenus: (id: string, menuIds: string[]) =>
      request<{ success: boolean }>(`/roles/${id}/menus`, { method: 'PUT', body: JSON.stringify({ menuIds }) }),
    setPermissions: (id: string, permissionIds: string[]) =>
      request<{ success: boolean }>(`/roles/${id}/permissions`, { method: 'PUT', body: JSON.stringify({ permissionIds }) }),
  },
  menus: {
    list: () => request<ApiMenu[]>('/menus'),
    create: (payload: { label: string; icon?: string; path?: string; parentId?: string; sortOrder?: number }) =>
      request<ApiMenu>('/menus', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: { label?: string; icon?: string; path?: string; parentId?: string | null; sortOrder?: number; active?: boolean }) =>
      request<ApiMenu>(`/menus/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    delete: (id: string) => request<void>(`/menus/${id}`, { method: 'DELETE' }),
  },
  permissions: {
    list: () => request<ApiPermission[]>('/permissions'),
    create: (payload: { name: string; description?: string; resource: string; action: string }) =>
      request<ApiPermission>('/permissions', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: { name?: string; description?: string; resource?: string; action?: string }) =>
      request<ApiPermission>(`/permissions/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    delete: (id: string) => request<void>(`/permissions/${id}`, { method: 'DELETE' }),
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
    record: (page: string, referrer: string) =>
      request<void>('/visits', { method: 'POST', body: JSON.stringify({ page, referrer }) }),
    stats: () =>
      request<{
        total: number; today: number; week: number;
        recent: { id: string; ip: string | null; browser: string | null; os: string | null; device: string | null; referrer: string | null; visitedAt: string }[];
        byBrowser: { label: string; count: number }[];
        byOS: { label: string; count: number }[];
        byDevice: { label: string; count: number }[];
      }>('/visits/stats'),
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
