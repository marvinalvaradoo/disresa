import { useState } from 'react';
import { sileo } from 'sileo';

interface AddToCartButtonProps {
  shoeId: number;
  shoeName: string;
  price: number;
  availableSizes: string[];
  stock: number;
}

export default function AddToCartButton({
  shoeId,
  shoeName,
  price,
  availableSizes,
  stock,
}: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const getOrCreateCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cartId', cartId);
    }
    return cartId;
  };

  const ensureCartExists = async (cartId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      sileo.warning({ description: 'Por favor selecciona una talla' });
      return;
    }

    if (quantity < 1 || quantity > stock) {
      sileo.error({ description: 'Cantidad no válida' });
      return;
    }

    setIsAdding(true);

    try {
      const cartId = getOrCreateCartId();
      
      // Ensure cart exists
      await ensureCartExists(cartId);

      // Add item to cart
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          shoe_id: shoeId,
          size: selectedSize,
          quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sileo.success({ description: '¡Agregado al carrito!' });
        
        // Dispatch event to update cart count
        window.dispatchEvent(new Event('cartUpdated'));

        // Reset form
        setQuantity(1);
      } else {
        sileo.error({ description: data.error || 'Error al agregar al carrito' });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      sileo.error({ description: 'Error de conexión' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Size Selector */}
      <div role="group" aria-labelledby="size-label">
        <label id="size-label" className="block font-bold mb-3">Selecciona tu talla:</label>
        <div className="grid grid-cols-6 gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              aria-label={`Talla ${size}`}
              className={`border-2 px-4 py-3 rounded-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 ${
                selectedSize === size
                  ? 'bg-black text-white border-black'
                  : 'border-black hover:bg-gray-800 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div role="group" aria-labelledby="quantity-label">
        <label id="quantity-label" className="block font-bold mb-3">Cantidad:</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Disminuir cantidad"
            className="w-10 h-10 border-2 border-black rounded-lg font-bold hover:bg-gray-800 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="text-xl font-bold w-12 text-center" aria-live="polite" aria-atomic="true">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            aria-label="Aumentar cantidad"
            className="w-10 h-10 border-2 border-black rounded-lg font-bold hover:bg-gray-800 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity >= stock}
          >
            +
          </button>
          <span className="text-sm text-gray-600" aria-label={`Máximo disponible: ${stock} unidades`}>
            (Máximo: {stock})
          </span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || stock === 0}
        aria-label={stock === 0 ? 'Producto agotado' : 'Agregar producto al carrito'}
        aria-busy={isAdding}
        className="w-full bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-black text-lg hover:bg-[#C5A028] transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isAdding ? 'Agregando...' : stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
      </button>

      {/* Price Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-bold">Subtotal:</span>
          <span className="text-2xl font-black">Q{(price * quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
