"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui//button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import CryptoJS from "crypto-js"
import { JSEncrypt } from "jsencrypt"
import { Shield, Key, Lock } from "lucide-react"

export function EncryptionDemo() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const [output, setOutput] = useState("")
  const [symmetricKey, setSymmetricKey] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [encryptedText, setEncryptedText] = useState("")
  
  const [verifiedText, setVerifiedText] = useState("")
  // Añadir estos nuevos estados
  const [verificationKey, setVerificationKey] = useState("")
  const [verificationMethod, setVerificationMethod] = useState("symmetric")
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      generateKeys()
    }
  }, [isAuthenticated]) // Agregado currentTab como dependencia

  const handleAuthentication = () => {
    // This is a simple check. In a real application, you'd verify against a backend.
    if (email === "Test@gmail.com" && password === "123") {
      setIsAuthenticated(true)
      setError("")
      setSuccess("Initial authentication successful! Please verify your account with the generated key.")
      generateKeys()
    } else {
      setError("Invalid email or password.")
      setSuccess("") // Clear any previous success messages
      setIsAuthenticated(false)
    }
  }

  const generateKeys = () => {
    const symKey = CryptoJS.lib.WordArray.random(256 / 8).toString()
    setSymmetricKey(symKey)

    const crypt = new JSEncrypt({ default_key_size: "2048" })
    const asymPublicKey = crypt.getPublicKey()
    const asymPrivateKey = crypt.getPrivateKey()
    setPublicKey(asymPublicKey)
    setPrivateKey(asymPrivateKey)
  }

  // Añadir esta nueva función después de generateKeys
  const handleVerification = () => {
    if (verificationMethod === "symmetric" && verificationKey === symmetricKey) {
      setShowDashboard(true)
      setSuccess("Account verified successfully with symmetric key!")
      setError("") // Clear any previous error messages
    } else if (verificationMethod === "asymmetric") {
      // Limpia la clave privada ingresada y la generada
      const cleanedInputKey = verificationKey.replace(/-----(BEGIN|END) PRIVATE KEY-----|\n|\r/g, "").trim()
      const cleanedGeneratedKey = privateKey.replace(/-----(BEGIN|END) PRIVATE KEY-----|\n|\r/g, "").trim()

      if (cleanedInputKey === cleanedGeneratedKey) {
        setShowDashboard(true)
        setSuccess("Account verified successfully with private key!")
        setError("") // Clear any previous error messages
      } else {
        setError("Invalid private key. Please try again.")
        setSuccess("") // Clear any previous success messages
      }
    } else {
      setError("Invalid verification key. Please try again.")
      setSuccess("") // Clear any previous success messages
    }
  }

  const handleSymmetricEncrypt = () => {
    try {
      const encrypted = CryptoJS.AES.encrypt(verifiedText, symmetricKey).toString()
      setOutput(encrypted)
      setEncryptedText(encrypted)
      setSuccess("Text encrypted successfully!")
      setError("")
    } catch {
      setError("Encryption failed. Please check your input and key.")
    }
  }

  const handleSymmetricDecrypt = () => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedText, symmetricKey).toString(CryptoJS.enc.Utf8)
      setOutput(decrypted)
      setSuccess("Text decrypted successfully!")
      setError("")
    } catch {
      setError("Decryption failed. Please check your input and key.")
    }
  }

  const handleAsymmetricEncrypt = () => {
    try {
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(publicKey)
      const encrypted = encrypt.encrypt(verifiedText)
      setOutput(encrypted || "")
      setEncryptedText(encrypted || "")
      setSuccess("Text encrypted successfully!")
      setError("")
    } catch {
      setError("Encryption failed. Please check your input and public key.")
    }
  }

  const handleAsymmetricDecrypt = () => {
    try {
      const decrypt = new JSEncrypt()
      decrypt.setPrivateKey(privateKey)
      const decrypted = decrypt.decrypt(encryptedText)
      setOutput(decrypted || "")
      setSuccess("Text decrypted successfully!")
      setError("")
    } catch {
      setError("Decryption failed. Please check your input and private key.")
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="text-3xl font-bold flex items-center">
            <Shield className="mr-2" /> Encryption and Account Verification
          </CardTitle>
          <CardDescription className="text-indigo-100">AES (Symmetric) and RSA (Asymmetric) encryption</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!isAuthenticated ? (
            <div className="space-y-6 transition-opacity duration-300 ease-in-out">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold text-indigo-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email (Test@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-indigo-300 focus:border-indigo-500 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-semibold text-indigo-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password (123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-indigo-300 focus:border-indigo-500 rounded-md p-2"
                />
              </div>
              <Button
                onClick={handleAuthentication}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Verify and Proceed
              </Button>
            </div>
          ) : !showDashboard ? (
            <div className="space-y-6 transition-opacity duration-300 ease-in-out">
              <div className="space-y-2">
                <Label htmlFor="verification-method" className="text-lg font-semibold text-indigo-700">
                  Verification Method
                </Label>
                <select
                  id="verification-method"
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  className="w-full p-2 border-2 border-indigo-300 focus:border-indigo-500 rounded-md bg-white"
                >
                  <option value="symmetric">Symmetric (AES)</option>
                  <option value="asymmetric">Asymmetric (RSA)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-key" className="text-lg font-semibold text-indigo-700">
                  {verificationMethod === "symmetric" ? "Symmetric Key" : "Private Key"}
                </Label>
                {verificationMethod === "symmetric" ? (
                  <Input
                    id="verification-key"
                    type="text"
                    placeholder="Enter the symmetric key"
                    value={verificationKey}
                    onChange={(e) => setVerificationKey(e.target.value)}
                    className="border-2 border-indigo-300 focus:border-indigo-500 rounded-md p-2"
                  />
                ) : (
                  <textarea
                    id="verification-key"
                    placeholder="Paste the entire private key here, including BEGIN and END lines"
                    value={verificationKey}
                    onChange={(e) => setVerificationKey(e.target.value)}
                    className="w-full p-2 border-2 border-indigo-300 focus:border-indigo-500 rounded-md h-32 text-xs"
                  />
                )}
              </div>
              <Button
                onClick={handleVerification}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Verify Account
              </Button>
              <div className="mt-4">
                <div className="text-sm text-indigo-600 bg-indigo-50 p-4 rounded-md">
                  {verificationMethod === "symmetric" ? (
                    <div className="flex items-center">
                      <Key className="mr-2" />
                      <span>Symmetric Key: {symmetricKey}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center mb-2">
                        <Lock className="mr-2" />
                        <span>Private Key:</span>
                      </div>
                      <div>Copy the entire key, including BEGIN and END lines:</div>
                      <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto border border-indigo-200">
                        {privateKey}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 transition-opacity duration-300 ease-in-out">
              <div className="text-lg text-indigo-600">You have successfully verified your account.</div>
              <h2 className="text-3xl font-bold text-indigo-700">Welcome to message Encrypter</h2>
              
              
              <Tabs defaultValue="symmetric" className="mt-6">
                <TabsList className="grid w-full grid-cols-2 bg-indigo-100 rounded-md">
                  <TabsTrigger
                    value="symmetric"
                    className="data-[state=active]:bg-white data-[state=active]:text-indigo-700"
                  >
                    Symmetric (AES)
                  </TabsTrigger>
                  <TabsTrigger
                    value="asymmetric"
                    className="data-[state=active]:bg-white data-[state=active]:text-indigo-700"
                  >
                    Asymmetric (RSA)
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="symmetric" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verified-text" className="text-lg font-semibold text-indigo-700">
                        Verified Text
                      </Label>
                      <Input
                        id="verified-text"
                        placeholder="Enter text to encrypt/decrypt"
                        value={verifiedText}
                        onChange={(e) => setVerifiedText(e.target.value)}
                        className="border-2 border-indigo-300 focus:border-indigo-500 rounded-md p-2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSymmetricEncrypt}
                        className="flex-1 bg-purple-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                      >
                        Encrypt
                      </Button>
                      <Button
                        onClick={handleSymmetricDecrypt}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                      >
                        Decrypt
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="asymmetric" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verified-text" className="text-lg font-semibold text-indigo-700">
                        Verified Text
                      </Label>
                      <Input
                        id="verified-text"
                        placeholder="Enter text to encrypt/decrypt"
                        value={verifiedText}
                        onChange={(e) => setVerifiedText(e.target.value)}
                        className="border-2 border-indigo-300 focus:border-indigo-500 rounded-md p-2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAsymmetricEncrypt}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                      >
                        Encrypt
                      </Button>
                      <Button
                        onClick={handleAsymmetricDecrypt}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                      >
                        Decrypt
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-6 space-y-2">
                <Label htmlFor="output" className="text-lg font-semibold text-indigo-700">
                  Output
                </Label>
                <Input
                  id="output"
                  value={output}
                  readOnly
                  className="border-2 border-indigo-300 bg-gray-50 rounded-md p-2"
                />
              </div>
            </div>
          )}
          {error && (
            <div className="transition-all duration-300 ease-in-out mt-6">
              <Alert variant="destructive" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <AlertCircle className="h-6 w-6 mr-2" />
                <AlertTitle className="font-bold">Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          {success && (
            <div className="transition-all duration-300 ease-in-out mt-6">
              <Alert variant="default" className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                <CheckCircle2 className="h-6 w-6 mr-2" />
                <AlertTitle className="font-bold">Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

