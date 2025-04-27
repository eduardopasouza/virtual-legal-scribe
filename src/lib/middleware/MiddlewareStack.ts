
import { Middleware, MiddlewareContext, MiddlewareStack } from './types';

export class MiddlewareStackImpl implements MiddlewareStack {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  async execute(context: MiddlewareContext): Promise<void> {
    const runner = async (index: number): Promise<void> => {
      if (index >= this.middlewares.length) return;

      await this.middlewares[index](context, () => runner(index + 1));
    };

    await runner(0);
  }
}
