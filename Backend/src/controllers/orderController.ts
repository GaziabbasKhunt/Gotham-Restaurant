import { Request, Response, NextFunction } from 'express';
import { Order, IOrderItem, OrderType, PaymentMethod, OrderStatus } from '../models/Order';
import { MenuItem } from '../models/MenuItem';
import { User, LoyaltyTier } from '../models/User';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required to place an order');
    }

    const { items, orderType, deliveryAddress, paymentMethod, couponCode, pointsRedeemed } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Order must contain at least one valid item');
    }

    const typeOfOrder: OrderType = ['delivery', 'pickup', 'dine_in'].includes(orderType)
      ? orderType
      : 'delivery';

    const methodOfPayment: PaymentMethod = paymentMethod === 'online' ? 'online' : 'cash';

    // CRITICAL SECURITY: Fetch current prices directly from MongoDB database
    const orderItemSnapshots: IOrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const itemInput of items) {
      const { menuItem: menuItemId, quantity } = itemInput;

      if (!menuItemId || !quantity || quantity < 1) {
        throw new ApiError(400, 'Each item must specify a valid menuItem ID and a positive quantity');
      }

      const dbMenuItem = await MenuItem.findById(menuItemId);

      if (!dbMenuItem || !dbMenuItem.isActive) {
        throw new ApiError(400, `Menu item with ID '${menuItemId}' is no longer active in our system`);
      }

      if (!dbMenuItem.isAvailable) {
        throw new ApiError(400, `Dish '${dbMenuItem.name}' is currently out of stock / unavailable`);
      }

      const dbPrice = dbMenuItem.price;
      const itemSubtotal = dbPrice * quantity;
      calculatedSubtotal += itemSubtotal;

      orderItemSnapshots.push({
        menuItem: dbMenuItem._id,
        name: dbMenuItem.name,
        quantity,
        price: dbPrice,
        subtotal: itemSubtotal
      });
    }

    // Calculate tax & delivery fee
    const tax = Math.round(calculatedSubtotal * 0.05); // 5% tax
    const deliveryCharge = typeOfOrder === 'delivery' ? 50 : 0; // Flat ₹50 for delivery

    // Calculate Coupon Discounts
    let discountAmount = 0;
    let appliedCoupon = '';

    if (couponCode) {
      const cleanCoupon = String(couponCode).trim().toUpperCase();
      if (cleanCoupon === 'GOTHAM10') {
        discountAmount = Math.round(calculatedSubtotal * 0.10);
        appliedCoupon = 'GOTHAM10 (10% Off)';
      } else if (cleanCoupon === 'DARKNIGHT20') {
        discountAmount = Math.round(calculatedSubtotal * 0.20);
        appliedCoupon = 'DARKNIGHT20 (20% Off)';
      }
    }

    // Process Loyalty Points Redemption if applicable
    const dbUser = await User.findById(req.user._id);
    let redeemedPointsDiscount = 0;

    if (pointsRedeemed && Number(pointsRedeemed) > 0 && dbUser) {
      const ptsToUse = Math.min(dbUser.loyaltyPoints || 0, Number(pointsRedeemed));
      // 100 points = $1 discount
      redeemedPointsDiscount = Math.floor(ptsToUse / 100);
      if (redeemedPointsDiscount > 0) {
        discountAmount += redeemedPointsDiscount;
        dbUser.loyaltyPoints -= (redeemedPointsDiscount * 100);
      }
    }

    const totalBeforeDiscount = calculatedSubtotal + tax + deliveryCharge;
    const finalTotalAmount = Math.max(0, totalBeforeDiscount - discountAmount);

    // Calculate Bat-Coins / Loyalty Points earned (10 pts per $1 spent)
    const pointsEarned = Math.floor(finalTotalAmount * 10);

    if (dbUser) {
      dbUser.loyaltyPoints = (dbUser.loyaltyPoints || 0) + pointsEarned;
      
      // Update Loyalty Tier
      let newTier: LoyaltyTier = 'Bronze Gargoyle';
      if (dbUser.loyaltyPoints >= 5000) {
        newTier = 'Dark Knight VIP';
      } else if (dbUser.loyaltyPoints >= 3000) {
        newTier = 'Gold Vigilante';
      } else if (dbUser.loyaltyPoints >= 1000) {
        newTier = 'Silver Sentinel';
      }
      dbUser.loyaltyTier = newTier;
      await dbUser.save();
    }

    // Generate unique Order Number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `GOT-${timestamp}-${randomSuffix}`;

    const initialPaymentStatus = methodOfPayment === 'online' ? 'paid' : 'pending';

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: orderItemSnapshots,
      subtotal: calculatedSubtotal,
      tax,
      deliveryCharge,
      discountAmount,
      couponCode: appliedCoupon || couponCode || '',
      pointsEarned,
      totalAmount: finalTotalAmount,
      orderType: typeOfOrder,
      deliveryAddress: typeOfOrder === 'delivery' ? (deliveryAddress || req.user.address) : {},
      paymentMethod: methodOfPayment,
      paymentStatus: initialPaymentStatus,
      orderStatus: 'pending'
    });

    sendApiResponse(res, 201, 'Order created successfully', order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    sendApiResponse(res, 200, 'Customer orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = '1', limit = '15' } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && typeof status === 'string') {
      filter.orderStatus = status;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 15);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    sendApiResponse(res, 200, 'All restaurant orders fetched', orders, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email phone');

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Ownership check: Customer can only view their own order
    if (req.user?.role !== 'admin' && order.user._id.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, 'You are not authorized to view this order details');
    }

    sendApiResponse(res, 200, 'Order details retrieved successfully', order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (orderStatus) {
      const validStatuses: OrderStatus[] = [
        'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
      ];
      if (!validStatuses.includes(orderStatus)) {
        throw new ApiError(400, 'Invalid order status specified');
      }
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    sendApiResponse(res, 200, 'Order status updated successfully', order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Ownership check
    if (req.user?.role !== 'admin' && order.user.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, 'You are not authorized to cancel this order');
    }

    // Eligibility check for customer cancellation
    if (req.user?.role !== 'admin' && !['pending', 'confirmed'].includes(order.orderStatus)) {
      throw new ApiError(400, `Order cannot be cancelled in '${order.orderStatus}' status`);
    }

    order.orderStatus = 'cancelled';
    await order.save();

    sendApiResponse(res, 200, 'Order cancelled successfully', order);
  } catch (error) {
    next(error);
  }
};
