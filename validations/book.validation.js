import Joi from 'joi';

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  description: Joi.string().optional(),
});

export const createBookSchema = Joi.alternatives().try(
  bookSchema,            // single object
  Joi.array().items(bookSchema)  // array of objects
);
