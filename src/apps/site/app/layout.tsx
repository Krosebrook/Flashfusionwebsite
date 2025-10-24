import type { Metadata } from 'next';
import './globals.css';
import Navigation from '../components/Navigation';

export const metadata: Metadata = {
  title: 'FlashFusion - AI-Powered Development Platform',
  description: 'Ship faster with AI. FlashFusion combines multi-agent orchestration, full-stack development tools, and intelligent automation.',
  keywords: ['AI development', 'multi-agent', 'code generation', 'automation', 'DevOps'],
  authors: [{ name: 'FlashFusion Team' }],
  openGraph: {
    title: 'FlashFusion - AI-Powered Development Platform',
    description: 'Ship faster with AI. Multi-agent orchestration and full-stack development tools.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFusion - AI-Powered Development Platform',
    description: 'Ship faster with AI. Multi-agent orchestration and full-stack development tools.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  
  return (
    <html lang="en">
      <head>
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  
                  // Check consent before loading analytics
                  if (localStorage.getItem('consent') === 'granted') {
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                      anonymize_ip: true,
                      cookie_flags: 'SameSite=None;Secure'
                    });
                  }
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}