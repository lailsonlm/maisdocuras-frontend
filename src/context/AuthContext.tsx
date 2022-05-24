import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { dbFirestore, firebaseAuth } from "../services/firebase";

type AuthProviderProps = {
  children: ReactNode;
}

type AuthContextType = {
  isAuthenticated: boolean;
  userAuth: string;
  phoneNumber: string | null;
  handleSignOut: () => void;
  userData: UserData | undefined;
}

type UserData = {
  name: string;
  street: string;
  houseNumber: string;
  complement?: string;
  referencePoint?: string;
  district: string;
  city: string;
  userId: string;
  idDoc: string;
  secondaryAdress: {
    street: string;
    houseNumber: string;
    complement: string;
    referencePoint: string;
    district: string;
    city: string;
  }
};

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [userAuth, setUserAuth] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | undefined>(undefined)
  const router = useRouter()
  const isAuthenticated = !!userAuth;

  async function handleSignOut() {
    await signOut(firebaseAuth)
    .then(() => {
      setUserAuth('')
      setUserData(undefined)
    })
    .catch((error) => {
      console.log(error)
    });

    destroyCookie(undefined, 'maisdocuras.token')
    router.push('/')
  }

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if(!userAuth) {
        if (user) {
          const token = await user.getIdToken()
          setUserAuth(user.uid)
          setPhoneNumber(user.phoneNumber)
    
          setCookie(undefined, 'maisdocuras.token', token, {
            path: '/'
          })
          
        } else {
          setUserAuth('')
          setUserData(undefined)
        }
      }

      if(user) {
        getDataUser(user.uid)
      }
    });
  }, [])

  async function getDataUser(userId: string) {
    const q = query(collection(dbFirestore, "users"), where("userId", "==", userId));

    const user = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUserData({
          ...doc.data(),
          idDoc: doc.id
        } as UserData)
      });
    });

    return user;
  }

  useEffect(() => {
    getDataUser(userAuth)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, userAuth, userData, handleSignOut, phoneNumber }}>
      {children}
    </AuthContext.Provider>
  )
}
