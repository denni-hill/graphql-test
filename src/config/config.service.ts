import dotenv from "dotenv";
import path from "path";

export class ConfigService {
  private static configFiles: string[] = [
    path.join(process.cwd(), ".env")
  ];

  private static conf: Record<string, string> = {};

  private static initialized: boolean = false;

  static get(key: string): string | undefined {
    return this.conf[key];
  }

  static provide(filePath: string) {
    this.configFiles.push(filePath);
  }

  static initialize() {
    if (this.initialized)
      throw new Error(
        "Config service is already initialized!"
      );

    this.configFiles.forEach((path) => {
      Object.assign(
        this.conf,
        dotenv.config({ path }).parsed
      );
    });

    this.initialized = true;
  }
}
