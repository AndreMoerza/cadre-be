import * as path from 'path';

export class AppUtils {
  static joinCwd(...paths: string[]): string {
    return path.join(process.cwd(), ...paths);
  }

  static getErrorStacks(exception: Error) {
    return (
      exception?.stack
        ?.split('\n')
        ?.slice(1)
        ?.map((x) => x?.trim()) || 'Unknown Stack'
    );
  }

  static formatLog(...args: any[]) {
    let err = '';
    const isJSON = (value: any) => {
      try {
        JSON.stringify(value);
        return true;
      } catch {
        return false;
      }
    };
    const isError = (value: any) => {
      return value instanceof Error;
    };

    (args || [])?.forEach((arg) => {
      if (isError(arg)) {
        err += `|| [ERROR] ${arg?.message} (${this.getErrorStacks?.(arg)?.[0]}, ${this.getErrorStacks?.(arg)?.[1]}, ${this.getErrorStacks?.(arg)?.[2]}) ||`;
      } else if (isJSON(arg)) {
        err += `||${JSON.stringify(arg)}||`;
      } else {
        err += `||${arg}||`;
      }
    });

    return err;
  }
}
