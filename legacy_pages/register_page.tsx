"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
   const router = useRouter();
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   const handleSignUp = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setError("");
     setSuccess("");

     try {
       const response = await axios.post("http://127.0.0.1:8000/register", {
         name: username,
         email,
         password,
        
       });

       setSuccess(response.data.message || "Registration successful!");
       
       // Redirect to login after 2 seconds
       setTimeout(() => {
         router.push("/login");
       }, 2000);
     } catch (err: any) {
       setError(err.response?.data?.detail || "Registration failed");
     } finally {
       setLoading(false);
     }
   };

   return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-6">
           <div className="max-w-md w-full">
               {/* Decorative background */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
               </div>

               <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                   <h2 className="text-4xl font-black mb-2 text-center text-white">
                       Create Account
                   </h2>
                   <p className="text-center text-blue-200 mb-8">Join CogniLex AI Platform</p>

                   {error && (
                       <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                           {error}
                       </div>
                   )}

                   {success && (
                       <div className="mb-4 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
                           {success}
                       </div>
                   )}

                   <form className="space-y-5" onSubmit={handleSignUp}>
                       <div>
                           <label className="block text-sm font-semibold mb-2 text-white">
                               Full Name
                           </label>
                           <input
                               type="text"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               required
                               className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:border-blue-400 text-white placeholder:text-gray-400 transition-all"
                               placeholder="Enter your full name"
                           />
                       </div>

                       <div>
                           <label className="block text-sm font-semibold mb-2 text-white">
                               Email Address
                           </label>
                           <input
                               type="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               required
                               className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:border-blue-400 text-white placeholder:text-gray-400 transition-all"
                               placeholder="Enter your email"
                           />
                       </div>

                       <div>
                           <label className="block text-sm font-semibold mb-2 text-white">
                               Password
                           </label>
                           <input
                               type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               required
                               minLength={6}
                               className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:border-blue-400 text-white placeholder:text-gray-400 transition-all"
                               placeholder="Create a strong password"
                           />
                       </div>

                       
                       <button
                           type="submit"
                           disabled={loading}
                           className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-500/50 mt-6"
                       >
                           {loading ? "Creating Account…" : "Sign Up"}
                       </button>
                   </form>

                   <div className="mt-6 text-center">
                       <p className="text-gray-300 text-sm">
                           Already have an account?{" "}
                           <button
                               onClick={() => router.push("/login")}
                               className="text-blue-400 hover:text-blue-300 font-semibold"
                           >
                               Sign In
                           </button>
                       </p>
                   </div>
               </div>
           </div>
       </div>
   );
}