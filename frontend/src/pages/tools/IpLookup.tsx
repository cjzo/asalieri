import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Activity, Globe, MapPin, Box, Search, AlertCircle, RefreshCw } from 'lucide-react'

interface IpInfo {
    ip: string
    isp?: string
    org?: string
    hostname?: string
    latitude?: number
    longitude?: number
    country?: string
    city?: string
    time_zone?: { name: string, offset: number }
}

export function IpLookup() {
    const [ipInput, setIpInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<IpInfo | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchIpInfo = useCallback(async (ipToFetch?: string) => {
        setLoading(true)
        setError(null)

        try {
            // First get the IP (either provided or resolving our own)
            let targetIp = ipToFetch || ipInput.trim()

            if (!targetIp) {
                // Get client IP using a public API
                const ipRes = await fetch('https://api.ipify.org?format=json')
                if (!ipRes.ok) throw new Error('Failed to resolve client IP')
                const ipData = await ipRes.json()
                targetIp = ipData.ip
                setIpInput(targetIp) // populate input
            }

            // Then get the geo info (using ipapi.co as it's free with reasonable limits and no API key)
            const res = await fetch(`https://ipapi.co/${targetIp}/json/`)
            if (!res.ok) throw new Error('API Request Failed')

            const info = await res.json()
            if (info.error) throw new Error(info.reason || 'Invalid IP')

            setData({
                ip: info.ip,
                isp: info.org,
                org: info.asn,
                city: info.city,
                country: info.country_name,
                latitude: info.latitude,
                longitude: info.longitude,
                time_zone: { name: info.timezone, offset: info.utc_offset }
            })

        } catch (e: any) {
            setError(e.message || 'Failed to lookup IP')
            setData(null)
        } finally {
            setLoading(false)
        }
    }, [ipInput])

    // Fetch own IP on mount
    useEffect(() => {
        fetchIpInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-4xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center relative"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Activity className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-6">
                        IP Lookup
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Discover geographical and network details for any IP address.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full flex justify-center mb-6 z-20"
                >
                    {/* Search Bar (Controls Box) */}
                    <div className="w-full max-w-2xl p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-lg flex flex-col gap-4">
                        <label className="block text-sm font-medium text-tertiary uppercase tracking-wider ml-1">Target IP Address</label>
                        <div className="relative group w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-tertiary group-focus-within:text-accent transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={ipInput}
                                onChange={(e) => setIpInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchIpInfo()}
                                placeholder="Enter IPv4 or IPv6..."
                                className="w-full h-14 pl-12 pr-28 bg-transparent border border-border/50 rounded-xl text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all shadow-inner text-sm font-mono backdrop-blur-xl"
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <Button
                                    onClick={() => fetchIpInfo()}
                                    disabled={loading}
                                    className="h-10 px-4 rounded-lg bg-accent hover:bg-accent/90 text-surface shadow-md shadow-accent/20 border-none relative overflow-hidden"
                                >
                                    {loading ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                            <RefreshCw className="w-4 h-4" />
                                        </motion.div>
                                    ) : (
                                        <span className="font-medium">Lookup</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Matrix as Main Display Box */}
                <div className="w-full min-h-[300px] relative">
                    <AnimatePresence mode="wait">
                        {error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="w-full p-6 rounded-2xl bg-red-500/5 border border-red-500/30 flex flex-col items-center justify-center text-center gap-4 backdrop-blur-sm"
                            >
                                <AlertCircle className="w-12 h-12 text-red-500" />
                                <span className="text-xl font-bold text-red-500">{error}</span>
                            </motion.div>
                        ) : data ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="w-full"
                            >
                                <div className="p-8 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                        {/* Card 1: Network */}
                                        <div className="p-6 rounded-xl bg-surface/50 border border-border/50 shadow-sm flex flex-col gap-4 group">
                                            <Globe className="w-6 h-6 text-accent" />
                                            <div>
                                                <p className="text-sm font-medium text-tertiary uppercase tracking-wider mb-1">IP Address</p>
                                                <p className="text-xl font-mono text-primary font-medium tracking-tight break-all">{data.ip}</p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-border/50">
                                                <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">ASN / ID</p>
                                                <p className="text-sm text-secondary truncate" title={data.org}>{data.org || 'Unknown'}</p>
                                            </div>
                                        </div>

                                        {/* Card 2: Geo */}
                                        <div className="p-6 rounded-xl bg-surface/50 border border-border/50 shadow-sm flex flex-col gap-4 group md:col-span-2">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-6 h-6 text-accent" />
                                                <div>
                                                    <p className="text-sm font-medium text-tertiary uppercase tracking-wider">Location</p>
                                                    <p className="text-xl font-medium text-primary">
                                                        {data.city ? `${data.city}, ` : ''}{data.country || 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-4 border-t border-border/50">
                                                <div>
                                                    <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Coordinates</p>
                                                    <p className="text-sm font-mono text-secondary">
                                                        {data.latitude}, {data.longitude}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Timezone</p>
                                                    <p className="text-sm text-secondary">
                                                        {data.time_zone?.name} (UTC{data.time_zone?.offset})
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 3: ISP */}
                                        <div className="p-6 rounded-xl bg-surface/50 border border-border/50 shadow-sm flex flex-col gap-4 group md:col-span-3">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-accent/10 rounded-xl shrink-0">
                                                    <Box className="w-5 h-5 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-tertiary uppercase tracking-wider mb-1">Internet Service Provider (ISP)</p>
                                                    <p className="text-lg md:text-xl font-medium text-primary break-words">
                                                        {data.isp || 'Unknown Provider'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}
