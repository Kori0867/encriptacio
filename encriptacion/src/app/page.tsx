
import { EncryptionDemo } from "./components/encryption"

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center w-full">
        <h1 className="text-3xl font-bold text-center">Secure Encryption and Decryption</h1>
        <p className="text-center text-gray-600 max-w-2xl">
          Cryptography symmetric (AES) and
          asymmetric (RSA) encryption 
        </p>
        <EncryptionDemo />
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
       
        
      
      </footer>
    </div>
  )
}

