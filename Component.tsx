import { Button } from "@/components/ui/button";

import SmartImage from "@/components/ui/smart-image";
import { toPersianNumber } from "@/random-shit-functions/utils";
import { ChatContext } from "@/store/chat-context";
import { ChevronLeft } from "lucide-react";

import * as React from "react";
import { CartDrawer } from "./CartDrawer";
import { motion } from "motion/react";
import { useCart } from "@/hooks/useCart";

export const FooterCart = () => {
  const { cart } = useCart();
  const [isOpenCartDrawer, setIsOpenCartDrawer] = React.useState(false);
  const [newItemAddedToCart, setNewItemAddedToCart] = React.useState(false);
  const prevCartLengthRef = React.useRef(cart.length);

  const newlyAddedItem = cart[cart.length - 1];
  const { submitCheckoutCart } = React.useContext(ChatContext);
  React.useEffect(() => {
    // Only trigger animation when cart length increases (new item added)
    if (cart.length > prevCartLengthRef.current) {
      setNewItemAddedToCart(false);
      // Force a re-render to restart the animation
      setTimeout(() => setNewItemAddedToCart(true), 10);
    }
    // Update the ref with current cart length
    prevCartLengthRef.current = cart.length;
  }, [cart.length]);

  const handleCheckoutCartButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation();

    submitCheckoutCart();
  };

  return (
    <>
      <motion.div
        onClick={() => setIsOpenCartDrawer(true)}
        className="flex h-[50px] w-full flex-grow items-center justify-between border-y bg-white p-2"
        initial={{ scale: 0.8, opacity: 0, y: -140 }}
        animate={{
          scale: cart.length > 0 ? 1 : 0.8,
          opacity: cart.length > 0 ? 1 : 0,
          y: cart.length > 0 ? 0 : 0,
          visibility: cart.length > 0 ? "visible" : "hidden",
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <div className="mr-4 flex w-full">
          {cart.length > 5 ? (
            <>
              {cart.slice(0, 5).map((item) => (
                <SmartImage
                  key={item.product_id}
                  className="-mr-4 h-12 w-12 rounded-[50%] border bg-white p-1"
                  src={item.image_url}
                  alt={item.name}
                  width={48}
                  height={48}
                />
              ))}

              <div className="relative -mr-4 flex h-12 w-12 flex-col items-center justify-center rounded-[50%] border bg-slate-100">
                <SmartImage
                  className={`absolute -z-10 ${
                    newItemAddedToCart
                      ? "animate-[animate-cart-item-up-down_ease-out_0.5s_forwards]"
                      : ""
                  } rounded-[50%] border bg-white p-1`}
                  src={newlyAddedItem.image_url}
                  alt={newlyAddedItem.name}
                  width={48}
                  height={48}
                />
                <span
                  className={`text-sm font-medium ${
                    newItemAddedToCart
                      ? "animate-[animate-emphasis_0.5s] [animation-delay:1s]"
                      : ""
                  }`}
                >
                  {toPersianNumber(cart.length - 5)}+
                </span>
              </div>
            </>
          ) : (
            cart.map((item) => (
              <SmartImage
                key={item.product_id}
                className="animate-in zoom-in-50 -mr-4 h-12 w-12 rounded-[50%] border transition-transform duration-300"
                src={item.image_url}
                alt={item.name}
                width={48}
                height={48}
              />
            ))
          )}
        </div>

        <Button
          className={`gap-1 text-sm font-normal text-gray-600 ${
            newItemAddedToCart ? "animate-[shake_0.5s_ease-in-out]" : ""
          }`}
          variant={"secondary"}
          size={"sm"}
          onClick={handleCheckoutCartButtonClick}
        >
          جست‌و‌جوی فروشگاه <ChevronLeft />
        </Button>
      </motion.div>

      <CartDrawer
        open={isOpenCartDrawer}
        onClose={() => setIsOpenCartDrawer(false)}
      />
    </>
  );
};
