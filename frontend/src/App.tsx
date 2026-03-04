import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ToolLayout } from './components/layout/ToolLayout'
import { Home } from './pages/Home'
import { Tools } from './pages/Tools'

// Original Tools
import { EmailSignatureGenerator } from './pages/tools/EmailSignatureGenerator'
import { LoremIpsumGenerator } from './pages/tools/LoremIpsumGenerator'
import { PasswordGenerator } from './pages/tools/PasswordGenerator'
import { JsonFormatter } from './pages/tools/JsonFormatter'
import { UuidGenerator } from './pages/tools/UuidGenerator'
import { Base64Encoder } from './pages/tools/Base64Encoder'
import { AvailabilityCalendar } from './pages/tools/AvailabilityCalendar'

// Batch 1
import { UrlEncoderDecoder } from './pages/tools/UrlEncoderDecoder'
import { HtmlEncoderDecoder } from './pages/tools/HtmlEncoderDecoder'
import { JwtDecoder } from './pages/tools/JwtDecoder'
import { XmlFormatter } from './pages/tools/XmlFormatter'
import { UnicodeConverter } from './pages/tools/UnicodeConverter'
import { IpLookup } from './pages/tools/IpLookup'

// Batch 2
import { HashGenerator } from './pages/tools/HashGenerator'
import { TextEncryption } from './pages/tools/TextEncryption'
import { QrCodeGenerator } from './pages/tools/QrCodeGenerator'
import { GradientGenerator } from './pages/tools/GradientGenerator'
import { WordCounter } from './pages/tools/WordCounter'

// Batch 3
import { CaseConverter } from './pages/tools/CaseConverter'
import { MarkdownPreview } from './pages/tools/MarkdownPreview'
import { MarkdownToHtml } from './pages/tools/MarkdownToHtml'
import { DiffChecker } from './pages/tools/DiffChecker'
import { TextToSlug } from './pages/tools/TextToSlug'
import { ChineseConverter } from './pages/tools/ChineseConverter'
import { ColorConverter } from './pages/tools/ColorConverter'

// Batch 4
import { TimestampConverter } from './pages/tools/TimestampConverter'
import { JsonToCsv } from './pages/tools/JsonToCsv'
import { ImageToBase64 } from './pages/tools/ImageToBase64'
import { NumberBaseConverter } from './pages/tools/NumberBaseConverter'
import { UnitConverter } from './pages/tools/UnitConverter'

// Batch 5
import { RegexTester } from './pages/tools/RegexTester'
import { CodeMinifier } from './pages/tools/CodeMinifier'
import { SqlFormatter } from './pages/tools/SqlFormatter'
import { ColorPicker } from './pages/tools/ColorPicker'
import { HtmlPreview } from './pages/tools/HtmlPreview'
import { JsonSchemaValidator } from './pages/tools/JsonSchemaValidator'
import { JsonToTypeScript } from './pages/tools/JsonToTypeScript'
import { JsonDiff } from './pages/tools/JsonDiff'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />

          <Route element={<ToolLayout />}>
            {/* Original Tools */}
            <Route path="/tools/email-signature" element={<EmailSignatureGenerator />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsumGenerator />} />
            <Route path="/tools/password" element={<PasswordGenerator />} />
            <Route path="/tools/json" element={<JsonFormatter />} />
            <Route path="/tools/uuid" element={<UuidGenerator />} />
            <Route path="/tools/base64" element={<Base64Encoder />} />
            <Route path="/tools/calendar" element={<AvailabilityCalendar />} />

            {/* Batch 1 */}
            <Route path="/tools/url" element={<UrlEncoderDecoder />} />
            <Route path="/tools/html-entities" element={<HtmlEncoderDecoder />} />
            <Route path="/tools/jwt" element={<JwtDecoder />} />
            <Route path="/tools/xml" element={<XmlFormatter />} />
            <Route path="/tools/unicode" element={<UnicodeConverter />} />
            <Route path="/tools/ip" element={<IpLookup />} />

            {/* Batch 2 */}
            <Route path="/tools/hash" element={<HashGenerator />} />
            <Route path="/tools/encryption" element={<TextEncryption />} />
            <Route path="/tools/qr" element={<QrCodeGenerator />} />
            <Route path="/tools/gradient" element={<GradientGenerator />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />

            {/* Batch 3 */}
            <Route path="/tools/case" element={<CaseConverter />} />
            <Route path="/tools/markdown" element={<MarkdownPreview />} />
            <Route path="/tools/markdown-html" element={<MarkdownToHtml />} />
            <Route path="/tools/diff" element={<DiffChecker />} />
            <Route path="/tools/slug" element={<TextToSlug />} />
            <Route path="/tools/chinese" element={<ChineseConverter />} />
            <Route path="/tools/color" element={<ColorConverter />} />

            {/* Batch 4 */}
            <Route path="/tools/timestamp" element={<TimestampConverter />} />
            <Route path="/tools/json-csv" element={<JsonToCsv />} />
            <Route path="/tools/image-base64" element={<ImageToBase64 />} />
            <Route path="/tools/number-base" element={<NumberBaseConverter />} />
            <Route path="/tools/units" element={<UnitConverter />} />

            {/* Batch 5 */}
            <Route path="/tools/regex" element={<RegexTester />} />
            <Route path="/tools/minifier" element={<CodeMinifier />} />
            <Route path="/tools/sql" element={<SqlFormatter />} />
            <Route path="/tools/picker" element={<ColorPicker />} />
            <Route path="/tools/html-preview" element={<HtmlPreview />} />
            <Route path="/tools/json-schema" element={<JsonSchemaValidator />} />
            <Route path="/tools/json-ts" element={<JsonToTypeScript />} />
            <Route path="/tools/json-diff" element={<JsonDiff />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
