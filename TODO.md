# TODO - Fix NestJS + Prisma build (lowercase model mapping)

- [ ] B1: Update `prisma/schema.prisma` — add `@@map("PascalCaseName")` to every model to keep Prisma client accessors PascalCase.
- [ ] Run `npx prisma generate` (no migrate).

- [ ] B2: Update `src/products/products.service.ts` — replace `variants` -> `variant` in `include` and `data` create.
- [ ] B3: Update `src/shops/shops.service.ts` — replace `owner: { connect: ... }` with `ownerId: ownerId`.
- [ ] B4: Update `src/cart/cart.service.ts` — ensure correct cartItem accessor and relation includes.
- [ ] B5: Update `src/orders/orders.service.ts` — replace `items` -> `orderItem` in include and create payload.
- [ ] Ensure transaction usage uses correct accessor names (e.g., `transaction.cartItem` if needed).
- [ ] B6: Check `src/auth/prisma-types.ts` and `src/auth/types.ts` — confirm Role enum import is correct.
- [ ] B7: Run `yarn build` to confirm no remaining TS/Prisma type errors.
