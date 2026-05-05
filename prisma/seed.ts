import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@petshelter.com';
  const adminPassword = 'Admin123!';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHash,
      role: 'ADMIN',
      hashedRefreshToken: null,
    },
    create: {
      email: adminEmail,
      password: adminHash,
      role: 'ADMIN',
    },
  });

  const categoryNames = ['Beds', 'Collars', 'Toys', 'Travel', 'Accessories'];

  const categories = {} as Record<string, { id: number; name: string }>;

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = category;
  }

  const products = [
    {
      name: 'Cozy Pet Bed',
      description: 'Soft, washable and perfect for naps after long walks.',
      price: '29.99',
      stock: 20,
      images: ['https://placehold.co/600x400?text=Cozy+Pet+Bed'],
      categoryName: 'Beds',
    },
    {
      name: 'Leather Collar',
      description: 'Durable leather collar with an engraved name tag slot.',
      price: '18.5',
      stock: 30,
      images: ['https://placehold.co/600x400?text=Leather+Collar'],
      categoryName: 'Collars',
    },
    {
      name: 'Treat Bag',
      description: 'Keep treats close for training and outdoor adventures.',
      price: '12.0',
      stock: 40,
      images: ['https://placehold.co/600x400?text=Treat+Bag'],
      categoryName: 'Accessories',
    },
    {
      name: 'Interactive Toy',
      description: 'A fun toy to keep your pet active and entertained.',
      price: '15.75',
      stock: 35,
      images: ['https://placehold.co/600x400?text=Interactive+Toy'],
      categoryName: 'Toys',
    },
    {
      name: 'Water Bottle',
      description: 'Leak-proof water bottle for walks and trips.',
      price: '10.99',
      stock: 50,
      images: ['https://placehold.co/600x400?text=Water+Bottle'],
      categoryName: 'Travel',
    },
    {
      name: 'Fleece Blanket',
      description: 'Warm blanket for chilly nights on the couch.',
      price: '22.0',
      stock: 25,
      images: ['https://placehold.co/600x400?text=Fleece+Blanket'],
      categoryName: 'Beds',
    },
  ];

  for (const product of products) {
    const category = categories[product.categoryName];
    if (!category) {
      throw new Error(`Category not found: ${product.categoryName}`);
    }

    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.images,
          categoryId: category.id,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.images,
          categoryId: category.id,
        },
      });
    }
  }

  console.log(
    'Seed completed: admin user, categories and accessories created.',
  );
  console.log('Admin email:', adminEmail);
  console.log('Admin password:', adminPassword);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
