import { internalMutation } from "./_generated/server";

export const removeEmailField = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    for (const user of users) {
      // @ts-ignore - email field exists in db but not in types
      if (user.email !== undefined) {
        await ctx.db.patch(user._id, {
          // @ts-ignore - unsetting a field
          email: undefined,
        });
      }
    }
    
    return { success: true, count: users.length };
  },
});
