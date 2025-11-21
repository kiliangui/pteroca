'use client';

import { useEffect, useState } from 'react';

interface SSORedirectProps {
  redirectPath?: string;
}

export default function SSORedirect({ redirectPath }: SSORedirectProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSSOToken = async () => {
      try {
        const response = await fetch('/api/sso/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            redirectPath,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate SSO token');
        }

        const { token, redirectUrl, redirectPath: finalRedirectPath } = await response.json();

        console.log('SSO Form Data:', {
          token: token.substring(0, 20) + '...',
          redirectUrl,
          finalRedirectPath,
          tokenLength: token.length
        });

        // Create and submit form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = redirectUrl;
        form.style.display = 'none';

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'HostChicken_sso_token';
        tokenInput.value = token;
        form.appendChild(tokenInput);

        const redirectInput = document.createElement('input');
        redirectInput.type = 'hidden';
        redirectInput.name = 'HostChicken_sso_redirect';
        redirectInput.value = finalRedirectPath;
        form.appendChild(redirectInput);

        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'SSO failed');
        setIsLoading(false);
      }
    };

    generateSSOToken();
  }, [redirectPath]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">SSO Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Pterodactyl...</p>
      </div>
    </div>
  );
}