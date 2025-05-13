export const roles = {
    admin: ['TENANT_ENTITY_ADMIN', 'TECHEAZY_ADMIN', 'OPERATOR', 'TEACHER', 'STUDENT'],
    operator: ['TENANT_ENTITY_OPERATOR', 'OPERATOR'],
    teacher: ['TEACHER'],
    student: ['STUDENT'],
  };

  export const canAccess = (role: string, allowedRoles: string[]) =>
    allowedRoles.includes(role);

