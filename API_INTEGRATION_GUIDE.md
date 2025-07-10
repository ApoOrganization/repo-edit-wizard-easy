# API Integration Guide

This guide provides comprehensive patterns, best practices, and integration strategies for working with the application's Edge Functions and RPC calls.

## Table of Contents

1. [Integration Architecture](#1-integration-architecture)
2. [React Query Patterns](#2-react-query-patterns)
3. [Error Handling Strategies](#3-error-handling-strategies)
4. [Caching and Performance](#4-caching-and-performance)
5. [TypeScript Integration](#5-typescript-integration)
6. [Testing Patterns](#6-testing-patterns)
7. [Monitoring and Debugging](#7-monitoring-and-debugging)

---

## 1. Integration Architecture

### 1.1 Hook-Based Architecture

The application uses a consistent hook-based architecture for all API integrations:

```typescript
// Standard hook pattern
export const useEntityData = (
  entityId: string | undefined,
  options: QueryOptions = {}
) => {
  return useQuery<EntityResponse>({
    queryKey: ['entity-data', entityId, options],
    queryFn: async () => {
      // API call implementation
    },
    enabled: !!entityId,
    ...options
  });
};
```

### 1.2 Three-Tier Fallback System

All analytics hooks implement a three-tier fallback system:

```typescript
// Tier 1: Primary Edge Function
try {
  const { data, error } = await supabase.functions.invoke('primary-function', {
    body: parameters
  });
  
  if (error) throw error;
  return data;
} catch (primaryError) {
  // Tier 2: Fallback Edge Function
  try {
    const fallbackData = await supabase.functions.invoke('fallback-function', {
      body: parameters
    });
    return transformFallbackData(fallbackData);
  } catch (fallbackError) {
    // Tier 3: Basic Database Query
    const basicData = await supabase
      .from('basic_view')
      .select('*')
      .eq('id', entityId)
      .single();
    
    return transformBasicData(basicData);
  }
}
```

### 1.3 Separation of Concerns

```typescript
// hooks/useEntityAnalytics.ts - Data fetching
export const useEntityAnalytics = (id: string) => {
  return useQuery(/* ... */);
};

// utils/entityTransformers.ts - Data transformation
export const transformEntityData = (rawData: any): EntityAnalytics => {
  return {
    // transformation logic
  };
};

// components/EntityDashboard.tsx - UI logic
export const EntityDashboard: React.FC = () => {
  const { data, isLoading, error } = useEntityAnalytics(entityId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  
  return <EntityAnalyticsDisplay data={data} />;
};
```

---

## 2. React Query Patterns

### 2.1 Standard Query Configuration

```typescript
// hooks/useStandardQuery.ts
export const useStandardQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: Partial<UseQueryOptions<T>> = {}
) => {
  return useQuery<T>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => 
      Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    ...options
  });
};
```

### 2.2 Dependent Queries

```typescript
// Chain queries with proper dependencies
export const useEntityWithDetails = (entityId: string) => {
  // Primary entity data
  const { data: entity, isLoading: isEntityLoading } = useEntity(entityId);
  
  // Dependent queries
  const { data: analytics } = useEntityAnalytics(entityId, {
    enabled: !!entity
  });
  
  const { data: events } = useEntityEvents(entityId, {
    enabled: !!entity
  });
  
  return {
    entity,
    analytics,
    events,
    isLoading: isEntityLoading,
    hasAllData: !!(entity && analytics && events)
  };
};
```

### 2.3 Parallel Query Execution

```typescript
// Execute multiple independent queries in parallel
export const useDashboardData = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['market-analytics'],
        queryFn: () => supabase.functions.invoke('get-market-analytics')
      },
      {
        queryKey: ['top-promoters'],
        queryFn: () => supabase.functions.invoke('get-top-promoters')
      },
      {
        queryKey: ['venue-utilization'],
        queryFn: () => supabase.functions.invoke('get-venue-utilization')
      }
    ]
  });
  
  return {
    marketAnalytics: queries[0].data,
    topPromoters: queries[1].data,
    venueUtilization: queries[2].data,
    isLoading: queries.some(q => q.isLoading),
    hasError: queries.some(q => q.error)
  };
};
```

### 2.4 Lazy Loading Pattern

```typescript
// Tab-based lazy loading
export const useEntityTabs = (entityId: string) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: overview } = useEntityOverview(entityId);
  
  const { data: analytics } = useEntityAnalytics(entityId, {
    enabled: activeTab === 'analytics'
  });
  
  const { data: events } = useEntityEvents(entityId, {
    enabled: activeTab === 'events'
  });
  
  return {
    activeTab,
    setActiveTab,
    overview,
    analytics,
    events
  };
};
```

---

## 3. Error Handling Strategies

### 3.1 Comprehensive Error Types

```typescript
// types/errors.ts
export interface APIError {
  message: string;
  code?: string;
  status?: number;
  context?: any;
}

export interface EdgeFunctionError extends APIError {
  functionName: string;
  parameters: any;
}

export interface RPCError extends APIError {
  functionName: string;
  sqlState?: string;
}

export const isEdgeFunctionError = (error: any): error is EdgeFunctionError => {
  return error?.name === 'FunctionsFetchError';
};

export const isRPCError = (error: any): error is RPCError => {
  return error?.code && typeof error.code === 'string';
};
```

### 3.2 Error Boundary Pattern

```typescript
// components/ErrorBoundary.tsx
export const APIErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <pre>{error.message}</pre>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('API Error:', error);
        // Log to monitoring service
        logError(error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

### 3.3 Graceful Degradation

```typescript
// hooks/useEntityWithFallback.ts
export const useEntityWithFallback = (entityId: string) => {
  const { data, error, isLoading } = useEntityAnalytics(entityId);
  
  // Determine data source and adjust UI accordingly
  const dataSource = useMemo(() => {
    if (!data) return 'loading';
    if (error) return 'error';
    
    // Check for fallback indicators
    if (data.insights?.some(i => i.message.includes('temporarily unavailable'))) {
      return 'fallback';
    }
    
    return 'full';
  }, [data, error]);
  
  return {
    data,
    error,
    isLoading,
    dataSource,
    showLimitedUI: dataSource === 'fallback',
    showErrorUI: dataSource === 'error'
  };
};
```

### 3.4 Retry Strategies

```typescript
// utils/retryStrategies.ts
export const createRetryStrategy = (
  type: 'aggressive' | 'conservative' | 'minimal'
) => {
  const strategies = {
    aggressive: {
      retry: 5,
      retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 5000)
    },
    conservative: {
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    minimal: {
      retry: 1,
      retryDelay: 2000
    }
  };
  
  return strategies[type];
};
```

---

## 4. Caching and Performance

### 4.1 Cache Key Strategies

```typescript
// utils/cacheKeys.ts
export const cacheKeys = {
  // Static data (cache longer)
  artists: {
    list: (filters: ArtistFilters) => ['artists', 'list', filters],
    details: (id: string) => ['artists', 'details', id],
    all: () => ['artists'] as const
  },
  
  // Dynamic data (cache shorter)
  analytics: {
    market: () => ['analytics', 'market'],
    promoter: (id: string, timeRange: string) => 
      ['analytics', 'promoter', id, timeRange],
    venue: (id: string, timeRange: string) => 
      ['analytics', 'venue', id, timeRange]
  },
  
  // Real-time data (minimal cache)
  tickets: {
    event: (id: string) => ['tickets', 'event', id],
    sales: (id: string) => ['tickets', 'sales', id]
  }
};
```

### 4.2 Cache Invalidation

```typescript
// hooks/useCacheInvalidation.ts
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();
  
  const invalidateEntity = useCallback((entityType: string, entityId: string) => {
    queryClient.invalidateQueries({
      queryKey: [entityType, entityId]
    });
  }, [queryClient]);
  
  const invalidateAnalytics = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['analytics']
    });
  }, [queryClient]);
  
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);
  
  return {
    invalidateEntity,
    invalidateAnalytics,
    invalidateAll
  };
};
```

### 4.3 Background Refresh Patterns

```typescript
// hooks/useBackgroundRefresh.ts
export const useBackgroundRefresh = (
  queryKey: string[],
  interval: number = 5 * 60 * 1000 // 5 minutes
) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey });
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [queryClient, queryKey, interval]);
};
```

### 4.4 Optimistic Updates

```typescript
// hooks/useOptimisticUpdate.ts
export const useOptimisticUpdate = <T>(
  queryKey: string[],
  updateFn: (oldData: T, newData: Partial<T>) => T
) => {
  const queryClient = useQueryClient();
  
  const optimisticUpdate = useCallback((newData: Partial<T>) => {
    queryClient.setQueryData<T>(queryKey, (oldData) => {
      if (!oldData) return oldData;
      return updateFn(oldData, newData);
    });
  }, [queryClient, queryKey, updateFn]);
  
  return optimisticUpdate;
};
```

---

## 5. TypeScript Integration

### 5.1 Generic Hook Pattern

```typescript
// hooks/useGenericEntity.ts
export const useGenericEntity = <T extends BaseEntity>(
  entityType: string,
  entityId: string | undefined,
  transformer?: (data: any) => T
): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: [entityType, entityId],
    queryFn: async () => {
      if (!entityId) throw new Error(`${entityType} ID is required`);
      
      const { data, error } = await supabase.functions.invoke(
        `get-${entityType}-details`,
        { body: { [`${entityType}Id`]: entityId } }
      );
      
      if (error) throw error;
      
      return transformer ? transformer(data) : data;
    },
    enabled: !!entityId
  });
};
```

### 5.2 Type-Safe API Responses

```typescript
// types/apiResponses.ts
export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Type guards
export const isApiSuccess = <T>(result: ApiResult<T>): result is ApiResponse<T> => {
  return result.error === null;
};

export const isApiError = <T>(result: ApiResult<T>): result is ApiError => {
  return result.error !== null;
};
```

### 5.3 Discriminated Unions for Data States

```typescript
// types/dataStates.ts
export type DataState<T> = 
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }
  | { status: 'fallback'; data: T; limitation: string };

export const useDataState = <T>(
  query: UseQueryResult<T>
): DataState<T> => {
  if (query.isLoading) {
    return { status: 'loading' };
  }
  
  if (query.error) {
    return { status: 'error', error: query.error };
  }
  
  if (query.data) {
    // Check for fallback indicators
    const isFallback = checkFallbackIndicators(query.data);
    
    if (isFallback) {
      return { 
        status: 'fallback', 
        data: query.data, 
        limitation: 'Limited data available' 
      };
    }
    
    return { status: 'success', data: query.data };
  }
  
  return { status: 'loading' };
};
```

---

## 6. Testing Patterns

### 6.1 Mock Service Worker Setup

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Edge Function mocks
  rest.post('/functions/v1/get-market-analytics', (req, res, ctx) => {
    return res(
      ctx.json({
        totals: {
          revenue_realized: 1000000,
          remaining_revenue: 500000,
          total_potential_revenue: 1500000
        },
        timeseries: [
          { date: '2024-01-01', tickets_sold: 100, daily_revenue: 10000 }
        ]
      })
    );
  }),
  
  // RPC mocks
  rest.post('/rest/v1/rpc/get_promoter_calendar', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 'event-1',
          name: 'Test Event',
          date: '2024-06-15',
          venue_name: 'Test Venue'
        }
      ])
    );
  })
];
```

### 6.2 Hook Testing Utilities

```typescript
// tests/utils/hookTestUtils.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0
      }
    }
  });
};

export const renderHookWithQuery = <T>(
  hook: () => T,
  queryClient?: QueryClient
) => {
  const client = queryClient || createTestQueryClient();
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
  
  return renderHook(hook, { wrapper });
};
```

### 6.3 Integration Test Patterns

```typescript
// tests/integration/apiIntegration.test.ts
describe('API Integration', () => {
  it('should handle edge function success', async () => {
    const { result } = renderHookWithQuery(() => 
      useMarketAnalytics()
    );
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
    
    expect(result.current.data.totals.revenue_realized).toBe(1000000);
  });
  
  it('should handle edge function failure with fallback', async () => {
    // Mock failure
    server.use(
      rest.post('/functions/v1/get-market-analytics', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    const { result } = renderHookWithQuery(() => 
      useMarketAnalytics()
    );
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

---

## 7. Monitoring and Debugging

### 7.1 Logging Strategy

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  
  error: (message: string, error?: Error, meta?: any) => {
    console.error(`[ERROR] ${message}`, error, meta);
    // Send to monitoring service
    sendToMonitoring({ level: 'error', message, error, meta });
  },
  
  api: (type: 'request' | 'response' | 'error', data: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[API ${type.toUpperCase()}] ${timestamp}`, data);
  }
};
```

### 7.2 Performance Monitoring

```typescript
// hooks/usePerformanceMonitoring.ts
export const usePerformanceMonitoring = (queryKey: string[]) => {
  const startTime = useRef<number>();
  
  useEffect(() => {
    startTime.current = performance.now();
  }, []);
  
  const logPerformance = useCallback((phase: string, data?: any) => {
    const duration = performance.now() - (startTime.current || 0);
    
    logger.info(`Performance: ${queryKey.join('.')} - ${phase}`, {
      duration: `${duration.toFixed(2)}ms`,
      data
    });
  }, [queryKey]);
  
  return logPerformance;
};
```

### 7.3 Error Reporting

```typescript
// utils/errorReporting.ts
export const reportError = (error: Error, context: any) => {
  // Log locally
  logger.error(error.message, error, context);
  
  // Report to external service
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry, LogRocket, etc.
    window.errorReporter?.captureException(error, {
      tags: {
        component: context.component,
        function: context.function
      },
      extra: context
    });
  }
};
```

### 7.4 Debug Mode

```typescript
// hooks/useDebugMode.ts
export const useDebugMode = () => {
  const [isDebugMode, setIsDebugMode] = useState(
    localStorage.getItem('debug-mode') === 'true'
  );
  
  useEffect(() => {
    localStorage.setItem('debug-mode', isDebugMode.toString());
  }, [isDebugMode]);
  
  const debugLog = useCallback((message: string, data?: any) => {
    if (isDebugMode) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }, [isDebugMode]);
  
  return {
    isDebugMode,
    setIsDebugMode,
    debugLog
  };
};
```

---

## Best Practices Summary

### 1. **Consistent Patterns**
- Use the same hook structure across all API integrations
- Implement consistent error handling and fallback strategies
- Follow the same naming conventions for query keys

### 2. **Performance Optimization**
- Implement proper caching strategies based on data volatility
- Use lazy loading for non-critical data
- Implement background refresh for real-time data

### 3. **Error Resilience**
- Always provide fallback mechanisms
- Handle network failures gracefully
- Implement proper retry strategies with exponential backoff

### 4. **Type Safety**
- Use TypeScript throughout the API layer
- Implement proper type guards for runtime safety
- Use discriminated unions for complex state management

### 5. **Monitoring and Debugging**
- Implement comprehensive logging
- Monitor API performance and error rates
- Provide debug modes for development

### 6. **Testing**
- Mock all external dependencies
- Test both success and failure scenarios
- Implement integration tests for critical paths

This guide provides a comprehensive foundation for building robust, maintainable, and performant API integrations in the application.