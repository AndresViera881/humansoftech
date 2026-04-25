'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api, ApiRole, ApiMenu, ApiPermission } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { useMutation } from '@/hooks/useMutation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SaveButton } from '@/components/ui/save-button';

interface RoleAccess { menuIds: string[]; permissionIds: string[] }

export default function AdminRolesGrid() {
  const [selectedRole, setSelectedRole] = useState<ApiRole | null>(null);
  const [access, setAccess] = useState<RoleAccess>({ menuIds: [], permissionIds: [] });

  const { data, loading } = useApiData(() =>
    Promise.all([api.roles.list(), api.menus.list(), api.permissions.list()])
      .then(([roles, menus, permissions]) => ({ roles, menus, permissions }))
  );
  const roles: ApiRole[] = data?.roles ?? [];
  const menus: ApiMenu[] = data?.menus ?? [];
  const permissions: ApiPermission[] = data?.permissions ?? [];

  const { mutate: saveAccess, loading: saving } = useMutation(
    () => Promise.all([
      api.roles.setMenus(selectedRole!.id, access.menuIds),
      api.roles.setPermissions(selectedRole!.id, access.permissionIds),
    ]),
    { onSuccess: () => toast.success('Accesos guardados correctamente'), onError: () => toast.error('Error al guardar accesos') }
  );

  async function selectRole(role: ApiRole) {
    setSelectedRole(role);
    const a = await api.roles.getAccess(role.id);
    setAccess(a);
  }

  function toggleMenu(id: string) {
    setAccess(prev => ({
      ...prev,
      menuIds: prev.menuIds.includes(id) ? prev.menuIds.filter(x => x !== id) : [...prev.menuIds, id],
    }));
  }

  function togglePermission(id: string) {
    setAccess(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id) ? prev.permissionIds.filter(x => x !== id) : [...prev.permissionIds, id],
    }));
  }

  const parentMenus = menus.filter(m => !m.parentId);
  const childMenus = menus.filter(m => m.parentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-border border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">

      {/* Role list */}
      <div className="w-56 flex-shrink-0 flex flex-col gap-2">
        <p className="text-xs font-bold tracking-widest uppercase px-1 mb-1 text-muted-foreground">Roles</p>
        {roles.map(role => (
          <button key={role.id} onClick={() => selectRole(role)}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background: selectedRole?.id === role.id ? '#111827' : '#fff',
              color: selectedRole?.id === role.id ? '#fff' : '#374151',
              border: '1px solid',
              borderColor: selectedRole?.id === role.id ? '#111827' : 'rgba(0,0,0,0.08)',
              boxShadow: selectedRole?.id === role.id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
            }}>
            <p>{role.name.replace('_', ' ')}</p>
            {role.description && (
              <p className="text-xs mt-0.5 font-normal truncate"
                style={{ color: selectedRole?.id === role.id ? 'rgba(255,255,255,0.55)' : '#9ca3af' }}>
                {role.description}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Access editor */}
      <div className="flex-1 min-w-0">
        {!selectedRole ? (
          <div className="flex items-center justify-center h-64 rounded-2xl bg-white border text-muted-foreground">
            <p className="text-sm">Selecciona un rol para editar sus accesos</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden bg-white border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-base font-black text-foreground">{selectedRole.name.replace('_', ' ')}</h2>
                {selectedRole.description && <p className="text-xs mt-0.5 text-muted-foreground">{selectedRole.description}</p>}
              </div>
              <SaveButton onClick={() => saveAccess()} loading={saving}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Guardar
              </SaveButton>
            </div>

            <div className="grid grid-cols-2 divide-x">
              {/* Menus */}
              <div className="p-6">
                <p className="text-xs font-bold tracking-widest uppercase mb-4 text-muted-foreground">Menús</p>
                <div className="flex flex-col gap-3">
                  {parentMenus.map(parent => {
                    const children = childMenus.filter(c => c.parentId === parent.id);
                    return (
                      <div key={parent.id}>
                        <div className="flex items-center gap-2.5">
                          <Checkbox id={`menu-${parent.id}`} checked={access.menuIds.includes(parent.id)} onCheckedChange={() => toggleMenu(parent.id)} />
                          <label htmlFor={`menu-${parent.id}`} className="text-sm font-semibold cursor-pointer text-foreground">{parent.label}</label>
                        </div>
                        {children.map(child => (
                          <div key={child.id} className="flex items-center gap-2.5 mt-1.5 ml-6">
                            <Checkbox id={`menu-${child.id}`} checked={access.menuIds.includes(child.id)} onCheckedChange={() => toggleMenu(child.id)} />
                            <label htmlFor={`menu-${child.id}`} className="text-sm cursor-pointer text-muted-foreground">{child.label}</label>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Permissions */}
              <div className="p-6">
                <p className="text-xs font-bold tracking-widest uppercase mb-4 text-muted-foreground">Permisos</p>
                <div className="flex flex-col gap-2.5">
                  {permissions.map(perm => (
                    <div key={perm.id} className="flex items-center gap-2.5">
                      <Checkbox id={`perm-${perm.id}`} checked={access.permissionIds.includes(perm.id)} onCheckedChange={() => togglePermission(perm.id)} />
                      <label htmlFor={`perm-${perm.id}`} className="cursor-pointer">
                        <p className="text-sm font-semibold text-foreground">{perm.name}</p>
                        {perm.description && <p className="text-xs text-muted-foreground">{perm.description}</p>}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
