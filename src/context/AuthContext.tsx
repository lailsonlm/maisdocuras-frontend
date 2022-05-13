import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { firebaseAuth } from "../services/firebase";

type AuthProviderProps = {
  children: ReactNode;
}

type AuthContextType = {
  isAuthenticated: boolean;
  userAuth: string;
  handleSignOut: () => void;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [userAuth, setUserAuth] = useState<string>('')
  const router = useRouter()
  const isAuthenticated = !!userAuth;

  async function handleSignOut() {
    await signOut(firebaseAuth)
    .then(() => {})
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
      
            setCookie(undefined, 'maisdocuras.token', token, {
              path: '/'
            })
            
          } else {
            setUserAuth('')
          }
        }
      });
    }, [])



  return (
    <AuthContext.Provider value={{ isAuthenticated, userAuth, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}