# TODO - Multi-vendor e-commerce NestJS (Prisma/MySQL/JWT)

## Step 1: Prisma schema

- [ ] Replace `prisma/schema.prisma` with the full spec (datasource/mysql, generator, Role enum, User/Shop/Product/Variant models + relations)
- [ ] Run: `yarn prisma generate`
- [ ] Run: `yarn prisma migrate dev` (generate DB tables)

## Step 2: Backend bootstrapping

- [ ] Update `src/main.ts` CORS to use `FRONTEND_URL || http://localhost:3000`
- [ ] Ensure global ValidationPipe settings match spec

## Step 3: Prisma module/service

- [ ] Add `src/prisma/prisma.service.ts`
- [ ] Add `src/prisma/prisma.module.ts`

## Step 4: Common response format

- [ ] Implement a consistent response envelope `{ success, data, message }` across controllers

## Step 5: Auth + RBAC

- [ ] Implement `auth` module: register/login
- [ ] Implement JWT strategy + `JwtAuthGuard`
- [ ] Implement `RolesGuard` + `@Roles()` decorator + `roles.decorator`
- [ ] Implement `Users` admin endpoints (ADMIN only)

## Step 6: Ownership guard (MANAGER)

- [ ] Implement guard/service logic to ensure MANAGER can only manage products/shops where `ownerId === userId`

## Step 7: Shops

- [ ] Public: GET /shops, GET /shops/:id (include products)
- [ ] Protected: POST/PUT/DELETE for ADMIN+MANAGER (manager only own)

## Step 8: Products

- [ ] Public: GET /products, GET /products/:id (include variants)
- [ ] Protected: POST/PUT/DELETE for ADMIN+MANAGER (manager only products in own shop)

## Step 9: Variants

- [ ] Implement variants endpoints or integrate variant create/update during product create/update (per existing structure)

## Step 10: DTO validation

- [ ] Implement DTOs with class-validator + class-transformer as specified

## Step 11: App wiring

- [ ] Update `src/app.module.ts` to import all modules

## Step 12: Testing

- [ ] `yarn start:dev`
- [ ] Smoke test: register/login, role-protected routes, ownership enforcement
