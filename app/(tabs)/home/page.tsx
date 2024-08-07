import Button from "@/components/button";
import ListProduct from "@/components/list-products";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  console.log("hit!!");

  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Home",
};

export default async function Products() {
  const initailProducts = await getInitialProducts();

  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };
  return (
    <div>
      <ProductList initailProducts={initailProducts} />
      <form action={revalidate}>
        <Button text="revalidate" />
      </form>
      <Link
        replace
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-18" />
      </Link>
    </div>
  );
}
