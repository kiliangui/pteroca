import { Suspense } from 'react';
import SSORedirect from '@/components/SSORedirect';

interface SSORedirectPageProps {
  searchParams: {
    redirectPath?: string;
  };
}

export default async function SSORedirectPage({ searchParams }: SSORedirectPageProps) {

  const { redirectPath } = await searchParams;

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing SSO...</p>
        </div>
      </div>
    }>
      <SSORedirect redirectPath={redirectPath} />
    </Suspense>
  );
}