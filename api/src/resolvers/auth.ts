export default {
  Query: {
    me: (obj, args, context) => context.user,
  },
};
