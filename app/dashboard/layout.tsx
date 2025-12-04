"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation'
import { useAuth } from '@/lib/auth-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No user logged in, redirect to login
        router.push('/login');
      } else if (!profile) {
        // User logged in but no profile, redirect to setup
        router.push('/setup-profile');
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  const userRole = profile.role as 'client' | 'coach' | 'doctor' | 'admin';

  return (
    <div className="flex">
      <Navigation role={userRole} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
