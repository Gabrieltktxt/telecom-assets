import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Libera o CORS de forma agressiva para garantir que funcione na Vercel
  app.enableCors({
    origin: true, // Aceita qualquer origem (reflete a origem da requisição)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders:
      "Content-Type, Accept, Authorization, Origin, X-Requested-With",
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, "0.0.0.0");
  console.log(`🚀 API rodando na porta ${port}`);
}
bootstrap();
