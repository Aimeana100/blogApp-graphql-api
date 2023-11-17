import { User } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Context } from "../..";
import { JWT_SIGNATURE } from "../../keys";

interface SignUpArgs {
  credentials: {
    password: string;
    email: string;
  };
  name: string;

  bio: string;
}

interface SignInArgs {
  credentials: {
    password: string;
    email: string;
  }
}


interface AuthPayloadType {
  userErrors: { message: string }[];
  user: User | null;
  token: string | null;
}

export const authResolvers = {
  signUp: async (
    _parent: any,
    { user }: { user: SignUpArgs },
    { prisma }: Context
  ): Promise<AuthPayloadType> => {
    const { email, password } = user.credentials;
    const { name, bio } = user;

    if (!name || !email || !password) {
      return {
        userErrors: [
          {
            message: "name, email and password are required",
          },
        ],
        user: null,
        token: "",
      };
    }

    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        user: null,
        token: null,
      };
    }

    const isPassowrdValid = validator.isLength(password, {
      min: 5,
    });

    if (!isPassowrdValid) {
      return {
        userErrors: [
          {
            message: "password should be atleast 5 chars ",
          },
        ],
        user: null,
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (bio) {
      await prisma.profile.create({
        data: {
          bio,
          userId: newUser.id,
        },
      });
    }
    const token = jwt.sign({ userId: newUser.id }, JWT_SIGNATURE, {
      expiresIn: 360000,
    });

    return {
      userErrors: [],
      user: newUser,
      token,
    };
  },
  signIn: async (_: any, { credentials }: SignInArgs, { prisma} : Context) : Promise<AuthPayloadType>=> {
    const { email , password} = credentials
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if(!user){
      return {
        userErrors: [
          {
            message: "Invalid credetials"
          }
        ],
        user: null,
        token: null
      }
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return {
        userErrors: [
          {
            message: "Invalid Credentials"
          }
        ],
        user: null,
        token: null
      }
    }

    return {
      userErrors: [],
      user,
      token: jwt.sign({userId: user.id}, JWT_SIGNATURE)
    }
  }
};
