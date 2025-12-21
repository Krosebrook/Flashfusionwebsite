export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
          }}
        >
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
              fill="white"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <p 
          style={{
            color: 'var(--ff-text-secondary)',
            fontFamily: 'Sora, sans-serif',
            fontWeight: '600',
            fontSize: '0.875rem',
            letterSpacing: '0.05em'
          }}
        >
          Loading...
        </p>

        {/* Loading Bar */}
        <div 
          className="mt-4 mx-auto h-1 rounded-full overflow-hidden"
          style={{
            width: '200px',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div 
            className="h-full rounded-full animate-loading-bar"
            style={{
              background: 'linear-gradient(90deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
              width: '40%',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(500%);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
