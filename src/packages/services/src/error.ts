interface FlashFusionError {
  type: string;
  message: string;
  details?: string;
  recoverable: boolean;
  code?: string;
  timestamp?: string;
}

export function useErrorService() {
  const handleError = (error: FlashFusionError) => {
    console.error('FlashFusion Error:', error);
    
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Send to error tracking
    }
  };

  const createError = (
    type: string, 
    message: string, 
    options: Partial<FlashFusionError> = {}
  ): FlashFusionError => {
    return {
      type,
      message,
      recoverable: true,
      timestamp: new Date().toISOString(),
      ...options
    };
  };

  return {
    handleError,
    createError
  };
}