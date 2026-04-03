import React, { useState, useEffect } from 'react';
import API from '../config/api';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get('/api/admin/users', getAuthConfig());
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to connect to directory');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently exile ${userName}? This will delete all their recipes.`)) {
      return;
    }
    try {
      await API.delete(`/api/admin/users/${userId}`, getAuthConfig());
      toast.success('Author formally removed!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to remove author');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="pt-32 pb-24 px-6 relative overflow-hidden min-h-screen bg-surface">
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-50 z-[0]"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <header className="mb-12 border-b border-outline-variant/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label text-xs tracking-[0.2em] text-primary mb-2 block font-medium uppercase">Administration</span>
            <h1 className="text-5xl md:text-6xl font-headline text-on-surface leading-tight tracking-tight mb-2">Author Directory</h1>
            <p className="font-body text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Curate the community list. Removing an author retracts all their published and pending volumes.
            </p>
          </div>
        </header>

        {users.length === 0 ? (
          <div className="py-24 text-center border mt-8 border-outline-variant/20 bg-surface-container-lowest shadow-sm">
            <h3 className="font-headline text-2xl text-on-surface italic">Directory is Empty</h3>
          </div>
        ) : (
          <div className="bg-surface-container-lowest shadow-[0px_20px_40px_rgba(88,65,60,0.08)] border border-outline-variant/10 overflow-hidden">
             
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="p-5 pl-8 font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase border-b border-outline-variant/30">Author Name</th>
                    <th className="p-5 font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase border-b border-outline-variant/30">Pen Name</th>
                    <th className="p-5 font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase border-b border-outline-variant/30">Contact</th>
                    <th className="p-5 font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase border-b border-outline-variant/30">Authorization</th>
                    <th className="p-5 font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase border-b border-outline-variant/30">Inaugurated</th>
                    <th className="p-5 pr-8 text-right font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase border-b border-outline-variant/30">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="p-5 pl-8 font-headline text-xl text-on-surface">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="p-5 font-body text-sm text-on-surface-variant italic">@{user.username}</td>
                      <td className="p-5 font-technical text-sm text-on-surface">{user.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 text-[9px] font-label font-bold tracking-[0.15em] uppercase border ${user.role === 'admin' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-surface text-on-surface-variant border-outline-variant/30'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5 font-technical text-xs text-on-surface-variant tracking-wider">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        {user.role !== 'admin' ? (
                          <button
                            className="font-label text-[10px] uppercase tracking-[0.15em] font-semibold text-error/80 hover:text-error transition-colors flex items-center justify-end gap-1 ml-auto group-hover:underline"
                            onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                          >
                            <span className="material-symbols-outlined text-[1rem]">person_remove</span> Revoke
                          </button>
                        ) : (
                          <span className="font-body text-xs text-on-surface-variant/50 italic flex items-center justify-end gap-1">
                             <span className="material-symbols-outlined text-[1rem]">shield</span> Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-outline-variant/10">
              {users.map((user) => (
                <div key={user._id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-headline text-2xl text-on-surface mb-1">{user.firstName} {user.lastName}</div>
                      <div className="font-body text-sm text-on-surface-variant italic mb-2">@{user.username}</div>
                    </div>
                    <span className={`px-2 py-1 text-[9px] font-label font-bold tracking-[0.15em] uppercase border ${user.role === 'admin' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-surface text-on-surface-variant border-outline-variant/30'}`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 bg-surface-container-low/50 p-4 border border-outline-variant/10">
                    <div className="flex items-center gap-3">
                       <span className="material-symbols-outlined text-[1rem] text-outline">mail</span>
                       <span className="font-technical text-sm text-on-surface">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="material-symbols-outlined text-[1rem] text-outline">calendar_today</span>
                       <span className="font-technical text-xs tracking-wider text-on-surface-variant">
                          Inaugurated {new Date(user.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                  </div>

                  {user.role !== 'admin' ? (
                    <button
                      className="w-full border border-error/50 text-error hover:bg-error hover:text-surface font-label uppercase tracking-[0.1em] text-[10px] font-bold py-3 transition-colors flex justify-center items-center gap-2"
                      onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                    >
                      <span className="material-symbols-outlined text-[1rem]">person_remove</span> Revoke Author Status
                    </button>
                  ) : (
                    <div className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface-variant/50 font-label uppercase tracking-[0.1em] text-[10px] font-bold py-3 text-center flex justify-center items-center gap-2">
                      <span className="material-symbols-outlined text-[1rem]">shield</span> Protected Admin
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default UserManagement;
