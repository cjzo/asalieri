import {
    PenTool, Type, Key, Code, Hash, Link2, Calendar,
    Globe, FileJson, FileCode, Shield, QrCode, Palette,
    AlignLeft, CaseSensitive, FileText, ArrowRightLeft,
    Languages, Pipette, Clock, Table, Image as ImageIcon,
    Binary, Ruler, Regex, Minimize2, Braces, Eye, CheckCircle2,
    Activity, Lock, RefreshCw
} from 'lucide-react'

export type ToolCategory =
    | 'All'
    | 'Encoding & Decoding'
    | 'Security'
    | 'Generators'
    | 'Text Tools'
    | 'Converters'
    | 'Math & Calculators'
    | 'Development'
    | 'Network'

export interface ToolItem {
    id: string
    name: string
    description: string
    category: ToolCategory
    icon: React.ElementType
    path: string
    color: string
    border: string
    shadow: string
}

export const CATEGORIES: ToolCategory[] = [
    'All',
    'Encoding & Decoding',
    'Security',
    'Generators',
    'Text Tools',
    'Converters',
    'Math & Calculators',
    'Development',
    'Network'
]

export const TOOLS: ToolItem[] = [
    // --- Original Tools (Categorized) ---
    {
        id: 'email-signature',
        name: 'Email Signature Generator',
        description: 'Create professional, robust HTML email signatures.',
        category: 'Generators',
        icon: PenTool,
        path: '/tools/email-signature',
        color: 'from-blue-500/20 to-cyan-500/20',
        border: 'group-hover:border-cyan-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]'
    },
    {
        id: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Synthesize versatile placeholder text for prototypes.',
        category: 'Generators',
        icon: Type,
        path: '/tools/lorem-ipsum',
        color: 'from-amber-500/20 to-orange-500/20',
        border: 'group-hover:border-orange-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]'
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate high-entropy, secure credentials.',
        category: 'Security',
        icon: Key,
        path: '/tools/password',
        color: 'from-green-500/20 to-emerald-500/20',
        border: 'group-hover:border-emerald-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]'
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format, validate, and explore JSON payloads.',
        category: 'Development',
        icon: Braces,
        path: '/tools/json',
        color: 'from-purple-500/20 to-fuchsia-500/20',
        border: 'group-hover:border-fuchsia-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)]'
    },
    {
        id: 'base64-encoder',
        name: 'Base64 Encoder',
        description: 'Instantly encode or decode strings and files.',
        category: 'Encoding & Decoding',
        icon: Link2,
        path: '/tools/base64',
        color: 'from-pink-500/20 to-rose-500/20',
        border: 'group-hover:border-rose-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)]'
    },
    {
        id: 'uuid-generator',
        name: 'UUID/GUID Generator',
        description: 'Bulk generation of standard unique identifiers.',
        category: 'Generators',
        icon: Hash,
        path: '/tools/uuid',
        color: 'from-indigo-500/20 to-blue-500/20',
        border: 'group-hover:border-indigo-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]'
    },
    {
        id: 'availability-calendar',
        name: 'Availability Calendar',
        description: 'Design and export a single-month interactive calendar snapshot.',
        category: 'Generators',
        icon: Calendar,
        path: '/tools/calendar',
        color: 'from-violet-500/20 to-purple-500/20',
        border: 'group-hover:border-purple-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]'
    },

    // --- Batch 1: Encoding, Decoding & Network ---
    {
        id: 'url-encoder',
        name: 'URL Encoder/Decoder',
        description: 'Safely encode or decode URLs and query strings.',
        category: 'Encoding & Decoding',
        icon: Globe,
        path: '/tools/url',
        color: 'from-sky-500/20 to-blue-500/20',
        border: 'group-hover:border-sky-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)]'
    },
    {
        id: 'html-encoder',
        name: 'HTML Encoder/Decoder',
        description: 'Encode text to HTML entities or decode them back.',
        category: 'Encoding & Decoding',
        icon: FileCode,
        path: '/tools/html-entities',
        color: 'from-orange-500/20 to-red-500/20',
        border: 'group-hover:border-orange-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]'
    },
    {
        id: 'jwt-decoder',
        name: 'JWT Decoder',
        description: 'Decode and inspect JSON Web Tokens instantly.',
        category: 'Encoding & Decoding',
        icon: Shield,
        path: '/tools/jwt',
        color: 'from-rose-500/20 to-pink-500/20',
        border: 'group-hover:border-rose-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)]'
    },
    {
        id: 'xml-formatter',
        name: 'XML Formatter',
        description: 'Format, minify, and validate XML syntax instantly.',
        category: 'Encoding & Decoding',
        icon: Code,
        path: '/tools/xml',
        color: 'from-emerald-500/20 to-green-500/20',
        border: 'group-hover:border-emerald-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]'
    },
    {
        id: 'unicode-converter',
        name: 'Unicode Converter',
        description: 'Convert between text and Unicode encoding formats.',
        category: 'Encoding & Decoding',
        icon: Type,
        path: '/tools/unicode',
        color: 'from-fuchsia-500/20 to-purple-500/20',
        border: 'group-hover:border-fuchsia-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)]'
    },
    {
        id: 'ip-lookup',
        name: 'IP Lookup',
        description: 'Look up IP address location, ISP, and other metadata.',
        category: 'Network',
        icon: Activity,
        path: '/tools/ip',
        color: 'from-blue-500/20 to-indigo-500/20',
        border: 'group-hover:border-blue-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]'
    },

    // --- Batch 2: Security & Generators ---
    {
        id: 'hash-generator',
        name: 'Hash Generator',
        description: 'Generate MD5, SHA-1, SHA-256 hashes from text.',
        category: 'Security',
        icon: Lock,
        path: '/tools/hash',
        color: 'from-slate-500/20 to-gray-500/20',
        border: 'group-hover:border-slate-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(100,116,139,0.15)]'
    },
    {
        id: 'text-encryption',
        name: 'Text Encryption',
        description: 'Encrypt and decrypt text using AES block ciphers.',
        category: 'Security',
        icon: Shield,
        path: '/tools/encryption',
        color: 'from-zinc-500/20 to-neutral-500/20',
        border: 'group-hover:border-zinc-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(113,113,122,0.15)]'
    },
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Generate customizable QR codes from text or URLs.',
        category: 'Generators',
        icon: QrCode,
        path: '/tools/qr',
        color: 'from-stone-500/20 to-zinc-500/20',
        border: 'group-hover:border-stone-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(120,113,108,0.15)]'
    },
    {
        id: 'gradient-generator',
        name: 'Gradient Generator',
        description: 'Create beautiful CSS gradients visually.',
        category: 'Generators',
        icon: Palette,
        path: '/tools/gradient',
        color: 'from-pink-500/20 to-orange-500/20',
        border: 'group-hover:border-pink-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]'
    },
    {
        id: 'word-counter',
        name: 'Word Counter',
        description: 'Count words, characters, sentences, and paragraphs.',
        category: 'Generators',
        icon: AlignLeft,
        path: '/tools/word-counter',
        color: 'from-teal-500/20 to-emerald-500/20',
        border: 'group-hover:border-teal-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)]'
    },

    // --- Batch 3: Text Tools ---
    {
        id: 'case-converter',
        name: 'Case Converter',
        description: 'Convert text casing between Title, Camel, Snake, and more.',
        category: 'Text Tools',
        icon: CaseSensitive,
        path: '/tools/case',
        color: 'from-violet-500/20 to-fuchsia-500/20',
        border: 'group-hover:border-violet-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]'
    },
    {
        id: 'markdown-preview',
        name: 'Markdown Preview',
        description: 'Write Markdown with live preview and HTML export.',
        category: 'Text Tools',
        icon: FileText,
        path: '/tools/markdown',
        color: 'from-sky-500/20 to-indigo-500/20',
        border: 'group-hover:border-sky-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)]'
    },
    {
        id: 'markdown-to-html',
        name: 'Markdown to HTML',
        description: 'Convert Markdown strings into raw HTML markup.',
        category: 'Text Tools',
        icon: FileCode,
        path: '/tools/markdown-html',
        color: 'from-blue-500/20 to-cyan-500/20',
        border: 'group-hover:border-blue-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]'
    },
    {
        id: 'diff-checker',
        name: 'Diff Checker',
        description: 'Compare texts and highlight differences side-by-side.',
        category: 'Text Tools',
        icon: ArrowRightLeft,
        path: '/tools/diff',
        color: 'from-red-500/20 to-rose-500/20',
        border: 'group-hover:border-red-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]'
    },
    {
        id: 'text-to-slug',
        name: 'Text to Slug',
        description: 'Convert strings into URL-friendly slug formats.',
        category: 'Text Tools',
        icon: Link2,
        path: '/tools/slug',
        color: 'from-emerald-500/20 to-teal-500/20',
        border: 'group-hover:border-emerald-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]'
    },
    {
        id: 'chinese-converter',
        name: 'Chinese Converter',
        description: 'Convert between Traditional and Simplified Chinese.',
        category: 'Text Tools',
        icon: Languages,
        path: '/tools/chinese',
        color: 'from-red-500/20 to-orange-500/20',
        border: 'group-hover:border-red-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]'
    },
    {
        id: 'color-converter',
        name: 'Color Converter',
        description: 'Translate HEX, RGB, and HSL color values.',
        category: 'Text Tools',
        icon: Pipette,
        path: '/tools/color',
        color: 'from-fuchsia-500/20 to-pink-500/20',
        border: 'group-hover:border-fuchsia-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)]'
    },

    // --- Batch 4: Converters & Math ---
    {
        id: 'timestamp-converter',
        name: 'Timestamp Converter',
        description: 'Convert Unix timestamps to localized human dates.',
        category: 'Converters',
        icon: Clock,
        path: '/tools/timestamp',
        color: 'from-indigo-500/20 to-violet-500/20',
        border: 'group-hover:border-indigo-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]'
    },
    {
        id: 'json-to-csv',
        name: 'JSON to CSV',
        description: 'Flatten structured JSON objects into CSV data.',
        category: 'Converters',
        icon: Table,
        path: '/tools/json-csv',
        color: 'from-green-500/20 to-emerald-500/20',
        border: 'group-hover:border-green-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)]'
    },
    {
        id: 'image-to-base64',
        name: 'Image to Base64',
        description: 'Convert raw images into Base64 data strings.',
        category: 'Converters',
        icon: ImageIcon,
        path: '/tools/image-base64',
        color: 'from-blue-500/20 to-sky-500/20',
        border: 'group-hover:border-blue-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]'
    },
    {
        id: 'number-base',
        name: 'Number Base Converter',
        description: 'Convert between binary, octal, decimal, and hex.',
        category: 'Math & Calculators',
        icon: Binary,
        path: '/tools/number-base',
        color: 'from-orange-500/20 to-amber-500/20',
        border: 'group-hover:border-orange-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]'
    },
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        description: 'Translate lengths, weights, temperatures, and areas.',
        category: 'Converters',
        icon: Ruler,
        path: '/tools/units',
        color: 'from-cyan-500/20 to-teal-500/20',
        border: 'group-hover:border-cyan-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]'
    },

    // --- Batch 5: Development Tools ---
    {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Mock and validate regular expressions.',
        category: 'Development',
        icon: Regex,
        path: '/tools/regex',
        color: 'from-purple-500/20 to-violet-500/20',
        border: 'group-hover:border-purple-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]'
    },
    {
        id: 'code-minifier',
        name: 'Code Minifier',
        description: 'Compress JS, CSS, and HTML files client-side.',
        category: 'Development',
        icon: Minimize2,
        path: '/tools/minifier',
        color: 'from-red-500/20 to-orange-500/20',
        border: 'group-hover:border-red-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]'
    },
    {
        id: 'sql-formatter',
        name: 'SQL Formatter',
        description: 'Beautify and standardize structural SQL queries.',
        category: 'Development',
        icon: FileCode,
        path: '/tools/sql',
        color: 'from-teal-500/20 to-emerald-500/20',
        border: 'group-hover:border-teal-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)]'
    },
    {
        id: 'color-picker',
        name: 'Color Picker',
        description: 'Extract exact matching colors from visual palettes.',
        category: 'Development',
        icon: Pipette,
        path: '/tools/picker',
        color: 'from-pink-500/20 to-rose-500/20',
        border: 'group-hover:border-pink-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]'
    },
    {
        id: 'html-preview',
        name: 'HTML Preview',
        description: 'Test render raw DOM trees securely.',
        category: 'Development',
        icon: Eye,
        path: '/tools/html-preview',
        color: 'from-sky-500/20 to-cyan-500/20',
        border: 'group-hover:border-sky-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)]'
    },
    {
        id: 'json-validator',
        name: 'JSON Schema Validator',
        description: 'Validate deep object structs against draft schemas.',
        category: 'Development',
        icon: CheckCircle2,
        path: '/tools/json-schema',
        color: 'from-emerald-500/20 to-teal-500/20',
        border: 'group-hover:border-emerald-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]'
    },
    {
        id: 'json-to-ts',
        name: 'JSON to TypeScript',
        description: 'Infer static interfaces from dynamic JSON trees.',
        category: 'Development',
        icon: FileJson,
        path: '/tools/json-ts',
        color: 'from-blue-500/20 to-indigo-500/20',
        border: 'group-hover:border-blue-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]'
    },
    {
        id: 'json-diff',
        name: 'JSON Diff',
        description: 'Compare deep JSON nodes for granular parity checks.',
        category: 'Development',
        icon: RefreshCw,
        path: '/tools/json-diff',
        color: 'from-fuchsia-500/20 to-purple-500/20',
        border: 'group-hover:border-fuchsia-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)]'
    }
]
