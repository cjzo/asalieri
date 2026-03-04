import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Tools } from './pages/Tools'
import { EmailSignatureGenerator } from './pages/tools/EmailSignatureGenerator'
import { LoremIpsumGenerator } from './pages/tools/LoremIpsumGenerator'
import { PasswordGenerator } from './pages/tools/PasswordGenerator'
import { JsonFormatter } from './pages/tools/JsonFormatter'
import { UuidGenerator } from './pages/tools/UuidGenerator'
import { Base64Encoder } from './pages/tools/Base64Encoder'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/email-signature" element={<EmailSignatureGenerator />} />
          <Route path="/tools/lorem-ipsum" element={<LoremIpsumGenerator />} />
          <Route path="/tools/password" element={<PasswordGenerator />} />
          <Route path="/tools/json" element={<JsonFormatter />} />
          <Route path="/tools/uuid" element={<UuidGenerator />} />
          <Route path="/tools/base64" element={<Base64Encoder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
