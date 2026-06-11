import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Clear existing data ──────────────────────────────────
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.resetToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // ─── Passwords ────────────────────────────────────────────
  const managerPwd = await bcrypt.hash("Manager@123", 10);
  const adminPwd = await bcrypt.hash("Admin@123456", 10);
  const userPwd = await bcrypt.hash("User@123456", 10);

  // ─── Users ────────────────────────────────────────────────
  const managerNam = await prisma.user.create({
    data: {
      username: "manager_nam",
      email: "nam.manager@tlmarket.com",
      password: managerPwd,
      role: "MANAGER",
      status: "Active",
    },
  });

  const managerLinh = await prisma.user.create({
    data: {
      username: "manager_linh",
      email: "linh.manager@tlmarket.com",
      password: managerPwd,
      role: "MANAGER",
      status: "Active",
    },
  });

  const adminHoang = await prisma.user.create({
    data: {
      username: "admin_hoang",
      email: "hoang.admin@tlmarket.com",
      password: adminPwd,
      role: "ADMIN",
      status: "Active",
    },
  });

  const adminMai = await prisma.user.create({
    data: {
      username: "admin_mai",
      email: "mai.admin@tlmarket.com",
      password: adminPwd,
      role: "ADMIN",
      status: "Active",
    },
  });

  const userMinh = await prisma.user.create({
    data: {
      username: "user_minh",
      email: "minh@gmail.com",
      password: userPwd,
      role: "USER",
      status: "Active",
    },
  });

  const userTrang = await prisma.user.create({
    data: {
      username: "user_trang",
      email: "trang@gmail.com",
      password: userPwd,
      role: "USER",
      status: "Active",
    },
  });

  const userHung = await prisma.user.create({
    data: {
      username: "user_hung",
      email: "hung@gmail.com",
      password: userPwd,
      role: "USER",
      status: "Active",
    },
  });

  console.log("Users created");

  // ─── Shops (owned by Managers) ──────────────────────────
  const shopFashion = await prisma.shop.create({
    data: {
      shopName: "Nam's Fashion Store",
      description: "Chuyên thời trang nam cao cấp, hàng nhập khẩu chính hãng.",
      ownerId: managerNam.id,
    },
  });

  const shopBeauty = await prisma.shop.create({
    data: {
      shopName: "Linh Beauty & Skincare",
      description: "Mỹ phẩm và chăm sóc da chính hãng Hàn Quốc, Nhật Bản.",
      ownerId: managerLinh.id,
    },
  });

  const shopTech = await prisma.shop.create({
    data: {
      shopName: "TechZone Accessories",
      description: "Phụ kiện công nghệ, điện thoại, laptop giá tốt.",
      ownerId: managerNam.id,
    },
  });

  console.log("Shops created");

  // ─── Products & Variants ─────────────────────────────────

  // Shop 1 - Fashion
  await prisma.product.create({
    data: {
      productName: "Áo Polo Premium",
      description: "Áo polo cotton cao cấp, thoáng mát, phù hợp đi làm và đi chơi.",
      basePrice: 350000,
      visible: true,
      shopId: shopFashion.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "S - Trắng", extraPrice: 0, stock: 50 },
          { variantName: "M - Trắng", extraPrice: 0, stock: 80 },
          { variantName: "L - Trắng", extraPrice: 20000, stock: 60 },
          { variantName: "XL - Trắng", extraPrice: 30000, stock: 40 },
          { variantName: "S - Đen", extraPrice: 0, stock: 55 },
          { variantName: "M - Đen", extraPrice: 0, stock: 75 },
          { variantName: "L - Đen", extraPrice: 20000, stock: 45 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      productName: "Quần Jeans Slim Fit",
      description: "Quần jeans co giãn 4 chiều, dáng slim fit hiện đại.",
      basePrice: 550000,
      visible: true,
      shopId: shopFashion.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "29 - Xanh nhạt", extraPrice: 0, stock: 30 },
          { variantName: "30 - Xanh nhạt", extraPrice: 0, stock: 45 },
          { variantName: "31 - Xanh nhạt", extraPrice: 0, stock: 40 },
          { variantName: "32 - Xanh đậm", extraPrice: 0, stock: 35 },
          { variantName: "33 - Xanh đậm", extraPrice: 10000, stock: 20 },
          { variantName: "34 - Đen", extraPrice: 10000, stock: 25 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      productName: "Giày Sneaker Classic",
      description: "Giày thể thao cổ thấp, đế cao su chống trượt, thiết kế tối giản.",
      basePrice: 890000,
      visible: true,
      shopId: shopFashion.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "Size 39 - Trắng", extraPrice: 0, stock: 20 },
          { variantName: "Size 40 - Trắng", extraPrice: 0, stock: 30 },
          { variantName: "Size 41 - Trắng", extraPrice: 0, stock: 35 },
          { variantName: "Size 42 - Trắng", extraPrice: 0, stock: 25 },
          { variantName: "Size 40 - Đen", extraPrice: 0, stock: 28 },
          { variantName: "Size 41 - Đen", extraPrice: 0, stock: 30 },
          { variantName: "Size 42 - Đen", extraPrice: 0, stock: 22 },
          { variantName: "Size 43 - Đen", extraPrice: 20000, stock: 15 },
        ],
      },
    },
  });

  // Shop 2 - Beauty
  await prisma.product.create({
    data: {
      productName: "Kem Dưỡng Da COSRX",
      description: "Kem dưỡng ẩm snail mucin 92% dành cho da nhạy cảm, giúp phục hồi và làm sáng da.",
      basePrice: 320000,
      visible: true,
      shopId: shopBeauty.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "50ml", extraPrice: 0, stock: 100 },
          { variantName: "100ml", extraPrice: 150000, stock: 80 },
          { variantName: "200ml - Combo set", extraPrice: 350000, stock: 40 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      productName: "Serum Vitamin C Klairs",
      description: "Serum vitamin C 5% không kích ứng, làm đều màu da và chống oxy hóa.",
      basePrice: 480000,
      visible: true,
      shopId: shopBeauty.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "35ml - Standard", extraPrice: 0, stock: 60 },
          { variantName: "35ml - Jumbo", extraPrice: 200000, stock: 30 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      productName: "Son Môi 3CE Velvet",
      description: "Son lì nhung mịn, màu sắc đa dạng, bền màu cả ngày.",
      basePrice: 280000,
      visible: true,
      shopId: shopBeauty.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1586495777744-4e6232bf2e79?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1631214524020-3c69f3a4e4c1?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "#Nudist - Nude hồng", extraPrice: 0, stock: 70 },
          { variantName: "#Hype Me - Đỏ cam", extraPrice: 0, stock: 65 },
          { variantName: "#Dare Me - Đỏ đất", extraPrice: 0, stock: 55 },
          { variantName: "#Mellow Rose - Hồng đất", extraPrice: 0, stock: 50 },
          { variantName: "#Vintage Rose - Hồng cũ", extraPrice: 0, stock: 45 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      productName: "Toner Hada Labo",
      description: "Toner dưỡng ẩm Hyaluronic acid siêu cấp, không cồn, phù hợp mọi loại da.",
      basePrice: 195000,
      visible: true,
      shopId: shopBeauty.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "170ml - Lotion nhẹ", extraPrice: 0, stock: 120 },
          { variantName: "170ml - Lotion giàu ẩm", extraPrice: 15000, stock: 90 },
          { variantName: "400ml - Refill", extraPrice: 80000, stock: 50 },
        ],
      },
    },
  });

  // Shop 3 - Tech
  await prisma.product.create({
    data: {
      productName: "Tai Nghe Bluetooth Sony WH-1000XM5",
      description: "Tai nghe chống ồn chủ động hàng đầu, âm thanh Hi-Res, pin 30 giờ.",
      basePrice: 7990000,
      visible: true,
      shopId: shopTech.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "Đen - Chính hãng VN", extraPrice: 0, stock: 15 },
          { variantName: "Bạc - Chính hãng VN", extraPrice: 0, stock: 12 },
          { variantName: "Đen - Kèm case", extraPrice: 500000, stock: 8 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      productName: "Ốp Lưng iPhone MagSafe",
      description: "Ốp lưng trong suốt hỗ trợ MagSafe, chống sốc 4 góc, chống ố vàng.",
      basePrice: 150000,
      visible: true,
      shopId: shopTech.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "iPhone 14", extraPrice: 0, stock: 80 },
          { variantName: "iPhone 14 Pro", extraPrice: 0, stock: 75 },
          { variantName: "iPhone 14 Pro Max", extraPrice: 20000, stock: 60 },
          { variantName: "iPhone 15", extraPrice: 0, stock: 90 },
          { variantName: "iPhone 15 Pro", extraPrice: 0, stock: 85 },
          { variantName: "iPhone 15 Pro Max", extraPrice: 20000, stock: 70 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      productName: "Cáp Sạc Anker USB-C 100W",
      description: "Cáp sạc nhanh 100W, bọc dù chắc chắn, dài 1.8m, tương thích mọi thiết bị.",
      basePrice: 220000,
      visible: true,
      shopId: shopTech.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1615526675279-a3396f34a92e?w=400&q=80", isPrimary: false },
        ],
      },
      variants: {
        create: [
          { variantName: "0.9m - Đen", extraPrice: -50000, stock: 100 },
          { variantName: "1.8m - Đen", extraPrice: 0, stock: 120 },
          { variantName: "1.8m - Trắng", extraPrice: 0, stock: 95 },
          { variantName: "3m - Đen", extraPrice: 80000, stock: 40 },
        ],
      },
    },
  });

  console.log("Products & Variants created");

  // ─── Vouchers ─────────────────────────────────────────────
  await prisma.voucher.create({
    data: {
      code: "WELCOME10",
      description: "Giảm 10% cho đơn hàng đầu tiên, tối đa 50k",
      discountType: "PERCENT",
      discountValue: 10,
      maxDiscount: 50000,
      minOrderValue: 100000,
      usageLimit: 500,
      usageCount: 0,
      isActive: true,
      expiresAt: new Date("2027-12-31"),
    },
  });

  await prisma.voucher.create({
    data: {
      code: "FREESHIP",
      description: "Miễn phí vận chuyển cho đơn hàng từ 200k",
      discountType: "FIXED",
      discountValue: 30000,
      minOrderValue: 200000,
      usageLimit: 200,
      usageCount: 0,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    },
  });

  await prisma.voucher.create({
    data: {
      code: "SALE50",
      description: "Giảm 50% cho đơn hàng từ 500k, tối đa 100k",
      discountType: "PERCENT",
      discountValue: 50,
      maxDiscount: 100000,
      minOrderValue: 500000,
      usageLimit: 100,
      usageCount: 0,
      isActive: true,
      expiresAt: new Date("2026-09-30"),
    },
  });

  console.log("Vouchers created");
  console.log("Seed completed!");
  console.log("\nAccount list:");
  console.log("  MANAGER → manager_nam  / Manager@123");
  console.log("  MANAGER → manager_linh / Manager@123");
  console.log("  ADMIN   → admin_hoang  / Admin@123456");
  console.log("  ADMIN   → admin_mai    / Admin@123456");
  console.log("  USER    → user_minh    / User@123456");
  console.log("  USER    → user_trang   / User@123456");
  console.log("  USER    → user_hung    / User@123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
