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
  const users = await Promise.all([
    prisma.user.create({ data: { username: "manager_nam", email: "nam.manager@tlmarket.com", password: managerPwd, role: "MANAGER", status: "Active" } }),
    prisma.user.create({ data: { username: "manager_linh", email: "linh.manager@tlmarket.com", password: managerPwd, role: "MANAGER", status: "Active" } }),
    prisma.user.create({ data: { username: "admin_hoang", email: "hoang.admin@tlmarket.com", password: adminPwd, role: "ADMIN", status: "Active" } }),
    prisma.user.create({ data: { username: "admin_mai", email: "mai.admin@tlmarket.com", password: adminPwd, role: "ADMIN", status: "Active" } }),
    prisma.user.create({ data: { username: "user_minh", email: "minh@gmail.com", password: userPwd, role: "USER", status: "Active" } }),
    prisma.user.create({ data: { username: "user_trang", email: "trang@gmail.com", password: userPwd, role: "USER", status: "Active" } }),
    prisma.user.create({ data: { username: "user_hung", email: "hung@gmail.com", password: userPwd, role: "USER", status: "Active" } }),
  ]);
  const [managerNam, managerLinh] = users;
  console.log("Users created");

  // ─── Shops ────────────────────────────────────────────────
  const shops = await Promise.all([
    prisma.shop.create({ data: { shopName: "Nam's Fashion Store", description: "Chuyên thời trang nam cao cấp, hàng nhập khẩu chính hãng.", ownerId: managerNam.id } }),
    prisma.shop.create({ data: { shopName: "Linh Beauty & Skincare", description: "Mỹ phẩm và chăm sóc da chính hãng Hàn Quốc, Nhật Bản.", ownerId: managerLinh.id } }),
    prisma.shop.create({ data: { shopName: "TechZone Accessories", description: "Phụ kiện công nghệ, điện thoại, laptop giá tốt.", ownerId: managerNam.id } }),
    prisma.shop.create({ data: { shopName: "Home & Living TL", description: "Nội thất, trang trí nhà cửa, đồ dùng gia đình.", ownerId: managerLinh.id } }),
  ]);
  const [shopFashion, shopBeauty, shopTech, shopHome] = shops;
  console.log("Shops created");

  // ─── Product definitions ──────────────────────────────────
  const products = [
    // ===== Shop 1: Fashion (18 products) =====
    { shopId: shopFashion.id, name: "Áo Polo Premium", desc: "Áo polo cotton cao cấp, thoáng mát, phù hợp đi làm và đi chơi.", price: 350000, img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80", img2: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", visible: true, variants: [{ n: "S - Trắng", ep: 0, s: 50 }, { n: "M - Trắng", ep: 0, s: 80 }, { n: "L - Trắng", ep: 20000, s: 60 }, { n: "XL - Trắng", ep: 30000, s: 40 }, { n: "S - Đen", ep: 0, s: 55 }, { n: "M - Đen", ep: 0, s: 75 }, { n: "L - Đen", ep: 20000, s: 45 }] },
    { shopId: shopFashion.id, name: "Quần Jeans Slim Fit", desc: "Quần jeans co giãn 4 chiều, dáng slim fit hiện đại.", price: 550000, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", img2: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80", visible: true, variants: [{ n: "29 - Xanh nhạt", ep: 0, s: 30 }, { n: "30 - Xanh nhạt", ep: 0, s: 45 }, { n: "31 - Xanh nhạt", ep: 0, s: 40 }, { n: "32 - Xanh đậm", ep: 0, s: 35 }, { n: "33 - Xanh đậm", ep: 10000, s: 20 }, { n: "34 - Đen", ep: 10000, s: 25 }] },
    { shopId: shopFashion.id, name: "Giày Sneaker Classic", desc: "Giày thể thao cổ thấp, đế cao su chống trượt, thiết kế tối giản.", price: 890000, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", img2: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&q=80", visible: true, variants: [{ n: "Size 39 - Trắng", ep: 0, s: 20 }, { n: "Size 40 - Trắng", ep: 0, s: 30 }, { n: "Size 41 - Trắng", ep: 0, s: 35 }, { n: "Size 42 - Trắng", ep: 0, s: 25 }, { n: "Size 40 - Đen", ep: 0, s: 28 }, { n: "Size 41 - Đen", ep: 0, s: 30 }, { n: "Size 42 - Đen", ep: 0, s: 22 }, { n: "Size 43 - Đen", ep: 20000, s: 15 }] },
    { shopId: shopFashion.id, name: "Áo Thun Basic", desc: "Áo thun cotton 100%, form rộng thoải mái, nhiều màu sắc.", price: 159000, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80", img2: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80", visible: true, variants: [{ n: "S", ep: 0, s: 100 }, { n: "M", ep: 0, s: 150 }, { n: "L", ep: 0, s: 120 }, { n: "XL", ep: 10000, s: 80 }] },
    { shopId: shopFashion.id, name: "Quần Short Jean", desc: "Quần short jean nam, phong cách trẻ trung, năng động.", price: 299000, img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80", img2: "https://images.unsplash.com/photo-1565084888279-3b5bb1a4d6f6?w=400&q=80", visible: true, variants: [{ n: "S", ep: 0, s: 40 }, { n: "M", ep: 0, s: 60 }, { n: "L", ep: 0, s: 55 }, { n: "XL", ep: 10000, s: 30 }] },
    { shopId: shopFashion.id, name: "Áo Khoác Bomber", desc: "Áo khoác bomber thời trang, chất liệu dù chống thấm.", price: 650000, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", img2: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", visible: true, variants: [{ n: "M", ep: 0, s: 35 }, { n: "L", ep: 0, s: 45 }, { n: "XL", ep: 20000, s: 25 }] },
    { shopId: shopFashion.id, name: "Sơ Mi Trắng Công Sở", desc: "Sơ mi trắng classic, chất vải cao cấp, không nhăn.", price: 450000, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", img2: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80", visible: true, variants: [{ n: "S", ep: 0, s: 70 }, { n: "M", ep: 0, s: 90 }, { n: "L", ep: 0, s: 85 }, { n: "XL", ep: 15000, s: 40 }] },
    { shopId: shopFashion.id, name: "Quần Tây Âu", desc: "Quần tây nam cao cấp, ống slim, phù hợp đi làm.", price: 490000, img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80", img2: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", visible: true, variants: [{ n: "28", ep: 0, s: 25 }, { n: "29", ep: 0, s: 35 }, { n: "30", ep: 0, s: 40 }, { n: "31", ep: 0, s: 38 }, { n: "32", ep: 0, s: 30 }] },
    { shopId: shopFashion.id, name: "Áo Len Cashmere", desc: "Áo len cao cấp từ sợi cashmere mềm mại, ấm áp.", price: 890000, img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80", img2: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80", visible: true, variants: [{ n: "M", ep: 0, s: 20 }, { n: "L", ep: 0, s: 30 }, { n: "XL", ep: 50000, s: 15 }] },
    { shopId: shopFashion.id, name: "Váy Liền Công Sở", desc: "Váy A-line thanh lịch, form chuẩn cho phái đẹp công sở.", price: 520000, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", img2: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80", visible: true, variants: [{ n: "S", ep: 0, s: 30 }, { n: "M", ep: 0, s: 45 }, { n: "L", ep: 0, s: 35 }, { n: "XL", ep: 10000, s: 15 }] },
    { shopId: shopFashion.id, name: "Quần Jogger Nỉ", desc: "Quần jogger chất nỉ bông ấm áp, co giãn tốt.", price: 320000, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80", img2: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80", visible: true, variants: [{ n: "S", ep: 0, s: 50 }, { n: "M", ep: 0, s: 70 }, { n: "L", ep: 0, s: 60 }, { n: "XL", ep: 0, s: 40 }] },
    { shopId: shopFashion.id, name: "Áo Gió Chống Nắng", desc: "Áo gió mỏng nhẹ, chống nắng, gấp gọn tiện lợi.", price: 199000, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", img2: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", visible: true, variants: [{ n: "M", ep: 0, s: 80 }, { n: "L", ep: 0, s: 100 }, { n: "XL", ep: 10000, s: 60 }] },
    { shopId: shopFashion.id, name: "Giày Tây Da Bò", desc: "Giày tây da bò thật, đế cao su bền bỉ.", price: 1200000, img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80", img2: "https://images.unsplash.com/photo-1614252235316-8c8573833efc?w=400&q=80", visible: true, variants: [{ n: "39", ep: 0, s: 15 }, { n: "40", ep: 0, s: 25 }, { n: "41", ep: 0, s: 30 }, { n: "42", ep: 0, s: 28 }, { n: "43", ep: 0, s: 10 }] },
    { shopId: shopFashion.id, name: "Balo Laptop", desc: "Balo chống sốc chuyên dụng cho laptop 15.6 inch.", price: 450000, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", img2: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80", visible: true, variants: [{ n: "Xám", ep: 0, s: 35 }, { n: "Đen", ep: 0, s: 50 }, { n: "Xanh dương", ep: 0, s: 25 }] },
    { shopId: shopFashion.id, name: "Thắt Lưng Da Cao Cấp", desc: "Thắt lưng da bò thật, khóa inox sáng bóng.", price: 280000, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", img2: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80", visible: true, variants: [{ n: "90cm", ep: 0, s: 0 }, { n: "95cm", ep: 0, s: 0 }, { n: "100cm", ep: 10000, s: 40 }] },
    { shopId: shopFashion.id, name: "Đồng Hồ Nam Cơ", desc: "Đồng hồ cơ Nhật Bản, mặt kính sapphire, chống nước.", price: 2500000, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80", img2: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&q=80", visible: true, variants: [{ n: "Dây da đen", ep: 0, s: 10 }, { n: "Dây thép bạc", ep: 200000, s: 8 }, { n: "Dây da nâu", ep: 0, s: 5 }] },
    { shopId: shopFashion.id, name: "Khăn Quàng Cổ", desc: "Khăn quàng cổ dệt kim len pha cashmere.", price: 199000, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80", img2: "https://images.unsplash.com/photo-1605899330790-7b3283bc25c8?w=400&q=80", visible: false, variants: [{ n: "Be", ep: 0, s: 40 }, { n: "Xám", ep: 0, s: 35 }, { n: "Đen", ep: 0, s: 30 }] },
    { shopId: shopFashion.id, name: "Tất Nam Cổ Dài", desc: "Tất nam cổ dài chất cotton, đệm gót êm.", price: 50000, img: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&q=80", img2: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80", visible: true, variants: [{ n: "Đen - Hộp 5 đôi", ep: 0, s: 200 }, { n: "Trắng - Hộp 5 đôi", ep: 0, s: 180 }] },

    // ===== Shop 2: Beauty (16 products) =====
    { shopId: shopBeauty.id, name: "Kem Dưỡng Da COSRX", desc: "Kem dưỡng ẩm snail mucin 92% phục hồi da nhạy cảm.", price: 320000, img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80", img2: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80", visible: true, variants: [{ n: "50ml", ep: 0, s: 100 }, { n: "100ml", ep: 150000, s: 80 }, { n: "200ml - Combo set", ep: 350000, s: 40 }] },
    { shopId: shopBeauty.id, name: "Serum Vitamin C Klairs", desc: "Serum vitamin C 5%, làm đều màu da, chống oxy hóa.", price: 480000, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", img2: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80", visible: true, variants: [{ n: "35ml - Standard", ep: 0, s: 60 }, { n: "35ml - Jumbo", ep: 200000, s: 30 }] },
    { shopId: shopBeauty.id, name: "Son Môi 3CE Velvet", desc: "Son lì nhung mịn, bền màu cả ngày.", price: 280000, img: "https://images.unsplash.com/photo-1586495777744-4e6232bf2e79?w=400&q=80", img2: "https://images.unsplash.com/photo-1631214524020-3c69f3a4e4c1?w=400&q=80", visible: true, variants: [{ n: "#Nudist", ep: 0, s: 70 }, { n: "#Hype Me", ep: 0, s: 65 }, { n: "#Dare Me", ep: 0, s: 55 }, { n: "#Mellow Rose", ep: 0, s: 50 }, { n: "#Vintage Rose", ep: 0, s: 45 }] },
    { shopId: shopBeauty.id, name: "Toner Hada Labo", desc: "Toner dưỡng ẩm HA siêu cấp, không cồn.", price: 195000, img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80", img2: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80", visible: true, variants: [{ n: "170ml - Lotion nhẹ", ep: 0, s: 120 }, { n: "170ml - Giàu ẩm", ep: 15000, s: 90 }, { n: "400ml - Refill", ep: 80000, s: 50 }] },
    { shopId: shopBeauty.id, name: "Sữa Rửa Mặt La Roche", desc: "Sữa rửa mặt dịu nhẹ cho da nhạy cảm.", price: 350000, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80", img2: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80", visible: true, variants: [{ n: "200ml", ep: 0, s: 75 }, { n: "400ml", ep: 200000, s: 45 }] },
    { shopId: shopBeauty.id, name: "Kem Chống Nắng Anessa", desc: "Kem chống nắng Nhật Bản, SPF50+ PA++++ chống nước.", price: 420000, img: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=400&q=80", img2: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=400&q=80", visible: true, variants: [{ n: "60ml", ep: 0, s: 60 }, { n: "90ml - Family", ep: 150000, s: 30 }] },
    { shopId: shopBeauty.id, name: "Mặt Nạ Giấy Innisfree", desc: "Mặt nạ giấy dưỡng ẩm từ thiên nhiên Hàn Quốc.", price: 25000, img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80", img2: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80", visible: true, variants: [{ n: "Trà xanh (miếng)", ep: 0, s: 300 }, { n: "Mật ong (miếng)", ep: 0, s: 250 }, { n: "Hyaluronic (miếng)", ep: 0, s: 200 }] },
    { shopId: shopBeauty.id, name: "Tinh Chất Tre AHA/BHA", desc: "Tinh chất tre đặc trị mụn, se khít lỗ chân lông.", price: 390000, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", img2: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80", visible: true, variants: [{ n: "100ml", ep: 0, s: 40 }, { n: "200ml", ep: 200000, s: 25 }] },
    { shopId: shopBeauty.id, name: "Dầu Gội Kerastase", desc: "Dầu gội cao cấp phục hồi tóc hư tổn.", price: 550000, img: "https://images.unsplash.com/photo-1631214524020-3c69f3a4e4c1?w=400&q=80", img2: "https://images.unsplash.com/photo-1586495777744-4e6232bf2e79?w=400&q=80", visible: true, variants: [{ n: "250ml", ep: 0, s: 30 }, { n: "500ml", ep: 300000, s: 20 }, { n: "1000ml", ep: 700000, s: 10 }] },
    { shopId: shopBeauty.id, name: "Nước Tẩy Trang Bioderma", desc: "Nước tẩy trang micellar dịu nhẹ, không cần rửa lại.", price: 350000, img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80", img2: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80", visible: true, variants: [{ n: "100ml", ep: 0, s: 60 }, { n: "250ml", ep: 80000, s: 80 }, { n: "500ml", ep: 200000, s: 50 }] },
    { shopId: shopBeauty.id, name: "Phấn Nước Hera Black", desc: "Phủ siêu mịn, che khuyết điểm hoàn hảo.", price: 680000, img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", img2: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80", visible: true, variants: [{ n: "21N1 - Sáng", ep: 0, s: 20 }, { n: "23N1 - Tự nhiên", ep: 0, s: 35 }, { n: "25N1 - Vừa", ep: 0, s: 15 }] },
    { shopId: shopBeauty.id, name: "Kem Mắt The Ordinary", desc: "Kem mắt caffeine 5% giảm bọng mắt, quầng thâm.", price: 250000, img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80", img2: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80", visible: true, variants: [{ n: "30ml", ep: 0, s: 45 }, { n: "60ml", ep: 100000, s: 25 }] },
    { shopId: shopBeauty.id, name: "Xịt Dưỡng Tóc", desc: "Xịt dưỡng tóc không xả, chống rối, bóng mượt.", price: 180000, img: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80", img2: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", visible: true, variants: [{ n: "150ml", ep: 0, s: 90 }, { n: "300ml", ep: 80000, s: 50 }] },
    { shopId: shopBeauty.id, name: "Sáp Vuốt Tóc", desc: "Sáp vuốt tóc giữ nếp lâu, không bóng dầu.", price: 120000, img: "https://images.unsplash.com/photo-1586495777744-4e6232bf2e79?w=400&q=80", img2: "https://images.unsplash.com/photo-1631214524020-3c69f3a4e4c1?w=400&q=80", visible: true, variants: [{ n: "70g - Giữ nếp nhẹ", ep: 0, s: 60 }, { n: "70g - Cứng", ep: 10000, s: 45 }, { n: "150g - Professional", ep: 40000, s: 20 }] },
    { shopId: shopBeauty.id, name: "Lăn Khử Mùi Nam", desc: "Lăn khử mùi nam, khô thoáng 48h.", price: 99000, img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80", img2: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80", visible: true, variants: [{ n: "50ml", ep: 0, s: 120 }, { n: "100ml", ep: 30000, s: 80 }] },
    { shopId: shopBeauty.id, name: "Nước Hoa Nam EDT", desc: "Nước hoa nam hương gỗ phương đông, lưu hương 6-8h.", price: 890000, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80", img2: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80", visible: false, variants: [{ n: "50ml", ep: 0, s: 8 }, { n: "100ml", ep: 400000, s: 5 }] },

    // ===== Shop 3: Tech (16 products) =====
    { shopId: shopTech.id, name: "Tai Nghe Sony WH-1000XM5", desc: "Chống ồn chủ động, âm thanh Hi-Res, pin 30h.", price: 7990000, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", img2: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", visible: true, variants: [{ n: "Đen - Chính hãng VN", ep: 0, s: 15 }, { n: "Bạc - Chính hãng VN", ep: 0, s: 12 }, { n: "Đen - Kèm case", ep: 500000, s: 8 }] },
    { shopId: shopTech.id, name: "Ốp Lưng iPhone MagSafe", desc: "Ốp lưng trong suốt, chống sốc, hỗ trợ MagSafe.", price: 150000, img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80", img2: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80", visible: true, variants: [{ n: "iPhone 14", ep: 0, s: 80 }, { n: "iPhone 14 Pro", ep: 0, s: 75 }, { n: "iPhone 14 Pro Max", ep: 20000, s: 60 }, { n: "iPhone 15", ep: 0, s: 90 }, { n: "iPhone 15 Pro", ep: 0, s: 85 }, { n: "iPhone 15 Pro Max", ep: 20000, s: 70 }] },
    { shopId: shopTech.id, name: "Cáp Anker USB-C 100W", desc: "Cáp sạc nhanh 100W, bọc dù, dài 1.8m.", price: 220000, img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80", img2: "https://images.unsplash.com/photo-1615526675279-a3396f34a92e?w=400&q=80", visible: true, variants: [{ n: "0.9m - Đen", ep: -50000, s: 100 }, { n: "1.8m - Đen", ep: 0, s: 120 }, { n: "1.8m - Trắng", ep: 0, s: 95 }, { n: "3m - Đen", ep: 80000, s: 40 }] },
    { shopId: shopTech.id, name: "Sạc Dự Phòng 20000mAh", desc: "Pin dự phòng PD 65W, sạc được laptop.", price: 1200000, img: "https://images.unsplash.com/photo-1609592424823-5e160627714e?w=400&q=80", img2: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80", visible: true, variants: [{ n: "20000mAh - Đen", ep: 0, s: 30 }, { n: "20000mAh - Trắng", ep: 0, s: 20 }, { n: "30000mAh - Đen", ep: 400000, s: 10 }] },
    { shopId: shopTech.id, name: "Bàn Phím Cơ Keychron", desc: "Bàn phím cơ không dây hot-swappable, RGB.", price: 2500000, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", img2: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80", visible: true, variants: [{ n: "K2 - 84 key - Đen", ep: 0, s: 10 }, { n: "K4 - 96 key - Trắng", ep: 200000, s: 8 }, { n: "K8 - 87 key - Xám", ep: 100000, s: 5 }] },
    { shopId: shopTech.id, name: "Chuột Logitech MX Master 3S", desc: "Chuột không dây ergonomic, sensor 8K DPI.", price: 1890000, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80", img2: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80", visible: true, variants: [{ n: "Graphite", ep: 0, s: 12 }, { n: "Pale Grey", ep: 0, s: 8 }] },
    { shopId: shopTech.id, name: "Webcam Logitech C920", desc: "Webcam HD 1080p, micro kép, tự động căn chỉnh.", price: 1200000, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", img2: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80", visible: true, variants: [{ n: "C920 - Full HD", ep: 0, s: 18 }, { n: "C922 - Stream", ep: 400000, s: 7 }] },
    { shopId: shopTech.id, name: "Loa Bluetooth JBL Flip 6", desc: "Loa bluetooth chống nước, âm bass mạnh, pin 12h.", price: 2990000, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", img2: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&q=80", visible: true, variants: [{ n: "Đen", ep: 0, s: 25 }, { n: "Xanh dương", ep: 0, s: 20 }, { n: "Đỏ", ep: 0, s: 10 }] },
    { shopId: shopTech.id, name: "Màn Hình Dell 27\" 4K", desc: "Màn hình 27 inch IPS 4K, 95% DCI-P3.", price: 7990000, img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=400&q=80", img2: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&q=80", visible: true, variants: [{ n: "27\" - 4K - Chuẩn", ep: 0, s: 5 }, { n: "27\" - 4K - Cao cấp", ep: 2000000, s: 3 }] },
    { shopId: shopTech.id, name: "Hub USB-C 7-in-1", desc: "Hub đa năng, HDMI 4K, USB 3.0, SD, PD 100W.", price: 650000, img: "https://images.unsplash.com/photo-1615526675279-a3396f34a92e?w=400&q=80", img2: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80", visible: true, variants: [{ n: "Xám", ep: 0, s: 35 }, { n: "Bạc", ep: 0, s: 30 }] },
    { shopId: shopTech.id, name: "Giá Đỡ Laptop", desc: "Giá đỡ laptop nhôm tản nhiệt, gập gọn.", price: 350000, img: "https://images.unsplash.com/photo-1629429407759-7428e1d58231?w=400&q=80", img2: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80", visible: true, variants: [{ n: "Nhôm bạc", ep: 0, s: 50 }, { n: "Nhôm đen", ep: 0, s: 40 }] },
    { shopId: shopTech.id, name: "Đồng Hồ Thông Minh", desc: "Smart watch theo dõi sức khỏe, GPS, SpO2.", price: 1500000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", img2: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80", visible: true, variants: [{ n: "42mm - Đen", ep: 0, s: 15 }, { n: "46mm - Bạc", ep: 200000, s: 10 }] },
    { shopId: shopTech.id, name: "Ổ Cứng SSD Samsung 1TB", desc: "SSD NVMe M.2, tốc độ đọc 7000MB/s.", price: 2990000, img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400&q=80", img2: "https://images.unsplash.com/photo-1609592424823-5e160627714e?w=400&q=80", visible: true, variants: [{ n: "1TB", ep: 0, s: 0 }, { n: "2TB", ep: 1500000, s: 5 }] },
    { shopId: shopTech.id, name: "Camera IP 2K", desc: "Camera an ninh trong nhà, xoay 360°, hồng ngoại.", price: 600000, img: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&q=80", img2: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=400&q=80", visible: true, variants: [{ n: "Trong nhà - WiFi", ep: 0, s: 25 }, { n: "Ngoài trời - Chống nước", ep: 300000, s: 10 }] },
    { shopId: shopTech.id, name: "Đèn LED Học Tập", desc: "Đèn bàn LED mắt, chống cận, chớp, 3 chế độ.", price: 450000, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", img2: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", visible: true, variants: [{ n: "Cổ điển", ep: 0, s: 40 }, { n: "Hiện đại - Cảm ứng", ep: 100000, s: 25 }] },
    { shopId: shopTech.id, name: "Miếng Dán Màn Hình", desc: "Kính cường lực chống chói cho điện thoại.", price: 120000, img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80", img2: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80", visible: false, variants: [{ n: "Samsung S24", ep: 0, s: 50 }, { n: "iPhone 15", ep: 0, s: 60 }, { n: "iPhone 15 Pro", ep: 10000, s: 45 }] },

    // ===== Shop 4: Home & Living (12 products) =====
    { shopId: shopHome.id, name: "Đèn Bàn Nordic", desc: "Đèn bàn phong cách Bắc Âu, ánh sáng vàng ấm.", price: 680000, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", img2: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", visible: true, variants: [{ n: "Trắng", ep: 0, s: 20 }, { n: "Đen", ep: 50000, s: 15 }] },
    { shopId: shopHome.id, name: "Bộ Chén Đĩa Sứ", desc: "Bộ chén đĩa sứ trắng cao cấp 12 món.", price: 550000, img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", img2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", visible: true, variants: [{ n: "Trắng kem", ep: 0, s: 25 }, { n: "Xanh nhạt", ep: 50000, s: 15 }] },
    { shopId: shopHome.id, name: "Gối Tựa Lưng", desc: "Gối tựa lưng văn phòng, mút hoạt tính cao cấp.", price: 380000, img: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80", img2: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80", visible: true, variants: [{ n: "Xám", ep: 0, s: 35 }, { n: "Xanh navy", ep: 0, s: 25 }] },
    { shopId: shopHome.id, name: "Rèm Cửa Sổ", desc: "Rèm vải linen, chống nắng 70%, nhiều kích thước.", price: 420000, img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80", img2: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80", visible: true, variants: [{ n: "140x200cm - Kem", ep: 0, s: 10 }, { n: "140x200cm - Xám", ep: 0, s: 15 }, { n: "200x250cm - Kem", ep: 100000, s: 8 }] },
    { shopId: shopHome.id, name: "Thảm Trải Sàn", desc: "Thảm lông ngắn cao cấp, chống trơn, dễ vệ sinh.", price: 980000, img: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80", img2: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80", visible: true, variants: [{ n: "120x160cm - Be", ep: 0, s: 12 }, { n: "160x230cm - Be", ep: 300000, s: 8 }, { n: "120x160cm - Xám", ep: 0, s: 10 }] },
    { shopId: shopHome.id, name: "Kệ Sách Mini", desc: "Kệ sách gỗ công nghiệp, lắp ráp dễ dàng.", price: 520000, img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", img2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", visible: true, variants: [{ n: "3 tầng - Trắng", ep: 0, s: 18 }, { n: "3 tầng - Nâu", ep: 0, s: 12 }, { n: "5 tầng - Trắng", ep: 200000, s: 8 }] },
    { shopId: shopHome.id, name: "Móc Treo Quần Áo", desc: "Bộ móc treo inox chống gỉ, 10 cái.", price: 89000, img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80", img2: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80", visible: true, variants: [{ n: "Bạc 10 cái", ep: 0, s: 100 }, { n: "Vàng 10 cái", ep: 20000, s: 60 }] },
    { shopId: shopHome.id, name: "Hộp Đựng Đồ Đa Năng", desc: "Hộp nhựa trong suốt có nắp, xếp chồng được.", price: 150000, img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", img2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", visible: true, variants: [{ n: "5L", ep: 0, s: 50 }, { n: "12L", ep: 30000, s: 40 }, { n: "25L", ep: 60000, s: 20 }] },
    { shopId: shopHome.id, name: "Khung Ảnh Decor", desc: "Khung ảnh gỗ tự nhiên lịch sự.", price: 190000, img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", img2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", visible: true, variants: [{ n: "10x15cm", ep: 0, s: 40 }, { n: "20x30cm", ep: 50000, s: 30 }, { n: "30x45cm", ep: 100000, s: 15 }] },
    { shopId: shopHome.id, name: "Bộ Ly Rượu Vang", desc: "Bộ 6 ly rượu vang pha lê cao cấp.", price: 450000, img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", img2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", visible: false, variants: [{ n: "Bộ 6 ly 350ml", ep: 0, s: 10 }, { n: "Bộ 6 ly 500ml", ep: 100000, s: 5 }] },
    { shopId: shopHome.id, name: "Đèn Ngủ LED", desc: "Đèn ngủ LED đổi màu, điều khiển từ xa.", price: 250000, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", img2: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", visible: true, variants: [{ n: "Tròn trắng", ep: 0, s: 30 }, { n: "Vuông gỗ", ep: 50000, s: 15 }] },
    { shopId: shopHome.id, name: "Cây Cảnh Mini", desc: "Cây kim tiền mini trong chậu sứ trang trí bàn.", price: 180000, img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80", img2: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80", visible: true, variants: [{ n: "Kim tiền - Chậu trắng", ep: 0, s: 25 }, { n: "Lưỡi hổ - Chậu đen", ep: 20000, s: 20 }, { n: "Sen đá - Chậu terrazzo", ep: 40000, s: 15 }] },
  ];

  // ─── Create products ──────────────────────────────────────
  for (const p of products) {
    await prisma.product.create({
      data: {
        productName: p.name,
        description: p.desc,
        basePrice: p.price,
        visible: p.visible,
        shopId: p.shopId,
        images: {
          create: [
            { url: p.img, isPrimary: true },
            { url: p.img2, isPrimary: false },
          ],
        },
        variants: {
          create: p.variants.map(v => ({
            variantName: v.n,
            extraPrice: v.ep,
            stock: v.s,
          })),
        },
      },
    });
  }

  console.log(`Products & Variants created (${products.length} products)`);

  // ─── Vouchers ─────────────────────────────────────────────
  await prisma.voucher.create({ data: { code: "WELCOME10", description: "Giảm 10% đơn đầu tiên, tối đa 50k", discountType: "PERCENT", discountValue: 10, maxDiscount: 50000, minOrderValue: 100000, usageLimit: 500, usageCount: 0, isActive: true, expiresAt: new Date("2027-12-31") } });
  await prisma.voucher.create({ data: { code: "FREESHIP", description: "Miễn phí vận chuyển đơn từ 200k", discountType: "FIXED", discountValue: 30000, minOrderValue: 200000, usageLimit: 200, usageCount: 0, isActive: true, expiresAt: new Date("2026-12-31") } });
  await prisma.voucher.create({ data: { code: "SALE50", description: "Giảm 50% đơn từ 500k, tối đa 100k", discountType: "PERCENT", discountValue: 50, maxDiscount: 100000, minOrderValue: 500000, usageLimit: 100, usageCount: 0, isActive: true, expiresAt: new Date("2026-09-30") } });
  await prisma.voucher.create({ data: { code: "SUMMER25", description: "Giảm 25% mùa hè, tối đa 80k", discountType: "PERCENT", discountValue: 25, maxDiscount: 80000, minOrderValue: 200000, usageLimit: 300, usageCount: 0, isActive: true, expiresAt: new Date("2026-08-31") } });
  await prisma.voucher.create({ data: { code: "PAYDAY100", description: "Giảm 100k ngày lương", discountType: "FIXED", discountValue: 100000, minOrderValue: 500000, usageLimit: 150, usageCount: 0, isActive: true, expiresAt: new Date("2026-07-31") } });
  console.log("Vouchers created");

  console.log("Seed completed!");
  console.log(`\n📊 Total: ${products.length} products, 4 shops, 7 users`);
  console.log("\n📋 Account list:");
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
