import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { execSync } from "child_process";
import { ResponseInterceptor } from "./common/response.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  try {
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "inherit",
      timeout: 30000,
    });
  } catch {
    console.warn("prisma db push failed, continuing...");
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (
        !origin ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        origin === "http://localhost:3000"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Product API")
    .setDescription("API for managing products and variants")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

void bootstrap();
