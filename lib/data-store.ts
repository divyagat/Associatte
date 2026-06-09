import dbConnect from './mongodb';
import Property from './models/Property';
import Blog from './models/Blog';
import { IProperty } from './models/Property';
import { IBlog } from './models/Blog';

// ==================== PROPERTIES ====================
export async function getAllProperties(): Promise<IProperty[]> {
  try {
    await dbConnect();
    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
    return properties.map(p => ({ ...p, _id: p._id.toString() })) as any;
  } catch (error) {
    console.error('❌ getAllProperties failed:', (error as Error).message);
    return [];
  }
}

export async function getPropertyBySlug(slug: string): Promise<IProperty | null> {
  try {
    await dbConnect();
    const property = await Property.findOne({ slug }).lean();
    if (!property) return null;
    return { ...property, _id: property._id.toString() } as any;
  } catch (error) {
    console.error('❌ getPropertyBySlug failed:', (error as Error).message);
    return null;
  }
}

export async function createProperty(propertyData: Partial<IProperty>): Promise<IProperty> {
  await dbConnect();
  
  const existing = await Property.findOne({ slug: propertyData.slug });
  if (existing) {
    throw new Error('Property with this slug already exists');
  }
  
  const property = new Property(propertyData);
  await property.save();
  return { ...property.toObject(), _id: property._id.toString() } as any;
}

export async function updateProperty(slug: string, updates: Partial<IProperty>): Promise<IProperty | null> {
  await dbConnect();
  const property = await Property.findOneAndUpdate(
    { slug },
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();
  
  if (!property) return null;
  return { ...property, _id: property._id.toString() } as any;
}

export async function deleteProperty(slug: string): Promise<boolean> {
  await dbConnect();
  const result = await Property.deleteOne({ slug });
  return result.deletedCount > 0;
}

// ==================== BLOGS ====================
export async function getAllBlogs(): Promise<IBlog[]> {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return blogs.map(b => ({ ...b, _id: b._id.toString() })) as any;
  } catch (error) {
    console.error('❌ getAllBlogs failed:', (error as Error).message);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) return null;
    return { ...blog, _id: blog._id.toString() } as any;
  } catch (error) {
    console.error('❌ getBlogBySlug failed:', (error as Error).message);
    return null;
  }
}

export async function createBlog(blogData: Partial<IBlog>): Promise<IBlog> {
  await dbConnect();
  
  const existing = await Blog.findOne({ slug: blogData.slug });
  if (existing) {
    throw new Error('Blog with this slug already exists');
  }
  
  const blog = new Blog(blogData);
  await blog.save();
  return { ...blog.toObject(), _id: blog._id.toString() } as any;
}

export async function updateBlog(slug: string, updates: Partial<IBlog>): Promise<IBlog | null> {
  await dbConnect();
  const blog = await Blog.findOneAndUpdate(
    { slug },
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();
  
  if (!blog) return null;
  return { ...blog, _id: blog._id.toString() } as any;
}

export async function deleteBlog(slug: string): Promise<boolean> {
  await dbConnect();
  const result = await Blog.deleteOne({ slug });
  return result.deletedCount > 0;
}

// ==================== HELPER FUNCTIONS ====================
export async function getPropertiesByLocation(location: string): Promise<IProperty[]> {
  try {
    await dbConnect();
    const properties = await Property.find({ location: location as any }).sort({ createdAt: -1 }).lean();
    return properties.map(p => ({ ...p, _id: p._id.toString() })) as any;
  } catch (error) {
    console.error('❌ getPropertiesByLocation failed:', (error as Error).message);
    return [];
  }
}

export async function getBlogsByCategory(category: string): Promise<IBlog[]> {
  try {
    await dbConnect();
    const blogs = await Blog.find({ category }).sort({ createdAt: -1 }).lean();
    return blogs.map(b => ({ ...b, _id: b._id.toString() })) as any;
  } catch (error) {
    console.error('❌ getBlogsByCategory failed:', (error as Error).message);
    return [];
  }
}

export async function searchProperties(query: string): Promise<IProperty[]> {
  try {
    await dbConnect();
    const properties = await Property.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'fullLocation.area': { $regex: query, $options: 'i' } },
        { 'developer.name': { $regex: query, $options: 'i' } },
      ]
    }).lean();
    return properties.map(p => ({ ...p, _id: p._id.toString() })) as any;
  } catch (error) {
    console.error('❌ searchProperties failed:', (error as Error).message);
    return [];
  }
}

export async function searchBlogs(query: string): Promise<IBlog[]> {
  try {
    await dbConnect();
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ]
    }).lean();
    return blogs.map(b => ({ ...b, _id: b._id.toString() })) as any;
  } catch (error) {
    console.error('❌ searchBlogs failed:', (error as Error).message);
    return [];
  }
}