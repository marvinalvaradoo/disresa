import { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface CartButtonProps {
  initialCount?: number;
}

export default function CartButton({ initialCount = 0 }: CartButtonProps) {
  const [itemCount, setItemCount] = useState(initialCount);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load cart count from localStorage
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      fetchCartCount(cartId);
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        fetchCartCount(cartId);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchCartCount = async (cartId: string) => {
    try {
      const response = await fetch(`/api/cart?cartId=${cartId}`);
      const data = await response.json();
      setItemCount(data.itemCount || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <a
      href="/cart"
      className="relative text-white hover:text-[#D4AF37] transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded p-1"
      aria-label={itemCount > 0 ? `Ver carrito con ${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'}` : 'Ver carrito vacío'}
    >
      <ShoppingCartIcon className="w-6 h-6" aria-hidden="true" />
      {itemCount > 0 && (
        <span 
          className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          aria-label={`${itemCount} artículos en el carrito`}
        >
          {itemCount}
        </span>
      )}
    </a>
  );
}
