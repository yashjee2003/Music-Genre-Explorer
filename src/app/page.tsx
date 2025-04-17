"use client"

import type React from "react"

import { useState } from "react"
import { MusicIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { GenreCard } from "@/components/genre-card"
import { generateGenres } from "@/lib/generate-genres"
import { Toaster} from "@/components/ui/sonner"
import { toast } from "sonner"

export default function MusicGenreExplorer() {
  const [prompt, setPrompt] = useState("")
  const [genres, setGenres] = useState<Array<{ name: string; description: string; color: string }>>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const generatedGenres = await generateGenres(prompt)
      setGenres(generatedGenres)

      if (generatedGenres.length === 1 && generatedGenres[0].name === "Error Synth") {
        toast("Generation failed. Please try a different prompt.")
      }
    } catch (error) {
      console.error("Failed to generate genres:", error)
      toast("An error occurred while generating genres. Please try again.", )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <Toaster />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <MusicIcon className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold">SoundScape AI</h1>
          </div>
          <p className="text-xl text-center text-purple-200 max-w-2xl">
            Discover unique music genres based on your creative prompts
          </p>
        </div>

        <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="prompt" className="text-sm font-medium text-purple-200">
                Enter a prompt to generate music genres
              </label>
              <div className="flex gap-2">
                <Input
                  id="prompt"
                  placeholder="e.g., underwater cyberpunk with tribal influences"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-black/30 border-purple-500/50 text-white"
                />
                <Button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {genres.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Generated Music Genres</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genres.map((genre, index) => (
                <GenreCard key={index} genre={genre} />
              ))}
            </div>
          </div>
        )}

        {genres.length === 0 && !loading && (
          <div className="mt-12 text-center text-purple-300">
            <p>Enter a prompt to discover AI-generated music genres</p>
          </div>
        )}
      </div>
    </main>
  )
}
