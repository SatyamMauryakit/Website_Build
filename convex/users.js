import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ Create User Mutation
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()), // Optional
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.email) {
      console.warn("Skipping user creation: Email is missing.");
      return;
    }

    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (existingUser.length === 0) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        uid: args.uid,
        token:50000
      });
      
    } else {
      console.log("User already exists.");
    }
  },
});

// ✅ Get User Query — updated to optional
export const GetUser = query({
  args: {
    email: v.optional(v.string()), // Make this optional too
  },
  handler: async (ctx, args) => {
    if (!args.email) {
      console.warn("Skipping GetUser: Email is missing.");
      return null;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    return user[0];
  },
});

export const UpdateToken=mutation({
  args:{
    token:v.number(),
    userId:v.id("users")
  },
  handler:async(ctx,args)=>{
    const result = await ctx.db.patch(args.userId,{token:args.token});
    return result
  }
})
