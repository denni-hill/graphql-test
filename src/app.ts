import { ApolloServer } from "apollo-server";
import {
  Config,
  ExpressContext
} from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ConfigService } from "./config";
import { getDefaultDataSource } from "./datasources";
import resolvers from "./resolvers";

ConfigService.initialize();

export interface AppOptions {
  apollo?: Config<ExpressContext>;
  port: number;
}

export class App {
  constructor(private options?: AppOptions) {}

  private server: ApolloServer;

  async start() {
    await getDefaultDataSource().initialize();
    const schema = await buildSchema({ resolvers });
    this.server = new ApolloServer(
      Object.assign({}, this.options?.apollo, { schema })
    );

    const port = ConfigService.get("PORT") || 4000;

    await this.server.listen(port);
    console.log(`Apollo server started on port ${port}`);
  }

  async stop() {
    await this.server.stop();
    await getDefaultDataSource().destroy();
  }
}
