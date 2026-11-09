import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const menCategory = await prisma.category.create({
    data: { name: 'Men', slug: 'men' },
  });
  const womenCategory = await prisma.category.create({
    data: { name: 'Women', slug: 'women' },
  });
  const accessoriesCategory = await prisma.category.create({
    data: { name: 'Accessories', slug: 'accessories' },
  });

  console.log('✅ Categories created');

  // Create users
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const customerPassword = await bcrypt.hash('Customer123!', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@store.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: customerPassword,
      name: 'John Doe',
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: customerPassword,
      name: 'Jane Smith',
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Users created');

  // Products data
  const productsData = [
    {
      name: 'Classic White Tee',
      slug: 'classic-white-tee',
      description: 'A timeless white t-shirt made from 100% organic cotton. Perfect for everyday wear with a relaxed fit and soft feel.',
      price: 29.99,
      categoryId: menCategory.id,
      featured: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Gray'],
    },
    {
      name: 'Slim Fit Chinos',
      slug: 'slim-fit-chinos',
      description: 'Modern slim fit chinos crafted from premium stretch cotton. Versatile enough for the office or weekend outings.',
      price: 79.99,
      categoryId: menCategory.id,
      featured: true,
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Khaki', 'Navy', 'Olive'],
    },
    {
      name: 'Merino Wool Sweater',
      slug: 'merino-wool-sweater',
      description: 'Luxuriously soft merino wool sweater. Temperature-regulating and naturally odor-resistant for all-day comfort.',
      price: 129.99,
      categoryId: menCategory.id,
      featured: false,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Cream', 'Charcoal', 'Burgundy'],
    },
    {
      name: 'Floral Wrap Dress',
      slug: 'floral-wrap-dress',
      description: 'Elegant floral wrap dress with a flattering silhouette. Lightweight fabric perfect for warm weather and special occasions.',
      price: 89.99,
      categoryId: womenCategory.id,
      featured: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue Floral', 'Pink Floral', 'Green Floral'],
    },
    {
      name: 'High-Waist Trousers',
      slug: 'high-waist-trousers',
      description: 'Sophisticated high-waist trousers with a straight leg cut. Made from premium woven fabric with a polished finish.',
      price: 95.99,
      categoryId: womenCategory.id,
      featured: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Camel', 'White'],
    },
    {
      name: 'Cashmere Turtleneck',
      slug: 'cashmere-turtleneck',
      description: 'Ultra-soft cashmere turtleneck sweater. A wardrobe essential that elevates any outfit with timeless elegance.',
      price: 189.99,
      categoryId: womenCategory.id,
      featured: false,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Ivory', 'Dusty Rose', 'Sage'],
    },
    {
      name: 'Linen Blazer',
      slug: 'linen-blazer',
      description: 'Relaxed linen blazer perfect for warm weather. Unlined and unstructured for effortless style.',
      price: 149.99,
      categoryId: womenCategory.id,
      featured: false,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Ecru', 'Slate Blue'],
    },
    {
      name: 'Leather Tote Bag',
      slug: 'leather-tote-bag',
      description: 'Spacious genuine leather tote bag with interior pockets. The perfect everyday bag for work and beyond.',
      price: 219.99,
      categoryId: accessoriesCategory.id,
      featured: true,
      sizes: ['One Size'],
      colors: ['Tan', 'Black', 'Cognac'],
    },
    {
      name: 'Classic Leather Belt',
      slug: 'classic-leather-belt',
      description: 'Full-grain leather belt with a polished silver buckle. A foundational accessory for any wardrobe.',
      price: 59.99,
      categoryId: accessoriesCategory.id,
      featured: false,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Brown'],
    },
    {
      name: 'Silk Scarf',
      slug: 'silk-scarf',
      description: 'Luxurious 100% silk scarf with an artistic print. Wear as a neck scarf, hair accessory, or bag charm.',
      price: 79.99,
      categoryId: accessoriesCategory.id,
      featured: false,
      sizes: ['One Size'],
      colors: ['Multicolor', 'Blue', 'Red'],
    },
  ];

  const createdProducts = [];
  for (const productData of productsData) {
    const { sizes, colors, ...rest } = productData;

    const product = await prisma.product.create({
      data: {
        ...rest,
        price: rest.price,
        images: {
          create: [
            {
              url: `https://picsum.photos/seed/${rest.slug}/800/1000`,
              alt: rest.name,
            },
            {
              url: `https://picsum.photos/seed/${rest.slug}-2/800/1000`,
              alt: `${rest.name} - view 2`,
            },
          ],
        },
        variants: {
          create: sizes.flatMap((size) =>
            colors.map((color) => ({
              size,
              color,
              stock: Math.floor(Math.random() * 50) + 5,
            }))
          ),
        },
      },
    });

    createdProducts.push(product);
  }

  console.log('✅ Products created');

  // Create reviews for some products
  const reviewComments = [
    'Absolutely love this! Great quality and fits perfectly.',
    'Very comfortable and stylish. Will definitely buy again.',
    'Good value for money. The fabric is soft and durable.',
    'Perfect fit and excellent quality. Highly recommend!',
    'Beautiful piece, exactly as described. Fast shipping too.',
  ];

  for (let i = 0; i < 3; i++) {
    await prisma.review.create({
      data: {
        userId: customer1.id,
        productId: createdProducts[i].id,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: reviewComments[i % reviewComments.length],
      },
    });
    await prisma.review.create({
      data: {
        userId: customer2.id,
        productId: createdProducts[i].id,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: reviewComments[(i + 1) % reviewComments.length],
      },
    });
  }

  console.log('✅ Reviews created');

  // Create an address for customer1
  const address = await prisma.address.create({
    data: {
      userId: customer1.id,
      name: 'John Doe',
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'US',
    },
  });

  // Create a sample order for customer1
  const orderProduct = createdProducts[0];
  const orderVariant = await prisma.productVariant.findFirst({
    where: { productId: orderProduct.id },
  });

  if (orderVariant) {
    await prisma.order.create({
      data: {
        userId: customer1.id,
        addressId: address.id,
        status: 'DELIVERED',
        total: orderProduct.price,
        items: {
          create: [
            {
              productId: orderProduct.id,
              variantId: orderVariant.id,
              quantity: 1,
              price: orderProduct.price,
            },
          ],
        },
      },
    });
  }

  console.log('✅ Sample orders created');
  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('Default credentials:');
  console.log('  Admin:    admin@store.com / Admin123!');
  console.log('  Customer: john@example.com / Customer123!');
  console.log('  Customer: jane@example.com / Customer123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
