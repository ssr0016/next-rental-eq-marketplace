"use server";

import supabaseConfig from "@/config/supabase-config";
import { IUser } from "@/interfaces/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export const registerUser = async ({
  name,
  email,
  password,
}: Partial<IUser>) => {
  try {
    // Step 1: check if the user already exists, if so return an error
    const userExistsResponse = await supabaseConfig
      .from("user_profiles")
      .select("id")
      .eq("email", email);
    if (userExistsResponse.data?.length) {
      throw new Error("User already exists");
    }

    // Step 2: hash the password
    const hashedPassword = await bcrypt.hash(password!, 10);

    // Step 3: create the user in the database
    const user = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      profile_pic: "",
    };

    const saveUserResponse = await supabaseConfig
      .from("user_profiles")
      .insert([user]);
    if (saveUserResponse.error) {
      throw new Error(saveUserResponse.error.message);
    }

    //step 4: return the user
    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const loginUser = async ({ email, password, role }: Partial<IUser>) => {
  try {
    // step 1: check if the user exists
    const userResponse = await supabaseConfig
      .from("user_profiles")
      .select("*")
      .eq("email", email);

    if (!userResponse.data || userResponse.data.length === 0) {
      throw new Error("User does not exist");
    }

    const user = userResponse.data[0]; // get the first user

    // check if the user has the correct role
    if (user.role !== role) {
      throw new Error(`Your account is not associated with ${role} role`);
    }

    // step 2: check if the password is correct
    const isPasswordValid = await bcrypt.compare(password!, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // step 3:create a JWT token and return it
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    return {
      success: true,
      message: "User logged in successfully",
      data: token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getLoggedInUser = async () => {
  try {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("access_token")?.value;

    const decryptedData = jwt.verify(accessToken!, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    const userResponse = await supabaseConfig
      .from("user_profiles")
      .select("*")
      .eq("id", decryptedData.id);
    if (!userResponse.data || userResponse.data.length === 0) {
      throw new Error("User does not exist");
    }

    const user = userResponse.data[0];
    delete user.password;

    return {
      success: true,
      data: user,
      message: "User fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUserProfile = async () => {
  try {
    const userResponse = await getLoggedInUser();

    if (!userResponse.success) {
      throw new Error(userResponse.message);
    }

    return {
      success: true,
      data: userResponse.data,
      message: "Profile fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
