import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };

    const categories = await Category.find(filter).sort({ name: 1 });
    sendApiResponse(res, 200, 'Categories fetched successfully', categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    sendApiResponse(res, 200, 'Category details fetched successfully', category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name) {
      throw new ApiError(400, 'Category name is required');
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      throw new ApiError(400, 'A category with this name already exists');
    }

    const category = await Category.create({
      name,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true
    });

    sendApiResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    if (name && name.trim() !== category.name) {
      const existingName = await Category.findOne({ name: name.trim() });
      if (existingName) {
        throw new ApiError(400, 'Another category with this name already exists');
      }
      category.name = name.trim();
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    sendApiResponse(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Soft delete: Mark isActive = false to preserve relationships
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    sendApiResponse(res, 200, 'Category deactivated successfully', category);
  } catch (error) {
    next(error);
  }
};
