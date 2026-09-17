import { Request, Response, NextFunction } from 'express';
import { MenuItem } from '../models/MenuItem';
import { Category } from '../models/Category';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const getMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      category,
      search,
      vegetarian,
      featured,
      available,
      active,
      page = '1',
      limit = '12'
    } = req.query;

    const filter: Record<string, unknown> = {};

    // By default only query active items unless active=all/false explicitly requested
    if (active === 'false') {
      filter.isActive = false;
    } else if (active !== 'all') {
      filter.isActive = true;
    }

    if (available === 'true') {
      filter.isAvailable = true;
    } else if (available === 'false') {
      filter.isAvailable = false;
    }

    if (vegetarian === 'true') {
      filter.isVegetarian = true;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Category Filter (ID or Category Name)
    if (category) {
      if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const foundCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, 'i') }
        });
        if (foundCategory) {
          filter.category = foundCategory._id;
        } else {
          filter.category = null; // No match found
        }
      }
    }

    // Text Search Filter
    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const total = await MenuItem.countDocuments(filter);
    const items = await MenuItem.find(filter)
      .populate('category', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    sendApiResponse(res, 200, 'Menu items fetched successfully', items, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id).populate('category', 'name description image');

    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    sendApiResponse(res, 200, 'Menu item details fetched successfully', item);
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      category,
      name,
      description,
      price,
      image,
      ingredients,
      isVegetarian,
      isAvailable,
      isFeatured,
      preparationTime
    } = req.body;

    if (!category || !name || !description || price === undefined) {
      throw new ApiError(400, 'Category, name, description, and price are required');
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(400, 'Referenced category does not exist');
    }

    const item = await MenuItem.create({
      category,
      name,
      description,
      price,
      image,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      isVegetarian: !!isVegetarian,
      isAvailable: isAvailable !== undefined ? !!isAvailable : true,
      isFeatured: !!isFeatured,
      preparationTime: preparationTime ? Number(preparationTime) : 20
    });

    sendApiResponse(res, 201, 'Menu item created successfully', item);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        throw new ApiError(400, 'Referenced category does not exist');
      }
    }

    const item = await MenuItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('category', 'name image');

    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    sendApiResponse(res, 200, 'Menu item updated successfully', item);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Soft delete: Mark isActive = false to preserve order history integrity
    const item = await MenuItem.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    sendApiResponse(res, 200, 'Menu item deactivated successfully', item);
  } catch (error) {
    next(error);
  }
};
