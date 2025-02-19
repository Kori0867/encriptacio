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

export function EncryptionDemo() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [symmetricKey, setSymmetricKey] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [encryptedText, setEncryptedText] = useState("")
  const [currentTab, setCurrentTab] = useState("symmetric")

  useEffect(() => {
    if (isAuthenticated) {
      generateKeys()
    }  }, [isAuthenticated, currentTab]) // Agregado currentTab como dependencia

  const handleAuthentication = () => {
    if (email && password) {
      setIsAuthenticated(true)
      setError("")
      setSuccess("Authentication successful!")
      generateKeys()
    } else {
      setError("Please enter both email and password.")
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

  const handleSymmetricEncrypt = () => {
    try {
      const encrypted = CryptoJS.AES.encrypt(input, symmetricKey).toString()
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
      const encrypted = encrypt.encrypt(input)
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
    <div className="transition-all duration-300 ease-in-out">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Encryption </CardTitle>
          <CardDescription> (AES) encryption  (RSA) </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            <div className="space-y-4 transition-opacity duration-300 ease-in-out">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleAuthentication}>Authenticate</Button>
            </div>
          ) : (
            <div className="transition-opacity duration-300 ease-in-out">
              <Tabs defaultValue="symmetric" onValueChange={(value) => setCurrentTab(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="symmetric">Symmetric (AES)</TabsTrigger>
                  <TabsTrigger value="asymmetric">Asymmetric (RSA)</TabsTrigger>
                </TabsList>
                <TabsContent value="symmetric">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="symmetric-key">Symmetric Key (Auto-generated)</Label>
                      <Input id="symmetric-key" value={symmetricKey} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symmetric-input">Input</Label>
                      <Input
                        id="symmetric-input"
                        placeholder="Enter text to encrypt/decrypt"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSymmetricEncrypt}>Encrypt</Button>
                      <Button onClick={handleSymmetricDecrypt}>Decrypt</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="asymmetric">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="public-key">Public Key (Auto-generated)</Label>
                      <Input id="public-key" value={publicKey} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="private-key">Private Key (Auto-generated)</Label>
                      <Input id="private-key" value={privateKey} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asymmetric-input">Input</Label>
                      <Input
                        id="asymmetric-input"
                        placeholder="Enter text to encrypt/decrypt"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAsymmetricEncrypt}>Encrypt</Button>
                      <Button onClick={handleAsymmetricDecrypt}>Decrypt</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-4 space-y-2">
                <Label htmlFor="output">Output</Label>
                <Input id="output" value={output} readOnly />
              </div>
            </div>
          )}
          {error && (
            <div className="transition-all duration-300 ease-in-out mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          {success && (
            <div className="transition-all duration-300 ease-in-out mt-4">
              <Alert variant="default" className="bg-green-50 text-green-800 border-green-300">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

