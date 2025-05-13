// RoleContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface RoleContextType {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     let initialRole = null;
//     const roles = localStorage.getItem('roles');
//     if(roles){
//         const parsedRoles = JSON.parse(roles);
//         if(parsedRoles && parsedRoles.length > 0){
//             initialRole = parsedRoles[0];
//         }
//     }

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(() => {
    const storedRole = localStorage.getItem('userRole');
    return storedRole || null; // Return null if nothing is found
  });
    
    // const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
      if (userRole !== null) {
        localStorage.setItem('userRole', userRole);
      } else {
        localStorage.removeItem('userRole'); // Remove from storage if null
      }
    }, [userRole]);
    
  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};