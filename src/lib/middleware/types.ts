
export type NextFunction = () => Promise<void>;

export interface MiddlewareContext {
  caseId?: string;
  agentType?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export type Middleware = (context: MiddlewareContext, next: NextFunction) => Promise<void>;

export interface MiddlewareStack {
  use(middleware: Middleware): void;
  execute(context: MiddlewareContext): Promise<void>;
}
