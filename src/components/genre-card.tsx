import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MusicIcon } from "lucide-react"

interface GenreProps {
    genre: {
        name: string
        description: string
        color: string
    }
}

export function GenreCard({ genre }: GenreProps) {
    return (
        <Card
            className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
                backgroundColor: `${genre.color}20`,
                borderColor: `${genre.color}50`,
            }}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${genre.color}30` }}>
                        <MusicIcon className="h-5 w-5" style={{ color: genre.color }} />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{genre.name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-200">{genre.description}</p>
            </CardContent>
        </Card>
    )
}
