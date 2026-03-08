import mongoose from "mongoose";


async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI || "";

  if (!MONGODB_URI) {
    console.log(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  } else {
    console.log("MongoDB URI connected");
  }

  let cached = global.mongoose; // global is used to maintain a cached connection across hot reloads in development

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
  try {
    // If the connection is cached, use it
    if (cached.conn) {
      return cached.conn;
    }

    // If no connection is cached, create a new one
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.log(error);
  }
}

export default dbConnect;
