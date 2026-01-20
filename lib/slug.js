import slugify from 'slugify';

export function generateSlug(destination, duration) {
  const baseSlug = slugify(`${destination} ${duration} days`, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });

  return baseSlug;
}

export async function generateUniqueSlug(destination, duration, TravelPlan) {
  let slug = generateSlug(destination, duration);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = await TravelPlan.findOne({ slug });
    if (!existing) {
      isUnique = true;
    } else {
      slug = `${generateSlug(destination, duration)}-${counter}`;
      counter++;
    }
  }

  return slug;
}

